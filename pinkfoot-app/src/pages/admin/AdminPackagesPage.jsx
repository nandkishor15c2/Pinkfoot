import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api.js";

export default function AdminPackagesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = () => {
    setLoading(true);
    api.adminListPackages()
      .then((data) => { setItems(data); setErr(""); })
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const remove = async (id, title) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await api.adminDeletePackage(id);
      setItems((xs) => xs.filter((x) => x.id !== id));
    } catch (e) { alert(e.message); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-[var(--color-navy)]">Packages</h1>
          <p className="mt-1 text-sm text-gray-500">{items.length} packages in your catalogue.</p>
        </div>
        <Link to="/admin/packages/new" className="btn-primary">+ New Package</Link>
      </div>

      {err && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{err}</div>}
      {loading ? (
        <div className="text-sm text-gray-500">Loading…</div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-card)]">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-off-white)] text-left text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="p-4">Package</th>
                <th className="p-4 hidden md:table-cell">Destination</th>
                <th className="p-4">Price</th>
                <th className="p-4 hidden lg:table-cell">Duration</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((p) => (
                <tr key={p.id} className="hover:bg-[var(--color-pink-pale)]/30">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {p.coverImage && (
                        <img src={p.coverImage} alt="" className="h-12 w-16 rounded-lg object-cover" />
                      )}
                      <div>
                        <div className="font-semibold text-[var(--color-navy)]">{p.title}</div>
                        <div className="text-xs text-gray-500">{p.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell text-gray-700">{p.destinationName}</td>
                  <td className="p-4 font-semibold text-[var(--color-navy)]">
                    ₹{p.price.adult.toLocaleString("en-IN")}
                  </td>
                  <td className="p-4 hidden lg:table-cell text-gray-700">
                    {p.duration.nights}N/{p.duration.days}D
                  </td>
                  <td className="p-4">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      p.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                    }`}>
                      {p.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link to={`/admin/packages/${p.id}`} className="text-[var(--color-pink)] hover:underline">Edit</Link>
                    <span className="mx-2 text-gray-300">|</span>
                    <button onClick={() => remove(p.id, p.title)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={6} className="p-10 text-center text-gray-500">No packages yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
