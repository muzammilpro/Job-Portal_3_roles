// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import connectDB from "@/lib/mongoose";
// import User from "@/models/User";

// export async function PUT(req) {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "admin") {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//   }

//   const { companyId, status } = await req.json();

//   if (!["approved", "rejected"].includes(status)) {
//     return NextResponse.json(
//       { message: "Invalid status" },
//       { status: 400 }
//     );
//   }

//   await connectDB();

//   await User.findByIdAndUpdate(companyId, {
//     companyStatus: status,
//   });

//   return NextResponse.json({ message: "Status updated" });
// }


import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";

export async function PUT(req) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { userId, status, rejectionReason } = await req.json();

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid status" },
        { status: 400 }
      );
    }

    const updateData = { companyStatus: status };

    // Add rejection reason if rejecting, clear it if approving
    if (status === "rejected" && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    } else if (status === "approved") {
      updateData.rejectionReason = null;
    }

    await User.findByIdAndUpdate(userId, updateData);

    return NextResponse.json({
      message: `Company ${status} successfully`,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}
