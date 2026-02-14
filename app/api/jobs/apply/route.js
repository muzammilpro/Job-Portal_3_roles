import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/mongoose";
import Job from "@/models/Job";
import User from "@/models/User";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "applicant") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { jobId } = await req.json();

  await connectDB();

  const user = await User.findOne({ email: session.user.email });
  const job = await Job.findById(jobId);

  if (!job) {
    return NextResponse.json({ message: "Job not found" }, { status: 404 });
  }

  const alreadyApplied = job.applicants.some(
    (a) => a.user.toString() === user._id.toString()
  );

  if (alreadyApplied) {
    return NextResponse.json(
      { message: "Already applied" },
      { status: 400 }
    );
  }

  job.applicants.push({ user: user._id });
  await job.save();

  return NextResponse.json({ message: "Applied successfully" });
}
