import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import StarRating from "./StarRating.jsx";
import PriceTag from "./PriceTag.jsx";
import { Icon, ArrowRight, MapPin, Check, Calendar } from "./icons/index.jsx";

const badgeClass = (badge) => {
  if (badge === "Best Seller") return "badge-pink";
  if (badge === "Premium") return "badge-navy";
  if (badge === "Hot Deal") return "badge-green";
  return "badge-soft";
};

export default function PackageCard({ pkg, index = 0, layout = "grid" }) {
  if (layout === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="group overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-hover)]"
      >
        <Link to={`/packages/${pkg.slug}`} className="grid md:grid-cols-[300px_1fr]">
          <div className="relative h-56 overflow-hidden md:h-full">
            <img
              src={pkg.coverImage}
              alt={pkg.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <span className={`absolute left-3 top-3 ${badgeClass(pkg.badge)}`}>{pkg.badge}</span>
          </div>
          <div className="flex flex-col gap-3 p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-xl font-bold text-[var(--color-navy)]">
                  {pkg.title}
                </h3>
                <div className="mt-1 flex items-center gap-2 text-[13px] text-gray-500">
                  <span className="inline-flex items-center gap-1"><Icon size={13}><MapPin /></Icon>{pkg.destinationName}</span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1"><Icon size={13}><Calendar /></Icon>{pkg.duration.nights}N/{pkg.duration.days}D</span>
                </div>
              </div>
              <StarRating rating={pkg.rating} reviewCount={pkg.reviewCount} />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {pkg.theme.map((t) => (
                <span key={t} className="badge-soft">{t}</span>
              ))}
            </div>
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-[var(--color-navy)]">Highlights:</span>{" "}
              {pkg.highlights.slice(0, 3).join(" • ")}
            </p>
            <div className="mt-auto flex items-end justify-between border-t border-gray-100 pt-4">
              <PriceTag price={pkg.price.adult} original={pkg.originalPrice} discount={pkg.discount} />
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="group overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[var(--shadow-hover)]"
    >
      <Link to={`/packages/${pkg.slug}`} className="block">
        <div className="relative h-52 overflow-hidden">
          <img
            src={pkg.coverImage}
            alt={pkg.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--color-navy)]/70 to-transparent" />
          <span className={`absolute left-3 top-3 ${badgeClass(pkg.badge)}`}>{pkg.badge}</span>
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-[var(--color-navy)]">
            <Icon size={12}><Calendar /></Icon> {pkg.duration.nights}N/{pkg.duration.days}D
          </span>
        </div>
        <div className="p-5">
          <h3 className="font-display text-[17px] font-bold leading-tight text-[var(--color-navy)]">
            {pkg.title}
          </h3>
          <div className="mt-1.5 flex items-center gap-2 text-[12px] text-gray-500">
            <span className="inline-flex items-center gap-1"><Icon size={12}><MapPin /></Icon>{pkg.destinationName}</span>
            <span className="text-gray-300">|</span>
            <StarRating rating={pkg.rating} reviewCount={pkg.reviewCount} size="xs" />
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {pkg.theme.slice(0, 3).map((t) => (
              <span key={t} className="badge-soft">{t}</span>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-1">
            {pkg.inclusions.slice(0, 3).map((inc) => (
              <span key={inc} className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-[11px] text-gray-700">
                <Icon size={11} className="text-[var(--color-green)]"><Check /></Icon>{inc}
              </span>
            ))}
            {pkg.inclusions.length > 3 && (
              <span className="px-1 text-[11px] text-gray-400">
                +{pkg.inclusions.length - 3} more
              </span>
            )}
          </div>
          <div className="mt-4 flex items-end justify-between border-t border-gray-100 pt-4">
            <div>
              <div className="text-[11px] text-gray-500">Starting from</div>
              <PriceTag
                price={pkg.price.adult}
                original={pkg.originalPrice}
                discount={pkg.discount}
              />
            </div>
            <span className="btn-primary !py-2 !px-4 !text-[13px]">
              View
              <Icon size={14} animateOnHover><ArrowRight /></Icon>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
