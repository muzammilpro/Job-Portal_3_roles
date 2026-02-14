import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import Job from "@/models/Job";
import OpenAI from "openai";

export async function POST(req) {
    try {
        // 1. Verify authentication
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "company") {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        // 2. Get request data
        const { jobId, applicantId } = await req.json();
        if (!jobId || !applicantId) {
            return NextResponse.json(
                { success: false, message: "Missing jobId or applicantId" },
                { status: 400 }
            );
        }

        // 3. Connect to database
        await connectDB();

        // 4. Fetch job details
        const job = await Job.findById(jobId).populate("company");
        if (!job) {
            return NextResponse.json(
                { success: false, message: "Job not found" },
                { status: 404 }
            );
        }

        // 5. Verify the company owns this job
        if (job.company.email !== session.user.email) {
            return NextResponse.json(
                { success: false, message: "Unauthorized - You don't own this job" },
                { status: 403 }
            );
        }

        // 6. Fetch applicant details
        const applicant = await User.findById(applicantId);
        if (!applicant) {
            return NextResponse.json(
                { success: false, message: "Applicant not found" },
                { status: 404 }
            );
        }

        // 7. Check if OpenAI API key is configured
        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { success: false, message: "OpenAI API key not configured. Please add OPENAI_API_KEY to your .env.local file." },
                { status: 500 }
            );
        }

        // 8. Initialize OpenAI
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        // 9. Prepare applicant profile data
        const profileData = {
            name: applicant.name,
            email: applicant.email,
            skills: applicant.profile?.skills || [],
            experience: applicant.profile?.experience || [],
            education: applicant.profile?.education || [],
            location: applicant.profile?.location || "Not specified",
            bio: applicant.profile?.bio || "No bio provided",
        };

        // Format experience for prompt
        const experienceText = profileData.experience.length > 0
            ? profileData.experience.map((exp, idx) =>
                `${idx + 1}. ${exp.title} at ${exp.company} (${exp.startDate} - ${exp.current ? 'Present' : exp.endDate || 'N/A'})${exp.description ? ': ' + exp.description : ''}`
            ).join('\n')
            : "No work experience listed";

        // Format education for prompt
        const educationText = profileData.education.length > 0
            ? profileData.education.map((edu, idx) =>
                `${idx + 1}. ${edu.degree} in ${edu.field || 'N/A'} from ${edu.institution} (${edu.startDate} - ${edu.endDate || 'N/A'})${edu.gpa ? ', GPA: ' + edu.gpa : ''}`
            ).join('\n')
            : "No education listed";

        // 10. Construct AI prompt
        const prompt = `You are an expert HR recruiter analyzing candidate suitability for a job position.

JOB DETAILS:
Title: ${job.title}
Description: ${job.description}
Requirements: ${job.requirements || "Not specified"}
Location: ${job.location || "Remote"}
Job Type: ${job.jobType}
Experience Level: ${job.experienceLevel}

CANDIDATE PROFILE:
Name: ${profileData.name}
Skills: ${profileData.skills.length > 0 ? profileData.skills.join(', ') : 'No skills listed'}
Location: ${profileData.location}
Bio: ${profileData.bio}

Work Experience:
${experienceText}

Education:
${educationText}

TASK:
Analyze this candidate's fit for the job position and provide a detailed assessment.

You must respond ONLY with valid JSON in this exact format (no markdown, no code blocks, just raw JSON):
{
  "score": <number between 0-100>,
  "highlights": [<array of 3-5 string points about why they're a good fit>],
  "concerns": [<array of 2-4 string points about potential gaps or concerns, or empty array if none>],
  "recommendation": "<one of: Highly Recommended | Recommended | Consider | Not Recommended>",
  "reasoning": "<2-3 sentence summary explaining the overall assessment>"
}

Be objective, professional, and base your analysis on the alignment between job requirements and candidate qualifications.`;

        // 11. Call OpenAI API
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are an expert HR recruiter. Always respond with valid JSON only, no markdown formatting."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 800,
        });

        // 12. Parse AI response
        let analysisResult;
        try {
            const responseText = completion.choices[0].message.content.trim();
            // Remove markdown code blocks if present
            const jsonText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            analysisResult = JSON.parse(jsonText);
        } catch (parseError) {
            console.error("Error parsing OpenAI response:", parseError);
            return NextResponse.json(
                {
                    success: false,
                    message: "Error parsing AI response. Please try again."
                },
                { status: 500 }
            );
        }

        // 13. Validate response structure
        if (!analysisResult.score || !analysisResult.recommendation) {
            return NextResponse.json(
                { success: false, message: "Invalid AI response format" },
                { status: 500 }
            );
        }

        // 14. Return analysis
        return NextResponse.json({
            success: true,
            analysis: {
                score: analysisResult.score,
                highlights: analysisResult.highlights || [],
                concerns: analysisResult.concerns || [],
                recommendation: analysisResult.recommendation,
                reasoning: analysisResult.reasoning || "",
                applicantName: applicant.name,
                jobTitle: job.title,
            },
        });

    } catch (error) {
        console.error("Error in AI analysis:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message || "An error occurred during analysis"
            },
            { status: 500 }
        );
    }
}
