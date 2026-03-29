import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress?: string;
  items: Array<{ menuItemId: string; name: string; price: number; qty: number }>;
  total: number;
  paymentMethod: "cod";
  status: "In Process" | "Delivered" | "Cancelled";
  notes?: string;
  messages?: Array<{ sender: "owner" | "customer"; text: string; createdAt: Date }>;
}

const OrderSchema = new Schema<IOrder>(
  {
    customerId: { type: String, required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerAddress: { type: String, default: "" },
    items: [
      {
        menuItemId: { type: String, default: "" },
        name: String,
        price: Number,
        qty: { type: Number, required: true }
      }
    ],
    total: { type: Number, required: true },
    paymentMethod: { type: String, default: "cod" },
    status: {
      type: String,
      enum: ["In Process", "Delivered", "Cancelled"],
      default: "In Process"
    },
    notes: String,
    messages: [
      {
        sender: { type: String, enum: ["owner", "customer"] },
        text: String,
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

// Drop old model if schema changed (dev hot-reload fix)
if (mongoose.models.Order) {
  delete mongoose.models.Order;
}

export default mongoose.model<IOrder>("Order", OrderSchema);
