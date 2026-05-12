import { Router } from "express";
import { requireAdmin } from "../auth.js";
import { upload, publicUrl } from "../upload.js";

const router = Router();

/**
 * Generic single-image upload. Used by admin UI for per-highlight images,
 * inline gallery additions, etc. Returns `{ url, filename, size }`.
 */
router.post("/image", requireAdmin, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No image provided" });
  res.status(201).json({
    url: publicUrl(req, req.file.filename),
    filename: req.file.filename,
    size: req.file.size,
  });
});

export default router;
