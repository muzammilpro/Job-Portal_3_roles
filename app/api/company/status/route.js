// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import connectDB from "@/lib/mongoose";
// import User from "@/models/User";

// export async function GET() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "company") {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//   }

//   await connectDB();

//   const company = await User.findOne({ email: session.user.email });

//   return NextResponse.json({
//     companyStatus: company.companyStatus,
//   });
// }


// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import connectDB from "@/lib/mongoose";
// import User from "@/models/User";

// export async function GET() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "company") {
//     return NextResponse.json(
//       { message: "Unauthorized" },
//       { status: 401 }
//     );
//   }

//   await connectDB();

//   const company = await User.findOne({ email: session.user.email }).select(
//     "status name email"
//   );

//   return NextResponse.json(company);
// }


// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import connectDB from "@/lib/mongoose";
// import User from "@/models/User";

// export async function GET() {
//   try {
//     await connectDB();

//     const session = await getServerSession(authOptions);

//     if (!session) {
//   } catch (error) {
//     return NextResponse.json(
//       { message: "Server Error" },
//       { status: 500 }
//     );
//   }
// }

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "company") {
      return Response.json({
        success: false,
        message: "Unauthorized"
      }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return Response.json({
        success: false,
        companyStatus: null,
        message: "User not found"
      }, { status: 404 });
    }

    return Response.json({
      success: true,
      companyStatus: user.companyStatus,
      rejectionReason: user.rejectionReason || null,
      company: {
        name: user.name,
        email: user.email,
        status: user.companyStatus
      }
    });

  } catch (error) {
    console.error("Error fetching company status:", error);
    return Response.json({
      success: false,
      message: "Error fetching company status"
    }, { status: 500 });
  }
}