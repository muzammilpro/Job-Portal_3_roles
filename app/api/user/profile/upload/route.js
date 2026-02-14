import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

// POST: Upload file (profile image or resume)
export async function POST(request) {
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
    
    const formData = await request.formData();
    const type = formData.get('type'); // 'profile' or 'resume'
    const file = formData.get('file');
    
    if (!type || !file) {
      return NextResponse.json(
        { error: 'Type and file are required' },
        { status: 400 }
      );
    }
    
    const user = await User.findOne({ email: session.user.email });
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
    
    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const mimeType = file.type;
    const dataUrl = `data:${mimeType};base64,${base64}`;
    
    if (type === 'profile') {
      user.profile.profileImage = dataUrl;
    } else if (type === 'resume') {
      user.profile.resume = {
        fileName: file.name,
        fileData: dataUrl,
        fileSize: file.size,
        fileType: mimeType
      };
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Use "profile" or "resume"' },
        { status: 400 }
      );
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
    user.markModified('profile');
    
    await user.save();
    
    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      dataUrl: dataUrl,
      fileName: file.name,
      fileSize: file.size
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE: Remove file
export async function DELETE(request) {
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
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'profile' or 'resume'
    
    if (!type) {
      return NextResponse.json(
        { error: 'Type is required' },
        { status: 400 }
      );
    }
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    if (!user.profile) {
      user.profile = {};
    }
    
    if (type === 'profile') {
      user.profile.profileImage = null;
    } else if (type === 'resume') {
      user.profile.resume = null;
    } else {
      return NextResponse.json(
        { error: 'Invalid type' },
        { status: 400 }
      );
    }
    
    // Recalculate profile completion
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
    user.markModified('profile');
    
    await user.save();
    
    return NextResponse.json({
      success: true,
      message: `${type} removed successfully`
    });
    
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}