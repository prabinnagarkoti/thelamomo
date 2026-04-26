import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

function validatePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters" };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one uppercase letter" };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one lowercase letter" };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "Password must contain at least one number" };
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { valid: false, message: "Password must contain at least one special character" };
  }
  return { valid: true, message: "Password meets all requirements" };
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Validate password strength
    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
      return NextResponse.json({ error: passwordCheck.message }, { status: 400 });
    }

    await connectDB();

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Generate 6-digit verification code
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    // Create user
    const hashedPassword = await hash(password, 10);
    await User.create({
      email,
      password: hashedPassword,
      name,
      role: "customer",
      emailVerified: false,
      verificationToken
    });

    // Send verification email via Resend
    try {
      await resend.emails.send({
        from: "BizMenu Builder <onboarding@resend.dev>",
        to: email,
        subject: "Your verification code — BizMenu Builder",
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 520px; margin: 0 auto; background: #0f172a; border-radius: 16px; overflow: hidden; border: 1px solid rgba(148,163,184,0.15);">
            <div style="background: linear-gradient(135deg, #f59e0b, #f97316, #e11d48); padding: 32px 24px; text-align: center;">
              <h1 style="margin: 0; color: #0f172a; font-size: 24px; font-weight: 700;">🍽️ BizMenu Builder</h1>
              <p style="margin: 8px 0 0; color: rgba(15,23,42,0.7); font-size: 13px;">Your Digital Menu, Your Rules</p>
            </div>
            <div style="padding: 32px 24px;">
              <h2 style="color: #f1f5f9; font-size: 20px; margin: 0 0 12px;">Verify your email</h2>
              <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
                Hi <strong style="color: #e2e8f0;">${name}</strong>, thanks for signing up! Enter the following 6-digit code to verify your email address.
              </p>
              <div style="background: #1e293b; border: 1px solid #334155; padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #f59e0b;">${verificationToken}</span>
              </div>
              <p style="color: #475569; font-size: 11px; margin: 20px 0 0;">
                If you didn't create an account, you can safely ignore this email.
              </p>
            </div>
          </div>
        `
      });
    } catch (emailError) {
      console.error("Email send error:", emailError);
      // Don't fail registration if email fails — user can resend later
    }

    return NextResponse.json({
      message: "Account created! Please check your email to verify your account."
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
