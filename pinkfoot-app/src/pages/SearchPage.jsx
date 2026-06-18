import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDestinations, usePackages } from "../lib/useData.js";
import { filterOptions } from "../data/filters.js";
import PackageCard from "../components/PackageCard.jsx";
import { Icon, Search as SearchIcon, ChevronDown, Grid as GridIcon, List as ListIcon, Luggage, MapPin, Check } from "../components/icons/index.jsx";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTheme = searchParams.get("theme");
  const initialDest = searchParams.get("destination");

  const [filters, setFilters] = useState({
    budget: null,
    duration: null,
    themes: initialTheme ? [initialTheme] : [],
    rating: null,
    destinations: initialDest ? initialDest.split(",").filter(Boolean) : [],
  });
  const [sort, setSort] = useState("Popularity");
  const [viewMode, setViewMode] = useState("grid");
  const [query, setQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const PANEL_IDS = ["destination", "budget", "themes", "duration", "rating"];
  const [openPanels, setOpenPanels] = useState(() => new Set(PANEL_IDS));
  const [destDropdownOpen, setDestDropdownOpen] = useState(false);
  const [headerDestQuery, setHeaderDestQuery] = useState("");
  const [sidebarDestQuery, setSidebarDestQuery] = useState("");

  const togglePanel = (id) =>
    setOpenPanels((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const expandAll = () => setOpenPanels(new Set(PANEL_IDS));
  const collapseAll = () => setOpenPanels(new Set());
  const { data: packagesData, loading } = usePackages();
  const { data: destinationsData } = useDestinations();
  const packages = packagesData || [];
  const destinations = destinationsData || [];

  const filteredHeaderDests = useMemo(() => {
    let list = destinations;
    if (headerDestQuery) {
      const q = headerDestQuery.toLowerCase();
      list = destinations.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          (d.country && d.country.toLowerCase().includes(q)) ||
          (d.region && d.region.toLowerCase().includes(q))
      );
    }
    // Sort selected destinations to the top
    return [...list].sort((a, b) => {
      const aSel = filters.destinations.includes(a.slug);
      const bSel = filters.destinations.includes(b.slug);
      if (aSel && !bSel) return -1;
      if (!aSel && bSel) return 1;
      return 0;
    });
  }, [headerDestQuery, destinations, filters.destinations]);

  const filteredSidebarDests = useMemo(() => {
    let list = destinations;
    if (sidebarDestQuery) {
      const q = sidebarDestQuery.toLowerCase();
      list = destinations.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          (d.country && d.country.toLowerCase().includes(q)) ||
          (d.region && d.region.toLowerCase().includes(q))
      );
    }
    // Sort selected destinations to the top
    return [...list].sort((a, b) => {
      const aSel = filters.destinations.includes(a.slug);
      const bSel = filters.destinations.includes(b.slug);
      if (aSel && !bSel) return -1;
      if (!aSel && bSel) return 1;
      return 0;
    });
  }, [sidebarDestQuery, destinations, filters.destinations]);

  useEffect(() => {
    const next = new URLSearchParams();
    if (filters.themes.length) next.set("theme", filters.themes[0]);
    if (filters.destinations.length) next.set("destination", filters.destinations.join(","));
    setSearchParams(next, { replace: true });
  }, [filters, setSearchParams]);

  const filtered = useMemo(() => {
    let list = packages.filter((p) => {
      if (filters.destinations.length && !filters.destinations.includes(p.destination)) return false;
      if (filters.themes.length && !filters.themes.some((t) => p.theme.includes(t))) return false;
      if (filters.budget) {
        const b = filterOptions.budgetRanges.find((x) => x.label === filters.budget);
        if (!b || p.price.adult < b.min || p.price.adult > b.max) return false;
      }
      if (filters.duration) {
        const d = filterOptions.durations.find((x) => x.label === filters.duration);
        if (!d || p.duration.days < d.min || p.duration.days > d.max) return false;
      }
      if (filters.rating && p.rating < filters.rating) return false;
      if (
        query &&
        !p.title.toLowerCase().includes(query.toLowerCase()) &&
        !p.destinationName.toLowerCase().includes(query.toLowerCase())
      )
        return false;
      return true;
    });

    if (sort === "Price: Low to High") list = [...list].sort((a, b) => a.price.adult - b.price.adult);
    if (sort === "Price: High to Low") list = [...list].sort((a, b) => b.price.adult - a.price.adult);
    if (sort === "Rating") list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === "Duration") list = [...list].sort((a, b) => a.duration.days - b.duration.days);
    return list;
  }, [filters, sort, query, packages]);

  const activeFilterCount =
    (filters.budget ? 1 : 0) +
    (filters.duration ? 1 : 0) +
    filters.themes.length +
    (filters.rating ? 1 : 0) +
    filters.destinations.length;

  const clearAllFilters = () =>
    setFilters({ budget: null, duration: null, themes: [], rating: null, destinations: [] });

  return (
    <main className="min-h-screen bg-[var(--color-off-white)] pt-[72px] md:pt-[108px]">
      {/* Search header */}
      <section className="bg-[var(--color-navy)] pt-16 pb-10">
        <div className="container-page">
          <h1 className="font-display text-3xl font-bold text-white">
            Find Your Perfect Holiday
          </h1>
          <div className="mt-4 flex flex-col gap-2 md:flex-row">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Icon size={18}><SearchIcon /></Icon>
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search destinations, packages..."
                className="w-full rounded-full bg-white px-12 py-3.5 text-sm outline-none"
              />
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setDestDropdownOpen((prev) => !prev)}
                className="flex w-full md:w-auto items-center justify-between gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[var(--color-navy)] outline-none cursor-pointer shadow-sm hover:bg-gray-50 transition min-w-[200px]"
              >
                <span className="flex items-center gap-2">
                  <span className="text-gray-400">
                    <Icon size={16}><MapPin /></Icon>
                  </span>
                  <span>
                    {filters.destinations.length
                      ? `Destinations · ${filters.destinations.length}`
                      : "Add destination"}
                  </span>
                </span>
                <span className={`text-gray-400 transition-transform duration-200 ${destDropdownOpen ? "rotate-180" : ""}`}>
                  <Icon size={14}><ChevronDown /></Icon>
                </span>
              </button>

              <AnimatePresence>
                {destDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-20 cursor-default"
                      onClick={() => setDestDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full z-30 mt-2 w-full md:w-80 rounded-2xl border border-gray-100 bg-white p-4 shadow-[var(--shadow-heavy)] animate-in fade-in"
                    >
                      <div className="relative mb-3">
                        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                          <Icon size={14}><SearchIcon /></Icon>
                        </span>
                        <input
                          type="text"
                          value={headerDestQuery}
                          onChange={(e) => setHeaderDestQuery(e.target.value)}
                          placeholder="Search destinations..."
                          className="w-full rounded-xl border border-gray-200 pl-9 pr-3 py-2.5 text-sm focus:border-[var(--color-pink)] focus:outline-none focus:ring-1 focus:ring-[var(--color-pink)] transition text-left"
                          autoFocus
                        />
                      </div>
                      <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-50 bg-white max-h-64 overflow-y-auto [scrollbar-width:thin]">
                        {filteredHeaderDests.map((d) => {
                          const isSelected = filters.destinations.includes(d.slug);
                          return (
                            <div
                              key={d.id}
                              className={`flex items-center justify-between px-4 py-3 transition ${
                                isSelected ? "bg-rose-50/50" : "hover:bg-rose-50/20"
                              }`}
                            >
                              <div className="min-w-0 flex-1 pr-2 text-left">
                                <div className="text-sm font-semibold text-[var(--color-navy)] truncate">{d.name}</div>
                                <div className="text-xs text-gray-500 mt-0.5 truncate">
                                  {d.country} · {d.region}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setFilters((f) => ({
                                    ...f,
                                    destinations: isSelected
                                      ? f.destinations.filter((s) => s !== d.slug)
                                      : [...f.destinations, d.slug],
                                  }));
                                }}
                                className={`rounded-full px-3 py-1 text-xs font-bold transition flex-shrink-0 cursor-pointer ${
                                  isSelected
                                    ? "bg-rose-100 text-rose-700 hover:bg-rose-200"
                                    : "bg-rose-50 text-rose-600 hover:bg-rose-100"
                                }`}
                              >
                                {isSelected ? "Remove" : "Add"}
                              </button>
                            </div>
                          );
                        })}
                        {filteredHeaderDests.length === 0 && (
                          <div className="px-4 py-6 text-center text-sm text-gray-400">
                            No destinations found
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      <div className="container-page grid gap-6 py-6 lg:grid-cols-[280px_1fr]">
        {/* SIDEBAR */}
        <aside className={`${sidebarOpen ? "block" : "hidden"} lg:block`}>
          <div className="sticky top-[88px] flex max-h-[calc(100vh-104px)] flex-col rounded-2xl bg-white shadow-[var(--shadow-card)]">
            {/* Master accordion header (sticky inside scroll area) */}
            <button
              type="button"
              onClick={() => setFiltersOpen((v) => !v)}
              aria-expanded={filtersOpen}
              className="m-4 mb-0 flex flex-shrink-0 items-center justify-between rounded-xl p-2 text-left transition hover:bg-[var(--color-pink-pale)]/40"
            >
              <span className="flex items-center gap-2">
                <span className="font-display text-lg font-bold text-[var(--color-navy)]">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="rounded-full bg-[var(--color-pink)] px-2 py-0.5 text-xs font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className={`text-gray-400 transition-transform duration-200 ${filtersOpen ? "rotate-180" : ""}`}
                aria-hidden
              >
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <AnimatePresence initial={false}>
              {filtersOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="flex min-h-0 flex-1 flex-col overflow-hidden"
                >
                  <div className="mx-4 mt-3 mb-2 flex flex-shrink-0 items-center justify-between border-b border-gray-100 pb-3 px-2">
                    <div className="flex gap-3 text-[11px] font-semibold">
                      <button type="button" onClick={expandAll} className="text-gray-500 hover:text-[var(--color-navy)]">
                        Expand all
                      </button>
                      <span className="text-gray-300">·</span>
                      <button type="button" onClick={collapseAll} className="text-gray-500 hover:text-[var(--color-navy)]">
                        Collapse all
                      </button>
                    </div>
                    <button
                      onClick={clearAllFilters}
                      className="text-xs font-bold text-[var(--color-pink)] hover:underline"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4 [scrollbar-width:thin]">

            {/* Destination (multi-select search layout) */}
            <FilterGroup
              label="Destination"
              badge={filters.destinations.length}
              open={openPanels.has("destination")}
              onToggle={() => togglePanel("destination")}
            >
              <div className="relative mb-3">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Icon size={14}><SearchIcon /></Icon>
                </span>
                <input
                  type="text"
                  value={sidebarDestQuery}
                  onChange={(e) => setSidebarDestQuery(e.target.value)}
                  placeholder="Search destinations..."
                  className="w-full rounded-xl border border-gray-200 pl-8 pr-3 py-2 text-xs focus:border-[var(--color-pink)] focus:outline-none focus:ring-1 focus:ring-[var(--color-pink)] transition"
                />
              </div>

              <div className="border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-50 bg-white shadow-sm max-h-[320px] overflow-y-auto [scrollbar-width:thin]">
                {filteredSidebarDests.map((d) => {
                  const isSelected = filters.destinations.includes(d.slug);
                  return (
                    <div
                      key={d.id}
                      className={`flex items-center justify-between px-3 py-2.5 transition ${
                        isSelected ? "bg-rose-50/50" : "hover:bg-rose-50/20"
                      }`}
                    >
                      <div className="min-w-0 flex-1 pr-2 text-left">
                        <div className="text-xs font-semibold text-[var(--color-navy)] truncate">{d.name}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5 truncate">
                          {d.country} · {d.region}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFilters((f) => ({
                            ...f,
                            destinations: isSelected
                              ? f.destinations.filter((s) => s !== d.slug)
                              : [...f.destinations, d.slug],
                          }));
                        }}
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold transition flex-shrink-0 cursor-pointer ${
                          isSelected
                            ? "bg-rose-100 text-rose-700 hover:bg-rose-200"
                            : "bg-rose-50 text-rose-600 hover:bg-rose-100"
                        }`}
                      >
                        {isSelected ? "Remove" : "Add"}
                      </button>
                    </div>
                  );
                })}
                {filteredSidebarDests.length === 0 && (
                  <div className="px-3 py-4 text-center text-xs text-gray-400">
                    No destinations found
                  </div>
                )}
              </div>

              {filters.destinations.length > 0 && (
                <button
                  type="button"
                  onClick={() => setFilters((f) => ({ ...f, destinations: [] }))}
                  className="mt-3 text-[11px] font-semibold text-gray-500 hover:text-[var(--color-pink)]"
                >
                  Clear destinations
                </button>
              )}
            </FilterGroup>

            {/* Budget */}
            <FilterGroup
              label="Budget (Per Person)"
              badge={filters.budget ? 1 : 0}
              open={openPanels.has("budget")}
              onToggle={() => togglePanel("budget")}
            >
              {filterOptions.budgetRanges.map((b) => (
                <RadioRow
                  key={b.label}
                  label={b.label}
                  name="budget"
                  checked={filters.budget === b.label}
                  onChange={() =>
                    setFilters({ ...filters, budget: filters.budget === b.label ? null : b.label })
                  }
                />
              ))}
            </FilterGroup>

            {/* Themes */}
            <FilterGroup
              label="Holiday Theme"
              badge={filters.themes.length}
              open={openPanels.has("themes")}
              onToggle={() => togglePanel("themes")}
            >
              <div className="flex flex-wrap gap-2">
                {filterOptions.themes.map((t) => {
                  const on = filters.themes.includes(t);
                  return (
                    <button
                      key={t}
                      onClick={() =>
                        setFilters({
                          ...filters,
                          themes: on
                            ? filters.themes.filter((x) => x !== t)
                            : [...filters.themes, t],
                        })
                      }
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                        on
                          ? "border-[var(--color-pink)] bg-[var(--color-pink-pale)] text-[var(--color-pink)]"
                          : "border-gray-300 bg-white text-gray-700 hover:border-[var(--color-pink)]"
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </FilterGroup>

            {/* Duration */}
            <FilterGroup
              label="Duration"
              badge={filters.duration ? 1 : 0}
              open={openPanels.has("duration")}
              onToggle={() => togglePanel("duration")}
            >
              {filterOptions.durations.map((d) => (
                <RadioRow
                  key={d.label}
                  label={d.label}
                  name="duration"
                  checked={filters.duration === d.label}
                  onChange={() =>
                    setFilters({ ...filters, duration: filters.duration === d.label ? null : d.label })
                  }
                />
              ))}
            </FilterGroup>

            {/* Rating */}
            <FilterGroup
              label="Minimum Rating"
              badge={filters.rating ? 1 : 0}
              open={openPanels.has("rating")}
              onToggle={() => togglePanel("rating")}
              last
            >
              {filterOptions.ratings.map((r) => (
                <RadioRow
                  key={r}
                  label={`${"★".repeat(r)} & up`}
                  name="rating"
                  checked={filters.rating === r}
                  onChange={() =>
                    setFilters({ ...filters, rating: filters.rating === r ? null : r })
                  }
                />
              ))}
            </FilterGroup>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </aside>

        {/* RESULTS */}
        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-4 shadow-[var(--shadow-card)]">
            <div className="text-sm">
              <span className="font-bold text-[var(--color-navy)]">{filtered.length}</span>
              <span className="text-gray-500"> packages found</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setSidebarOpen((v) => !v)}
                className="rounded-full border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 lg:hidden"
              >
                {sidebarOpen ? "Hide" : "Show"} Filters
              </button>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Sort:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold outline-none"
                >
                  {filterOptions.sortOptions.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div className="flex overflow-hidden rounded-full border border-gray-300">
                {[
                  { mode: "grid", Icon: GridIcon, label: "Grid view" },
                  { mode: "list", Icon: ListIcon, label: "List view" },
                ].map((v) => (
                  <button
                    key={v.mode}
                    aria-label={v.label}
                    onClick={() => setViewMode(v.mode)}
                    className={`px-3 py-1.5 transition ${
                      viewMode === v.mode
                        ? "bg-[var(--color-pink)] text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={16} animateOnHover><v.Icon /></Icon>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-card)]">
                  <div className="shimmer h-52 w-full" />
                  <div className="space-y-3 p-5">
                    <div className="shimmer h-4 w-3/4 rounded" />
                    <div className="shimmer h-3 w-1/2 rounded" />
                    <div className="shimmer h-8 w-1/3 rounded mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl bg-white p-12 text-center shadow-[var(--shadow-card)]"
            >
              <div className="mx-auto inline-block text-[var(--color-pink)]">
                <Icon size={56} animateOnView><Luggage /></Icon>
              </div>
              <h3 className="mt-3 font-display text-xl font-bold text-[var(--color-navy)]">
                No packages match these filters
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Try removing a filter or widening your budget.
              </p>
              <button onClick={clearAllFilters} className="btn-primary mt-5">
                Reset Filters
              </button>
            </motion.div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
                  : "flex flex-col gap-4"
              }
            >
              {filtered.map((p, i) => (
                <PackageCard key={p.id} pkg={p} index={i} layout={viewMode} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function FilterGroup({ label, children, last, badge, open, onToggle }) {
  return (
    <div className={last ? "" : "mb-4 border-b border-gray-100 pb-4"}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-1 text-left"
      >
        <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[var(--color-navy)]">
          {label}
          {badge != null && badge > 0 && (
            <span className="rounded-full bg-[var(--color-pink)] px-1.5 py-0.5 text-[9px] font-bold text-white">
              {badge}
            </span>
          )}
        </span>
        <span
          className={`flex-shrink-0 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <Icon size={14}><ChevronDown /></Icon>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="pt-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RadioRow({ label, name, checked, onChange }) {
  return (
    <label className="mb-2 flex cursor-pointer items-center gap-2 last:mb-0">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="accent-[var(--color-pink)]"
      />
      <span className="text-[13px] text-gray-700">{label}</span>
    </label>
  );
}
