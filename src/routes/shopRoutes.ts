import { Router, Request, Response } from "express";
import { ShopModel } from "../models/Shop.js";
import { EmployeeModel } from "../models/Employee.js";
import { isMongoConnected, memShops, memEmployees } from "../config/db.js";
import { SeedShop } from "../seed/seedData.js";

const router = Router();

// GET /api/shops - list all shops with employee counts
router.get("/", async (_req: Request, res: Response) => {
  try {
    if (isMongoConnected) {
      const shops = await ShopModel.find().sort({ createdAt: -1 }).lean();
      const employees = await EmployeeModel.find({}, { shopId: 1 }).lean();

      const counts: Record<string, number> = {};
      for (const emp of employees) {
        if (emp.shopId) {
          counts[emp.shopId] = (counts[emp.shopId] || 0) + 1;
        }
      }

      const enriched = shops.map((s) => ({
        ...s,
        employeeCount: counts[String(s._id)] || counts[s.code.toLowerCase()] || 0,
      }));

      return res.json({ success: true, count: enriched.length, shops: enriched });
    }

    // In-memory fallback
    const counts: Record<string, number> = {};
    for (const emp of memEmployees) {
      if (emp.shopId) {
        counts[emp.shopId] = (counts[emp.shopId] || 0) + 1;
      }
    }

    const enriched = memShops.map((s) => ({
      ...s,
      employeeCount: counts[s._id] || counts[s.code.toLowerCase()] || 0,
    }));

    return res.json({ success: true, count: enriched.length, shops: enriched });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "Failed to fetch shops" });
  }
});

// GET /api/shops/:id - single shop details + employees
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    if (isMongoConnected) {
      const shop = await ShopModel.findById(id).catch(() => null) ||
        await ShopModel.findOne({ _id: id }).catch(() => null) ||
        await ShopModel.findOne({ code: id.toUpperCase() });

      if (!shop) {
        return res.status(404).json({ success: false, message: "Shop not found" });
      }

      const employees = await EmployeeModel.find({
        $or: [{ shopId: String(shop._id) }, { shopId: shop.code.toLowerCase() }],
      }).lean();

      return res.json({
        success: true,
        shop: {
          ...shop.toObject(),
          employeeCount: employees.length,
          employees,
        },
      });
    }

    const shop = memShops.find((s) => s._id === id || s.code.toUpperCase() === id.toUpperCase());
    if (!shop) {
      return res.status(404).json({ success: false, message: "Shop not found" });
    }

    const employees = memEmployees.filter((e) => e.shopId === shop._id || e.shopId === shop.code.toLowerCase());
    return res.json({
      success: true,
      shop: {
        ...shop,
        employeeCount: employees.length,
        employees,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "Error fetching shop" });
  }
});

// POST /api/shops - create new shop (Superadmin action)
router.post("/", async (req: Request, res: Response) => {
  try {
    const data = req.body;

    if (!data.name || !data.city) {
      return res.status(400).json({ success: false, message: "Shop name and city are required" });
    }

    const code = data.code
      ? data.code.toUpperCase().trim()
      : `SHP-${data.city.slice(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;

    const adminName = data.adminName || "Assigned Shop Admin";
    const adminEmail = data.adminEmail || `${adminName.toLowerCase().replace(/\s+/g, ".")}@esarthi.internal`;

    const newShopData = {
      name: data.name.trim(),
      code,
      city: data.city.trim(),
      address: data.address || "",
      contactEmail: data.contactEmail || `station.${code.toLowerCase()}@esarthi-ev.internal`,
      contactPhone: data.contactPhone || "",
      adminName,
      adminEmail,
      adminPhone: data.adminPhone || "",
      status: (data.status as "active" | "inactive") || "active",
      stationType: data.stationType || "Ultra-Fast Highway & Urban Hub",
      powerCapacityKw: Number(data.powerCapacityKw) || 240,
      totalBays: Number(data.totalBays) || 8,
      activeBays: Number(data.activeBays) || 6,
      supportedConnectors: Array.isArray(data.supportedConnectors) && data.supportedConnectors.length > 0
        ? data.supportedConnectors
        : ["CCS-2 (150kW)", "Type-2 AC (22kW)"],
      uptimePercent: Number(data.uptimePercent) || 99.8,
      dailyEnergyKwh: Number(data.dailyEnergyKwh) || 3200,
    };

    if (isMongoConnected) {
      const created = await ShopModel.create(newShopData);
      return res.status(201).json({ success: true, shop: created });
    }

    const createdMem: SeedShop = {
      ...newShopData,
      _id: `shp-${Date.now()}`,
    };
    memShops.unshift(createdMem);
    return res.status(201).json({ success: true, shop: createdMem });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "Failed to create shop" });
  }
});

// PUT /api/shops/:id - update shop or assign shop admin
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const updates = req.body;

    if (isMongoConnected) {
      const updated = await ShopModel.findByIdAndUpdate(id, updates, { new: true });
      if (!updated) {
        return res.status(404).json({ success: false, message: "Shop not found" });
      }
      return res.json({ success: true, shop: updated });
    }

    const index = memShops.findIndex((s) => s._id === id || s.code === id.toUpperCase());
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Shop not found" });
    }

    memShops[index] = {
      ...memShops[index],
      ...updates,
    };
    return res.json({ success: true, shop: memShops[index] });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "Failed to update shop" });
  }
});

// DELETE /api/shops/:id - delete shop
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    if (isMongoConnected) {
      const deleted = await ShopModel.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Shop not found" });
      }
      return res.json({ success: true, message: "Shop deleted successfully" });
    }

    const index = memShops.findIndex((s) => s._id === id || s.code === id.toUpperCase());
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Shop not found" });
    }

    memShops.splice(index, 1);
    return res.json({ success: true, message: "Shop deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || "Failed to delete shop" });
  }
});

export default router;
