import { Router, Request, Response } from "express";
import { ShopModel } from "../models/Shop.js";
import { isMongoConnected, memShops } from "../config/db.js";

const router = Router();

// Platform Superadmin master credential
const SUPERADMIN_USER = {
  id: "superadmin-esarthi",
  name: "Suraj Dev Sagar",
  email: "superadmin@esarthi.com",
  type: "superadmin" as const,
  role: "Platform Superadmin",
};

// Known alias map for standard regional hub accounts
const BRANCH_ALIASES: Record<string, string> = {
  "delhi.admin@esarthi.com": "EV-DEL-01",
  "rajesh.kumar@esarthi.com": "EV-DEL-01",
  "bengaluru.admin@esarthi.com": "EV-BLR-01",
  "vikram.malhotra@esarthi.com": "EV-BLR-01",
  "mumbai.admin@esarthi.com": "EV-MUM-01",
  "sneha.patel@esarthi.com": "EV-MUM-01",
  "hyderabad.admin@esarthi.com": "EV-HYD-01",
  "karthik.reddy@esarthi.com": "EV-HYD-01",
};

// POST /api/auth/login - Direct admin identity login (no OTP / password required)
router.post("/login", async (req: Request, res: Response) => {
  try {
    const rawEmail = req.body.email || "";
    const email = rawEmail.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please enter your authorized @esarthi.com administrator ID",
      });
    }

    // 1. Superadmin verification
    if (email === "superadmin@esarthi.com") {
      return res.json({
        success: true,
        user: SUPERADMIN_USER,
        message: "Authenticated as Platform Superadmin (Suraj Dev Sagar)",
      });
    }

    // Check if domain is @esarthi.com
    if (!email.endsWith("@esarthi.com")) {
      return res.status(401).json({
        success: false,
        message: "Access restricted: Every admin ID must end with @esarthi.com",
      });
    }

    // 2. Check for Branch Admin in MongoDB or in-memory
    let matchedShop: any = null;

    if (isMongoConnected) {
      // Find shop by direct adminEmail match
      matchedShop = await ShopModel.findOne({
        adminEmail: { $regex: new RegExp(`^${email}$`, "i") },
      }).lean();

      // If not found, check branch code alias
      if (!matchedShop && BRANCH_ALIASES[email]) {
        matchedShop = await ShopModel.findOne({ code: BRANCH_ALIASES[email] }).lean();
      }
    } else {
      matchedShop = memShops.find(
        (s) => s.adminEmail?.toLowerCase() === email || s.code === BRANCH_ALIASES[email]
      );
    }

    if (matchedShop) {
      const shopAdminUser = {
        id: `admin-${matchedShop._id}`,
        name: matchedShop.adminName || "Station Admin",
        email: matchedShop.adminEmail || email,
        type: "shopadmin" as const,
        role: `Store Admin (${matchedShop.city})`,
        assignedShopId: String(matchedShop._id),
        assignedShopName: matchedShop.name,
      };

      return res.json({
        success: true,
        user: shopAdminUser,
        message: `Authenticated as Store Admin for ${matchedShop.name}`,
      });
    }

    return res.status(401).json({
      success: false,
      message: `No active station found for ID "${email}". Please verify the address or ask the Superadmin to configure your Hub ID.`,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Authentication error",
    });
  }
});

// GET /api/auth/branches - Retrieve superadmin and branch admin IDs for rapid login
router.get("/branches", async (_req: Request, res: Response) => {
  try {
    let shopsList: any[] = [];
    if (isMongoConnected) {
      shopsList = await ShopModel.find().lean();
    } else {
      shopsList = memShops;
    }

    const branches = shopsList.map((s) => ({
      id: String(s._id),
      name: s.name,
      city: s.city,
      code: s.code,
      adminName: s.adminName,
      adminEmail: s.adminEmail || `${s.city.toLowerCase().replace(/\s+/g, "")}.admin@esarthi.com`,
    }));

    return res.json({
      success: true,
      superadmin: SUPERADMIN_USER,
      branches,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to load auth accounts",
    });
  }
});

export default router;
