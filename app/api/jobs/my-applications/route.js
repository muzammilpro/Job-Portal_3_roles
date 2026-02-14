import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/mongoose";
import Job from "@/models/Job";

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "applicant") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  try {
    const jobs = await Job.find({
      "applicants.user": session.user.id
    }).populate("company");

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { message: "Error fetching applications" },
      { status: 500 }
    );
  }
}