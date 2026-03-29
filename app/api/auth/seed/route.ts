import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST() {
  await connectDB();
  const existing = await User.findOne({ email: "owner@bizmenu.com" });
  if (existing) {
    return NextResponse.json({ message: "Owner already exists" });
  }
  await User.create({
    email: "owner@bizmenu.com",
    password: await hash("BizMenu2024!", 10),
    role: "owner",
    name: "Owner"
  });
  return NextResponse.json({ message: "Seeded owner@bizmenu.com / BizMenu2024!" });
}
