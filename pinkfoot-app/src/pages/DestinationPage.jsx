import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useDestination, usePackages } from "../lib/useData.js";
import { useSEO } from "../lib/useSEO.js";
import PackageCard from "../components/PackageCard.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import StarRating from "../components/StarRating.jsx";
import Carousel from "../components/Carousel.jsx";
import { Icon, MapPin, Calendar, Target } from "../components/icons/index.jsx";

export default function DestinationPage() {
  const { slug } = useParams();
  const { data: dest, loading } = useDestination(slug);
  const { data: allPackages } = usePackages({ destination: slug });
  const pkgs = (allPackages || []).filter((p) => p.destination === slug);

  useSEO(dest ? {
    title: `${dest.name} Tours & Holiday Packages | Pinkfoot Travel`,
    description: dest.description?.slice(0, 160)
      || `Explore ${dest.name} with handcrafted Pinkfoot holidays. From ₹${dest.startFrom.toLocaleString("en-IN")} · Best time: ${dest.bestMonths}.`,
    keywords: dest.regionKeywords,
    image: dest.heroImage,
  } : {});

  if (loading) {
    return <main className="container-page pt-32 pb-20 text-center text-gray-500">Loading destination…</main>;
  }
  if (!dest) {
    return (
      <main className="container-page pt-32 pb-20 text-center">
        <h1 className="font-display text-3xl text-[var(--color-navy)]">Destination not found</h1>
        <Link to="/destinations" className="btn-primary mt-6 inline-flex">
          Browse all destinations
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-[var(--color-off-white)]">
      {/* HERO */}
      <section className="relative h-[80vh] min-h-[520px] overflow-hidden">
        <img
          src={dest.heroImage}
          alt={dest.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-navy)]/40 via-transparent to-[var(--color-navy)]/85" />
        <div className="container-page absolute inset-x-0 bottom-16 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <span className="badge-pink">{dest.badge}</span>
            <h1 className="mt-4 font-display text-[clamp(48px,7vw,80px)] font-bold leading-[0.95]">
              {dest.name}
            </h1>
            <p className="mt-3 text-xl italic text-white/90">{dest.tagline}</p>
            <div className="mt-5 flex flex-wrap items-center gap-5 text-sm">
              <span className="flex items-center gap-1.5"><Icon size={14}><MapPin /></Icon>{dest.country}</span>
              <span className="flex items-center gap-1.5"><Icon size={14}><Calendar /></Icon>Best: {dest.bestMonths}</span>
              <StarRating rating={dest.rating} reviewCount={dest.reviewCount} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* About */}
      <section className="container-page -mt-20 relative z-10 mb-12">
        <div className="grid gap-0 overflow-hidden rounded-3xl bg-white shadow-[var(--shadow-heavy)] md:grid-cols-[1fr_1fr]">
          <div className="p-10">
            <span className="badge-soft">About {dest.name}</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-[var(--color-navy)]">
              Why travellers fall for {dest.name}
            </h2>
            <p className="mt-4 leading-relaxed text-gray-700">{dest.description}</p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <Stat label="Starting from" value={`₹${dest.startFrom.toLocaleString("en-IN")}`} />
              <Stat label="Rating" value={`★ ${dest.rating} (${dest.reviewCount.toLocaleString()})`} />
              <Stat
                label="Best time"
                value={
                  dest.travelSeason?.start && dest.travelSeason?.end
                    ? `${dest.travelSeason.start} – ${dest.travelSeason.end}`
                    : dest.bestMonths
                }
              />
              <Stat label={dest.regionType || "Region"} value={dest.region} />
            </div>
            {dest.activity && (
              <div className="mt-5 rounded-xl bg-[var(--color-pink-pale)]/50 p-4">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-pink)]">
                  <Icon size={12}><Target /></Icon> What you'll do
                </div>
                <div className="mt-1 text-sm text-gray-700">{dest.activity}</div>
              </div>
            )}
            <Link to={`/search?destination=${dest.slug}`} className="btn-primary mt-7 inline-flex">
              See all packages →
            </Link>
          </div>
          <div className="relative min-h-[380px]">
            <img
              src={dest.gallery?.[1] || dest.heroImage}
              alt={dest.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="container-page py-12">
        <SectionHeader
          eyebrow="Top Experiences"
          title={`What to do in ${dest.name}`}
          subtitle="The unmissable hits — bookmark these for your trip."
        />
        <Carousel itemClassName="w-[220px] sm:w-[260px] lg:w-[300px]" gap={16}>
          {dest.highlights.map((raw, i) => {
            const h = typeof raw === "string" ? { name: raw, image: "" } : raw;
            const img = h.image || dest.gallery?.[i % (dest.gallery?.length || 1)] || dest.heroImage;
            return (
              <motion.div
                key={`${h.name}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="group relative overflow-hidden rounded-2xl shadow-[var(--shadow-card)]"
              >
                <img
                  src={img}
                  alt={h.name}
                  className="h-44 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy)] via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-pink-light)]">
                    Top {i + 1}
                  </div>
                  <div className="font-display text-lg font-bold text-white">{h.name}</div>
                </div>
              </motion.div>
            );
          })}
        </Carousel>
      </section>

      {/* Gallery strip */}
      {dest.gallery?.length > 0 && (
        <section className="container-page pb-12">
          <div className="grid gap-2 sm:grid-cols-3">
            {dest.gallery.map((img, i) => (
              <motion.img
                key={i}
                src={img}
                alt=""
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="h-56 w-full rounded-2xl object-cover"
              />
            ))}
          </div>
        </section>
      )}

      {/* Packages */}
      <section className="bg-white py-16">
        <div className="container-page">
          <SectionHeader
            eyebrow="Curated Packages"
            title={`Pinkfoot picks for ${dest.name}`}
            subtitle="Carefully designed itineraries — pick one or ask us to tailor it."
          />
          {pkgs.length === 0 ? (
            <p className="text-center text-gray-500">
              New {dest.name} packages launching soon. Talk to a designer for a custom plan.
            </p>
          ) : (
            <Carousel itemClassName="w-[300px] sm:w-[340px] lg:w-[380px]" gap={24}>
              {pkgs.map((p, i) => (
                <PackageCard key={p.id} pkg={p} index={i} />
              ))}
            </Carousel>
          )}
        </div>
      </section>

      {/* Best time banner */}
      <section
        className="relative overflow-hidden py-16"
        style={{
          background:
            "linear-gradient(135deg, #1B2A4A 0%, #2D4272 100%)",
        }}
      >
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[var(--color-pink)]/25 blur-3xl" />
        <div className="container-page relative grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
          <div className="text-white">
            <span className="badge-pink inline-flex items-center gap-1.5">
              <Icon size={12}><Calendar /></Icon> Best Season
            </span>
            <h2 className="mt-3 font-display text-4xl font-bold">
              Visit {dest.name} between{" "}
              {dest.travelSeason?.start && dest.travelSeason?.end
                ? `${dest.travelSeason.start} – ${dest.travelSeason.end}`
                : dest.bestMonths}
            </h2>
            <p className="mt-3 max-w-lg text-white/75">
              That's when the weather, prices, and crowds all align — our designers know exactly which week to pick for your travel style.
            </p>
            {dest.salesSeason?.start && dest.salesSeason?.end && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--color-pink)]/20 px-4 py-1.5 text-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-pink)] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-pink)]" />
                </span>
                <span className="text-white">
                  Booking window: <b>{dest.salesSeason.start} – {dest.salesSeason.end}</b>
                </span>
              </div>
            )}
            <Link to={`/search?destination=${dest.slug}`} className="btn-primary mt-5 inline-flex">
              Plan my trip
            </Link>
          </div>
          <div className="flex flex-wrap justify-end gap-3">
            {dest.themes.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-[var(--color-off-white)] p-3">
      <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
        {label}
      </div>
      <div className="mt-0.5 font-display text-sm font-bold text-[var(--color-navy)]">
        {value}
      </div>
    </div>
  );
}
