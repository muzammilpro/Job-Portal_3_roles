import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

// PUT: Update user role
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
        const { role } = await request.json();

        if (!id || !role) {
            return NextResponse.json(
                { error: "User ID and role are required" },
                { status: 400 }
            );
        }

        // Don't allow changing own role
        if (id === session.user.id) {
            return NextResponse.json(
                { error: "Cannot change your own role" },
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

        const oldRole = user.role;
        user.role = role;

        // If changing to/from company, update companyStatus
        if (role === "company" && oldRole !== "company") {
            user.companyStatus = "pending";
        }

        await user.save();

        return NextResponse.json({
            success: true,
            message: `User role updated to ${role}`,
            role: user.role,
            companyStatus: user.companyStatus,
        });

    } catch (error) {
        console.error("PUT user role error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
