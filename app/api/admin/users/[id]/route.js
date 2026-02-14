import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

// GET: Get a single user by ID
export async function GET(request, { params }) {
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

        if (!id) {
            return NextResponse.json(
                { error: "User ID is required" },
                { status: 400 }
            );
        }

        const user = await User.findById(id)
            .select("-password")
            .lean();

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            user,
        });

    } catch (error) {
        console.error("GET user by ID error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// PUT: Update user profile
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
        const updateData = await request.json();

        if (!id) {
            return NextResponse.json(
                { error: "User ID is required" },
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

        // Update user fields
        Object.keys(updateData).forEach(key => {
            if (key !== '_id' && key !== 'password') {
                user[key] = updateData[key];
            }
        });

        await user.save();

        // Return user without password
        const userObj = user.toObject();
        delete userObj.password;

        return NextResponse.json({
            success: true,
            message: "User updated successfully",
            user: userObj,
        });

    } catch (error) {
        console.error("PUT user by ID error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
