import { Router } from "express";
import db from "../db.js";
import { requireAdmin } from "../auth.js";

const router = Router();

const rowToLead = (r) => ({
  id: r.id,
  packageSlug: r.package_slug,
  packageTitle: r.package_title,
  name: r.name,
  email: r.email,
  phone: r.phone,
  travelers: r.travelers,
  travelDate: r.travel_date,
  message: r.message,
  status: r.status,
  createdAt: r.created_at,
});

router.post("/", (req, res) => {
  const b = req.body || {};
  if (!b.name || (!b.email && !b.phone)) {
    return res.status(400).json({ error: "Name and either email or phone are required" });
  }
  const info = db.prepare(`
    INSERT INTO leads (package_slug, package_title, name, email, phone, travelers, travel_date, message)
    VALUES (@package_slug, @package_title, @name, @email, @phone, @travelers, @travel_date, @message)
  `).run({
    package_slug: b.packageSlug || null,
    package_title: b.packageTitle || null,
    name: b.name,
    email: b.email || null,
    phone: b.phone || null,
    travelers: b.travelers || null,
    travel_date: b.travelDate || null,
    message: b.message || null,
  });
  const row = db.prepare("SELECT * FROM leads WHERE id = ?").get(info.lastInsertRowid);
  res.status(201).json(rowToLead(row));
});

router.get("/", requireAdmin, (req, res) => {
  const rows = db.prepare("SELECT * FROM leads ORDER BY created_at DESC LIMIT 200").all();
  res.json(rows.map(rowToLead));
});

router.patch("/:id", requireAdmin, (req, res) => {
  const { status } = req.body;
  db.prepare("UPDATE leads SET status = ? WHERE id = ?").run(status, req.params.id);
  const row = db.prepare("SELECT * FROM leads WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json(rowToLead(row));
});

router.delete("/:id", requireAdmin, (req, res) => {
  const info = db.prepare("DELETE FROM leads WHERE id = ?").run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Not found" });
  res.json({ deleted: true });
});

export default router;
