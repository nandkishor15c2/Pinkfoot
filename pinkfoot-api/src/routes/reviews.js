import { Router } from "express";
import db from "../db.js";
import { requireAdmin } from "../auth.js";

const router = Router();

const rowToReview = (r) => ({
  id: r.id,
  packageSlug: r.package_slug,
  name: r.name,
  location: r.location,
  avatar: r.avatar,
  rating: r.rating,
  comment: r.comment,
  date: r.travel_date,
});

router.get("/", (req, res) => {
  let rows;
  if (req.query.packageSlug) {
    rows = db.prepare("SELECT * FROM reviews WHERE package_slug = ? ORDER BY created_at DESC").all(req.query.packageSlug);
  } else {
    rows = db.prepare("SELECT * FROM reviews ORDER BY created_at DESC LIMIT 50").all();
  }
  res.json(rows.map(rowToReview));
});

router.post("/", requireAdmin, (req, res) => {
  const b = req.body;
  const id = b.id || `rev-${Date.now().toString(36)}`;
  db.prepare(`
    INSERT INTO reviews (id, package_slug, name, location, avatar, rating, comment, travel_date)
    VALUES (@id, @package_slug, @name, @location, @avatar, @rating, @comment, @travel_date)
  `).run({
    id,
    package_slug: b.packageSlug || "",
    name: b.name,
    location: b.location || "",
    avatar: b.avatar || (b.name || "G").slice(0, 2).toUpperCase(),
    rating: parseInt(b.rating || 5, 10),
    comment: b.comment || "",
    travel_date: b.date || "",
  });
  const row = db.prepare("SELECT * FROM reviews WHERE id = ?").get(id);
  res.status(201).json(rowToReview(row));
});

router.delete("/:id", requireAdmin, (req, res) => {
  const info = db.prepare("DELETE FROM reviews WHERE id = ?").run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Not found" });
  res.json({ deleted: true });
});

export default router;
