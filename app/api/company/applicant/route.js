import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/mongoose";
import Job from "@/models/Job";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "company") {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId");
    const userId = searchParams.get("userId");

    if (!jobId || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing parameters" }),
        { status: 400 }
      );
    }

    await connectDB();

    // Ensure job belongs to this company
    const job = await Job.findOne({
      _id: jobId,
      company: session.user.id,
      "applicants.user": userId,
    })
      .populate("applicants.user", "name email profile")
      .lean();

    if (!job) {
      return new Response(
        JSON.stringify({ error: "Applicant not found" }),
        { status: 404 }
      );
    }

    const applicant = job.applicants.find(
      a => a.user._id.toString() === userId
    );

    if (!applicant) {
      return new Response(
        JSON.stringify({ error: "Applicant not found" }),
        { status: 404 }
      );
    }

    const profile = {
      userId: applicant.user._id,
      name: applicant.user.name,
      email: applicant.user.email,
      phone: applicant.user.profile?.phone,
      location: applicant.user.profile?.location,
      skills: applicant.user.profile?.skills,
      experience: applicant.user.profile?.experience,
      education: applicant.user.profile?.education,
      resume: applicant.user.profile?.resume,
      socialLinks: applicant.user.profile?.socialLinks,
      appliedAt: applicant.appliedAt,
      status: applicant.status,
      jobTitle: job.title,
    };

    return new Response(JSON.stringify({ profile }), { status: 200 });

  } catch (error) {
    console.error("Error fetching applicant profile:", error);
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
}
