import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { role } = await req.json();

        // Validate role
        if (!["applicant", "company"].includes(role)) {
            return NextResponse.json(
                { message: "Invalid role" },
                { status: 400 }
            );
        }

        await connectDB();

        // Find and update user
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        // Only update if this is a newly created OAuth user (password is null)
        // and role is still the default "company"
        if (user.password === null && user.role === "company" && role === "applicant") {
            user.role = role;
            await user.save();

            return NextResponse.json({
                success: true,
                message: "Role updated successfully"
            });
        }

        return NextResponse.json({
            success: true,
            message: "No update needed"
        });

    } catch (error) {
        console.error("Error updating role:", error);
        return NextResponse.json(
            { message: "Error updating role" },
            { status: 500 }
        );
    }
}
