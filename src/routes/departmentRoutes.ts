import { Router, Request, Response } from "express";
import { DepartmentModel } from "../models/Department.js";
import { isMongoConnected, memDepartments } from "../config/db.js";

const router = Router();

// GET /api/departments
router.get("/", async (_req: Request, res: Response) => {
  try {
    if (isMongoConnected) {
      const departments = await DepartmentModel.find().sort({ name: 1 });
      return res.json({ success: true, count: departments.length, departments });
    }

    return res.json({ success: true, count: memDepartments.length, departments: memDepartments });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "Failed to fetch departments" });
  }
});

export default router;
