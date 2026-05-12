import { motion } from "framer-motion";

export default function SectionHeader({ eyebrow, title, subtitle, centered = true, light = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className={`${centered ? "text-center" : ""} mb-12`}
    >
      {eyebrow && (
        <span
          className={`inline-block rounded-full px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
            light ? "bg-white/15 text-white" : "bg-[var(--color-pink-pale)] text-[var(--color-pink)]"
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`mt-3 font-display text-[clamp(28px,4vw,42px)] font-bold leading-[1.1] ${
          light ? "text-white" : "text-[var(--color-navy)]"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mx-auto mt-3 max-w-[640px] text-base leading-relaxed ${
            light ? "text-white/70" : "text-gray-500"
          }`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
