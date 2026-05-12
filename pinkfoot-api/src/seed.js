import "dotenv/config";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import db from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND_DATA = path.resolve(__dirname, "..", "..", "pinkfoot-app", "src", "data");

const { destinations } = await import(pathToFileURL(path.join(FRONTEND_DATA, "destinations.js")).href);
const { packages } = await import(pathToFileURL(path.join(FRONTEND_DATA, "packages.js")).href);
const { reviews } = await import(pathToFileURL(path.join(FRONTEND_DATA, "reviews.js")).href);

console.log("Seeding Pinkfoot DB…");
console.log(`  destinations: ${destinations.length}`);
console.log(`  packages:     ${packages.length}`);
console.log(`  reviews:      ${reviews.length}`);

const wipe = process.argv.includes("--wipe");
if (wipe) {
  db.exec("DELETE FROM reviews; DELETE FROM packages; DELETE FROM destinations;");
  console.log("  (wiped existing rows)");
}

const insDest = db.prepare(`
  INSERT OR REPLACE INTO destinations (id, slug, name, country, region, hero_image, gallery,
    tagline, description, badge, start_from, rating, review_count, best_months,
    currency, themes, highlights, published,
    travel_season_start, travel_season_end, sales_season_start, sales_season_end,
    activity, region_type, region_keywords)
  VALUES (@id, @slug, @name, @country, @region, @hero_image, @gallery, @tagline,
    @description, @badge, @start_from, @rating, @review_count, @best_months,
    @currency, @themes, @highlights, 1,
    @travel_season_start, @travel_season_end, @sales_season_start, @sales_season_end,
    @activity, @region_type, @region_keywords)
`);

const insPkg = db.prepare(`
  INSERT OR REPLACE INTO packages (id, slug, title, destination, destination_name, theme,
    nights, days, price_adult, price_child, currency, original_price, discount,
    rating, review_count, cover_image, gallery, inclusions, exclusions, highlights,
    badge, itinerary, published,
    description, meta_title, meta_description, meta_keywords,
    tags, hotels, transfers, payment_policy)
  VALUES (@id, @slug, @title, @destination, @destination_name, @theme,
    @nights, @days, @price_adult, @price_child, @currency, @original_price, @discount,
    @rating, @review_count, @cover_image, @gallery, @inclusions, @exclusions, @highlights,
    @badge, @itinerary, 1,
    @description, @meta_title, @meta_description, @meta_keywords,
    @tags, @hotels, @transfers, @payment_policy)
`);

const insRev = db.prepare(`
  INSERT OR REPLACE INTO reviews (id, package_slug, name, location, avatar, rating, comment, travel_date)
  VALUES (@id, @package_slug, @name, @location, @avatar, @rating, @comment, @travel_date)
`);

const txn = db.transaction(() => {
  for (const d of destinations) {
    insDest.run({
      id: d.id,
      slug: d.slug,
      name: d.name,
      country: d.country,
      region: d.region,
      hero_image: d.heroImage,
      gallery: JSON.stringify(d.gallery || []),
      tagline: d.tagline || "",
      description: d.description || "",
      badge: d.badge || "",
      start_from: d.startFrom || 0,
      rating: d.rating || 0,
      review_count: d.reviewCount || 0,
      best_months: d.bestMonths || "",
      currency: d.currency || "INR",
      themes: JSON.stringify(d.themes || []),
      highlights: JSON.stringify(d.highlights || []),
      travel_season_start: d.travelSeason?.start || null,
      travel_season_end:   d.travelSeason?.end   || null,
      sales_season_start:  d.salesSeason?.start  || null,
      sales_season_end:    d.salesSeason?.end    || null,
      activity:        d.activity        || null,
      region_type:     d.regionType      || null,
      region_keywords: d.regionKeywords  || null,
    });
  }
  for (const p of packages) {
    insPkg.run({
      id: p.id,
      slug: p.slug,
      title: p.title,
      destination: p.destination,
      destination_name: p.destinationName,
      theme: JSON.stringify(p.theme || []),
      nights: p.duration?.nights || 0,
      days: p.duration?.days || 0,
      price_adult: p.price?.adult || 0,
      price_child: p.price?.child || 0,
      currency: p.price?.currency || "INR",
      original_price: p.originalPrice || null,
      discount: p.discount || 0,
      rating: p.rating || 0,
      review_count: p.reviewCount || 0,
      cover_image: p.coverImage,
      gallery: JSON.stringify(p.gallery || []),
      inclusions: JSON.stringify(p.inclusions || []),
      exclusions: JSON.stringify(p.exclusions || []),
      highlights: JSON.stringify(p.highlights || []),
      badge: p.badge || "",
      itinerary: JSON.stringify(p.itinerary || []),
      description:      p.description      || null,
      meta_title:       p.metaTitle        || null,
      meta_description: p.metaDescription  || null,
      meta_keywords:    p.metaKeywords     || null,
      tags:      JSON.stringify(p.tags      || []),
      hotels:    JSON.stringify(p.hotels    || []),
      transfers: JSON.stringify(p.transfers || []),
      payment_policy: p.paymentPolicy ? JSON.stringify(p.paymentPolicy) : null,
    });
  }
  for (const r of reviews) {
    insRev.run({
      id: r.id,
      package_slug: r.packageSlug || "",
      name: r.name,
      location: r.location || "",
      avatar: r.avatar || "G",
      rating: r.rating || 5,
      comment: r.comment || "",
      travel_date: r.date || "",
    });
  }
});
txn();

console.log("✓ Seed complete.");
db.close();
