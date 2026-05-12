import { Link } from "react-router-dom";
import { Icon, FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon } from "./icons/index.jsx";

const cols = [
  { title: "Destinations", links: [
    { label: "Bali", to: "/destinations/bali" },
    { label: "Maldives", to: "/destinations/maldives" },
    { label: "Thailand", to: "/destinations/thailand" },
    { label: "Dubai", to: "/destinations/dubai" },
    { label: "Europe", to: "/destinations/europe" },
    { label: "Singapore", to: "/destinations/singapore" },
  ]},
  { title: "Packages", links: [
    { label: "Honeymoon", to: "/search?theme=Honeymoon" },
    { label: "Family Trips", to: "/search?theme=Family" },
    { label: "Adventure", to: "/search?theme=Adventure" },
    { label: "Luxury", to: "/search?theme=Luxury" },
    { label: "Beach", to: "/search?theme=Beach" },
  ]},
  { title: "Company", links: [
    { label: "About Us", to: "/about" },
    { label: "Contact", to: "/contact" },
    { label: "Blog", to: "#" },
    { label: "Careers", to: "#" },
    { label: "Privacy Policy", to: "#" },
  ]},
];

export default function Footer() {
  return (
    <footer className="bg-[var(--color-navy)] text-white">
      <div className="container-page py-16">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <div className="font-display text-2xl font-bold text-[var(--color-pink)] mb-2">
              PINKFOOT TRAVEL
            </div>
            <p className="max-w-[280px] text-sm leading-relaxed text-white/65">
              Your trusted travel partner for personalised international holidays since 2018.
            </p>
            <div className="mt-5 flex gap-3">
              {[
                { label: "Facebook",  IconComp: FacebookIcon },
                { label: "Instagram", IconComp: InstagramIcon },
                { label: "Twitter",   IconComp: TwitterIcon },
                { label: "YouTube",   IconComp: YoutubeIcon },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white/80 transition hover:bg-[var(--color-pink)] hover:text-white"
                >
                  <s.IconComp size={16} />
                </a>
              ))}
            </div>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <div className="mb-4 text-sm font-bold tracking-wide">{col.title}</div>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-[13px] text-white/55 transition hover:text-[var(--color-pink-light)]"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-xs text-white/45">
          © {new Date().getFullYear()} Pinkfoot Travel. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
