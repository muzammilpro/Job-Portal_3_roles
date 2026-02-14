// SIMPLIFIED VERSION FOR TESTING - TEMPORARY
// This version removes database checks to test email sending directly
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    console.log("=== Simplified Email API Called ===");

    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "company") {
      console.error("Unauthorized access");
      return NextResponse.json(
        { error: "Unauthorized access. Company account required." },
        { status: 401 }
      );
    }
    console.log("User authenticated:", session.user.email);

    const body = await req.json();
    console.log("Request body:", body);

    const {
      to,
      applicantName,
      subject,
      message,
      jobTitle,
      companyName,
      interviewDate,
      interviewTime,
      interviewType,
      interviewLink,
    } = body;

    // Validate required fields
    if (!to || !subject || !message || !applicantName) {
      console.error("Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields: to, subject, message, applicantName" },
        { status: 400 }
      );
    }
    console.log("Required fields validated");

    // Check environment variables
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_EMAIL_APP_PASSWORD) {
      console.error("Email credentials not configured");
      return NextResponse.json(
        { error: "Email service not configured. Missing ADMIN_EMAIL or ADMIN_EMAIL_APP_PASSWORD" },
        { status: 500 }
      );
    }
    console.log("Email credentials found");

    // Create email transporter
    console.log("Creating transporter with:", process.env.ADMIN_EMAIL);
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_APP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Format interview details
    let interviewDetailsHtml = "";
    if (interviewDate || interviewTime || interviewType || interviewLink) {
      interviewDetailsHtml = `
        <div style="background-color: #f7fafc; border-left: 4px solid #4299e1; padding: 15px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #2d3748;">Interview Details</h3>
          <table style="width: 100%;">
            ${interviewDate ? `<tr><td style="padding: 5px 0;"><strong> Date:</strong></td><td style="padding: 5px 0;">${new Date(interviewDate).toLocaleDateString()}</td></tr>` : ''}
            ${interviewTime ? `<tr><td style="padding: 5px 0;"><strong> Time:</strong></td><td style="padding: 5px 0;">${interviewTime}</td></tr>` : ''}
            ${interviewType ? `<tr><td style="padding: 5px 0;"><strong> Type:</strong></td><td style="padding: 5px 0;">${interviewType}</td></tr>` : ''}
            ${interviewLink ? `<tr><td style="padding: 5px 0;"><strong> Link:</strong></td><td style="padding: 5px 0;"><a href="${interviewLink}">${interviewLink}</a></td></tr>` : ''}
          </table>
        </div>
      `;
    }

    // HTML email content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">${companyName || 'Job Portal'}</h1>
          </div>
          
          <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px;">
            
            <div style="white-space: pre-wrap; margin: 20px 0;">${message}</div>
            
            ${interviewDetailsHtml}
            
            ${jobTitle ? `<p style="margin: 20px 0;"><strong>Position:</strong> ${jobTitle}</p>` : ''}
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
            
            <p style="color: #718096; font-size: 14px; margin: 0;">
              Best regards,<br>
              ${companyName || 'The Hiring Team'}
            </p>
            
            <p style="color: #a0aec0; font-size: 12px; margin-top: 20px;">
              This is an automated message. Please do not reply to this email directly.
            </p>
          </div>
        </body>
      </html>
    `;

    // Plain text version
    const textContent = `
      ${subject}
      
      Dear ${applicantName},
      
      ${message}
      
      ${interviewDate ? `Interview Date: ${new Date(interviewDate).toLocaleDateString()}` : ''}
      ${interviewTime ? `Interview Time: ${interviewTime}` : ''}
      ${interviewType ? `Interview Type: ${interviewType}` : ''}
      ${interviewLink ? `Meeting Link: ${interviewLink}` : ''}
      
      ${jobTitle ? `Position: ${jobTitle}` : ''}
      
      Best regards,
      ${companyName || 'The Hiring Team'}
    `;

    // Send email
    const mailOptions = {
      from: {
        name: companyName || 'Job Portal',
        address: process.env.ADMIN_EMAIL,
      },
      to,
      subject,
      text: textContent,
      html: htmlContent,
      replyTo: session.user.email,
    };

    console.log("Attempting to send email...");
    console.log("Mail options:", { from: mailOptions.from, to: mailOptions.to, subject: mailOptions.subject });

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully! Message ID:", info.messageId);

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully!',
      messageId: info.messageId,
      to,
      subject
    });

  } catch (error) {
    console.error('❌ Error in email API:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });

    let errorMessage = 'Failed to send email';
    let statusCode = 500;

    if (error.code === 'EAUTH') {
      errorMessage = 'Email authentication failed. Please check your Gmail credentials and App Password.';
      statusCode = 401;
    } else if (error.code === 'EENVELOPE') {
      errorMessage = 'Invalid email address.';
      statusCode = 400;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: statusCode }
    );
  }
}