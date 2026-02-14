import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/mongoose";
import Job from "@/models/Job";
import User from "@/models/User";

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "company") {
      return Response.json({ 
        success: false, 
        message: "Unauthorized" 
      }, { status: 401 });
    }

    await connectDB();

    const { id } = params;

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
    }).populate({
      path: 'applicants.user',
      select: 'name email role'
    });

    if (!job) {
      return Response.json({ 
        success: false, 
        message: "Job not found" 
      }, { status: 404 });
    }

    return Response.json({ 
      success: true, 
      applicants: job.applicants || [],
      jobTitle: job.title
    });

  } catch (error) {
    console.error("Error fetching applicants:", error);
    return Response.json({ 
      success: false, 
      message: "Error fetching applicants" 
    }, { status: 500 });
  }
}