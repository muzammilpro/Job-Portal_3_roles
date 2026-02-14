// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import connectDB from "@/lib/mongoose";
// import User from "@/models/User";
// import Job from "@/models/Job";

// export async function POST(req) {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "company") {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//   }

//   await connectDB();

//   const company = await User.findOne({ email: session.user.email });

//   if (company.companyStatus !== "approved") {
//     return NextResponse.json(
//       { message: "Company not approved" },
//       { status: 403 }
//     );
//   }

//   const data = await req.json();

//   const job = await Job.create({
//     ...data,
//     company: company._id,
//   });

//   return NextResponse.json(job);
// }


import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import Job from "@/models/Job";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "company") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const company = await User.findOne({ email: session.user.email });

  if (company.companyStatus !== "approved") {
    return NextResponse.json(
      { message: "Company not approved" },
      { status: 403 }
    );
  }

  const { title, description, location } = await req.json();

  const job = await Job.create({
    title,
    description,
    location,
    company: company._id,
  });

  return NextResponse.json(job, { status: 201 });
}
