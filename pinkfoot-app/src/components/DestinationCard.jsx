import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function DestinationCard({ dest, index = 0, height = 280 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
    >
      <Link
        to={`/destinations/${dest.slug}`}
        className="group relative block overflow-hidden rounded-2xl shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-hover)]"
        style={{ height }}
      >
        <img
          src={dest.heroImage}
          alt={dest.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy)] via-[var(--color-navy)]/30 to-transparent" />
        <span className="absolute right-3 top-3 rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md">
          {dest.badge}
        </span>
        <div className="absolute inset-x-4 bottom-4">
          <div className="font-display text-2xl font-bold text-white leading-tight">
            {dest.name}
          </div>
          <div className="mt-1 text-[12px] text-white/85">{dest.tagline}</div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[13px] font-semibold text-white">
              From ₹{dest.startFrom.toLocaleString("en-IN")}
            </span>
            <span className="translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[var(--color-pink)]">
                Explore →
              </span>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
