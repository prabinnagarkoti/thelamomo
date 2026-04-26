import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ error: "Email and code are required" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ message: "Already verified" });
    }

    if (user.verificationToken !== code) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
    }

    // Mark email as verified and clear the token
    user.emailVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return NextResponse.json({ message: "Email verified successfully!" });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 500 });
  }
}
