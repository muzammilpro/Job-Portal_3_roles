import connectDB from "@/lib/mongoose";
import Job from "@/models/Job";

export async function PUT(req) {
  await connectDB();
  const { jobId, userId, status } = await req.json();

  await Job.updateOne(
    { _id: jobId, "applicants.user": userId },
    { $set: { "applicants.$.status": status } }
  );

  return Response.json({ success: true });
}
