import mongoose, { Schema, Document } from "mongoose";

export interface IShop extends Document {
  name: string;
  code: string;
  city: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  status: "active" | "inactive";
  stationType?: string;
  powerCapacityKw?: number;
  totalBays?: number;
  activeBays?: number;
  supportedConnectors?: string[];
  uptimePercent?: number;
  dailyEnergyKwh?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ShopSchema: Schema = new Schema(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    city: { type: String, required: true, trim: true },
    address: { type: String, default: "" },
    contactEmail: { type: String, default: "" },
    contactPhone: { type: String, default: "" },
    adminName: { type: String, required: true, trim: true },
    adminEmail: { type: String, required: true, trim: true },
    adminPhone: { type: String, default: "" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    stationType: { type: String, default: "Ultra-Fast Highway Hub" },
    powerCapacityKw: { type: Number, default: 240 },
    totalBays: { type: Number, default: 8 },
    activeBays: { type: Number, default: 6 },
    supportedConnectors: { type: [String], default: ["CCS-2", "CHAdeMO"] },
    uptimePercent: { type: Number, default: 99.8 },
    dailyEnergyKwh: { type: Number, default: 3200 },
  },
  {
    timestamps: true,
  }
);

export const ShopModel: mongoose.Model<any> = mongoose.models.Shop || mongoose.model("Shop", ShopSchema);
