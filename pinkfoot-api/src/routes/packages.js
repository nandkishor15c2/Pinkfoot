import { Router } from "express";
import db, { rowToPackage } from "../db.js";
import { requireAdmin } from "../auth.js";
import { upload, publicUrl } from "../upload.js";

const router = Router();

const slugify = (s) =>
  s.toString().toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

router.get("/", (req, res) => {
  const {
    destination,
    theme,
    minBudget,
    maxBudget,
    minRating,
    q,
    all,
    limit = 100,
    offset = 0,
  } = req.query;

  const where = [];
  const params = {};
  if (all !== "1") where.push("published = 1");
  if (destination) { where.push("destination = @destination"); params.destination = destination; }
  if (minBudget)   { where.push("price_adult >= @min"); params.min = +minBudget; }
  if (maxBudget)   { where.push("price_adult <= @max"); params.max = +maxBudget; }
  if (minRating)   { where.push("rating >= @rating"); params.rating = +minRating; }
  if (q) {
    where.push("(LOWER(title) LIKE @q OR LOWER(destination_name) LIKE @q)");
    params.q = `%${q.toLowerCase()}%`;
  }

  let sql = `SELECT * FROM packages ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY created_at DESC LIMIT @limit OFFSET @offset`;
  params.limit = Math.min(+limit, 200);
  params.offset = +offset;

  let rows = db.prepare(sql).all(params).map(rowToPackage);
  if (theme) {
    const themes = String(theme).split(",").map((t) => t.trim());
    rows = rows.filter((p) => themes.some((t) => p.theme.includes(t)));
  }
  res.json(rows);
});

router.get("/:slug", (req, res) => {
  const row = db.prepare("SELECT * FROM packages WHERE slug = ?").get(req.params.slug);
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json(rowToPackage(row));
});

const uploadFields = upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "gallery", maxCount: 8 },
]);

router.post("/", requireAdmin, uploadFields, (req, res) => {
  try {
    const b = req.body;
    const id = b.id || `pkg-${Date.now().toString(36)}`;
    const slug = b.slug || slugify(b.title || id);

    const coverFile = req.files?.coverImage?.[0];
    const galleryFiles = req.files?.gallery || [];
    const coverImage = coverFile ? publicUrl(req, coverFile.filename) : b.coverImage || "";
    const gallery = [
      ...(b.galleryUrls ? JSON.parse(b.galleryUrls) : []),
      ...galleryFiles.map((f) => publicUrl(req, f.filename)),
    ];

    db.prepare(`
      INSERT INTO packages (id, slug, title, destination, destination_name, theme,
        nights, days, price_adult, price_child, currency, original_price, discount,
        rating, review_count, cover_image, gallery, inclusions, exclusions, highlights,
        badge, itinerary, published,
        description, meta_title, meta_description, meta_keywords,
        tags, hotels, transfers, payment_policy, category_pricing)
      VALUES (@id, @slug, @title, @destination, @destination_name, @theme,
        @nights, @days, @price_adult, @price_child, @currency, @original_price, @discount,
        @rating, @review_count, @cover_image, @gallery, @inclusions, @exclusions, @highlights,
        @badge, @itinerary, @published,
        @description, @meta_title, @meta_description, @meta_keywords,
        @tags, @hotels, @transfers, @payment_policy, @category_pricing)
    `).run({
      id,
      slug,
      title: b.title,
      destination: b.destination,
      destination_name: b.destinationName || "",
      theme: JSON.stringify(b.theme ? JSON.parse(b.theme) : []),
      nights: parseInt(b.nights || 0, 10),
      days: parseInt(b.days || 0, 10),
      price_adult: parseInt(b.priceAdult || 0, 10),
      price_child: parseInt(b.priceChild || 0, 10),
      currency: b.currency || "INR",
      original_price: b.originalPrice ? parseInt(b.originalPrice, 10) : null,
      discount: parseInt(b.discount || 0, 10),
      rating: parseFloat(b.rating || 0),
      review_count: parseInt(b.reviewCount || 0, 10),
      cover_image: coverImage,
      gallery: JSON.stringify(gallery),
      inclusions: JSON.stringify(b.inclusions ? JSON.parse(b.inclusions) : []),
      exclusions: JSON.stringify(b.exclusions ? JSON.parse(b.exclusions) : []),
      highlights: JSON.stringify(b.highlights ? JSON.parse(b.highlights) : []),
      badge: b.badge || "",
      itinerary: JSON.stringify(b.itinerary ? JSON.parse(b.itinerary) : []),
      published: b.published === "false" ? 0 : 1,
      description: b.description || null,
      meta_title: b.metaTitle || null,
      meta_description: b.metaDescription || null,
      meta_keywords: b.metaKeywords || null,
      tags: JSON.stringify(b.tags ? JSON.parse(b.tags) : []),
      hotels: JSON.stringify(b.hotels ? JSON.parse(b.hotels) : []),
      transfers: JSON.stringify(b.transfers ? JSON.parse(b.transfers) : []),
      payment_policy: b.paymentPolicy ? JSON.stringify(JSON.parse(b.paymentPolicy)) : null,
      category_pricing: b.categoryPricing ? JSON.stringify(JSON.parse(b.categoryPricing)) : null,
    });

    const row = db.prepare("SELECT * FROM packages WHERE id = ?").get(id);
    res.status(201).json(rowToPackage(row));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.put("/:id", requireAdmin, uploadFields, (req, res) => {
  const existing = db.prepare("SELECT * FROM packages WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Not found" });
  const b = req.body;
  const coverFile = req.files?.coverImage?.[0];
  const galleryFiles = req.files?.gallery || [];
  const coverImage = coverFile ? publicUrl(req, coverFile.filename) : b.coverImage ?? existing.cover_image;
  const newGallery = galleryFiles.map((f) => publicUrl(req, f.filename));
  const gallery = b.galleryUrls
    ? [...JSON.parse(b.galleryUrls), ...newGallery]
    : [...JSON.parse(existing.gallery || "[]"), ...newGallery];

  db.prepare(`
    UPDATE packages SET
      slug = COALESCE(@slug, slug),
      title = COALESCE(@title, title),
      destination = COALESCE(@destination, destination),
      destination_name = COALESCE(@destination_name, destination_name),
      theme = COALESCE(@theme, theme),
      nights = COALESCE(@nights, nights),
      days = COALESCE(@days, days),
      price_adult = COALESCE(@price_adult, price_adult),
      price_child = COALESCE(@price_child, price_child),
      currency = COALESCE(@currency, currency),
      original_price = COALESCE(@original_price, original_price),
      discount = COALESCE(@discount, discount),
      rating = COALESCE(@rating, rating),
      review_count = COALESCE(@review_count, review_count),
      cover_image = @cover_image,
      gallery = @gallery,
      inclusions = COALESCE(@inclusions, inclusions),
      exclusions = COALESCE(@exclusions, exclusions),
      highlights = COALESCE(@highlights, highlights),
      badge = COALESCE(@badge, badge),
      itinerary = COALESCE(@itinerary, itinerary),
      published = COALESCE(@published, published),
      description = COALESCE(@description, description),
      meta_title = COALESCE(@meta_title, meta_title),
      meta_description = COALESCE(@meta_description, meta_description),
      meta_keywords = COALESCE(@meta_keywords, meta_keywords),
      tags = COALESCE(@tags, tags),
      hotels = COALESCE(@hotels, hotels),
      transfers = COALESCE(@transfers, transfers),
      payment_policy = COALESCE(@payment_policy, payment_policy),
      category_pricing = COALESCE(@category_pricing, category_pricing),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = @id
  `).run({
    id: req.params.id,
    slug: b.slug || null,
    title: b.title || null,
    destination: b.destination || null,
    destination_name: b.destinationName || null,
    theme: b.theme ? JSON.stringify(JSON.parse(b.theme)) : null,
    nights: b.nights != null ? parseInt(b.nights, 10) : null,
    days: b.days != null ? parseInt(b.days, 10) : null,
    price_adult: b.priceAdult != null ? parseInt(b.priceAdult, 10) : null,
    price_child: b.priceChild != null ? parseInt(b.priceChild, 10) : null,
    currency: b.currency || null,
    original_price: b.originalPrice != null ? parseInt(b.originalPrice, 10) : null,
    discount: b.discount != null ? parseInt(b.discount, 10) : null,
    rating: b.rating != null ? parseFloat(b.rating) : null,
    review_count: b.reviewCount != null ? parseInt(b.reviewCount, 10) : null,
    cover_image: coverImage,
    gallery: JSON.stringify(gallery),
    inclusions: b.inclusions ? JSON.stringify(JSON.parse(b.inclusions)) : null,
    exclusions: b.exclusions ? JSON.stringify(JSON.parse(b.exclusions)) : null,
    highlights: b.highlights ? JSON.stringify(JSON.parse(b.highlights)) : null,
    badge: b.badge ?? null,
    itinerary: b.itinerary ? JSON.stringify(JSON.parse(b.itinerary)) : null,
    published: b.published == null ? null : b.published === "false" ? 0 : 1,
    description: b.description ?? null,
    meta_title: b.metaTitle ?? null,
    meta_description: b.metaDescription ?? null,
    meta_keywords: b.metaKeywords ?? null,
    tags: b.tags ? JSON.stringify(JSON.parse(b.tags)) : null,
    hotels: b.hotels ? JSON.stringify(JSON.parse(b.hotels)) : null,
    transfers: b.transfers ? JSON.stringify(JSON.parse(b.transfers)) : null,
    payment_policy: b.paymentPolicy ? JSON.stringify(JSON.parse(b.paymentPolicy)) : null,
    category_pricing: b.categoryPricing ? JSON.stringify(JSON.parse(b.categoryPricing)) : null,
  });

  const row = db.prepare("SELECT * FROM packages WHERE id = ?").get(req.params.id);
  res.json(rowToPackage(row));
});

router.delete("/:id", requireAdmin, (req, res) => {
  const info = db.prepare("DELETE FROM packages WHERE id = ?").run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: "Not found" });
  res.json({ deleted: true });
});

export default router;
