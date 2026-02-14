import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

// PUT: Update user company status
export async function PUT(request, { params }) {
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

        const { id } = await params;
        const { status } = await request.json();

        if (!id || !status) {
            return NextResponse.json(
                { error: "User ID and status are required" },
                { status: 400 }
            );
        }

        const user = await User.findById(id);

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Update company status
        user.companyStatus = status;
        await user.save();

        return NextResponse.json({
            success: true,
            message: `Company status updated to ${status}`,
            companyStatus: user.companyStatus,
        });

    } catch (error) {
        console.error("PUT user status error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
