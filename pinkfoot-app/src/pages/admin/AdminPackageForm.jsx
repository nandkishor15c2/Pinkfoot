import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "../../lib/api.js";
import ImageUpload from "../../components/ImageUpload.jsx";

const THEMES = ["Honeymoon", "Family", "Adventure", "Luxury", "Beach", "Culture", "Shopping"];
const BADGES = ["", "Best Seller", "Premium", "Hot Deal", "Family Favourite", "Family Pick", "Weekend Deal"];

const EMPTY = {
  title: "",
  slug: "",
  destination: "",
  destinationName: "",
  theme: [],
  tags: [],
  nights: 5,
  days: 6,
  priceAdult: 0,
  priceChild: 0,
  originalPrice: 0,
  discount: 0,
  rating: 4.5,
  reviewCount: 0,
  badge: "",
  description: "",
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  inclusions: [],
  exclusions: [],
  highlights: [],
  itinerary: [],
  hotels: [],
  transfers: [],
  paymentPolicy: { name: "", terms: "" },
  published: true,
};

export default function AdminPackageForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [destinations, setDestinations] = useState([]);
  const [coverFile, setCoverFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [existingCover, setExistingCover] = useState("");
  const [existingGallery, setExistingGallery] = useState([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    api.adminListDestinations().then(setDestinations).catch(() => {});
    if (isEdit) {
      api.adminListPackages().then((items) => {
        const p = items.find((x) => x.id === id);
        if (!p) return;
        setForm({
          title: p.title,
          slug: p.slug,
          destination: p.destination,
          destinationName: p.destinationName,
          theme: p.theme,
          tags: p.tags || [],
          nights: p.duration.nights,
          days: p.duration.days,
          priceAdult: p.price.adult,
          priceChild: p.price.child,
          originalPrice: p.originalPrice || 0,
          discount: p.discount || 0,
          rating: p.rating,
          reviewCount: p.reviewCount,
          badge: p.badge || "",
          description: p.description || "",
          metaTitle: p.metaTitle || "",
          metaDescription: p.metaDescription || "",
          metaKeywords: p.metaKeywords || "",
          inclusions: p.inclusions || [],
          exclusions: p.exclusions || [],
          highlights: p.highlights || [],
          itinerary: p.itinerary || [],
          hotels: p.hotels || [],
          transfers: p.transfers || [],
          paymentPolicy: p.paymentPolicy || { name: "", terms: "" },
          published: p.published,
        });
        setExistingCover(p.coverImage || "");
        setExistingGallery(p.gallery || []);
      });
    }
  }, [id, isEdit]);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleTheme = (t) =>
    update("theme", form.theme.includes(t) ? form.theme.filter((x) => x !== t) : [...form.theme, t]);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const fd = new FormData();
      const setMap = {
        title: form.title,
        slug: form.slug,
        destination: form.destination,
        destinationName: form.destinationName,
        nights: String(form.nights),
        days: String(form.days),
        priceAdult: String(form.priceAdult),
        priceChild: String(form.priceChild),
        originalPrice: String(form.originalPrice),
        discount: String(form.discount),
        rating: String(form.rating),
        reviewCount: String(form.reviewCount),
        badge: form.badge,
        published: String(form.published),
        theme: JSON.stringify(form.theme),
        tags: JSON.stringify(form.tags.filter(Boolean)),
        description: form.description,
        metaTitle: form.metaTitle,
        metaDescription: form.metaDescription,
        metaKeywords: form.metaKeywords,
        inclusions: JSON.stringify(form.inclusions.filter(Boolean)),
        exclusions: JSON.stringify(form.exclusions.filter(Boolean)),
        highlights: JSON.stringify(form.highlights.filter(Boolean)),
        itinerary: JSON.stringify(form.itinerary.filter((d) => d.title)),
        hotels: JSON.stringify(form.hotels.filter((h) => h.name)),
        transfers: JSON.stringify(form.transfers.filter((t) => t.title)),
        paymentPolicy: form.paymentPolicy?.terms
          ? JSON.stringify(form.paymentPolicy)
          : "",
        galleryUrls: JSON.stringify(existingGallery),
      };
      Object.entries(setMap).forEach(([k, v]) => fd.append(k, v));
      if (coverFile) fd.append("coverImage", coverFile);
      else if (existingCover) fd.append("coverImage", existingCover);
      galleryFiles.forEach((f) => fd.append("gallery", f));

      if (isEdit) await api.adminUpdatePackage(id, fd);
      else await api.adminCreatePackage(fd);
      navigate("/admin/packages");
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  const importJSON = () => {
    const raw = window.prompt(
      "Paste a Product JSON (the schema used in the project brief):"
    );
    if (!raw) return;
    let j;
    try {
      j = JSON.parse(raw);
    } catch {
      alert("That's not valid JSON.");
      return;
    }
    const region = j.Region || {};
    const next = {
      ...form,
      title: j["Product Name"] || form.title,
      slug: form.slug,
      description: j["Product Description"] || form.description,
      metaKeywords: j["Meta Keywords"] || form.metaKeywords,
      metaTitle: j["Meta Title"] || form.metaTitle,
      metaDescription: j["Meta Description"] || form.metaDescription,
      tags: Array.isArray(j.Tags) ? j.Tags : form.tags,
      priceAdult: typeof j["List Price"] === "number" ? j["List Price"] : form.priceAdult,
      highlights: Array.isArray(j.Highlights) ? j.Highlights : form.highlights,
      inclusions: typeof j.Inclusions === "string"
        ? Array.from(j.Inclusions.matchAll(/<li>(.*?)<\/li>/g), (m) => m[1].trim())
        : form.inclusions,
      exclusions: typeof j.exclusions === "string"
        ? Array.from(j.exclusions.matchAll(/<li>(.*?)<\/li>/g), (m) => m[1].trim())
        : form.exclusions,
      itinerary: Array.isArray(j.Itinerary)
        ? j.Itinerary.map((d) => ({
            day: d.Day,
            title: d.Title,
            description: d.Description,
            location: d.Location,
            meals: d.Meals,
            transferSharing: d["Transfer Sharing"],
            hotels: d.Hotels || [],
          }))
        : form.itinerary,
      hotels: Array.isArray(region.Hotels)
        ? region.Hotels.map((h) => ({
            id: h["Hotel ID"],
            name: h["Hotel Name"],
            address: h.Address,
            contactNumber: h["Contact Number"],
            contactEmail: h["Contact Email"],
            mapUrl: h["Google Map URL"],
            starCategory: h["Star Category"],
            propertyType: h["Property Type"],
          }))
        : form.hotels,
      transfers: Array.isArray(region.Transfers)
        ? region.Transfers.map((t) => ({
            id: t["Transfer ID"],
            title: t.Title,
            vehicle: t.Vehicle,
            occupancy: t.Occupency ?? t.Occupancy,
          }))
        : form.transfers,
      paymentPolicy: j["Payment Policy"]
        ? {
            name: j["Payment Policy"].Name,
            terms: j["Payment Policy"].terms,
          }
        : form.paymentPolicy,
    };
    setForm(next);
    alert(`Imported "${next.title}". Review the fields and save.`);
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-[var(--color-navy)]">
            {isEdit ? "Edit package" : "New package"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Upload images locally — they'll be saved to <code>pinkfoot-api/uploads/</code>.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={importJSON}
            className="rounded-full border border-[var(--color-pink)] px-4 py-2 text-xs font-bold text-[var(--color-pink)] hover:bg-[var(--color-pink)] hover:text-white"
          >
            📥 Import JSON
          </button>
          <Link to="/admin/packages" className="text-sm font-semibold text-gray-500 hover:text-[var(--color-pink)]">
            ← Cancel
          </Link>
        </div>
      </div>

      {err && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{err}</div>}

      <Card title="Basics">
        <Grid>
          <Field label="Title" required>
            <input
              required
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Slug (URL)">
            <input
              value={form.slug}
              onChange={(e) => update("slug", e.target.value)}
              placeholder="auto from title"
              className="input"
            />
          </Field>
          <Field label="Destination" required>
            <select
              required
              value={form.destination}
              onChange={(e) => {
                const d = destinations.find((x) => x.slug === e.target.value);
                update("destination", e.target.value);
                if (d) update("destinationName", d.name);
              }}
              className="input"
            >
              <option value="">Select destination</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.slug}>{d.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Badge">
            <select value={form.badge} onChange={(e) => update("badge", e.target.value)} className="input">
              {BADGES.map((b) => <option key={b} value={b}>{b || "— none —"}</option>)}
            </select>
          </Field>
        </Grid>

        <Field label="Themes" className="mt-4">
          <div className="flex flex-wrap gap-2">
            {THEMES.map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => toggleTheme(t)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  form.theme.includes(t)
                    ? "border-[var(--color-pink)] bg-[var(--color-pink-pale)] text-[var(--color-pink)]"
                    : "border-gray-300 text-gray-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </Field>
      </Card>

      <Card title="Pricing & duration">
        <Grid>
          <Field label="Nights"><input type="number" min="0" value={form.nights} onChange={(e) => update("nights", +e.target.value)} className="input" /></Field>
          <Field label="Days"><input type="number" min="1" value={form.days} onChange={(e) => update("days", +e.target.value)} className="input" /></Field>
          <Field label="Adult price (₹)" required><input required type="number" min="0" value={form.priceAdult} onChange={(e) => update("priceAdult", +e.target.value)} className="input" /></Field>
          <Field label="Child price (₹)"><input type="number" min="0" value={form.priceChild} onChange={(e) => update("priceChild", +e.target.value)} className="input" /></Field>
          <Field label="Original price (₹)"><input type="number" min="0" value={form.originalPrice} onChange={(e) => update("originalPrice", +e.target.value)} className="input" /></Field>
          <Field label="Discount (%)"><input type="number" min="0" max="100" value={form.discount} onChange={(e) => update("discount", +e.target.value)} className="input" /></Field>
          <Field label="Rating"><input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(e) => update("rating", +e.target.value)} className="input" /></Field>
          <Field label="Review count"><input type="number" min="0" value={form.reviewCount} onChange={(e) => update("reviewCount", +e.target.value)} className="input" /></Field>
        </Grid>
      </Card>

      <Card title="Images">
        <Field label="Cover image">
          <ImageUpload
            existing={existingCover || null}
            files={coverFile ? [coverFile] : []}
            onFilesChange={(fs) => {
              setCoverFile(fs[0] || null);
              if (fs[0]) setExistingCover("");
            }}
            onRemoveExisting={() => setExistingCover("")}
          />
        </Field>
        <Field label="Gallery" className="mt-5">
          <ImageUpload
            multiple
            existing={existingGallery}
            files={galleryFiles}
            onFilesChange={setGalleryFiles}
            onRemoveExisting={(i) =>
              setExistingGallery((g) => g.filter((_, idx) => idx !== i))
            }
            helper="Drag in multiple images. JPG/PNG/WEBP up to 8 MB each."
          />
        </Field>
      </Card>

      <Card title="Long description">
        <Field label="Description (HTML allowed)">
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={6}
            className="input"
            placeholder="<p>Embark on a magnificent 7-day journey…</p>"
          />
          <div className="mt-1 text-[11px] text-gray-500">
            Plain text works too. Renders above the tabs on the product page.
          </div>
        </Field>
        <ChipList
          label="Tags (free-form, beyond themes)"
          value={form.tags}
          onChange={(v) => update("tags", v)}
          placeholder="e.g., Multi-City, North India, Desert"
          className="mt-4"
        />
      </Card>

      <Card title="Content">
        <ChipList
          label="Inclusions"
          value={form.inclusions}
          onChange={(v) => update("inclusions", v)}
          placeholder="e.g., 5★ Hotel, Flights, Breakfast"
        />
        <ChipList
          label="Exclusions"
          value={form.exclusions}
          onChange={(v) => update("exclusions", v)}
          placeholder="e.g., Visa, Insurance"
          className="mt-4"
        />
        <ChipList
          label="Highlights"
          value={form.highlights}
          onChange={(v) => update("highlights", v)}
          placeholder="e.g., Sunset cruise"
          className="mt-4"
        />
      </Card>

      <Card title="Hotels (Where you'll stay)">
        <ol className="space-y-3">
          {form.hotels.map((h, i) => (
            <li key={i} className="rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Hotel {i + 1}</span>
                <button
                  type="button"
                  onClick={() => update("hotels", form.hotels.filter((_, idx) => idx !== i))}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <input
                  value={h.name || ""}
                  onChange={(e) => {
                    const next = [...form.hotels];
                    next[i] = { ...next[i], name: e.target.value };
                    update("hotels", next);
                  }}
                  placeholder="Hotel name"
                  className="input"
                />
                <input
                  value={h.propertyType || ""}
                  onChange={(e) => {
                    const next = [...form.hotels];
                    next[i] = { ...next[i], propertyType: e.target.value };
                    update("hotels", next);
                  }}
                  placeholder="Property type (e.g., Heritage Hotel)"
                  className="input"
                />
                <input
                  value={h.address || ""}
                  onChange={(e) => {
                    const next = [...form.hotels];
                    next[i] = { ...next[i], address: e.target.value };
                    update("hotels", next);
                  }}
                  placeholder="Address"
                  className="input sm:col-span-2"
                />
                <input
                  value={h.contactNumber || ""}
                  onChange={(e) => {
                    const next = [...form.hotels];
                    next[i] = { ...next[i], contactNumber: e.target.value };
                    update("hotels", next);
                  }}
                  placeholder="Contact number"
                  className="input"
                />
                <input
                  value={h.contactEmail || ""}
                  onChange={(e) => {
                    const next = [...form.hotels];
                    next[i] = { ...next[i], contactEmail: e.target.value };
                    update("hotels", next);
                  }}
                  placeholder="Contact email"
                  className="input"
                />
                <input
                  value={h.mapUrl || ""}
                  onChange={(e) => {
                    const next = [...form.hotels];
                    next[i] = { ...next[i], mapUrl: e.target.value };
                    update("hotels", next);
                  }}
                  placeholder="Google Maps URL"
                  className="input sm:col-span-2"
                />
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={h.starCategory || ""}
                  onChange={(e) => {
                    const next = [...form.hotels];
                    next[i] = { ...next[i], starCategory: +e.target.value };
                    update("hotels", next);
                  }}
                  placeholder="Star (1-5)"
                  className="input"
                />
              </div>
            </li>
          ))}
        </ol>
        <button
          type="button"
          onClick={() => update("hotels", [...form.hotels, { name: "", propertyType: "", starCategory: 4 }])}
          className="mt-3 rounded-full border border-dashed border-[var(--color-pink)] px-4 py-2 text-xs font-bold text-[var(--color-pink)]"
        >
          + Add hotel
        </button>
      </Card>

      <Card title="Transfers">
        <ol className="space-y-3">
          {form.transfers.map((t, i) => (
            <li key={i} className="rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Transfer {i + 1}</span>
                <button
                  type="button"
                  onClick={() => update("transfers", form.transfers.filter((_, idx) => idx !== i))}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                <input
                  value={t.title || ""}
                  onChange={(e) => {
                    const next = [...form.transfers];
                    next[i] = { ...next[i], title: e.target.value };
                    update("transfers", next);
                  }}
                  placeholder="Title (e.g., Jaipur to Jodhpur)"
                  className="input sm:col-span-2"
                />
                <input
                  type="number"
                  min="1"
                  value={t.occupancy || ""}
                  onChange={(e) => {
                    const next = [...form.transfers];
                    next[i] = { ...next[i], occupancy: +e.target.value };
                    update("transfers", next);
                  }}
                  placeholder="Occupancy"
                  className="input"
                />
                <input
                  value={t.vehicle || ""}
                  onChange={(e) => {
                    const next = [...form.transfers];
                    next[i] = { ...next[i], vehicle: e.target.value };
                    update("transfers", next);
                  }}
                  placeholder="Vehicle (e.g., Toyota Innova Crysta)"
                  className="input sm:col-span-3"
                />
              </div>
            </li>
          ))}
        </ol>
        <button
          type="button"
          onClick={() => update("transfers", [...form.transfers, { title: "", vehicle: "", occupancy: 4 }])}
          className="mt-3 rounded-full border border-dashed border-[var(--color-pink)] px-4 py-2 text-xs font-bold text-[var(--color-pink)]"
        >
          + Add transfer
        </button>
      </Card>

      <Card title="Payment & Cancellation Policy">
        <Grid>
          <Field label="Policy name">
            <input
              value={form.paymentPolicy?.name || ""}
              onChange={(e) =>
                update("paymentPolicy", { ...form.paymentPolicy, name: e.target.value })
              }
              placeholder="e.g., Standard Installment Plan"
              className="input"
            />
          </Field>
        </Grid>
        <Field label="Terms" className="mt-3">
          <textarea
            rows={4}
            value={form.paymentPolicy?.terms || ""}
            onChange={(e) =>
              update("paymentPolicy", { ...form.paymentPolicy, terms: e.target.value })
            }
            placeholder="30% at booking, 40% 60 days before departure…"
            className="input"
          />
        </Field>
      </Card>

      <Card title="SEO meta">
        <Field label="Meta title">
          <input
            value={form.metaTitle}
            onChange={(e) => update("metaTitle", e.target.value)}
            placeholder="Royal Rajasthan Heritage Tour — 7N/8D | Pinkfoot"
            className="input"
          />
        </Field>
        <Field label="Meta description" className="mt-3">
          <textarea
            rows={2}
            value={form.metaDescription}
            onChange={(e) => update("metaDescription", e.target.value)}
            placeholder="One-paragraph snippet shown in Google search results."
            className="input"
          />
        </Field>
        <Field label="Meta keywords" className="mt-3">
          <input
            value={form.metaKeywords}
            onChange={(e) => update("metaKeywords", e.target.value)}
            placeholder="comma, separated, keywords"
            className="input"
          />
        </Field>
      </Card>

      <Card title="Itinerary">
        <ol className="space-y-3">
          {form.itinerary.map((d, i) => (
            <li key={i} className="rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Day {d.day}</span>
                <button
                  type="button"
                  onClick={() => update("itinerary", form.itinerary.filter((_, idx) => idx !== i).map((x, idx) => ({ ...x, day: idx + 1 })))}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
              <input
                value={d.title}
                onChange={(e) => {
                  const next = [...form.itinerary];
                  next[i] = { ...next[i], title: e.target.value };
                  update("itinerary", next);
                }}
                placeholder="Day title"
                className="input mt-2"
              />
              <textarea
                rows={2}
                value={d.description}
                onChange={(e) => {
                  const next = [...form.itinerary];
                  next[i] = { ...next[i], description: e.target.value };
                  update("itinerary", next);
                }}
                placeholder="Day description"
                className="input mt-2"
              />
            </li>
          ))}
        </ol>
        <button
          type="button"
          onClick={() =>
            update("itinerary", [
              ...form.itinerary,
              { day: form.itinerary.length + 1, title: "", description: "" },
            ])
          }
          className="mt-3 rounded-full border border-dashed border-[var(--color-pink)] px-4 py-2 text-xs font-bold text-[var(--color-pink)]"
        >
          + Add day
        </button>
      </Card>

      <Card title="Visibility">
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => update("published", e.target.checked)}
            className="h-5 w-5 accent-[var(--color-pink)]"
          />
          Published (visible on public site)
        </label>
      </Card>

      <div className="sticky bottom-4 z-10 flex justify-end gap-3 rounded-2xl bg-white p-4 shadow-[var(--shadow-heavy)]">
        <Link to="/admin/packages" className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700">
          Cancel
        </Link>
        <button type="submit" disabled={busy} className="btn-primary disabled:opacity-60">
          {busy ? "Saving…" : isEdit ? "Save changes" : "Create package"}
        </button>
      </div>

      <style>{`.input{width:100%;border-radius:.75rem;border:1px solid #d1d5db;background:#fff;padding:.55rem .75rem;font-size:.875rem;outline:none}.input:focus{border-color:var(--color-pink)}`}</style>
    </form>
  );
}

function Card({ title, children }) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-[var(--shadow-card)]">
      <h2 className="mb-4 font-display text-lg font-bold text-[var(--color-navy)]">{title}</h2>
      {children}
    </section>
  );
}

function Grid({ children }) {
  return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

function Field({ label, required, className = "", children }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-gray-600">
        {label} {required && <span className="text-[var(--color-pink)]">*</span>}
      </span>
      {children}
    </label>
  );
}

function ChipList({ label, value, onChange, placeholder, className = "" }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    if (!draft.trim()) return;
    onChange([...value, draft.trim()]);
    setDraft("");
  };
  return (
    <Field label={label} className={className}>
      <div className="mb-2 flex flex-wrap gap-1.5">
        {value.map((v, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 rounded-full bg-[var(--color-pink-pale)] px-2.5 py-1 text-xs font-semibold text-[var(--color-pink)]"
          >
            {v}
            <button
              type="button"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              className="text-[var(--color-pink)]"
            >×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className="input"
        />
        <button
          type="button"
          onClick={add}
          className="rounded-full bg-[var(--color-navy)] px-4 py-2 text-xs font-bold text-white"
        >
          Add
        </button>
      </div>
    </Field>
  );
}
