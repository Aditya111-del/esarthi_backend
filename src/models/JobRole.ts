import mongoose, { Schema, Document } from "mongoose";

export interface IJobRole extends Document {
  title: string;
  department: string;
  level: string;
  description: string;
  responsibilities: string[];
  skills: string[];
  status: "active" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

const JobRoleSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    level: { type: String, required: true, default: "L1" },
    description: { type: String, default: "" },
    responsibilities: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    status: { type: String, enum: ["active", "archived"], default: "active" },
  },
  {
    timestamps: true,
  }
);

export const JobRoleModel = mongoose.models.JobRole || mongoose.model<IJobRole>("JobRole", JobRoleSchema);
