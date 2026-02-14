import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/mongoose";
import Job from "@/models/Job";
import User from "@/models/User";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "applicant") {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  await connectDB();

  const user = await User.findOne({ email: session.user.email });

  const appliedJobs = await Job.find({
    "applicants.user": user._id,
  })
    .populate("company", "name email")
    .sort({ createdAt: -1 });

  const formatted = appliedJobs.map((job) => {
    const applicant = job.applicants?.find((a) => a.user?.toString?.() === user._id.toString());
    return {
      _id: job._id,
      title: job.title,
      description: job.description,
      location: job.location,
      salary: job.salary,
      type: job.type,
      company: job.company,
      createdAt: applicant?.appliedAt || job.createdAt,
      updatedAt: job.updatedAt,
      status: applicant?.status || "pending",
      applicationId: `APP-${job._id.toString().slice(-8).toUpperCase()}`,
    };
  });

  return NextResponse.json(formatted);
}
