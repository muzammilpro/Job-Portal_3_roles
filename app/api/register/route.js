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
import crypto from "crypto";
import nodemailer from "nodemailer";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";

export async function POST(req) {
  const body = await req.json();
  const { action, name, email, password, role, token, origin } = body;

  await connectDB();

  if (action === "forgot-password") {
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { message: "If an account exists, a reset link has been sent." },
        { status: 200 }
      );
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 30);
    await user.save();

    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_EMAIL_APP_PASSWORD) {
      return NextResponse.json(
        { message: "Reset token created, but email service is not configured." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_APP_PASSWORD,
      },
      tls: { rejectUnauthorized: false },
    });

    const baseUrl = typeof origin === "string" && origin
      ? origin
      : process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/login?mode=reset&email=${encodeURIComponent(
      user.email
    )}&token=${rawToken}`;

    await transporter.sendMail({
      from: {
        name: "Job Portal",
        address: process.env.ADMIN_EMAIL,
      },
      to: user.email,
      subject: "Reset your password",
      text: `Use this link to reset your password: ${resetUrl}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>Password Reset</h2>
          <p>You requested to reset your password.</p>
          <p>
            <a href="${resetUrl}" style="display:inline-block;padding:10px 16px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;">
              Reset Password
            </a>
          </p>
          <p>If the button does not work, copy and paste this link:</p>
          <p>${resetUrl}</p>
          <p>This link expires in 30 minutes.</p>
        </div>
      `,
    });

    return NextResponse.json(
      { message: "If an account exists, a reset link has been sent." },
      { status: 200 }
    );
  }

  if (action === "reset-password") {
    if (!email || !token || !password) {
      return NextResponse.json(
        { message: "Email, token, and new password are required." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      email: email.toLowerCase(),
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Reset link is invalid or has expired." },
        { status: 400 }
      );
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return NextResponse.json(
      { message: "Password has been reset successfully." },
      { status: 200 }
    );
  }

  if (!name || !email || !password || !role) {
    return NextResponse.json(
      { message: "Name, email, password and role are required." },
      { status: 400 }
    );
  }

  const exists = await User.findOne({ email: email?.toLowerCase() });
  if (exists) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userData = {
    name,
    email: email.toLowerCase(),
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
