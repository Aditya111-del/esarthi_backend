import { Router, Request, Response } from "express";
import { EmployeeModel } from "../models/Employee.js";
import { ShopModel } from "../models/Shop.js";
import { isMongoConnected, memEmployees, memShops } from "../config/db.js";
import { SeedEmployee } from "../seed/seedData.js";

const router = Router();

// Helper to find shop name
async function resolveShopName(shopId: string): Promise<string> {
  if (!shopId) return "Central Headquarters";
  if (isMongoConnected) {
    const shop = await ShopModel.findById(shopId).catch(() => null) ||
      await ShopModel.findOne({ _id: shopId }).catch(() => null) ||
      await ShopModel.findOne({ code: shopId.toUpperCase() });
    if (shop) return shop.name;
  }
  const mem = memShops.find((s) => s._id === shopId || s.code.toUpperCase() === shopId.toUpperCase());
  return mem ? mem.name : "Central Headquarters";
}

// GET /api/employees - list with optional search, department, status, and shopId filters
router.get("/", async (req: Request, res: Response) => {
  try {
    const { search, department, status, shopId } = req.query;

    if (isMongoConnected) {
      const query: Record<string, any> = {};

      if (department && department !== "all") {
        query.department = department;
      }
      if (status && status !== "all") {
        query.status = status;
      }
      if (shopId && shopId !== "all") {
        query.$or = [{ shopId: String(shopId) }, { shopId: String(shopId).toLowerCase() }];
      }
      if (search) {
        const searchRegex = new RegExp(String(search), "i");
        const searchCond = [
          { name: searchRegex },
          { email: searchRegex },
          { roleTitle: searchRegex },
          { employeeId: searchRegex },
          { department: searchRegex },
          { shopName: searchRegex },
        ];
        if (query.$or) {
          query.$and = [{ $or: query.$or }, { $or: searchCond }];
          delete query.$or;
        } else {
          query.$or = searchCond;
        }
      }

      const employees = await EmployeeModel.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: employees.length, employees });
    }

    // In-memory fallback
    let filtered = [...memEmployees];
    if (department && department !== "all") {
      filtered = filtered.filter((e) => e.department.toLowerCase() === String(department).toLowerCase());
    }
    if (status && status !== "all") {
      filtered = filtered.filter((e) => e.status.toLowerCase() === String(status).toLowerCase());
    }
    if (shopId && shopId !== "all") {
      filtered = filtered.filter((e) => e.shopId === String(shopId) || e.shopId === String(shopId).toLowerCase());
    }
    if (search) {
      const q = String(search).toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.roleTitle.toLowerCase().includes(q) ||
          e.employeeId.toLowerCase().includes(q) ||
          e.department.toLowerCase().includes(q) ||
          (e.shopName && e.shopName.toLowerCase().includes(q))
      );
    }

    return res.json({ success: true, count: filtered.length, employees: filtered });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "Failed to fetch employees" });
  }
});

// GET /api/employees/:id - single employee
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isMongoConnected) {
      const employee = await EmployeeModel.findById(id).catch(() => null) ||
        await EmployeeModel.findOne({ _id: id }).catch(() => null) ||
        await EmployeeModel.findOne({ employeeId: id });

      if (!employee) {
        return res.status(404).json({ success: false, message: "Employee not found" });
      }
      return res.json({ success: true, employee });
    }

    const employee = memEmployees.find((e) => e._id === id || e.employeeId === id);
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }
    return res.json({ success: true, employee });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "Error fetching employee" });
  }
});

// POST /api/employees - onboard / create employee with complete data (Superadmin or Shop Admin)
router.post("/", async (req: Request, res: Response) => {
  try {
    const data = req.body;

    if (!data.name && (!data.firstName || !data.lastName)) {
      return res.status(400).json({ success: false, message: "First name and last name are required" });
    }

    const firstName = data.firstName || data.name.split(" ")[0];
    const lastName = data.lastName || data.name.split(" ").slice(1).join(" ") || "Employee";
    const fullName = data.name || `${firstName} ${lastName}`;

    const employeeId = data.employeeId || `ES-${Math.floor(1000 + Math.random() * 9000)}`;
    const email = data.email || `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/[^a-z0-9]/g, "")}@esarthi.internal`;

    const shopId = data.shopId || "shp-del-01";
    const shopName = data.shopName || (await resolveShopName(shopId));

    const newEmployeeData = {
      name: fullName,
      firstName,
      lastName,
      email,
      phone: data.phone || "",
      employeeId,
      shopId,
      shopName,
      department: data.department || "Engineering",
      roleTitle: data.roleTitle || "Staff Member",
      roleId: data.roleId || "",
      level: data.level || "L1",
      status: data.status || "Active",
      employmentType: data.employmentType || "Full-time",
      salary: data.salary || "",
      joiningDate: data.joiningDate || new Date().toISOString().split("T")[0],
      dateOfBirth: data.dateOfBirth || "",
      address: data.address || "",
      emergencyName: data.emergencyName || "",
      emergencyPhone: data.emergencyPhone || "",
      skills: Array.isArray(data.skills)
        ? data.skills
        : (typeof data.skills === "string" ? data.skills.split(",").map((s: string) => s.trim()).filter(Boolean) : []),
      certifications: Array.isArray(data.certifications)
        ? data.certifications
        : (typeof data.certifications === "string" ? data.certifications.split(",").map((s: string) => s.trim()).filter(Boolean) : ["HV Safety Level 2"]),
      assignedBay: data.assignedBay || "Bays 01-04 (DC Fast)",
      shift: data.shift || "Morning Shift (06:00 - 14:00)",
      safetyEquipmentCleared: data.safetyEquipmentCleared !== undefined ? Boolean(data.safetyEquipmentCleared) : true,
      bio: data.bio || "",
      image: data.image || "",
    };

    if (isMongoConnected) {
      const created = await EmployeeModel.create(newEmployeeData);
      return res.status(201).json({ success: true, employee: created });
    }

    const createdMem: SeedEmployee = {
      ...newEmployeeData,
      _id: `emp-${Date.now()}`,
    };
    memEmployees.unshift(createdMem);
    return res.status(201).json({ success: true, employee: createdMem });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "Failed to create employee" });
  }
});

// PUT /api/employees/:id - update employee details
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.firstName && updates.lastName) {
      updates.name = `${updates.firstName} ${updates.lastName}`;
    }

    if (updates.shopId && !updates.shopName) {
      updates.shopName = await resolveShopName(updates.shopId);
    }

    if (typeof updates.skills === "string") {
      updates.skills = updates.skills.split(",").map((s: string) => s.trim()).filter(Boolean);
    }

    if (isMongoConnected) {
      const updated = await EmployeeModel.findByIdAndUpdate(id, updates, { new: true }) ||
        await EmployeeModel.findOneAndUpdate({ employeeId: id }, updates, { new: true });

      if (!updated) {
        return res.status(404).json({ success: false, message: "Employee not found" });
      }
      return res.json({ success: true, employee: updated });
    }

    const index = memEmployees.findIndex((e) => e._id === id || e.employeeId === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    memEmployees[index] = {
      ...memEmployees[index],
      ...updates,
    };

    return res.json({ success: true, employee: memEmployees[index] });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "Failed to update employee" });
  }
});

// DELETE /api/employees/:id - delete employee
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isMongoConnected) {
      const deleted = await EmployeeModel.findByIdAndDelete(id) ||
        await EmployeeModel.findOneAndDelete({ employeeId: id });

      if (!deleted) {
        return res.status(404).json({ success: false, message: "Employee not found" });
      }
      return res.json({ success: true, message: "Employee deleted successfully" });
    }

    const index = memEmployees.findIndex((e) => e._id === id || e.employeeId === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    memEmployees.splice(index, 1);
    return res.json({ success: true, message: "Employee deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "Failed to delete employee" });
  }
});

export default router;
