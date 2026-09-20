import { Router, Request, Response } from "express";
import { EmployeeModel } from "../models/Employee.js";
import { JobRoleModel } from "../models/JobRole.js";
import { DepartmentModel } from "../models/Department.js";
import { ShopModel } from "../models/Shop.js";
import { isMongoConnected, memDepartments, memEmployees, memRoles, memShops } from "../config/db.js";

const router = Router();

// GET /api/stats - overview metrics for ESARTHI Employment Dashboard
router.get("/", async (req: Request, res: Response) => {
  try {
    const { shopId } = req.query;

    let employeesList: any[] = [];
    let rolesCount = 0;
    let deptsCount = 0;
    let shopsCount = 0;
    let allShops: any[] = [];

    if (isMongoConnected) {
      allShops = await ShopModel.find().lean();
      shopsCount = allShops.length;

      const employeeQuery = shopId && shopId !== "all"
        ? { $or: [{ shopId: String(shopId) }, { shopId: String(shopId).toLowerCase() }] }
        : {};

      employeesList = await EmployeeModel.find(employeeQuery).lean();
      rolesCount = await JobRoleModel.countDocuments({ status: { $ne: "archived" } });
      deptsCount = await DepartmentModel.countDocuments();
    } else {
      allShops = memShops;
      shopsCount = memShops.length;

      employeesList = shopId && shopId !== "all"
        ? memEmployees.filter((e) => e.shopId === String(shopId) || e.shopId === String(shopId).toLowerCase())
        : memEmployees;

      rolesCount = memRoles.filter((r) => r.status !== "archived").length;
      deptsCount = memDepartments.length;
    }

    const totalEmployees = employeesList.length;
    const activeEmployees = employeesList.filter((e) => e.status === "Active").length;
    const onboardingEmployees = employeesList.filter((e) => e.status === "Onboarding").length;
    const reviewEmployees = employeesList.filter((e) => e.status === "Review").length;
    const onLeaveEmployees = employeesList.filter((e) => e.status === "On Leave").length;

    // Department breakdown
    const departmentCounts: Record<string, number> = {};
    for (const emp of employeesList) {
      const dept = emp.department || "General";
      departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
    }

    const departmentBreakdown = Object.entries(departmentCounts).map(([department, count]) => ({
      department,
      count,
      percentage: totalEmployees > 0 ? Math.round((count / totalEmployees) * 100) : 0,
    }));

    // Shop breakdown
    const shopCounts: Record<string, { name: string; count: number }> = {};
    for (const s of allShops) {
      shopCounts[s._id] = { name: s.name, count: 0 };
    }
    const allEmps = isMongoConnected ? await EmployeeModel.find({}, { shopId: 1 }).lean() : memEmployees;
    for (const emp of allEmps) {
      if (emp.shopId && shopCounts[emp.shopId]) {
        shopCounts[emp.shopId].count += 1;
      }
    }

    const shopBreakdown = Object.entries(shopCounts).map(([id, info]) => ({
      shopId: id,
      shopName: info.name,
      count: info.count,
    }));

    // EV Network Telemetry aggregation
    const relevantShops = shopId && shopId !== "all"
      ? allShops.filter((s) => s._id === String(shopId) || s.code.toLowerCase() === String(shopId).toLowerCase())
      : allShops;

    const totalPowerCapacityKw = relevantShops.reduce((sum, s) => sum + (s.powerCapacityKw || 240), 0);
    const totalChargingBays = relevantShops.reduce((sum, s) => sum + (s.totalBays || 8), 0);
    const activeChargingBays = relevantShops.reduce((sum, s) => sum + (s.activeBays || 6), 0);
    const avgUptime = relevantShops.length > 0
      ? Number((relevantShops.reduce((sum, s) => sum + (s.uptimePercent || 99.8), 0) / relevantShops.length).toFixed(1))
      : 99.8;
    const energyDeliveredMwhToday = Number(
      (relevantShops.reduce((sum, s) => sum + (s.dailyEnergyKwh || 3500), 0) / 1000).toFixed(1)
    );

    return res.json({
      success: true,
      stats: {
        totalEmployees,
        activeEmployees,
        onboardingEmployees,
        reviewEmployees,
        onLeaveEmployees,
        totalRoles: rolesCount,
        totalDepartments: deptsCount,
        totalShops: shopsCount,
        totalPowerCapacityKw,
        totalChargingBays,
        activeChargingBays,
        networkUptimePercent: avgUptime,
        energyDeliveredMwhToday,
        departmentBreakdown,
        shopBreakdown,
        databaseConnected: isMongoConnected,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "Failed to calculate stats" });
  }
});

export default router;
