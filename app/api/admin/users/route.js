import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

// GET: Get all users
export async function GET(request) {
  try {
    await connectDB();
    
    // Check if user is admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();
    
    return NextResponse.json({
      success: true,
      users,
    });
    
  } catch (error) {
    console.error("GET users error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT: Update user role
export async function PUT(request) {
  try {
    await connectDB();
    
    // Check if user is admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { userId, role } = await request.json();
    
    if (!userId || !role) {
      return NextResponse.json(
        { error: "User ID and role are required" },
        { status: 400 }
      );
    }

    const validRoles = ["admin", "company", "applicant"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Use: admin, company, or applicant" },
        { status: 400 }
      );
    }
    
    // Don't allow changing own role
    if (userId === session.user.id) {
      return NextResponse.json(
        { error: "Cannot change your own role" },
        { status: 400 }
      );
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    const oldRole = user.role;
    user.role = role;

    // Keep company approval flow consistent when crossing company boundary.
    if (oldRole !== role && (oldRole === "company" || role === "company")) {
      user.companyStatus = "pending";
      user.rejectionReason = null;
    }
    
    await user.save();
    
    return NextResponse.json({
      success: true,
      message: "User role updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyStatus: user.companyStatus,
      },
    });
    
  } catch (error) {
    console.error("PUT user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Delete user
export async function DELETE(request) {
  try {
    await connectDB();
    
    // Check if user is admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");
    
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    
    // Don't allow deleting yourself
    if (userId === session.user.id) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    await User.findByIdAndDelete(userId);
    
    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
    
  } catch (error) {
    console.error("DELETE user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
