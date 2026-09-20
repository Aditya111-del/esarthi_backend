import mongoose, { Schema, Document } from "mongoose";

export interface IEmployee extends Document {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  employeeId: string;
  shopId: string;
  shopName: string;
  department: string;
  roleTitle: string;
  roleId: string;
  level: string;
  status: "Active" | "Onboarding" | "Review" | "On Leave";
  employmentType: "Full-time" | "Part-time" | "Contract" | "Intern";
  salary?: string;
  joiningDate: string;
  dateOfBirth?: string;
  address?: string;
  emergencyName?: string;
  emergencyPhone?: string;
  skills: string[];
  certifications?: string[];
  assignedBay?: string;
  shift?: string;
  safetyEquipmentCleared?: boolean;
  bio: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EmployeeSchema: Schema = new Schema(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    name: { type: String, required: true, trim: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: "" },
    employeeId: { type: String, required: true, unique: true, trim: true },
    shopId: { type: String, default: "" },
    shopName: { type: String, default: "Central Headquarters" },
    department: { type: String, required: true, trim: true },
    roleTitle: { type: String, required: true, trim: true },
    roleId: { type: String, default: "" },
    level: { type: String, default: "L1" },
    status: {
      type: String,
      enum: ["Active", "Onboarding", "Review", "On Leave"],
      default: "Active",
    },
    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Intern"],
      default: "Full-time",
    },
    salary: { type: String, default: "" },
    joiningDate: { type: String, required: true },
    dateOfBirth: { type: String, default: "" },
    address: { type: String, default: "" },
    emergencyName: { type: String, default: "" },
    emergencyPhone: { type: String, default: "" },
    skills: { type: [String], default: [] },
    certifications: { type: [String], default: ["High-Voltage Safety Level 2", "OCPP 1.6 Protocol"] },
    assignedBay: { type: String, default: "Bay 01 - 04 (DC Fast)" },
    shift: { type: String, default: "Morning Shift (06:00 - 14:00)" },
    safetyEquipmentCleared: { type: Boolean, default: true },
    bio: { type: String, default: "" },
    image: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

export const EmployeeModel: mongoose.Model<any> = mongoose.models.Employee || mongoose.model("Employee", EmployeeSchema);
