import { useEffect, useRef, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo.jsx";
import {
  Icon,
  Phone,
  Search as SearchIcon,
  ChevronDown,
  Globe,
  MessageCircle,
  Sparkles,
} from "./icons/index.jsx";
import { useDestinations } from "../lib/useData.js";

const navLinks = [
  { label: "Home", to: "/", end: true },
  { label: "Destinations", to: "/destinations", menu: "destinations" },
  { label: "Packages", to: "/search", menu: "packages" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const PACKAGE_THEMES = [
  { label: "Honeymoon", desc: "Romantic escapes", to: "/search?theme=Honeymoon" },
  { label: "Family",    desc: "Kid-friendly fun",  to: "/search?theme=Family" },
  { label: "Adventure", desc: "Off-the-grid trips", to: "/search?theme=Adventure" },
  { label: "Luxury",    desc: "Premium stays",     to: "/search?theme=Luxury" },
  { label: "Beach",     desc: "Sun, sand, sea",    to: "/search?theme=Beach" },
  { label: "Culture",   desc: "Heritage & history", to: "/search?theme=Culture" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(null); // "destinations" | "packages" | null
  const { data: destinations } = useDestinations();
  const closeTimer = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close any open menu when navigating
  useEffect(() => { setOpenMenu(null); }, [pathname]);

  const enter = (id) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(id);
  };
  const leave = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  };

  const dests = (destinations || []).slice(0, 6);

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      {/* TOP UTILITY STRIP — collapses on scroll */}
      <AnimatePresence initial={false}>
        {!scrolled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 36, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="hidden overflow-hidden md:block"
            style={{
              background:
                "linear-gradient(90deg, var(--color-navy) 0%, var(--color-navy-mid) 100%)",
            }}
          >
            <div className="container-page flex h-9 items-center justify-between text-[12px] text-white/85">
              <div className="flex items-center gap-5">
                <a
                  href="tel:+918109030897"
                  className="inline-flex items-center gap-1.5 font-semibold transition hover:text-[var(--color-pink-light)]"
                >
                  <Icon size={13} animateOnHover><Phone /></Icon> +91 8109030897
                </a>
                <span className="hidden text-white/25 lg:inline">·</span>
                <span className="hidden items-center gap-1.5 lg:inline-flex">
                  <Icon size={13}><MessageCircle /></Icon> 24/7 travel support
                </span>
                <span className="hidden text-white/25 xl:inline">·</span>
                <span className="hidden items-center gap-1.5 xl:inline-flex">
                  <Icon size={13}><Sparkles /></Icon> Hand-crafted itineraries since 2018
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center gap-1 font-semibold">
                  <Icon size={13}><Globe /></Icon> INR · English
                </span>
                <span className="text-white/25">·</span>
                <Link
                  to="/admin/login"
                  className="font-semibold transition hover:text-[var(--color-pink-light)]"
                >
                  Agent sign in
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN NAVBAR */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`transition-all duration-300 ${
          scrolled
            ? "bg-white/97 shadow-[0_4px_28px_rgba(27,42,74,0.10)] border-b border-[var(--color-pink-mid)]/40 backdrop-blur-md"
            : "bg-white/80 backdrop-blur"
        }`}
      >
        <div className={`container-page flex items-center justify-between transition-all ${scrolled ? "h-[60px]" : "h-[68px] md:h-[72px]"}`}>
          <Link to="/" aria-label="Pinkfoot home" className="flex-shrink-0">
            <Logo size={scrolled ? 30 : 34} />
          </Link>

          {/* Desktop nav */}
          <div
            className="hidden md:flex items-center gap-0.5"
            onMouseLeave={leave}
          >
            {navLinks.map((l) =>
              l.menu ? (
                <div
                  key={l.to}
                  className="relative"
                  onMouseEnter={() => enter(l.menu)}
                >
                  <NavLink
                    to={l.to}
                    end={l.end}
                    className={({ isActive }) =>
                      `relative inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
                        isActive
                          ? "text-[var(--color-pink)]"
                          : "text-[var(--color-navy)] hover:text-[var(--color-pink)]"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {l.label}
                        <span className={`transition ${openMenu === l.menu ? "rotate-180" : ""}`}>
                          <Icon size={12}><ChevronDown /></Icon>
                        </span>
                        {isActive && (
                          <motion.span
                            layoutId="nav-underline"
                            className="absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full bg-[var(--color-pink)]"
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                </div>
              ) : (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    `relative rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
                      isActive
                        ? "text-[var(--color-pink)]"
                        : "text-[var(--color-navy)] hover:text-[var(--color-pink)]"
                    }`
                  }
                  onMouseEnter={leave}
                >
                  {({ isActive }) => (
                    <>
                      {l.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full bg-[var(--color-pink)]"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              )
            )}
          </div>

          {/* Right utilities — desktop */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/search"
              aria-label="Search packages"
              className="grid h-10 w-10 place-items-center rounded-full text-[var(--color-navy)] transition hover:bg-[var(--color-pink-pale)] hover:text-[var(--color-pink)]"
            >
              <Icon size={18} animateOnHover><SearchIcon /></Icon>
            </Link>
            <Link to="/contact" className="btn-primary !py-2.5 !px-5 text-sm">
              <Icon size={14} animateOnHover><Phone /></Icon> Book Now
            </Link>
          </div>

          {/* Mobile mini CTA */}
          <Link
            to="/contact"
            className="md:hidden inline-flex items-center gap-1.5 rounded-full bg-[var(--color-pink)] px-3.5 py-2 text-[12px] font-bold text-white shadow-[0_4px_12px_rgba(232,84,120,0.32)]"
          >
            <Icon size={13} animateOnHover><Phone /></Icon> Book
          </Link>
        </div>

        {/* MEGA MENUS */}
        <AnimatePresence>
          {openMenu === "destinations" && (
            <motion.div
              key="destinations-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute inset-x-0 hidden border-t border-[var(--color-pink-mid)]/30 bg-white shadow-[0_24px_50px_rgba(27,42,74,0.15)] md:block"
              onMouseEnter={() => enter("destinations")}
              onMouseLeave={leave}
            >
              <div className="container-page py-7">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-pink)]">
                      Where to next
                    </div>
                    <div className="font-display text-xl text-[var(--color-navy)]">
                      Popular destinations
                    </div>
                  </div>
                  <Link
                    to="/destinations"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-pink)] hover:underline"
                  >
                    View all destinations →
                  </Link>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {dests.map((d) => (
                    <Link
                      key={d.id}
                      to={`/destinations/${d.slug}`}
                      className="group flex items-center gap-3 rounded-2xl border border-gray-100 p-2 transition hover:border-[var(--color-pink)] hover:bg-[var(--color-pink-pale)]/40 hover:shadow-md"
                    >
                      <img
                        src={d.heroImage}
                        alt=""
                        className="h-14 w-20 flex-shrink-0 rounded-xl object-cover transition group-hover:scale-105"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-display text-base text-[var(--color-navy)]">
                          {d.name}
                        </div>
                        <div className="truncate text-[11px] text-gray-500">
                          {d.tagline}
                        </div>
                        <div className="mt-0.5 text-[11px] font-semibold text-[var(--color-pink)]">
                          From ₹{d.startFrom.toLocaleString("en-IN")}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {openMenu === "packages" && (
            <motion.div
              key="packages-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute inset-x-0 hidden border-t border-[var(--color-pink-mid)]/30 bg-white shadow-[0_24px_50px_rgba(27,42,74,0.15)] md:block"
              onMouseEnter={() => enter("packages")}
              onMouseLeave={leave}
            >
              <div className="container-page py-7">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-pink)]">
                      Pick your vibe
                    </div>
                    <div className="font-display text-xl text-[var(--color-navy)]">
                      Browse by holiday theme
                    </div>
                  </div>
                  <Link
                    to="/search"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-pink)] hover:underline"
                  >
                    All packages →
                  </Link>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {PACKAGE_THEMES.map((t) => (
                    <Link
                      key={t.label}
                      to={t.to}
                      className="group flex items-center justify-between rounded-2xl border border-gray-100 p-3.5 transition hover:border-[var(--color-pink)] hover:bg-[var(--color-pink-pale)]/40"
                    >
                      <div>
                        <div className="font-display text-base text-[var(--color-navy)] group-hover:text-[var(--color-pink)]">
                          {t.label}
                        </div>
                        <div className="text-[11px] text-gray-500">{t.desc}</div>
                      </div>
                      <span className="text-[var(--color-pink)] opacity-0 transition-opacity group-hover:opacity-100">
                        →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}
