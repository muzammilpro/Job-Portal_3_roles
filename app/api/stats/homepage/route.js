// import { NextResponse } from "next/server";
// import connectDB from "@/lib/mongoose";
// import User from "@/models/User";
// import Job from "@/models/Job";

// export async function GET() {
//     try {
//         await connectDB();

//         // Fetch total and active jobs
//         const totalJobs = await Job.countDocuments();
//         const activeJobs = await Job.countDocuments({ isClosed: false });

//         // Fetch companies (all and approved)
//         const totalCompanies = await User.countDocuments({ role: "company" });
//         const approvedCompanies = await User.countDocuments({
//             role: "company",
//             companyStatus: "approved"
//         });

//         // Fetch total applicants
//         const totalApplicants = await User.countDocuments({ role: "applicant" });

//         // Aggregate application statistics
//         const jobs = await Job.find({}, { applicants: 1 });

//         let totalApplications = 0;
//         let totalHired = 0;

//         jobs.forEach(job => {
//             if (job.applicants && job.applicants.length > 0) {
//                 totalApplications += job.applicants.length;
//                 totalHired += job.applicants.filter(app => app.status === "accepted").length;
//             }
//         });

//         // Calculate success rate (avoid division by zero)
//         const successRate = totalApplications > 0
//             ? Math.round((totalHired / totalApplications) * 100)
//             : 0;

//         return NextResponse.json({
//             success: true,
//             stats: {
//                 totalJobs,
//                 activeJobs,
//                 totalCompanies,
//                 approvedCompanies,
//                 totalApplicants,
//                 totalApplications,
//                 successRate,
//                 totalHired,
//             },
//         });
//     } catch (error) {
//         console.error("Error fetching homepage stats:", error);
//         return NextResponse.json(
//             {
//                 success: false,
//                 message: "Failed to fetch statistics",
//                 error: error.message
//             },
//             { status: 500 }
//         );
//     }
// }


import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import Job from "@/models/Job";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ isClosed: false });

    const totalCompanies = await User.countDocuments({ role: "company" });
    const approvedCompanies = await User.countDocuments({
      role: "company",
      companyStatus: "approved",
    });

    const totalApplicants = await User.countDocuments({ role: "applicant" });

    const jobs = await Job.find({}, { applicants: 1 }).lean();

    let totalApplications = 0;
    let totalHired = 0;

    for (const job of jobs) {
      if (!Array.isArray(job.applicants)) continue;

      totalApplications += job.applicants.length;

      for (const app of job.applicants) {
        if (app?.status === "accepted") totalHired++;
      }
    }

    const successRate =
      totalApplications > 0
        ? Math.round((totalHired / totalApplications) * 100)
        : 0;

    return NextResponse.json({
      success: true,
      stats: {
        totalJobs,
        activeJobs,
        totalCompanies,
        approvedCompanies,
        totalApplicants,
        totalApplications,
        totalHired,
        successRate,
      },
    });
  } catch (error) {
    console.error("Homepage stats error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch homepage stats" },
      { status: 500 }
    );
  }
}
