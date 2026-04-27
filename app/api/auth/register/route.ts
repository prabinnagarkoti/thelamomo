import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { sendVerificationEmail } from "@/lib/email";
import crypto from "crypto";

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

    // Send verification email via Nodemailer
    try {
      await sendVerificationEmail(email, name, verificationToken);
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
