import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import StarRating from "./StarRating.jsx";
import {
  Icon,
  ArrowRight,
  MapPin,
  Check,
  Calendar,
  Bed,
  Plane,
  Utensils,
  Bus,
  Map,
  Camera,
  Shield,
  Wallet,
  Phone,
  Heart,
} from "./icons/index.jsx";

/** Map inclusion text to a meaningful icon component. */
const INCLUSION_MATCHERS = [
  { re: /hotel|stay|villa|haveli|resort|accommodation|night/i, C: Bed },
  { re: /flight|airfare|airline|airport/i, C: Plane },
  { re: /breakfast|dinner|lunch|meal|food|cuisine|bbq|menu|map\b|ap\b|cp\b/i, C: Utensils },
  { re: /transfer|transport|vehicle|cab|taxi|drive|safari/i, C: Bus },
  { re: /tour|sightseeing|visit|excursion|guide|cultural|tickets?|entry|monument|cruise|temple|park/i, C: Map },
  { re: /photo|camera/i, C: Camera },
  { re: /insurance|safe|secure|cover/i, C: Shield },
  { re: /tax|gst|charge|fee|payment/i, C: Wallet },
  { re: /support|assist|24\/7|call/i, C: Phone },
];
const iconFor = (label) => INCLUSION_MATCHERS.find((m) => m.re.test(label))?.C || Check;

const badgeColors = {
  "Best Seller":      { bg: "var(--color-pink)",  text: "#fff" },
  "Premium":          { bg: "var(--color-navy)",  text: "#fff" },
  "Hot Deal":         { bg: "var(--color-green)", text: "#fff" },
  "Family Favourite": { bg: "var(--color-gold)",  text: "#fff" },
  "Family Pick":      { bg: "var(--color-gold)",  text: "#fff" },
  "Weekend Deal":     { bg: "var(--color-pink)",  text: "#fff" },
};
const badgeColorFor = (b) =>
  badgeColors[b] || { bg: "var(--color-pink-pale)", text: "var(--color-pink)" };

function WishlistButton({ slug }) {
  const [liked, setLiked] = useState(false);
  return (
    <button
      type="button"
      aria-label={liked ? "Remove from wishlist" : "Save to wishlist"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setLiked((v) => !v);
        try {
          const key = "pinkfoot_wishlist";
          const list = JSON.parse(localStorage.getItem(key) || "[]");
          const next = liked ? list.filter((s) => s !== slug) : [...list, slug];
          localStorage.setItem(key, JSON.stringify(next));
        } catch {}
      }}
      className={`grid h-9 w-9 place-items-center rounded-full backdrop-blur transition active:scale-95 ${
        liked
          ? "bg-[var(--color-pink)] text-white shadow-[0_6px_18px_rgba(232,84,120,0.4)]"
          : "bg-white/95 text-gray-700 hover:bg-white hover:text-[var(--color-pink)]"
      }`}
    >
      <Icon size={15} animate={liked} key={String(liked)}>
        <Heart filled={liked} />
      </Icon>
    </button>
  );
}

function StickerBadge({ label }) {
  if (!label) return null;
  const c = badgeColorFor(label);
  return (
    <div className="origin-top-left -rotate-3">
      <span
        className="inline-block rounded-md px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] shadow-[0_4px_12px_rgba(27,42,74,0.25)] ring-2 ring-white"
        style={{ background: c.bg, color: c.text }}
      >
        {label}
      </span>
    </div>
  );
}

function InclusionChips({ list }) {
  return (
    <div className="flex max-w-full flex-wrap gap-1.5">
      {list.slice(0, 3).map((inc, i) => {
        const IconComp = iconFor(inc);
        return (
          <span
            key={inc}
            title={inc}
            className="group/incl inline-flex min-w-0 max-w-[150px] items-center gap-1.5 rounded-full border border-[var(--color-pink-mid)]/35 bg-white pl-1 pr-2.5 py-1 text-[11px] font-semibold leading-none text-[var(--color-navy)] shadow-[0_1px_2px_rgba(27,42,74,0.04)] transition hover:-translate-y-px hover:border-[var(--color-pink)]/70 hover:bg-[var(--color-pink-pale)] hover:text-[var(--color-pink)]"
            style={{ transitionDelay: `${i * 30}ms` }}
          >
            <span className="grid h-4 w-4 flex-shrink-0 place-items-center rounded-full bg-[var(--color-pink-pale)] text-[var(--color-pink)] transition group-hover/incl:bg-[var(--color-pink)] group-hover/incl:text-white">
              <Icon size={10} animateOnHover>
                <IconComp />
              </Icon>
            </span>
            <span className="min-w-0 truncate">{inc}</span>
          </span>
        );
      })}
      {list.length > 3 && (
        <span className="inline-flex flex-shrink-0 items-center rounded-full bg-[var(--color-pink-pale)] px-2.5 py-1 text-[11px] font-bold leading-none text-[var(--color-pink)]">
          +{list.length - 3}
        </span>
      )}
    </div>
  );
}

// Large faint travel icon that drifts behind the card content. Cycles
// through a small set of icons based on card index so a grid feels varied.
const WATERMARKS = [
  // Plane silhouette
  () => (
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
  ),
  // Giant (Ferris) wheel
  () => (
    <>
      <circle cx="12" cy="9" r="8" />
      <circle cx="12" cy="9" r="1.4" />
      <path d="M12 1v16" />
      <path d="M4 9h16" />
      <path d="M6.34 3.34 17.66 14.66" />
      <path d="M17.66 3.34 6.34 14.66" />
      <path d="M9 21h6" />
      <path d="M12 17v4" />
    </>
  ),
  // Map-pin
  () => (
    <>
      <path d="M20 10c0 7-8 13-8 13s-8-6-8-13a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  // Compass
  () => (
    <>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88" />
    </>
  ),
];

function CardWatermark({ index = 0 }) {
  const Inner = WATERMARKS[index % WATERMARKS.length];
  // For the Plane silhouette (index 0 of the rotation) use a fill so it stays
  // recognisable; the others read better as line drawings at low opacity.
  const isSilhouette = index % WATERMARKS.length === 0;
  const startRot = index % 2 ? -14 : 12;
  const endRot = index % 2 ? 6 : -8;
  return (
    <motion.div
      aria-hidden
      initial={{ rotate: startRot, x: 0, y: 0 }}
      animate={{ rotate: endRot, x: -8, y: -14 }}
      transition={{
        duration: 18 + (index % 4) * 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
      className="pointer-events-none absolute -right-10 -top-6 z-0 text-[var(--color-pink)]"
      style={{ opacity: isSilhouette ? 0.06 : 0.1 }}
    >
      <svg
        width="210"
        height="210"
        viewBox="0 0 24 24"
        fill={isSilhouette ? "currentColor" : "none"}
        stroke={isSilhouette ? "none" : "currentColor"}
        strokeWidth={isSilhouette ? 0 : 0.55}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Inner />
      </svg>
    </motion.div>
  );
}

function PriceBlock({ price, original, discount }) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">From</div>
      <div className="flex flex-wrap items-baseline gap-1.5">
        <span className="font-display text-2xl leading-none text-[var(--color-pink)] tabular-nums">
          ₹{price?.toLocaleString("en-IN")}
        </span>
        <span className="text-[11px] font-medium text-gray-500">/person</span>
      </div>
      {discount > 0 && original && (
        <div className="mt-1 flex items-center gap-1.5">
          <span className="text-[11px] text-gray-400 line-through tabular-nums">
            ₹{original.toLocaleString("en-IN")}
          </span>
          <span className="inline-flex items-center rounded-md bg-[var(--color-green)]/15 px-1.5 py-0.5 text-[9px] font-bold leading-none text-[var(--color-green)]">
            {discount}% OFF
          </span>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// PackageCard
// ──────────────────────────────────────────────────────────────────────────

export default function PackageCard({ pkg, index = 0, layout = "grid" }) {
  // ── LIST LAYOUT ──
  if (layout === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.4, delay: index * 0.04 }}
        className="group overflow-hidden rounded-3xl bg-white shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-hover)]"
      >
        <Link to={`/packages/${pkg.slug}`} className="grid md:grid-cols-[340px_1fr]">
          <div className="relative h-60 overflow-hidden md:h-full">
            <img
              src={pkg.coverImage}
              alt={pkg.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy)]/55 via-[var(--color-navy)]/15 to-transparent" />
            <div className="absolute left-4 top-4">
              <StickerBadge label={pkg.badge} />
            </div>
            <div className="absolute right-4 top-4">
              <WishlistButton slug={pkg.slug} />
            </div>
            <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-[var(--color-navy)] shadow-md">
              <Icon size={12} className="text-[var(--color-pink)]"><Calendar /></Icon>
              {pkg.duration.nights}N · {pkg.duration.days}D
            </span>
          </div>
          <div className="flex flex-col gap-3 p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-display text-2xl leading-tight text-[var(--color-navy)]">
                  {pkg.title}
                </h3>
                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[12px] text-gray-500">
                  <span className="inline-flex items-center gap-1 font-semibold text-[var(--color-pink)]">
                    <Icon size={12}><MapPin /></Icon>{pkg.destinationName}
                  </span>
                  <span className="text-gray-300">·</span>
                  <StarRating rating={pkg.rating} reviewCount={pkg.reviewCount} size="xs" />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {pkg.theme.map((t) => (
                <span key={t} className="badge-soft">#{t}</span>
              ))}
            </div>
            {pkg.highlights?.length > 0 && (
              <p className="text-[13px] leading-relaxed text-gray-600">
                <span className="font-semibold text-[var(--color-navy)]">Trip highlights —</span>{" "}
                {pkg.highlights.slice(0, 3).join(" · ")}
              </p>
            )}
            <InclusionChips list={pkg.inclusions} />
            <div className="mt-auto flex items-end justify-between gap-3 border-t border-gray-100 pt-4">
              <PriceBlock price={pkg.price.adult} original={pkg.originalPrice} discount={pkg.discount} />
              <span className="btn-primary !py-2.5 !px-5 !text-sm">
                View Details
                <Icon size={16} animateOnHover><ArrowRight /></Icon>
              </span>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  // ── GRID LAYOUT ──
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[var(--shadow-hover)]"
    >
      <Link to={`/packages/${pkg.slug}`} className="flex h-full flex-col">
        {/* IMAGE */}
        <div className="relative h-60 overflow-hidden">
          <img
            src={pkg.coverImage}
            alt={pkg.title}
            className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy)]/60 via-[var(--color-navy)]/10 to-transparent" />

          {/* Top-left sticker badge */}
          <div className="absolute left-4 top-4">
            <StickerBadge label={pkg.badge} />
          </div>

          {/* Top-right wishlist */}
          <div className="absolute right-4 top-4">
            <WishlistButton slug={pkg.slug} />
          </div>

          {/* Bottom-left destination pill */}
          <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-[var(--color-navy)] shadow-md backdrop-blur">
            <Icon size={12} className="text-[var(--color-pink)]"><MapPin /></Icon>
            {pkg.destinationName}
          </div>

          {/* Bottom-right duration */}
          <div className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-[var(--color-navy)] shadow-md backdrop-blur">
            <Icon size={12} className="text-[var(--color-pink)]"><Calendar /></Icon>
            {pkg.duration.nights}N · {pkg.duration.days}D
          </div>
        </div>

        {/* CONTENT */}
        <div className="relative flex flex-1 flex-col overflow-hidden p-5">
          {/* Decorative travel watermark — large, faint, slowly drifting */}
          <CardWatermark index={index} />

          {/* Title + rating */}
          <div className="relative z-10 flex items-start justify-between gap-3">
            <h3 className="min-w-0 font-display text-[19px] leading-tight text-[var(--color-navy)]">
              {pkg.title}
            </h3>
            <span className="flex-shrink-0 inline-flex items-center gap-1 rounded-md bg-[var(--color-pink-pale)] px-2 py-1 text-[11px] font-bold leading-none text-[var(--color-pink)]">
              ★ {pkg.rating.toFixed(1)}
            </span>
          </div>
          <div className="relative z-10 mt-1.5 text-[11px] text-gray-500">
            {pkg.reviewCount.toLocaleString("en-IN")} traveller reviews
          </div>

          {/* Themes */}
          {pkg.theme?.length > 0 && (
            <div className="relative z-10 mt-3 flex flex-wrap gap-1">
              {pkg.theme.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-[var(--color-navy-light)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-navy)]"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Inclusion chips */}
          <div className="relative z-10 mt-3">
            <InclusionChips list={pkg.inclusions} />
          </div>

          {/* Bottom-pinned group: day-dots + price/CTA */}
          <div className="relative z-10 mt-auto">
            {/* Day-dots route */}
            <div className="mb-3 flex items-center gap-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                Day 1
              </span>
              <span className="flex flex-1 items-center gap-[3px] px-2">
                {Array.from({ length: Math.min(pkg.duration.days, 14) }).map((_, i) => (
                  <span
                    key={i}
                    className="h-1 flex-1 rounded-full bg-[var(--color-pink-mid)]/40 transition group-hover:bg-[var(--color-pink)]"
                    style={{ transitionDelay: `${i * 40}ms` }}
                  />
                ))}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                Day {pkg.duration.days}
              </span>
            </div>

          {/* Price + CTA */}
          <div className="-mx-5 -mb-5 flex items-center justify-between gap-3 bg-gradient-to-r from-[var(--color-pink-pale)] via-white to-[var(--color-pink-pale)] px-5 py-4">
            <PriceBlock
              price={pkg.price.adult}
              original={pkg.originalPrice}
              discount={pkg.discount}
            />
            <span className="btn-primary !py-2.5 !px-4 !text-[13px]">
              View
              <Icon size={14} animateOnHover><ArrowRight /></Icon>
            </span>
          </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
