import { Router, Request, Response } from "express";
import { JobRoleModel } from "../models/JobRole.js";
import { isMongoConnected, memRoles } from "../config/db.js";
import { SeedRole } from "../seed/seedData.js";

const router = Router();

// GET /api/roles
router.get("/", async (req: Request, res: Response) => {
  try {
    if (isMongoConnected) {
      const roles = await JobRoleModel.find({ status: { $ne: "archived" } }).sort({ title: 1 });
      return res.json({ success: true, count: roles.length, roles });
    }

    const roles = memRoles.filter((r) => r.status !== "archived");
    return res.json({ success: true, count: roles.length, roles });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "Failed to fetch job roles" });
  }
});

// GET /api/roles/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isMongoConnected) {
      const role = await JobRoleModel.findById(id).catch(() => null) ||
        await JobRoleModel.findOne({ _id: id });

      if (!role) {
        return res.status(404).json({ success: false, message: "Job role not found" });
      }
      return res.json({ success: true, role });
    }

    const role = memRoles.find((r) => r._id === id);
    if (!role) {
      return res.status(404).json({ success: false, message: "Job role not found" });
    }
    return res.json({ success: true, role });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "Error fetching role" });
  }
});

// POST /api/roles - Create role (Auth bypassed)
router.post("/", async (req: Request, res: Response) => {
  try {
    const data = req.body;

    if (!data.title || !data.department) {
      return res.status(400).json({ success: false, message: "Role title and department are required" });
    }

    const newRoleData = {
      title: data.title,
      department: data.department,
      level: data.level || "L1",
      description: data.description || "",
      responsibilities: Array.isArray(data.responsibilities)
        ? data.responsibilities
        : (typeof data.responsibilities === "string" ? data.responsibilities.split("\n").map((r: string) => r.trim()).filter(Boolean) : []),
      skills: Array.isArray(data.skills)
        ? data.skills
        : (typeof data.skills === "string" ? data.skills.split(",").map((s: string) => s.trim()).filter(Boolean) : []),
      status: (data.status as "active" | "archived") || "active",
    };

    if (isMongoConnected) {
      const created = await JobRoleModel.create(newRoleData);
      return res.status(201).json({ success: true, role: created });
    }

    const createdMem: SeedRole = {
      ...newRoleData,
      _id: `role-${Date.now()}`,
    };
    memRoles.unshift(createdMem);
    return res.status(201).json({ success: true, role: createdMem });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "Failed to create job role" });
  }
});

// PUT /api/roles/:id - Update role
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (typeof updates.responsibilities === "string") {
      updates.responsibilities = updates.responsibilities.split("\n").map((r: string) => r.trim()).filter(Boolean);
    }
    if (typeof updates.skills === "string") {
      updates.skills = updates.skills.split(",").map((s: string) => s.trim()).filter(Boolean);
    }

    if (isMongoConnected) {
      const updated = await JobRoleModel.findByIdAndUpdate(id, updates, { new: true });
      if (!updated) {
        return res.status(404).json({ success: false, message: "Job role not found" });
      }
      return res.json({ success: true, role: updated });
    }

    const index = memRoles.findIndex((r) => r._id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Job role not found" });
    }

    memRoles[index] = {
      ...memRoles[index],
      ...updates,
    };
    return res.json({ success: true, role: memRoles[index] });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "Failed to update role" });
  }
});

// DELETE /api/roles/:id - Archive or delete role
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isMongoConnected) {
      const deleted = await JobRoleModel.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Job role not found" });
      }
      return res.json({ success: true, message: "Job role deleted successfully" });
    }

    const index = memRoles.findIndex((r) => r._id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Job role not found" });
    }

    memRoles.splice(index, 1);
    return res.json({ success: true, message: "Job role deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "Failed to delete role" });
  }
});

export default router;
