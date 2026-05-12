import { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "./Logo.jsx";
import { Icon, Phone, Menu, X } from "./icons/index.jsx";

const links = [
  { label: "Home", to: "/" },
  { label: "Destinations", to: "/destinations" },
  { label: "Packages", to: "/search" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-[0_2px_24px_rgba(27,42,74,0.08)] border-b border-[var(--color-pink-mid)]/40"
          : "bg-white/70 backdrop-blur"
      }`}
    >
      <div className="container-page flex h-[72px] items-center justify-between">
        <Link to="/" aria-label="Pinkfoot home">
          <Logo />
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `relative rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? "text-[var(--color-pink)]"
                    : "text-[var(--color-navy)] hover:text-[var(--color-pink)]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-[var(--color-pink)]"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
          <Link to="/search" className="btn-primary group ml-3 !py-2.5 !px-5 text-sm">
            <Icon size={16} animateOnHover>
              <Phone />
            </Icon>
            Book Now
          </Link>
        </div>

        <button
          aria-label="Open menu"
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden rounded-full p-2 text-[var(--color-navy)] hover:bg-[var(--color-pink-pale)]"
        >
          <Icon size={22} animate={menuOpen} key={String(menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </Icon>
        </button>
      </div>

      {menuOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="md:hidden border-t border-[var(--color-pink-mid)]/40 bg-white"
        >
          <div className="container-page flex flex-col gap-1 py-4">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-3 text-sm font-semibold ${
                    isActive
                      ? "bg-[var(--color-pink-pale)] text-[var(--color-pink)]"
                      : "text-[var(--color-navy)]"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link to="/search" className="btn-primary mt-2">
              <Icon size={16}><Phone /></Icon>
              Book Now
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
