import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import MenuItem from "@/models/MenuItem";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const menu = await MenuItem.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ menu });
  } catch (error) {
    console.error("Menu GET error:", error);
    return NextResponse.json({ menu: [], error: "Database unavailable" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "owner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const { name, price, img, description } = await req.json();
  const item = await MenuItem.create({
    name,
    price,
    img: img || "",
    description: description || "",
    available: true
  });
  return NextResponse.json({ item });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "owner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const { id, available } = await req.json();
  await MenuItem.findByIdAndUpdate(id, { available });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "owner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const { id } = await req.json();
  await MenuItem.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
