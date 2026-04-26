import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY || "default_key_to_prevent_build_error");

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal whether account exists
      return NextResponse.json({ message: "If an account exists, a verification email has been sent." });
    }

    if (user.emailVerified) {
      return NextResponse.json({ message: "This email is already verified. You can sign in." });
    }

    // Generate new verification code
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationToken = verificationToken;
    await user.save();

    await resend.emails.send({
      from: "BizMenu Builder <onboarding@resend.dev>",
      to: email,
      subject: "Your new verification code — BizMenu Builder",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 520px; margin: 0 auto; background: #0f172a; border-radius: 16px; overflow: hidden; border: 1px solid rgba(148,163,184,0.15);">
          <div style="background: linear-gradient(135deg, #f59e0b, #f97316, #e11d48); padding: 32px 24px; text-align: center;">
            <h1 style="margin: 0; color: #0f172a; font-size: 24px; font-weight: 700;">🍽️ BizMenu Builder</h1>
            <p style="margin: 8px 0 0; color: rgba(15,23,42,0.7); font-size: 13px;">Your Digital Menu, Your Rules</p>
          </div>
          <div style="padding: 32px 24px;">
            <h2 style="color: #f1f5f9; font-size: 20px; margin: 0 0 12px;">Verify your email</h2>
            <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
              Hi <strong style="color: #e2e8f0;">${user.name || "there"}</strong>, here is your new verification code.
            </p>
            <div style="background: #1e293b; border: 1px solid #334155; padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #f59e0b;">${verificationToken}</span>
            </div>
          </div>
        </div>
      `
    });

    return NextResponse.json({ message: "Verification email sent! Please check your inbox." });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 });
  }
}
