import mongoose, { Schema, Document } from "mongoose";

export interface IDepartment extends Document {
  name: string;
  code: string;
  lead: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const DepartmentSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    lead: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

export const DepartmentModel = mongoose.models.Department || mongoose.model<IDepartment>("Department", DepartmentSchema);
