import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

// PUT: Update company status
export async function PUT(request) {
  try {
    await connectDB();
    
    // Check if user is admin
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }
    
    const { userId, status } = await request.json();
    
    console.log("Status update request:", { userId, status });
    
    if (!userId || !status) {
      return NextResponse.json(
        { error: "User ID and status are required" },
        { status: 400 }
      );
    }
    
    // Validate status value
    const validStatuses = ["pending", "approved", "rejected"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Use: pending, approved, or rejected" },
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
    
    // Only update status for companies
    if (user.role !== "company") {
      return NextResponse.json(
        { 
          error: "Can only update status for companies",
          userRole: user.role 
        },
        { status: 400 }
      );
    }
    
    // Update status
    user.companyStatus = status;
    await user.save();
    
    console.log("Status updated successfully:", { 
      userId, 
      oldStatus: user.companyStatus, 
      newStatus: status 
    });
    
    return NextResponse.json({
      success: true,
      message: "Company status updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyStatus: user.companyStatus,
      },
    });
    
  } catch (error) {
    console.error("PUT status error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// GET: Get company status
export async function GET(request) {
  try {
    await connectDB();
    
    // Check if user is admin
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    
    if (userId) {
      // Get specific user status
      const user = await User.findById(userId).select("role companyStatus");
      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        user: {
          _id: user._id,
          role: user.role,
          companyStatus: user.companyStatus,
        },
      });
    }
    
    // Get all company statuses
    const companies = await User.find({ role: "company" })
      .select("name email companyStatus createdAt")
      .sort({ companyStatus: 1, createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      companies,
      counts: {
        total: companies.length,
        pending: companies.filter(c => c.companyStatus === "pending").length,
        approved: companies.filter(c => c.companyStatus === "approved").length,
        rejected: companies.filter(c => c.companyStatus === "rejected").length,
      },
    });
    
  } catch (error) {
    console.error("GET status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}