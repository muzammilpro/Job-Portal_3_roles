import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/mongoose";
import Job from "@/models/Job";
import User from "@/models/User";

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "company") {
      return Response.json({
        success: false,
        message: "Unauthorized"
      }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;
    const body = await req.json();

    // Find the user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return Response.json({
        success: false,
        message: "Company not found"
      }, { status: 404 });
    }

    // Find and verify the job belongs to the company
    const job = await Job.findOne({
      _id: id,
      company: user._id
    });

    if (!job) {
      return Response.json({
        success: false,
        message: "Job not found"
      }, { status: 404 });
    }

    // Update job fields
    if (body.isClosed !== undefined) {
      job.isClosed = body.isClosed;
    }

    if (body.title) job.title = body.title;
    if (body.description) job.description = body.description;
    if (body.location) job.location = body.location;
    if (body.salary) job.salary = body.salary;
    if (body.jobType || body.type) job.jobType = body.jobType || body.type;
    if (body.experienceLevel || body.experience) job.experienceLevel = body.experienceLevel || body.experience;
    if (body.requirements) job.requirements = body.requirements;
    if (body.skills) job.skills = body.skills;
    if (body.applicationDeadline || body.deadline) {
      job.applicationDeadline = new Date(body.applicationDeadline || body.deadline);
    }

    await job.save();

    return Response.json({
      success: true,
      job: job,
      message: "Job updated successfully"
    });

  } catch (error) {
    console.error("Error updating job:", error);
    return Response.json({
      success: false,
      message: "Error updating job"
    }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "company") {
      return Response.json({
        success: false,
        message: "Unauthorized"
      }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;

    // Find the user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return Response.json({
        success: false,
        message: "Company not found"
      }, { status: 404 });
    }

    // Find and verify the job belongs to the company
    const job = await Job.findOne({
      _id: id,
      company: user._id
    });

    if (!job) {
      return Response.json({
        success: false,
        message: "Job not found"
      }, { status: 404 });
    }

    // Delete the job
    await Job.findByIdAndDelete(id);

    return Response.json({
      success: true,
      message: "Job deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting job:", error);
    return Response.json({
      success: false,
      message: "Error deleting job"
    }, { status: 500 });
  }
}