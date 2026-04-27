import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { sendVerificationEmail } from "@/lib/email";
import crypto from "crypto";

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

    await sendVerificationEmail(email, user.name || "there", verificationToken);

    return NextResponse.json({ message: "Verification email sent! Please check your inbox." });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 });
  }
}
