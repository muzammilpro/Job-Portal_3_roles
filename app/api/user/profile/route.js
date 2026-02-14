// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import connectDB from "@/lib/mongoose";
// import User from "@/models/User";

// export async function GET() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "user") {
//     return NextResponse.json(
//       { message: "Unauthorized" },
//       { status: 401 }
//     );
//   }

//   await connectDB();

//   const user = await User.findOne({ email: session.user.email })
//     .select("-password");

//   if (!user) {
//     return NextResponse.json(
//       { message: "User not found" },
//       { status: 404 }
//     );
//   }

//   return NextResponse.json({
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     role: user.role,
//     createdAt: user.createdAt,
//     applications: [], // 🔜 future job applications
//   });
// }


import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

// GET: Get user profile
export async function GET(request) {
  try {
    await connectDB();
    
    // Get session using NextAuth
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const user = await User.findOne({ email: session.user.email })
      .select('-password')
      .lean();
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Ensure profile exists
    if (!user.profile) {
      user.profile = {};
    }
    
    // Calculate profile completion
    let completion = 0;
    const fields = [
      { field: user.name, weight: 10 },
      { field: user.email, weight: 10 },
      { field: user.profile.phone, weight: 10 },
      { field: user.profile.location, weight: 10 },
      { field: user.profile.bio, weight: 15 },
      { field: user.profile.skills, weight: 15, isArray: true },
      { field: user.profile.experience, weight: 15, isArray: true },
      { field: user.profile.education, weight: 10, isArray: true },
      { field: user.profile.profileImage, weight: 5 },
    ];
    
    fields.forEach(item => {
      if (item.field) {
        if (item.isArray && Array.isArray(item.field)) {
          if (item.field.length > 0) completion += item.weight;
        } else if (item.field.toString().trim().length > 0) {
          completion += item.weight;
        }
      }
    });
    
    user.profile.profileCompletion = completion;
    
    return NextResponse.json({
      success: true,
      user: {
        ...user,
        profile: user.profile
      }
    });
    
  } catch (error) {
    console.error('GET profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT: Update user profile
export async function PUT(request) {
  try {
    await connectDB();
    
    // Get session using NextAuth
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const data = await request.json();
    const { profileData } = data;
    
    // Find user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // FIX: Convert "user" role to "applicant" if needed
    if (user.role === "user") {
      user.role = "applicant";
    }
    
    // Ensure profile exists
    if (!user.profile) {
      user.profile = {};
    }
    
    // Update name if provided
    if (profileData.fullName) {
      user.name = profileData.fullName;
    }
    
    // Update profile fields
    if (profileData.phone !== undefined) {
      user.profile.phone = profileData.phone;
    }
    
    if (profileData.location !== undefined) {
      user.profile.location = profileData.location;
    }
    
    if (profileData.bio !== undefined) {
      user.profile.bio = profileData.bio;
    }
    
    // Update skills
    if (profileData.skills !== undefined) {
      if (Array.isArray(profileData.skills)) {
        user.profile.skills = profileData.skills;
      } else if (typeof profileData.skills === 'string') {
        user.profile.skills = profileData.skills
          .split(',')
          .map(s => s.trim())
          .filter(s => s);
      }
    }
    
    // Update experience
    if (profileData.experience !== undefined) {
      user.profile.experience = profileData.experience;
    }
    
    // Update education
    if (profileData.education !== undefined) {
      user.profile.education = profileData.education;
    }
    
    // Update profile image (Base64)
    if (profileData.profileImage !== undefined) {
      user.profile.profileImage = profileData.profileImage;
    }
    
    // Update resume
    if (profileData.resume !== undefined) {
      if (profileData.resume === null) {
        user.profile.resume = null;
      } else {
        user.profile.resume = profileData.resume;
      }
    }
    
    // Update social links
    if (!user.profile.socialLinks) {
      user.profile.socialLinks = {};
    }
    
    if (profileData.github !== undefined) {
      user.profile.socialLinks.github = profileData.github;
    }
    
    if (profileData.linkedin !== undefined) {
      user.profile.socialLinks.linkedin = profileData.linkedin;
    }
    
    if (profileData.portfolio !== undefined) {
      user.profile.socialLinks.portfolio = profileData.portfolio;
    }
    
    // Calculate profile completion
    let completion = 0;
    const fields = [
      { field: user.name, weight: 10 },
      { field: user.email, weight: 10 },
      { field: user.profile.phone, weight: 10 },
      { field: user.profile.location, weight: 10 },
      { field: user.profile.bio, weight: 15 },
      { field: user.profile.skills, weight: 15, isArray: true },
      { field: user.profile.experience, weight: 15, isArray: true },
      { field: user.profile.education, weight: 10, isArray: true },
      { field: user.profile.profileImage, weight: 5 },
    ];
    
    fields.forEach(item => {
      if (item.field) {
        if (item.isArray && Array.isArray(item.field)) {
          if (item.field.length > 0) completion += item.weight;
        } else if (item.field.toString().trim().length > 0) {
          completion += item.weight;
        }
      }
    });
    
    user.profile.profileCompletion = completion;
    
    // Mark profile as modified
    user.markModified('profile');
    
    // Save user without validation (temporary fix)
    await user.save({ validateBeforeSave: false });
    
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });
    
  } catch (error) {
    console.error('PUT profile error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}