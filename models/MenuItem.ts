import mongoose, { Schema, Document } from "mongoose";

export interface IMenuItem extends Document {
  name: string;
  price: number;
  img: string;
  available: boolean;
  description?: string;
  category?: string;
}

const MenuItemSchema = new Schema<IMenuItem>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    img: { type: String, required: true },
    available: { type: Boolean, default: true },
    description: String,
    category: String
  },
  { timestamps: true }
);

export default mongoose.models.MenuItem ||
  mongoose.model<IMenuItem>("MenuItem", MenuItemSchema);
