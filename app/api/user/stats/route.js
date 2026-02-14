import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';

// POST: Increment jobs applied
export async function POST(request) {
  try {
    await connectDB();
    
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    const user = await User.findOne({ email });
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
    
    user.profile.jobsApplied = (user.profile.jobsApplied || 0) + 1;
    user.markModified('profile');
    
    await user.save();
    
    return NextResponse.json({
      success: true,
      message: 'Jobs applied counter incremented',
      jobsApplied: user.profile.jobsApplied
    });
    
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT: Update interviews counter
export async function PUT(request) {
  try {
    await connectDB();
    
    const { email, interviews } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    if (!user.profile) {
      user.profile = {};
    }
    
    if (interviews !== undefined) {
      user.profile.interviews = interviews;
    } else {
      user.profile.interviews = (user.profile.interviews || 0) + 1;
    }
    
    user.markModified('profile');
    await user.save();
    
    return NextResponse.json({
      success: true,
      message: 'Interviews counter updated',
      interviews: user.profile.interviews
    });
    
  } catch (error) {
    console.error('Interviews error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}