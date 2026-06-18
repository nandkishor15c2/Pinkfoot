import { Router } from "express";
import db, { rowToStay } from "../db.js";
import { requireAdmin } from "../auth.js";
import { upload, publicUrl } from "../upload.js";

const router = Router();

router.get("/", (req, res) => {
  const { destination, q } = req.query;
  const where = [];
  const params = {};

  if (destination) {
    where.push("destination = @destination");
    params.destination = destination;
  }
  if (q) {
    where.push("(LOWER(name) LIKE @q OR LOWER(property_type) LIKE @q OR LOWER(address) LIKE @q)");
    params.q = `%${q.toLowerCase()}%`;
  }

  const sql = `SELECT * FROM stays ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY name`;
  const rows = db.prepare(sql).all(params).map(rowToStay);
  res.json(rows);
});

router.get("/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM stays WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json(rowToStay(row));
});

const fields = upload.fields([
  { name: "image", maxCount: 8 }
]);

router.post("/", requireAdmin, fields, (req, res) => {
  try {
    const b = req.body;
    const id = b.id || `stay-${Date.now().toString(36)}`;
    const imageFiles = req.files?.image || [];
    const image = JSON.stringify([
      ...(b.imageUrls ? JSON.parse(b.imageUrls) : []),
      ...imageFiles.map((f) => publicUrl(req, f.filename)),
    ]);

    db.prepare(`
      INSERT INTO stays (id, name, property_type, star_category, tier, destination,
        contact_number, contact_email, address, map_url, image, description)
      VALUES (@id, @name, @property_type, @star_category, @tier, @destination,
        @contact_number, @contact_email, @address, @map_url, @image, @description)
    `).run({
      id,
      name: b.name,
      property_type: b.propertyType || "Hotel",
      star_category: b.starCategory ? parseInt(b.starCategory, 10) : 4,
      tier: b.tier || "standard",
      destination: b.destination || "",
      contact_number: b.contactNumber || "",
      contact_email: b.contactEmail || "",
      address: b.address || "",
      map_url: b.mapUrl || "",
      image,
      description: b.description || "",
    });

    const row = db.prepare("SELECT * FROM stays WHERE id = ?").get(id);
    res.status(201).json(rowToStay(row));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.put("/:id", requireAdmin, fields, (req, res) => {
  const existing = db.prepare("SELECT * FROM stays WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Not found" });
  const b = req.body;

  const imageFiles = req.files?.image || [];
  const newImages = imageFiles.map((f) => publicUrl(req, f.filename));
  
  let parsedExisting = [];
  if (b.imageUrls) {
    parsedExisting = JSON.parse(b.imageUrls);
  } else if (existing.image) {
    parsedExisting = existing.image.startsWith("[")
      ? JSON.parse(existing.image)
      : [existing.image];
  }
  const image = JSON.stringify([...parsedExisting, ...newImages]);

  db.prepare(`
    UPDATE stays SET
      name = COALESCE(@name, name),
      property_type = COALESCE(@property_type, property_type),
      star_category = COALESCE(@star_category, star_category),
      tier = COALESCE(@tier, tier),
      destination = COALESCE(@destination, destination),
      contact_number = COALESCE(@contact_number, contact_number),
      contact_email = COALESCE(@contact_email, contact_email),
      address = COALESCE(@address, address),
      map_url = COALESCE(@map_url, map_url),
      image = @image,
      description = COALESCE(@description, description),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = @id
  `).run({
    id: req.params.id,
    name: b.name || null,
    property_type: b.propertyType || null,
    star_category: b.starCategory != null ? parseInt(b.starCategory, 10) : null,
    tier: b.tier != null ? b.tier : null,
    destination: b.destination != null ? b.destination : null,
    contact_number: b.contactNumber != null ? b.contactNumber : null,
    contact_email: b.contactEmail != null ? b.contactEmail : null,
    address: b.address ?? null,
    map_url: b.mapUrl ?? null,
    image,
    description: b.description ?? null,
  });

  const row = db.prepare("SELECT * FROM stays WHERE id = ?").get(req.params.id);
  res.json(rowToStay(row));
});

router.delete("/:id", requireAdmin, (req, res) => {
  const info = db.prepare("DELETE FROM stays WHERE id = ?").run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Not found" });
  res.json({ deleted: true });
});

export default router;
