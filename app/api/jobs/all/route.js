import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Job from "@/models/Job";

export async function GET() {
  await connectDB();

  const jobs = await Job.find()
    .populate("company", "name")
    .sort({ createdAt: -1 });

  return NextResponse.json(jobs);
}
