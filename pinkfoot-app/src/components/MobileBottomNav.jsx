import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Icon,
  Sparkles,
  Map,
  Search,
  MessageCircle,
  Heart,
} from "./icons/index.jsx";

const items = [
  { to: "/", end: true, label: "Home", IconComp: Sparkles },
  { to: "/destinations", label: "Places", IconComp: Map },
  { to: "/search", label: "Search", IconComp: Search, primary: true },
  { to: "/about", label: "About", IconComp: Heart },
  { to: "/contact", label: "Contact", IconComp: MessageCircle },
];

export default function MobileBottomNav() {
  // hide on product pages — that page has its own bottom price bar
  const { pathname } = useLocation();
  const hideBottomNav = pathname.startsWith("/packages/");

  if (hideBottomNav) return null;

  return (
    <motion.nav
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-pink-mid)]/40 bg-white/95 backdrop-blur-md shadow-[0_-6px_24px_rgba(27,42,74,0.1)] md:hidden"
      aria-label="Bottom navigation"
    >
      <div className="flex items-end justify-around px-2 pt-1.5 pb-[max(6px,env(safe-area-inset-bottom))]">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.end}
            className={({ isActive }) =>
              `relative flex min-w-[56px] flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider transition ${
                isActive ? "text-[var(--color-pink)]" : "text-gray-500"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {it.primary ? (
                  <div
                    className={`-mt-5 grid h-12 w-12 place-items-center rounded-full shadow-[0_8px_22px_rgba(232,84,120,0.38)] ring-4 ring-white ${
                      isActive
                        ? "bg-gradient-to-br from-[var(--color-pink)] to-[var(--color-navy-mid)] text-white"
                        : "bg-[var(--color-pink)] text-white"
                    }`}
                  >
                    <Icon size={20} animate={isActive}>
                      <it.IconComp />
                    </Icon>
                  </div>
                ) : (
                  <Icon size={20} animate={isActive}>
                    <it.IconComp />
                  </Icon>
                )}
                <span className={it.primary ? "mt-0" : ""}>{it.label}</span>
                {isActive && !it.primary && (
                  <motion.span
                    layoutId="mobile-nav-dot"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="mt-0.5 h-1 w-1 rounded-full bg-[var(--color-pink)]"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </motion.nav>
  );
}
