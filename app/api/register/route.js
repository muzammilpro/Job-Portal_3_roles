// import connectDB from "@/lib/mongoose";
// import User from "@/models/User";
// import bcrypt from "bcrypt";

// export async function POST(req) {
//   await connectDB();
//   const { name, email, password, role } = await req.json();

//   if (!name || !email || !password || !role) {
//     return new Response("Missing fields", { status: 400 });
//   }

//   const exists = await User.findOne({ email });
//   if (exists) return new Response("Email already exists", { status: 400 });

//   const hashed = await bcrypt.hash(password, 10);
//   const user = new User({ name, email, password: hashed, role });
//   await user.save();

//   return new Response(JSON.stringify({ message: "User registered" }), {
//     status: 201,
//   });
// }


import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";

export async function POST(req) {
  const { name, email, password, role } = await req.json();

  await connectDB();

  const exists = await User.findOne({ email });
  if (exists) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userData = {
    name,
    email,
    password: hashedPassword,
    role,
  };

  // ✅ FORCE COMPANY STATUS
  if (role === "company") {
    userData.companyStatus = "pending";
  }

  const user = await User.create(userData);

  return NextResponse.json(user, { status: 201 });
}
