import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";

import destinations from "./routes/destinations.js";
import packages from "./routes/packages.js";
import reviews from "./routes/reviews.js";
import leads from "./routes/leads.js";
import auth from "./routes/auth.js";
import uploads from "./routes/uploads.js";
import stays from "./routes/stays.js";
import policies from "./routes/policies.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

app.use(cors({ origin: CORS_ORIGIN.split(","), credentials: false }));
app.use(express.json({ limit: "2mb" }));
app.use("/uploads", express.static(path.resolve(__dirname, "..", "uploads"), {
  maxAge: "30d",
}));

app.get("/api/health", (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));
app.use("/api/auth", auth);
app.use("/api/destinations", destinations);
app.use("/api/packages", packages);
app.use("/api/reviews", reviews);
app.use("/api/leads", leads);
app.use("/api/uploads", uploads);
app.use("/api/stays", stays);
app.use("/api/policies", policies);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Internal error" });
});

app.listen(PORT, () => {
  console.log(`✓ Pinkfoot API running at http://localhost:${PORT}`);
  console.log(`  Admin login: ${process.env.ADMIN_EMAIL || "admin@pinkfoot.local"} / ${process.env.ADMIN_PASSWORD || "pinkfoot-admin"}`);
});
