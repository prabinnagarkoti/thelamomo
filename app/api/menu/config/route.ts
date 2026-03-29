import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import RestaurantConfig from "@/models/RestaurantConfig";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    let config = await RestaurantConfig.findOne();
    if (!config) {
      config = await RestaurantConfig.create({
        restaurantName: "BizMenu Builder",
        primaryColor: "#f59e0b",
        secondaryColor: "#e11d48",
        tagline: "Your Digital Menu, Your Rules"
      });
    }
    return NextResponse.json({ config });
  } catch (error) {
    console.error("Config GET error:", error);
    return NextResponse.json({ config: null, error: "Database unavailable" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "owner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const configData = await req.json();
  const config = await RestaurantConfig.findOneAndUpdate({}, configData, {
    upsert: true,
    new: true
  });
  return NextResponse.json({ config });
}
