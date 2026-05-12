import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon, Calendar, ChevronLeft, ChevronRight } from "./icons/index.jsx";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const fmt = (d) => {
  if (!d) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd} ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`;
};

const iso = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

const parseISO = (s) => {
  if (!s) return null;
  const [y, m, d] = s.split("-").map(Number);
  if (!y) return null;
  return new Date(y, (m || 1) - 1, d || 1);
};

const sameDay = (a, b) =>
  a && b && a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export default function DatePicker({
  value,
  onChange,
  placeholder = "Select a date",
  minDate,
}) {
  const selected = useMemo(() => parseISO(value), [value]);
  const today = useMemo(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), t.getDate());
  }, []);
  const min = minDate || today;

  const [view, setView] = useState(() => selected || today);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  // close on outside click
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // grid: start at the first day of the month, back-fill to Sunday
  const cells = useMemo(() => {
    const first = new Date(view.getFullYear(), view.getMonth(), 1);
    const startWeekday = first.getDay();
    const start = new Date(first);
    start.setDate(1 - startWeekday);
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [view]);

  const shiftMonth = (delta) => {
    setView((v) => new Date(v.getFullYear(), v.getMonth() + delta, 1));
  };

  const pick = (d) => {
    onChange(iso(d));
    setOpen(false);
  };

  const inMonth = (d) => d.getMonth() === view.getMonth();
  const before = (a, b) =>
    a.getFullYear() < b.getFullYear() ||
    (a.getFullYear() === b.getFullYear() && a.getMonth() < b.getMonth()) ||
    (a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() < b.getDate());

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-between rounded-xl border bg-white px-3 py-2.5 text-sm text-left outline-none transition focus:border-[var(--color-pink)] ${
          open ? "border-[var(--color-pink)]" : "border-gray-300"
        }`}
      >
        <span className={`flex items-center gap-2 ${selected ? "text-[var(--color-navy)]" : "text-gray-400"}`}>
          <Icon size={14} className="text-[var(--color-pink)]"><Calendar /></Icon>
          {selected ? fmt(selected) : placeholder}
        </span>
        {selected && (
          <span
            role="button"
            tabIndex={0}
            aria-label="Clear date"
            onClick={(e) => { e.stopPropagation(); onChange(""); }}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); onChange(""); } }}
            className="rounded-full p-0.5 text-gray-400 hover:bg-gray-100 hover:text-[var(--color-pink)]"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute left-0 right-0 z-30 mt-2 origin-top overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_18px_50px_rgba(27,42,74,0.18)]"
          >
            {/* Header with brand gradient */}
            <div
              className="flex items-center justify-between px-4 py-3 text-white"
              style={{
                background: "linear-gradient(135deg, var(--color-pink) 0%, var(--color-navy-mid) 100%)",
              }}
            >
              <button
                type="button"
                aria-label="Previous month"
                onClick={() => shiftMonth(-1)}
                className="grid h-8 w-8 place-items-center rounded-full bg-white/15 backdrop-blur hover:bg-white/25"
              >
                <Icon size={14} animateOnHover><ChevronLeft /></Icon>
              </button>
              <div className="text-center">
                <div className="font-display text-base font-bold leading-none">
                  {MONTHS[view.getMonth()]}
                </div>
                <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/80">
                  {view.getFullYear()}
                </div>
              </div>
              <button
                type="button"
                aria-label="Next month"
                onClick={() => shiftMonth(1)}
                className="grid h-8 w-8 place-items-center rounded-full bg-white/15 backdrop-blur hover:bg-white/25"
              >
                <Icon size={14} animateOnHover><ChevronRight /></Icon>
              </button>
            </div>

            {/* Day-of-week strip */}
            <div className="grid grid-cols-7 gap-0.5 bg-[var(--color-off-white)] px-2 py-2 text-center text-[10px] font-bold uppercase tracking-wider text-gray-500">
              {DAYS.map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-1 p-2">
              {cells.map((d, i) => {
                const isSel = sameDay(d, selected);
                const isToday = sameDay(d, today);
                const dim = !inMonth(d);
                const disabled = before(d, min);
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={disabled}
                    onClick={() => !disabled && pick(d)}
                    className={`relative grid h-9 place-items-center rounded-lg text-[13px] font-semibold transition ${
                      isSel
                        ? "bg-[var(--color-pink)] text-white shadow-[0_4px_12px_rgba(232,84,120,0.4)]"
                        : disabled
                        ? "cursor-not-allowed text-gray-300"
                        : dim
                        ? "text-gray-300 hover:bg-gray-50"
                        : "text-[var(--color-navy)] hover:bg-[var(--color-pink-pale)]"
                    }`}
                  >
                    {d.getDate()}
                    {isToday && !isSel && (
                      <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[var(--color-pink)]" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 px-3 py-2">
              <button
                type="button"
                onClick={() => { setView(today); pick(today); }}
                className="rounded-full px-3 py-1 text-xs font-semibold text-[var(--color-pink)] hover:bg-[var(--color-pink-pale)]"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full px-3 py-1 text-xs font-semibold text-gray-500 hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
