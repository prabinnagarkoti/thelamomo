import mongoose, { Schema, Document } from "mongoose";

export interface IRestaurantConfig extends Document {
  restaurantName: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  tagline?: string;
  aboutText?: string;
  address?: string;
  phone?: string;
  email?: string;
  operatingHours?: string;
  heroSubtitle?: string;
  badge1?: string;
  badge2?: string;
  badge3?: string;
}

const RestaurantConfigSchema = new Schema<IRestaurantConfig>(
  {
    restaurantName: { type: String, default: "BizMenu Builder" },
    logoUrl: String,
    primaryColor: { type: String, default: "#f59e0b" },
    secondaryColor: { type: String, default: "#e11d48" },
    backgroundColor: { type: String, default: "#020617" },
    tagline: { type: String, default: "Your Digital Menu, Your Rules" },
    aboutText: {
      type: String,
      default:
        "We are passionate about bringing you the best dining experience. Every dish is crafted with care using the freshest ingredients, honoring traditional recipes while embracing modern techniques."
    },
    address: { type: String, default: "123 Main Street, Your City" },
    phone: { type: String, default: "+1 (555) 000-0000" },
    email: { type: String, default: "hello@yourbusiness.com" },
    operatingHours: { type: String, default: "Mon–Sun: 11:00am – 10:00pm" },
    heroSubtitle: {
      type: String,
      default:
        "Fresh, handcrafted dishes made with love. Order online for pickup or delivery — quality food at your fingertips."
    },
    badge1: { type: String, default: "Fresh Ingredients" },
    badge2: { type: String, default: "Fast Preparation" },
    badge3: { type: String, default: "Top Rated" }
  },
  { timestamps: true }
);

export default mongoose.models.RestaurantConfig ||
  mongoose.model<IRestaurantConfig>("RestaurantConfig", RestaurantConfigSchema);
