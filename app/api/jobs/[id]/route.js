import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/mongoose";
import Job from "@/models/Job";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    
    const job = await Job.findById(id)
      .populate("company", "name description industry size website")
      .populate("applicants.user", "name email");
    
    if (!job) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json(
      { message: "Error fetching job" },
      { status: 500 }
    );
  }
}



export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'company') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const job = await Job.findById(id);

    if (!job) {
      return NextResponse.json(
        { message: 'Job not found' },
        { status: 404 }
      );
    }

    // Verify company owns this job
    if (job.company.toString() !== session.user.id) {
      return NextResponse.json(
        { message: 'Unauthorized to update this job' },
        { status: 403 }
      );
    }

    // Update job fields
    const updatedJob = await Job.findByIdAndUpdate(
      id,
      {
        $set: {
          title: body.title,
          description: body.description,
          location: body.location,
          salary: body.salary,
          type: body.type,
          experience: body.experience,
          requirements: body.requirements,
          skills: body.skills,
          benefits: body.benefits,
          deadline: body.deadline,
          remote: body.remote,
          updatedAt: new Date()
        }
      },
      { new: true, runValidators: true }
    ).populate('company', 'name');

    return NextResponse.json({
      success: true,
      message: 'Job updated successfully',
      job: updatedJob
    });
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      { message: 'Error updating job', error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'company') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const { id } = await params;
    const { isClosed } = await request.json();

    const job = await Job.findById(id);

    if (!job) {
      return NextResponse.json(
        { message: 'Job not found' },
        { status: 404 }
      );
    }

    // Verify company owns this job
    if (job.company.toString() !== session.user.id) {
      return NextResponse.json(
        { message: 'Unauthorized to update this job' },
        { status: 403 }
      );
    }

    const updatedJob = await Job.findByIdAndUpdate(
      id,
      { $set: { isClosed, updatedAt: new Date() } },
      { new: true }
    ).populate('company', 'name');

    return NextResponse.json({
      success: true,
      message: `Job ${isClosed ? 'closed' : 're-opened'} successfully`,
      job: updatedJob
    });
  } catch (error) {
    console.error('Error updating job status:', error);
    return NextResponse.json(
      { message: 'Error updating job status', error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'company') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const { id } = await params;

    const job = await Job.findById(id);

    if (!job) {
      return NextResponse.json(
        { message: 'Job not found' },
        { status: 404 }
      );
    }

    // Verify company owns this job
    if (job.company.toString() !== session.user.id) {
      return NextResponse.json(
        { message: 'Unauthorized to delete this job' },
        { status: 403 }
      );
    }

    await Job.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json(
      { message: 'Error deleting job', error: error.message },
      { status: 500 }
    );
  }
}