import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api.js";
import { Icon, PackageBox, Map, Inbox } from "../../components/icons/index.jsx";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ packages: 0, destinations: 0, leads: 0, latestLeads: [] });

  useEffect(() => {
    Promise.all([
      api.adminListPackages().catch(() => []),
      api.adminListDestinations().catch(() => []),
      api.adminLeads().catch(() => []),
    ]).then(([packages, destinations, leads]) => {
      setStats({
        packages: packages.length,
        destinations: destinations.length,
        leads: leads.length,
        latestLeads: leads.slice(0, 5),
      });
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-[var(--color-navy)]">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Quick overview of your travel catalogue and enquiries.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Packages" value={stats.packages} IconComp={PackageBox} to="/admin/packages" />
        <StatCard label="Destinations" value={stats.destinations} IconComp={Map} to="/admin/destinations" />
        <StatCard label="Leads" value={stats.leads} IconComp={Inbox} to="/admin/leads" highlight />
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-[var(--shadow-card)]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-[var(--color-navy)]">Latest enquiries</h2>
          <Link to="/admin/leads" className="text-xs font-semibold text-[var(--color-pink)]">
            View all →
          </Link>
        </div>
        {stats.latestLeads.length === 0 ? (
          <p className="text-sm text-gray-500">No leads yet — the booking form on each product page will populate this.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {stats.latestLeads.map((l) => (
              <li key={l.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <div className="font-semibold text-[var(--color-navy)]">{l.name}</div>
                  <div className="text-xs text-gray-500">
                    {l.email || l.phone} · {l.packageTitle || "General"}
                  </div>
                </div>
                <span className="rounded-full bg-[var(--color-pink-pale)] px-2.5 py-1 text-[11px] font-bold text-[var(--color-pink)]">
                  {l.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl bg-[var(--color-navy)] p-6 text-white shadow-[var(--shadow-card)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-display text-xl font-bold">Add a new package</div>
            <div className="text-sm text-white/70">Upload images, set price, write the itinerary — go live in minutes.</div>
          </div>
          <Link to="/admin/packages/new" className="btn-primary whitespace-nowrap">
            + New Package
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, IconComp, to, highlight }) {
  return (
    <Link
      to={to}
      className={`group rounded-2xl p-5 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 ${
        highlight ? "bg-[var(--color-pink)] text-white" : "bg-white text-[var(--color-navy)]"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className={`text-xs font-bold uppercase tracking-wider ${highlight ? "text-white/85" : "text-gray-500"}`}>
          {label}
        </div>
        <Icon size={22} animateOnHover><IconComp /></Icon>
      </div>
      <div className="mt-2 font-display text-4xl font-bold">{value}</div>
    </Link>
  );
}
