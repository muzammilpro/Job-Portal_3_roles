// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import connectDB from "@/lib/mongoose";
// import Job from "@/models/Job";
// import User from "@/models/User";

// export async function GET() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "company") {
//     return NextResponse.json(
//       { message: "Unauthorized" },
//       { status: 401 }
//     );
//   }

//   await connectDB();

//   const company = await User.findOne({ email: session.user.email });

//   const jobs = await Job.find({ company: company._id })
//     .populate("applicants.user", "name email")
//     .sort({ createdAt: -1 });

//   return NextResponse.json(jobs);
// }

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/mongoose";
import Job from "@/models/Job";
import User from "@/models/User";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "company") {
      return Response.json({
        success: false,
        message: "Unauthorized"
      }, { status: 401 });
    }

    await connectDB();

    // Check if company is approved
    const user = await User.findOne({ email: session.user.email });
    if (!user || user.companyStatus !== "approved") {
      return Response.json({
        success: false,
        message: "Company not approved"
      }, { status: 403 });
    }

    // Fetch jobs created by this company
    const jobs = await Job.find({ company: user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: 'applicants.user',
        select: 'name email'
      });

    return Response.json({
      success: true,
      jobs: jobs
    });

  } catch (error) {
    console.error("Error fetching jobs:", error);
    return Response.json({
      success: false,
      message: "Error fetching jobs"
    }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "company") {
      return Response.json({
        success: false,
        message: "Unauthorized"
      }, { status: 401 });
    }

    await connectDB();

    // Check if company is approved
    const user = await User.findOne({ email: session.user.email });
    if (!user || user.companyStatus !== "approved") {
      return Response.json({
        success: false,
        message: "Company not approved"
      }, { status: 403 });
    }

    const body = await req.json();

    // Validate required fields
    if (!body.title || !body.description) {
      return Response.json({
        success: false,
        message: "Title and description are required"
      }, { status: 400 });
    }

    const jobData = {
      title: body.title.trim(),
      description: body.description.trim(),
      company: user._id,
      location: body.location?.trim() || "Remote",
      salary: body.salary?.trim(),
      jobType: body.jobType || body.type || "full-time",
      experienceLevel: body.experienceLevel || body.experience || "mid-level",
      requirements: body.requirements?.trim(),
      skills: body.skills?.trim(),
    };

    const deadline = body.applicationDeadline || body.deadline;
    if (deadline) {
      jobData.applicationDeadline = new Date(deadline);
    }

    const job = new Job(jobData);
    await job.save();

    // Populate company info
    const populatedJob = await Job.findById(job._id).populate('company', 'name email');

    return Response.json({
      success: true,
      job: populatedJob,
      message: "Job posted successfully"
    });

  } catch (error) {
    console.error("Error posting job:", error);
    return Response.json({
      success: false,
      message: "Error posting job"
    }, { status: 500 });
  }
}