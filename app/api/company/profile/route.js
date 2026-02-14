// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/authOptions";
// import connectDB from "@/lib/mongoose";
// import User from "@/models/User";

// export async function GET() {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session || session.user.role !== "company") {
//       return Response.json(
//         { success: false, message: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     await connectDB();

//     const user = await User.findOne({ email: session.user.email }).select(
//       "-password"
//     );

//     if (!user) {
//       return Response.json(
//         { success: false, message: "User not found" },
//         { status: 404 }
//       );
//     }

//     return Response.json(
//       {
//         success: true,
//         profile: {
//           name: user.name,
//           email: user.email,
//           description: user.description || "",
//           industry: user.industry || "",
//           size: user.size || "",
//           website: user.website || "",
//           phone: user.profile?.phone || "",
//           location: user.profile?.location || "",
//           bio: user.profile?.bio || "",
//           socialLinks: user.profile?.socialLinks || {},
//         },
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error fetching company profile:", error);
//     return Response.json(
//       { success: false, message: "Error fetching company profile" },
//       { status: 500 }
//     );
//   }
// }

// export async function PUT(req) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session || session.user.role !== "company") {
//       return Response.json(
//         { success: false, message: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const body = await req.json();

//     await connectDB();

//     const user = await User.findOne({ email: session.user.email });

//     if (!user) {
//       return Response.json(
//         { success: false, message: "User not found" },
//         { status: 404 }
//       );
//     }

//     // Basic company info
//     if (body.name) user.name = body.name;
//     if (body.description !== undefined) user.description = body.description;
//     if (body.industry !== undefined) user.industry = body.industry;
//     if (body.size !== undefined) user.size = body.size;
//     if (body.website !== undefined) user.website = body.website;

//     // Profile/contact info
//     user.profile = user.profile || {};
//     if (body.phone !== undefined) user.profile.phone = body.phone;
//     if (body.location !== undefined) user.profile.location = body.location;
//     if (body.bio !== undefined) user.profile.bio = body.bio;

//     if (body.socialLinks && typeof body.socialLinks === "object") {
//       user.profile.socialLinks = {
//         ...(user.profile.socialLinks?.toObject?.() || user.profile.socialLinks || {}),
//         ...body.socialLinks,
//       };
//     }

//     // Recalculate profile completion (optional but harmless for companies)
//     if (typeof user.calculateProfileCompletion === "function") {
//       user.calculateProfileCompletion();
//     }

//     await user.save();

//     return Response.json(
//       { success: true, message: "Company profile updated successfully" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error updating company profile:", error);
//     return Response.json(
//       { success: false, message: "Error updating company profile" },
//       { status: 500 }
//     );
//   }
// }

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import { authOptions } from "@/lib/authOptions";

/* ===================== GET PROFILE ===================== */
export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "company") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await User.findById(session.user.id).select(
      "companyProfile companyStatus"
    );

    return NextResponse.json({
      success: true,
      profile: user.companyProfile,
      companyStatus: user.companyStatus,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/* ===================== UPDATE PROFILE ===================== */
export async function PUT(req) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "company") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const {
      name,
      description,
      industry,
      size,
      website,
      phone,
      location,
      bio,
      socialLinks,
      approvalDocument,
      approvalDocumentType,
    } = body;

    const user = await User.findById(session.user.id);

    // Update company name if provided
    if (name !== undefined && name.trim() !== "") {
      user.name = name.trim();
    }

    user.companyProfile = {
      description,
      industry,
      size,
      website,
      phone,
      location,
      bio,
      socialLinks,
      approvalDocument,
      approvalDocumentType,
      approvalDocumentStatus: "pending", // reset on update
    };

    user.companyStatus = "pending"; // admin must re-approve

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Company profile updated",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
