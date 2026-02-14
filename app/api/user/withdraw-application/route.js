import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/mongoose";
import Job from "@/models/Job";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "applicant") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { jobId } = await req.json();
  await connectDB();

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    // Remove user from applicants
    job.applicants = job.applicants.filter(
      applicant => applicant.user.toString() !== session.user.id
    );

    await job.save();
    return NextResponse.json({ message: "Application withdrawn successfully" });
  } catch (error) {
    console.error("Error withdrawing application:", error);
    return NextResponse.json(
      { message: "Error withdrawing application" },
      { status: 500 }
    );
  }
}