import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { sendOrderConfirmationEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const order = await Order.findById(id);
      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
      return NextResponse.json(order);
    }

    // Check for customer orders query
    const customerEmail = searchParams.get("customerEmail");
    if (customerEmail) {
      const orders = await Order.find({ customerEmail }).sort({ createdAt: -1 });
      return NextResponse.json({ orders });
    }

    // Owner: get all orders
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "owner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const status = searchParams.get("status");
    const filter: any = {};
    if (status) filter.status = status;

    const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(100);
    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json({ orders: [], error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();

    // Map cart items to order items format
    const orderItems = (data.items || []).map((item: any) => ({
      menuItemId: item.id || item.menuItemId || "",
      name: item.name,
      price: item.price,
      qty: item.qty
    }));

    const order = await Order.create({
      customerId: data.customerId || data.customerEmail,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      customerAddress: data.customerAddress || "",
      customerLocation: data.customerLocation || null,
      items: orderItems,
      total: data.total,
      paymentMethod: "cod",
      status: "In Process",
      notes: data.notes || ""
    });

    try {
      if (order.customerEmail) {
        await sendOrderConfirmationEmail(order.customerEmail, order.customerName, order);
      }
    } catch (emailErr) {
      console.error("Failed to send order confirmation email:", emailErr);
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Order POST error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const data = await req.json();
    const { orderId, status, message, sender } = data;

    await connectDB();

    // Handle message posting (customer or owner)
    if (message && orderId) {
      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          $push: {
            messages: {
              sender: sender || "customer",
              text: message,
              createdAt: new Date(),
              readByOwner: sender === "owner" // auto-read if sent by owner
            }
          }
        },
        { new: true }
      );
      return NextResponse.json({ order });
    }

    // Status and read updates require owner role
    if (!session || (session.user as any)?.role !== "owner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (data.markMessagesRead) {
      // Set all messages to readByOwner = true
      // We do this by updating the array where it's false, but Mongoose makes this slightly tricky
      // The easiest way is fetching the doc, modifying the array, and saving
      const order = await Order.findById(orderId);
      if (order) {
        order.messages?.forEach((m: any) => { m.readByOwner = true; });
        await order.save();
      }
      return NextResponse.json({ ok: true, order });
    }

    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    return NextResponse.json({ ok: true, order });
  } catch (error) {
    console.error("Order PATCH error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
