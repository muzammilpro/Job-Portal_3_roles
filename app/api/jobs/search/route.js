import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Job from "@/models/Job";

export async function GET(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);

        // Get search parameters
        const query = searchParams.get("query") || "";
        const location = searchParams.get("location") || "";
        const jobType = searchParams.get("jobType") || "";
        const experienceLevel = searchParams.get("experienceLevel") || "";
        const limit = parseInt(searchParams.get("limit")) || 20;

        // Build filter object
        const filter = { isClosed: false };

        // Search in title, description, and location
        if (query) {
            filter.$or = [
                { title: { $regex: query, $options: "i" } },
                { description: { $regex: query, $options: "i" } },
            ];
        }

        // Location filter
        if (location) {
            filter.location = { $regex: location, $options: "i" };
        }

        // Job type filter
        if (jobType && jobType !== "all") {
            filter.jobType = jobType;
        }

        // Experience level filter
        if (experienceLevel && experienceLevel !== "all") {
            filter.experienceLevel = experienceLevel;
        }

        // Fetch jobs with filters
        const jobs = await Job.find(filter)
            .populate("company", "name email companyProfile")
            .sort({ createdAt: -1 })
            .limit(limit);

        return NextResponse.json({
            success: true,
            count: jobs.length,
            jobs,
        });
    } catch (error) {
        console.error("Job search error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to search jobs" },
            { status: 500 }
        );
    }
}
