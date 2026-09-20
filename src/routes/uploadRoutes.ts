import { Router, Request, Response } from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const router = Router();

// Use memory storage — we'll stream the buffer directly to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max per file
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, WEBP images and PDFs are allowed"));
    }
  },
});

/** Helper: upload buffer to Cloudinary */
function uploadToCloudinary(
  buffer: Buffer,
  folder: string,
  resourceType: "image" | "raw" = "image"
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `esarthi/${folder}`,
        resource_type: resourceType,
        transformation:
          resourceType === "image"
            ? [{ quality: "auto:best", fetch_format: "auto" }]
            : undefined,
      },
      (error, result) => {
        if (error || !result) return reject(error || new Error("Cloudinary upload failed"));
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
}

/**
 * POST /api/upload/single
 * Body: multipart/form-data with field "file" and query "folder" (e.g. employees, shops, documents)
 */
router.post(
  "/single",
  upload.single("file"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
      }

      const folder = (req.query.folder as string) || "misc";
      const isPdf = req.file.mimetype === "application/pdf";
      const resourceType = isPdf ? "raw" : "image";

      const { url, publicId } = await uploadToCloudinary(
        req.file.buffer,
        folder,
        resourceType
      );

      res.json({ url, publicId, mimeType: req.file.mimetype, folder });
    } catch (err: any) {
      console.error("[Upload] Error:", err.message);
      res.status(500).json({ error: err.message || "Upload failed" });
    }
  }
);

/**
 * POST /api/upload/multiple
 * Body: multipart/form-data with field "files[]" and query "folder"
 * Max 5 files at once
 */
router.post(
  "/multiple",
  upload.array("files", 5),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        res.status(400).json({ error: "No files uploaded" });
        return;
      }

      const folder = (req.query.folder as string) || "misc";

      const results = await Promise.all(
        files.map(async (file) => {
          const isPdf = file.mimetype === "application/pdf";
          const resourceType = isPdf ? "raw" : "image";
          const { url, publicId } = await uploadToCloudinary(
            file.buffer,
            folder,
            resourceType
          );
          return { url, publicId, originalName: file.originalname, mimeType: file.mimetype };
        })
      );

      res.json({ uploaded: results.length, files: results });
    } catch (err: any) {
      console.error("[Upload] Multiple error:", err.message);
      res.status(500).json({ error: err.message || "Upload failed" });
    }
  }
);

export default router;
