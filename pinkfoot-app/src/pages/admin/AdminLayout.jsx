import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/auth.jsx";
import Logo from "../../components/Logo.jsx";
import { Icon, Sparkles, PackageBox, Map, Inbox, Bed, Shield } from "../../components/icons/index.jsx";

const nav = [
  { to: "/admin", end: true, label: "Dashboard", IconComp: Sparkles },
  { to: "/admin/packages", label: "Packages", IconComp: PackageBox },
  { to: "/admin/destinations", label: "Destinations", IconComp: Map },
  { to: "/admin/stays", label: "Stays", IconComp: Bed },
  { to: "/admin/policies", label: "Policies", IconComp: Shield },
  { to: "/admin/leads", label: "Leads", IconComp: Inbox },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[var(--color-off-white)]">
      <header className="border-b border-[var(--color-pink-pale)] bg-white">
        <div className="container-page flex h-16 items-center justify-between">
          <Link to="/admin">
            <Logo size={32} />
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xs font-semibold text-gray-500 hover:text-[var(--color-pink)]">
              ↗ View site
            </Link>
            <span className="hidden text-xs text-gray-500 sm:inline">{admin?.email}</span>
            <button
              onClick={() => { logout(); navigate("/admin/login"); }}
              className="rounded-full border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-[var(--color-pink)] hover:text-[var(--color-pink)]"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <div className="container-page grid gap-6 py-6 md:grid-cols-[220px_1fr]">
        <aside className="rounded-2xl bg-white p-3 shadow-[var(--shadow-card)] md:sticky md:top-6 md:self-start">
          <nav className="flex md:flex-col gap-1">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-[var(--color-pink-pale)] text-[var(--color-pink)]"
                      : "text-gray-700 hover:bg-[var(--color-pink-pale)]/50"
                  }`
                }
              >
                <Icon size={16}><n.IconComp /></Icon>
                {n.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
