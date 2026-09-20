import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB, isMongoConnected } from "./config/db.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import shopRoutes from "./routes/shopRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();
try {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  dotenv.config({ path: path.resolve(currentDir, "../.env") });
  dotenv.config({ path: path.resolve(currentDir, "../../.env") });
} catch {
  // Ignore in environments where import.meta.url is virtual
}

const app = express();
const PORT = process.env.PORT || 5050;

// Allowed origins
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://esarthifrontend.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
].filter(Boolean) as string[];

// Middlewares
app.use(
  cors({
    origin: (origin: any, callback: any) => {
      if (!origin) return callback(null, true);
      if (
        process.env.NODE_ENV !== "production" ||
        allowedOrigins.includes("*") ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req: any, _res: any, next: any) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "healthy",
    application: "ESARTHI Employment Dashboard Backend",
    database: isMongoConnected ? "connected" : "in-memory-fallback",
    timestamp: new Date().toISOString(),
  });
});

// Lightweight Ping / Wakeup Endpoint
app.get("/api/ping", (_req: Request, res: Response) => {
  res.json({ status: "awake", timestamp: new Date().toISOString() });
});

// Auth Bypass Endpoint - Returns active admin session directly without blocking
app.get("/api/auth/me", (_req: Request, res: Response) => {
  res.json({
    authenticated: true,
    user: {
      id: "admin-esarthi-1",
      email: "admin@esarthi.internal",
      name: "ESARTHI Admin",
      type: "admin",
      role: "System Administrator",
    },
    message: "Authentication bypassed for rapid access",
  });
});

// Ensure DB connection before processing requests
app.use(async (_req: any, _res: any, next: any) => {
  try {
    await connectDB();
  } catch {
    // In-memory fallback is handled within db.ts
  }
  next();
});

// Register API routes
app.use("/api/employees", employeeRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/shops", shopRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);

// Fallback 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: any) => {
  console.error("Backend Error:", err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

// Automated Self-Ping Keep-Alive Trigger (Prevents Render free-tier idle spin-down)
const PING_INTERVAL_MS = 9 * 60 * 1000; // Ping every 9 minutes (Render free tier spins down at 15m)
const RENDER_SERVICE_URL = process.env.RENDER_EXTERNAL_URL || "https://esarthi-backend-2ya2.onrender.com";

function setupKeepAliveTrigger() {
  console.log(`⏱️ [Keep-Alive] Configured keep-alive trigger every 9m targeting: ${RENDER_SERVICE_URL}`);

  // Initial wake-up ping after 30 seconds
  setTimeout(runPing, 30000);

  // Recurring ping loop
  setInterval(runPing, PING_INTERVAL_MS);

  async function runPing() {
    try {
      const pingUrl = `${RENDER_SERVICE_URL.replace(/\/$/, "")}/api/ping`;
      const res = await fetch(pingUrl, {
        headers: { "User-Agent": "ESARTHI-KeepAlive-Trigger/1.0" },
      });
      if (res.ok) {
        console.log(`💓 [Keep-Alive Ping] Successfully pinged self at ${new Date().toISOString()} (HTTP ${res.status})`);
      } else {
        console.warn(`⚠️ [Keep-Alive Ping] Returned status ${res.status}`);
      }
    } catch (err: any) {
      console.warn(`⚠️ [Keep-Alive Ping] Ping attempt failed: ${err.message}`);
    }
  }
}

// Start server when run directly (local / Node)
async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 [ESARTHI Backend] Server running at http://localhost:${PORT}`);
    console.log(`📡 [Endpoints] /api/employees | /api/roles | /api/stats | /api/shops | /api/health`);
    setupKeepAliveTrigger();
  });
}

if (!process.env.VERCEL) {
  startServer().catch((err) => {
    console.error("Failed to start server:", err);
  });
}

export default app;
