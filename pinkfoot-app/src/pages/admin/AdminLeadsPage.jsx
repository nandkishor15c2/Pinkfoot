import { useEffect, useState } from "react";
import { api } from "../../lib/api.js";
import { Icon, Mail, Phone } from "../../components/icons/index.jsx";

const STATUSES = ["new", "contacted", "booked", "closed"];

export default function AdminLeadsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => { setLoading(true); api.adminLeads().then(setItems).finally(() => setLoading(false)); };
  useEffect(load, []);

  const setStatus = async (id, status) => {
    const next = await api.adminUpdateLead(id, status);
    setItems((xs) => xs.map((x) => (x.id === id ? next : x)));
  };
  const remove = async (id) => {
    if (!confirm("Delete this lead?")) return;
    await api.adminDeleteLead(id);
    setItems((xs) => xs.filter((x) => x.id !== id));
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-3xl font-bold text-[var(--color-navy)]">Leads</h1>
        <p className="mt-1 text-sm text-gray-500">{items.length} enquiries from the booking form.</p>
      </div>
      {loading ? (
        <div className="text-sm text-gray-500">Loading…</div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center text-sm text-gray-500 shadow-[var(--shadow-card)]">
          No leads yet.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((l) => (
            <div key={l.id} className="rounded-2xl bg-white p-5 shadow-[var(--shadow-card)]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-display text-lg font-bold text-[var(--color-navy)]">{l.name}</div>
                  <div className="mt-0.5 text-xs text-gray-500">
                    {l.email && (
                      <span className="mr-3 inline-flex items-center gap-1"><Icon size={12}><Mail /></Icon>{l.email}</span>
                    )}
                    {l.phone && (
                      <span className="inline-flex items-center gap-1"><Icon size={12}><Phone /></Icon>{l.phone}</span>
                    )}
                  </div>
                  {l.packageTitle && (
                    <div className="mt-2 text-xs">
                      <span className="badge-soft">{l.packageTitle}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={l.status}
                    onChange={(e) => setStatus(l.id, e.target.value)}
                    className="rounded-full border border-gray-300 px-3 py-1.5 text-xs font-semibold"
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={() => remove(l.id)} className="text-xs text-red-600 hover:underline">Delete</button>
                </div>
              </div>
              {l.message && (
                <p className="mt-3 whitespace-pre-line rounded-xl bg-[var(--color-off-white)] p-3 text-sm text-gray-700">
                  {l.message}
                </p>
              )}
              <div className="mt-3 text-[11px] text-gray-400">{new Date(l.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
