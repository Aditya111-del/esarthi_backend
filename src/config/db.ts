import mongoose from "mongoose";
import {
  initialDepartments,
  initialEmployees,
  initialRoles,
  initialShops,
  SeedDepartment,
  SeedEmployee,
  SeedRole,
  SeedShop,
} from "../seed/seedData.js";
import { EmployeeModel } from "../models/Employee.js";
import { JobRoleModel } from "../models/JobRole.js";
import { DepartmentModel } from "../models/Department.js";
import { ShopModel } from "../models/Shop.js";

export let isMongoConnected = false;

// Resilient in-memory fallback stores
export let memShops: SeedShop[] = [...initialShops];
export let memEmployees: SeedEmployee[] = [...initialEmployees];
export let memRoles: SeedRole[] = [...initialRoles];
export let memDepartments: SeedDepartment[] = [...initialDepartments];

let cachedPromise: Promise<void> | null = null;

export async function connectDB(): Promise<void> {
  if (isMongoConnected && mongoose.connection.readyState === 1) {
    return;
  }

  if (cachedPromise) {
    return cachedPromise;
  }

  cachedPromise = (async () => {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/esarthi";
    const maskedUri = uri.replace(/:([^@]+)@/, ":****@");

    try {
      mongoose.set("strictQuery", false);
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 3000,
        connectTimeoutMS: 5000,
      } as any);
      isMongoConnected = true;
      console.log(`✅ [MongoDB] Connected successfully to: ${maskedUri}`);

      // Seed data if empty
      await seedDatabaseIfEmpty();
    } catch (err: unknown) {
      isMongoConnected = false;
      cachedPromise = null; // allow retry on next request
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.warn(`\n⚠️  [MongoDB Notice] Could not connect to MongoDB (${maskedUri}):`);
      console.warn(`   ${errorMsg}`);
      console.warn(`   👉 Running in resilient in-memory fallback mode.`);
      console.warn(`   👉 Full ESARTHI features and demo dataset are active.\n`);
    }
  })();

  return cachedPromise;
}

async function seedDatabaseIfEmpty() {
  try {
    const shopCount = await ShopModel.countDocuments();
    if (shopCount === 0) {
      console.log("🌱 [MongoDB] Seeding initial ESARTHI shops...");
      await ShopModel.insertMany(initialShops);
    } else {
      // Ensure the 4 primary branches have @esarthi.com admin IDs configured
      await ShopModel.updateOne(
        { $or: [{ code: "EV-DEL-01" }, { _id: "shp-del-01" }] },
        { $set: { adminEmail: "delhi.admin@esarthi.com", adminName: "Rajesh Kumar" } }
      );
      await ShopModel.updateOne(
        { $or: [{ code: "EV-BLR-01" }, { _id: "shp-blr-01" }] },
        { $set: { adminEmail: "bengaluru.admin@esarthi.com", adminName: "Vikram Malhotra" } }
      );
      await ShopModel.updateOne(
        { $or: [{ code: "EV-MUM-01" }, { _id: "shp-mum-01" }] },
        { $set: { adminEmail: "mumbai.admin@esarthi.com", adminName: "Sneha Patel" } }
      );
      await ShopModel.updateOne(
        { $or: [{ code: "EV-HYD-01" }, { _id: "shp-hyd-01" }] },
        { $set: { adminEmail: "hyderabad.admin@esarthi.com", adminName: "Karthik Reddy" } }
      );

      // Clean any legacy internal emails to @esarthi.com
      const legacyShops = await ShopModel.find({ adminEmail: /@esarthi-ev\.internal/ });
      for (const s of legacyShops) {
        const newEmail = s.adminEmail.replace("@esarthi-ev.internal", "@esarthi.com");
        await ShopModel.updateOne({ _id: s._id }, { $set: { adminEmail: newEmail } });
      }
    }

    const employeeCount = await EmployeeModel.countDocuments();
    if (employeeCount === 0) {
      console.log("🌱 [MongoDB] Seeding initial ESARTHI employees...");
      await EmployeeModel.insertMany(initialEmployees);
    }

    const roleCount = await JobRoleModel.countDocuments();
    if (roleCount === 0) {
      console.log("🌱 [MongoDB] Seeding initial ESARTHI job roles...");
      await JobRoleModel.insertMany(initialRoles);
    }

    const deptCount = await DepartmentModel.countDocuments();
    if (deptCount === 0) {
      console.log("🌱 [MongoDB] Seeding initial ESARTHI departments...");
      await DepartmentModel.insertMany(initialDepartments);
    }
  } catch (err) {
    console.error("Error during initial MongoDB seeding:", err);
  }
}
