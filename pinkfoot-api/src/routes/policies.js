import { Router } from "express";
import db, { rowToPolicy } from "../db.js";
import { requireAdmin } from "../auth.js";

const router = Router();

router.get("/", (req, res) => {
  const { q } = req.query;
  const where = [];
  const params = {};

  if (q) {
    where.push("(LOWER(name) LIKE @q OR LOWER(terms) LIKE @q)");
    params.q = `%${q.toLowerCase()}%`;
  }

  const sql = `SELECT * FROM policies ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY name`;
  const rows = db.prepare(sql).all(params).map(rowToPolicy);
  res.json(rows);
});

router.get("/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM policies WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json(rowToPolicy(row));
});

router.post("/", requireAdmin, (req, res) => {
  try {
    const b = req.body;
    const id = b.id || `pol-${Date.now().toString(36)}`;

    db.prepare(`
      INSERT INTO policies (id, name, terms)
      VALUES (@id, @name, @terms)
    `).run({
      id,
      name: b.name,
      terms: b.terms,
    });

    const row = db.prepare("SELECT * FROM policies WHERE id = ?").get(id);
    res.status(201).json(rowToPolicy(row));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.put("/:id", requireAdmin, (req, res) => {
  const existing = db.prepare("SELECT * FROM policies WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Not found" });
  const b = req.body;

  db.prepare(`
    UPDATE policies SET
      name = COALESCE(@name, name),
      terms = COALESCE(@terms, terms),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = @id
  `).run({
    id: req.params.id,
    name: b.name || null,
    terms: b.terms || null,
  });

  const row = db.prepare("SELECT * FROM policies WHERE id = ?").get(req.params.id);
  res.json(rowToPolicy(row));
});

router.delete("/:id", requireAdmin, (req, res) => {
  const info = db.prepare("DELETE FROM policies WHERE id = ?").run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Not found" });
  res.json({ deleted: true });
});

export default router;
