import { Router } from "express";
import db, { rowToDestination } from "../db.js";
import { requireAdmin } from "../auth.js";
import { upload, publicUrl } from "../upload.js";

const router = Router();

const slugify = (s) =>
  s.toString().toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

router.get("/", (req, res) => {
  const includeUnpublished = req.query.all === "1";
  const sql = includeUnpublished
    ? "SELECT * FROM destinations ORDER BY name"
    : "SELECT * FROM destinations WHERE published = 1 ORDER BY name";
  const rows = db.prepare(sql).all();
  res.json(rows.map(rowToDestination));
});

router.get("/:slug", (req, res) => {
  const row = db.prepare("SELECT * FROM destinations WHERE slug = ?").get(req.params.slug);
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json(rowToDestination(row));
});

const fields = upload.fields([
  { name: "heroImage", maxCount: 1 },
  { name: "gallery", maxCount: 8 },
]);

router.post("/", requireAdmin, fields, (req, res) => {
  try {
    const b = req.body;
    const id = b.id || `dest-${Date.now().toString(36)}`;
    const slug = b.slug || slugify(b.name || id);

    const heroFile = req.files?.heroImage?.[0];
    const galleryFiles = req.files?.gallery || [];

    const heroImage = heroFile ? publicUrl(req, heroFile.filename) : b.heroImage || "";
    const gallery = [
      ...(b.galleryUrls ? JSON.parse(b.galleryUrls) : []),
      ...galleryFiles.map((f) => publicUrl(req, f.filename)),
    ];

    db.prepare(`
      INSERT INTO destinations (id, slug, name, country, region, hero_image, gallery,
        tagline, description, badge, start_from, rating, review_count, best_months,
        currency, themes, highlights, published,
        travel_season_start, travel_season_end, sales_season_start, sales_season_end,
        activity, region_type, region_keywords)
      VALUES (@id, @slug, @name, @country, @region, @hero_image, @gallery,
        @tagline, @description, @badge, @start_from, @rating, @review_count, @best_months,
        @currency, @themes, @highlights, @published,
        @travel_season_start, @travel_season_end, @sales_season_start, @sales_season_end,
        @activity, @region_type, @region_keywords)
    `).run({
      id,
      slug,
      name: b.name,
      country: b.country || "",
      region: b.region || "",
      hero_image: heroImage,
      gallery: JSON.stringify(gallery),
      tagline: b.tagline || "",
      description: b.description || "",
      badge: b.badge || "",
      start_from: parseInt(b.startFrom || 0, 10),
      rating: parseFloat(b.rating || 0),
      review_count: parseInt(b.reviewCount || 0, 10),
      best_months: b.bestMonths || "",
      currency: b.currency || "INR",
      themes: JSON.stringify(b.themes ? JSON.parse(b.themes) : []),
      highlights: JSON.stringify(b.highlights ? JSON.parse(b.highlights) : []),
      published: b.published === "false" ? 0 : 1,
      travel_season_start: b.travelSeasonStart || null,
      travel_season_end: b.travelSeasonEnd || null,
      sales_season_start: b.salesSeasonStart || null,
      sales_season_end: b.salesSeasonEnd || null,
      activity: b.activity || null,
      region_type: b.regionType || null,
      region_keywords: b.regionKeywords || null,
    });
    const row = db.prepare("SELECT * FROM destinations WHERE id = ?").get(id);
    res.status(201).json(rowToDestination(row));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.put("/:id", requireAdmin, fields, (req, res) => {
  const existing = db.prepare("SELECT * FROM destinations WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Not found" });
  const b = req.body;

  const heroFile = req.files?.heroImage?.[0];
  const galleryFiles = req.files?.gallery || [];
  const heroImage = heroFile ? publicUrl(req, heroFile.filename) : b.heroImage ?? existing.hero_image;
  const newGallery = galleryFiles.map((f) => publicUrl(req, f.filename));
  const gallery = b.galleryUrls
    ? [...JSON.parse(b.galleryUrls), ...newGallery]
    : [...JSON.parse(existing.gallery || "[]"), ...newGallery];

  db.prepare(`
    UPDATE destinations SET
      slug = COALESCE(@slug, slug),
      name = COALESCE(@name, name),
      country = COALESCE(@country, country),
      region = COALESCE(@region, region),
      hero_image = @hero_image,
      gallery = @gallery,
      tagline = COALESCE(@tagline, tagline),
      description = COALESCE(@description, description),
      badge = COALESCE(@badge, badge),
      start_from = COALESCE(@start_from, start_from),
      rating = COALESCE(@rating, rating),
      review_count = COALESCE(@review_count, review_count),
      best_months = COALESCE(@best_months, best_months),
      currency = COALESCE(@currency, currency),
      themes = COALESCE(@themes, themes),
      highlights = COALESCE(@highlights, highlights),
      published = COALESCE(@published, published),
      travel_season_start = COALESCE(@travel_season_start, travel_season_start),
      travel_season_end   = COALESCE(@travel_season_end, travel_season_end),
      sales_season_start  = COALESCE(@sales_season_start, sales_season_start),
      sales_season_end    = COALESCE(@sales_season_end, sales_season_end),
      activity            = COALESCE(@activity, activity),
      region_type         = COALESCE(@region_type, region_type),
      region_keywords     = COALESCE(@region_keywords, region_keywords),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = @id
  `).run({
    id: req.params.id,
    slug: b.slug || null,
    name: b.name || null,
    country: b.country || null,
    region: b.region || null,
    hero_image: heroImage,
    gallery: JSON.stringify(gallery),
    tagline: b.tagline ?? null,
    description: b.description ?? null,
    badge: b.badge ?? null,
    start_from: b.startFrom ? parseInt(b.startFrom, 10) : null,
    rating: b.rating ? parseFloat(b.rating) : null,
    review_count: b.reviewCount ? parseInt(b.reviewCount, 10) : null,
    best_months: b.bestMonths ?? null,
    currency: b.currency || null,
    themes: b.themes ? JSON.stringify(JSON.parse(b.themes)) : null,
    highlights: b.highlights ? JSON.stringify(JSON.parse(b.highlights)) : null,
    published: b.published == null ? null : b.published === "false" ? 0 : 1,
    travel_season_start: b.travelSeasonStart ?? null,
    travel_season_end: b.travelSeasonEnd ?? null,
    sales_season_start: b.salesSeasonStart ?? null,
    sales_season_end: b.salesSeasonEnd ?? null,
    activity: b.activity ?? null,
    region_type: b.regionType ?? null,
    region_keywords: b.regionKeywords ?? null,
  });

  const row = db.prepare("SELECT * FROM destinations WHERE id = ?").get(req.params.id);
  res.json(rowToDestination(row));
});

router.delete("/:id", requireAdmin, (req, res) => {
  const info = db.prepare("DELETE FROM destinations WHERE id = ?").run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Not found" });
  res.json({ deleted: true });
});

export default router;
