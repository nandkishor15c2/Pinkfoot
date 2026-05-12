import { useState } from "react";

// ============================================================
// PINKFOOT TRAVEL — DESIGN SYSTEM & DATA SCHEMAS
// ============================================================

// ── BRAND TOKENS ─────────────────────────────────────────────
const TOKENS = {
  colors: {
    pink:        "#E85478",   // Primary brand pink (from logo)
    pinkLight:   "#F9768F",   // Lighter pink for hover
    pinkPale:    "#FEF0F3",   // Background tints
    pinkMid:     "#F2C0CC",   // Borders, dividers
    navy:        "#1B2A4A",   // Primary text & secondary brand color
    navyMid:     "#2D4272",   // Secondary navy
    navyLight:   "#E8EDF6",   // Navy-tinted backgrounds
    white:       "#FFFFFF",
    offWhite:    "#F8F9FC",
    gray100:     "#F3F4F6",
    gray300:     "#D1D5DB",
    gray500:     "#6B7280",
    gray700:     "#374151",
    gold:        "#F59E0B",   // Star ratings
    green:       "#10B981",   // Badges / success
  },
  fonts: {
    display: "'Playfair Display', Georgia, serif",
    body:    "'DM Sans', system-ui, sans-serif",
  },
  radius: { sm: "6px", md: "12px", lg: "20px", xl: "32px", full: "9999px" },
  shadow: {
    card:  "0 4px 24px rgba(27,42,74,0.09)",
    hover: "0 12px 40px rgba(232,84,120,0.18)",
    heavy: "0 24px 60px rgba(27,42,74,0.16)",
  },
};

// ── DATA SCHEMAS ──────────────────────────────────────────────

/** @schema Destination */
const destinations = [
  { id: "bali",        slug: "bali",        name: "Bali",         country: "Indonesia",   region: "Asia",    heroImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80", tagline: "Island of the Gods", badge: "🔥 Trending", startFrom: 34999, rating: 4.8, reviewCount: 2140, bestMonths: "Apr–Oct", currency: "IDR", themes: ["Beach","Culture","Adventure"], highlights: ["Ubud Rice Terraces","Tanah Lot Temple","Seminyak Beach","Mount Batur Sunrise"] },
  { id: "maldives",    slug: "maldives",    name: "Maldives",     country: "Maldives",    region: "Asia",    heroImage: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80", tagline: "Where Heaven Touches Earth", badge: "💎 Luxury", startFrom: 79999, rating: 4.9, reviewCount: 1870, bestMonths: "Nov–Apr", currency: "MVR", themes: ["Beach","Honeymoon","Luxury"], highlights: ["Overwater Villas","Coral Reefs","Sunset Cruises","Dolphin Watching"] },
  { id: "thailand",    slug: "thailand",    name: "Thailand",     country: "Thailand",    region: "Asia",    heroImage: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80", tagline: "Land of Smiles", badge: "🌟 Popular", startFrom: 24999, rating: 4.7, reviewCount: 3210, bestMonths: "Nov–Feb", currency: "THB", themes: ["Culture","Beach","Adventure","Family"], highlights: ["Grand Palace Bangkok","Phi Phi Islands","Chiang Mai Temples","Floating Markets"] },
  { id: "dubai",       slug: "dubai",       name: "Dubai",        country: "UAE",          region: "Middle East", heroImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80", tagline: "City of the Future", badge: "✨ Luxury", startFrom: 44999, rating: 4.8, reviewCount: 1650, bestMonths: "Oct–Apr", currency: "AED", themes: ["Luxury","Adventure","Shopping","Family"], highlights: ["Burj Khalifa","Desert Safari","Dubai Mall","Palm Jumeirah"] },
  { id: "europe",      slug: "europe",      name: "Europe",       country: "Multi-Country", region: "Europe", heroImage: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80", tagline: "Where Every Street is History", badge: "🗺 Explorer", startFrom: 89999, rating: 4.7, reviewCount: 980, bestMonths: "May–Sep", currency: "EUR", themes: ["Culture","Adventure","Honeymoon"], highlights: ["Eiffel Tower","Colosseum","Swiss Alps","Barcelona"] },
  { id: "singapore",   slug: "singapore",   name: "Singapore",    country: "Singapore",   region: "Asia",    heroImage: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80", tagline: "The Lion City", badge: "👨‍👩‍👧 Family", startFrom: 39999, rating: 4.6, reviewCount: 1420, bestMonths: "Feb–Apr", currency: "SGD", themes: ["Family","Culture","Shopping"], highlights: ["Gardens by the Bay","Universal Studios","Sentosa","Marina Bay Sands"] },
];

/** @schema Package */
const packages = [
  { id: "pkg-001", title: "Bali Bliss — 6N/7D", destination: "bali", destinationName: "Bali", theme: ["Honeymoon","Beach"], duration: { nights: 6, days: 7 }, price: { adult: 42999, child: 28999, currency: "INR", perPerson: true }, originalPrice: 55000, discount: 22, rating: 4.8, reviewCount: 312, coverImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80", inclusions: ["4★ Hotel","Flights","Breakfast","Airport Transfer","Guided Tours"], exclusions: ["Visa Fees","Travel Insurance","Personal Expenses"], highlights: ["Ubud Cultural Walk","Tegallalang Sunrise","Seminyak Beach Day","Tanah Lot Sunset"], badge: "Best Seller", itinerary: [ { day: 1, title: "Arrival in Bali", description: "Airport pickup, check-in at resort, evening at leisure." }, { day: 2, title: "Ubud Cultural Tour", description: "Monkey Forest, Tegallalang Rice Terrace, local art villages." }, { day: 3, title: "Water Temple & Kintamani", description: "Mount Batur views, Tirta Empul holy spring." }, { day: 4, title: "Beach Day at Seminyak", description: "Relax on the beach, sunset at Ku De Ta." }, { day: 5, title: "Tanah Lot & Spa", description: "Iconic sea temple visit, traditional Balinese massage." }, { day: 6, title: "Adventure Day", description: "White water rafting on Ayung River, ATV ride option." }, { day: 7, title: "Departure", description: "Breakfast, checkout, airport transfer." } ] },
  { id: "pkg-002", title: "Maldives Luxury — 5N/6D", destination: "maldives", destinationName: "Maldives", theme: ["Honeymoon","Luxury","Beach"], duration: { nights: 5, days: 6 }, price: { adult: 89999, child: 59999, currency: "INR", perPerson: true }, originalPrice: 110000, discount: 18, rating: 4.9, reviewCount: 210, coverImage: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80", inclusions: ["5★ Overwater Villa","Flights","All Meals","Snorkeling","Speed Boat Transfer"], exclusions: ["Visa on Arrival Fee","Scuba Diving","Spa Treatments"], highlights: ["Private Villa with Pool","Coral Reef Snorkeling","Sunset Cruise","Dolphin Safari"], badge: "Premium", itinerary: [] },
  { id: "pkg-003", title: "Thailand Explorer — 7N/8D", destination: "thailand", destinationName: "Thailand", theme: ["Family","Culture","Adventure"], duration: { nights: 7, days: 8 }, price: { adult: 32999, child: 19999, currency: "INR", perPerson: true }, originalPrice: 42000, discount: 21, rating: 4.7, reviewCount: 480, coverImage: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80", inclusions: ["4★ Hotels","Flights","Breakfast","City Tours","Airport Transfers"], exclusions: ["Visa Fees","Dinner","Personal Shopping"], highlights: ["Bangkok Grand Palace","Phi Phi Island Day Trip","Chiang Mai Night Bazaar","Elephant Sanctuary"], badge: "Family Favourite", itinerary: [] },
  { id: "pkg-004", title: "Dubai Glam — 4N/5D", destination: "dubai", destinationName: "Dubai", theme: ["Luxury","Adventure","Shopping"], duration: { nights: 4, days: 5 }, price: { adult: 54999, child: 34999, currency: "INR", perPerson: true }, originalPrice: 68000, discount: 19, rating: 4.8, reviewCount: 267, coverImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80", inclusions: ["5★ Hotel","Flights","Breakfast","Burj Khalifa Ticket","Desert Safari"], exclusions: ["Visa Fees","Lunch & Dinner","Shopping"], highlights: ["Burj Khalifa 124th Floor","Desert Safari with BBQ","Dubai Creek Dhow Cruise","Dubai Mall & Fountain Show"], badge: "Hot Deal", itinerary: [] },
  { id: "pkg-005", title: "Europe Grand Tour — 12N/13D", destination: "europe", destinationName: "Europe", theme: ["Honeymoon","Culture","Adventure"], duration: { nights: 12, days: 13 }, price: { adult: 119999, child: 79999, currency: "INR", perPerson: true }, originalPrice: 145000, discount: 17, rating: 4.8, reviewCount: 145, coverImage: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&q=80", inclusions: ["4★ Hotels","Flights","Daily Breakfast","Intercity Train Passes","Guided City Tours"], exclusions: ["Visa Fees","Some Dinners","Museum Entry Fees"], highlights: ["Eiffel Tower Night View","Vatican & Colosseum","Swiss Jungfraujoch","Barcelona Sagrada Familia"], badge: "Premium", itinerary: [] },
  { id: "pkg-006", title: "Singapore Family Fun — 5N/6D", destination: "singapore", destinationName: "Singapore", theme: ["Family","Shopping","Culture"], duration: { nights: 5, days: 6 }, price: { adult: 49999, child: 31999, currency: "INR", perPerson: true }, originalPrice: 62000, discount: 19, rating: 4.6, reviewCount: 198, coverImage: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&q=80", inclusions: ["4★ Hotel","Flights","Breakfast","Universal Studios Tickets","Gardens by the Bay"], exclusions: ["Visa Fees","Lunch & Dinner","Extra Rides"], highlights: ["Universal Studios","Sentosa Island","Gardens by the Bay","Night Safari"], badge: "Family Pick", itinerary: [] },
];

/** @schema Review */
const reviews = [
  { id: "rev-001", name: "Priya Sharma", location: "Mumbai", avatar: "PS", rating: 5, package: "Bali Bliss", comment: "Absolutely magical! Pinkfoot Travel handled everything seamlessly. Our Bali honeymoon was beyond expectations. The overwater villa they arranged was stunning!", date: "March 2025" },
  { id: "rev-002", name: "Rahul & Sneha", location: "Delhi", avatar: "RS", rating: 5, package: "Maldives Luxury", comment: "The Maldives package was worth every rupee. Pinkfoot's team was available 24/7 and the hotel was exactly as promised. Will definitely book again!", date: "February 2025" },
  { id: "rev-003", name: "Amit Patel", location: "Ahmedabad", avatar: "AP", rating: 4, package: "Thailand Explorer", comment: "Great value for money. The family tour to Thailand was perfectly planned. Kids loved the Elephant Sanctuary and the Phi Phi island trip.", date: "January 2025" },
];

/** @schema FilterOptions */
const filterOptions = {
  budgetRanges: [
    { label: "Under ₹30,000", min: 0, max: 30000 },
    { label: "₹30,000 – ₹60,000", min: 30000, max: 60000 },
    { label: "₹60,000 – ₹1,00,000", min: 60000, max: 100000 },
    { label: "Above ₹1,00,000", min: 100000, max: Infinity },
  ],
  durations: ["3–5 Days", "6–8 Days", "9–12 Days", "13+ Days"],
  themes: ["Honeymoon", "Family", "Adventure", "Luxury", "Beach", "Culture", "Shopping"],
  ratings: [4, 3, 2],
  sortOptions: ["Popularity", "Price: Low to High", "Price: High to Low", "Rating", "Duration"],
};

// ============================================================
// SHARED COMPONENTS
// ============================================================

const s = {
  // CSS-in-JS style objects reused across components
  btnPrimary: {
    background: `linear-gradient(135deg, ${TOKENS.colors.pink} 0%, ${TOKENS.colors.pinkLight} 100%)`,
    color: "#fff",
    border: "none",
    borderRadius: TOKENS.radius.full,
    padding: "14px 32px",
    fontFamily: TOKENS.fonts.body,
    fontWeight: 700,
    fontSize: "15px",
    cursor: "pointer",
    letterSpacing: "0.3px",
    boxShadow: "0 4px 18px rgba(232,84,120,0.35)",
    transition: "all 0.2s ease",
  },
  btnOutline: {
    background: "transparent",
    color: TOKENS.colors.pink,
    border: `2px solid ${TOKENS.colors.pink}`,
    borderRadius: TOKENS.radius.full,
    padding: "12px 28px",
    fontFamily: TOKENS.fonts.body,
    fontWeight: 600,
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  btnNavy: {
    background: TOKENS.colors.navy,
    color: "#fff",
    border: "none",
    borderRadius: TOKENS.radius.full,
    padding: "12px 28px",
    fontFamily: TOKENS.fonts.body,
    fontWeight: 700,
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  card: {
    background: "#fff",
    borderRadius: TOKENS.radius.lg,
    boxShadow: TOKENS.shadow.card,
    overflow: "hidden",
    transition: "all 0.3s ease",
  },
  badge: (color = TOKENS.colors.pink) => ({
    background: color,
    color: "#fff",
    borderRadius: TOKENS.radius.full,
    padding: "4px 14px",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.5px",
    fontFamily: TOKENS.fonts.body,
    display: "inline-block",
    textTransform: "uppercase",
  }),
  sectionTitle: {
    fontFamily: TOKENS.fonts.display,
    fontSize: "clamp(28px, 4vw, 40px)",
    fontWeight: 700,
    color: TOKENS.colors.navy,
    lineHeight: 1.15,
  },
  sectionSubtitle: {
    fontFamily: TOKENS.fonts.body,
    fontSize: "17px",
    color: TOKENS.colors.gray500,
    marginTop: "12px",
    lineHeight: 1.6,
  },
  starRating: (rating) => (
    <span style={{ color: TOKENS.colors.gold, fontSize: "14px" }}>
      {"★".repeat(Math.floor(rating))}
      {rating % 1 >= 0.5 ? "½" : ""}
      <span style={{ color: TOKENS.colors.gray300 }}>{"★".repeat(5 - Math.ceil(rating))}</span>
      <span style={{ color: TOKENS.colors.gray700, fontFamily: TOKENS.fonts.body, fontSize: "13px", marginLeft: "6px" }}>
        {rating}
      </span>
    </span>
  ),
  priceDisplay: (price, original, discount) => (
    <div style={{ fontFamily: TOKENS.fonts.body }}>
      {discount && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
          <span style={{ textDecoration: "line-through", color: TOKENS.colors.gray500, fontSize: "14px" }}>
            ₹{original?.toLocaleString()}
          </span>
          <span style={{ ...s.badge(TOKENS.colors.green), padding: "2px 8px", fontSize: "11px" }}>{discount}% OFF</span>
        </div>
      )}
      <div style={{ fontSize: "24px", fontWeight: 800, color: TOKENS.colors.navy }}>
        ₹{price?.toLocaleString()}
        <span style={{ fontSize: "13px", fontWeight: 400, color: TOKENS.colors.gray500 }}>/person</span>
      </div>
    </div>
  ),
};

// Navbar
function Navbar({ currentPage, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navLinks = [
    { label: "Home", page: "home" },
    { label: "Destinations", page: "destination" },
    { label: "Packages", page: "search" },
    { label: "About", page: "about" },
    { label: "Contact", page: "contact" },
  ];
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: "rgba(255,255,255,0.97)",
      backdropFilter: "blur(12px)",
      borderBottom: `1px solid ${TOKENS.colors.pinkMid}`,
      boxShadow: "0 2px 20px rgba(27,42,74,0.07)",
    }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", height: "70px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <div
          onClick={() => onNavigate("home")}
          style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
        >
          {/* SVG Footprint Logo */}
          <svg width="38" height="42" viewBox="0 0 80 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="40" cy="58" rx="26" ry="30" fill={TOKENS.colors.pink} />
            <ellipse cx="22" cy="22" rx="8" ry="10" fill={TOKENS.colors.pink} />
            <ellipse cx="34" cy="15" rx="7" ry="9" fill={TOKENS.colors.pink} />
            <ellipse cx="46" cy="13" rx="6.5" ry="8.5" fill={TOKENS.colors.pink} />
            <ellipse cx="56" cy="17" rx="6" ry="8" fill={TOKENS.colors.pink} />
            {/* Airplane */}
            <path d="M30 58 L50 48 L52 52 L42 56 L46 68 L42 67 L38 58 L32 60 Z" fill="white" />
          </svg>
          <div>
            <div style={{ fontFamily: TOKENS.fonts.display, fontWeight: 700, fontSize: "18px", color: TOKENS.colors.pink, lineHeight: 1 }}>PINKFOOT</div>
            <div style={{ fontFamily: TOKENS.fonts.body, fontWeight: 700, fontSize: "13px", color: TOKENS.colors.navy, letterSpacing: "2px", lineHeight: 1 }}>TRAVEL</div>
          </div>
        </div>

        {/* Nav Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {navLinks.map(link => (
            <button
              key={link.page}
              onClick={() => onNavigate(link.page)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: TOKENS.fonts.body, fontWeight: 600, fontSize: "14px",
                color: currentPage === link.page ? TOKENS.colors.pink : TOKENS.colors.navy,
                padding: "8px 14px",
                borderRadius: TOKENS.radius.full,
                borderBottom: currentPage === link.page ? `2px solid ${TOKENS.colors.pink}` : "2px solid transparent",
                transition: "all 0.2s",
              }}
            >{link.label}</button>
          ))}
          <button style={{ ...s.btnPrimary, padding: "10px 24px", marginLeft: "8px" }}>
            📞 Book Now
          </button>
        </div>
      </div>
    </nav>
  );
}

// PackageCard
function PackageCard({ pkg, onNavigate }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onNavigate("product", pkg)}
      style={{
        ...s.card,
        cursor: "pointer",
        boxShadow: hovered ? TOKENS.shadow.hover : TOKENS.shadow.card,
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
        <img src={pkg.coverImage} alt={pkg.title} style={{ width: "100%", height: "100%", objectFit: "cover", transform: hovered ? "scale(1.05)" : "scale(1)", transition: "transform 0.4s ease" }} />
        <div style={{ position: "absolute", top: "12px", left: "12px" }}>
          <span style={s.badge(pkg.badge === "Best Seller" ? TOKENS.colors.pink : pkg.badge === "Premium" ? TOKENS.colors.navy : TOKENS.colors.green)}>
            {pkg.badge}
          </span>
        </div>
        <div style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(255,255,255,0.95)", borderRadius: TOKENS.radius.full, padding: "4px 12px", fontSize: "12px", fontFamily: TOKENS.fonts.body, fontWeight: 600, color: TOKENS.colors.navy }}>
          🗓 {pkg.duration.nights}N/{pkg.duration.days}D
        </div>
        {/* Gradient overlay */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "80px", background: "linear-gradient(to top, rgba(27,42,74,0.5), transparent)" }} />
      </div>

      {/* Content */}
      <div style={{ padding: "16px" }}>
        <h3 style={{ fontFamily: TOKENS.fonts.display, fontSize: "17px", fontWeight: 700, color: TOKENS.colors.navy, margin: "0 0 6px 0" }}>{pkg.title}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
          <span style={{ fontSize: "13px", color: TOKENS.colors.gray500, fontFamily: TOKENS.fonts.body }}>📍 {pkg.destinationName}</span>
          <span style={{ color: TOKENS.colors.gray300 }}>|</span>
          {s.starRating(pkg.rating)}
          <span style={{ fontSize: "12px", color: TOKENS.colors.gray500, fontFamily: TOKENS.fonts.body }}>({pkg.reviewCount})</span>
        </div>
        {/* Themes */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "14px" }}>
          {pkg.theme.map(t => (
            <span key={t} style={{ background: TOKENS.colors.pinkPale, color: TOKENS.colors.pink, borderRadius: TOKENS.radius.full, padding: "3px 10px", fontSize: "11px", fontFamily: TOKENS.fonts.body, fontWeight: 600 }}>{t}</span>
          ))}
        </div>
        {/* Inclusions preview */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "14px" }}>
          {pkg.inclusions.slice(0, 3).map(inc => (
            <span key={inc} style={{ fontSize: "11px", fontFamily: TOKENS.fonts.body, color: TOKENS.colors.gray700, background: TOKENS.colors.gray100, borderRadius: TOKENS.radius.sm, padding: "3px 8px" }}>✓ {inc}</span>
          ))}
          {pkg.inclusions.length > 3 && <span style={{ fontSize: "11px", fontFamily: TOKENS.fonts.body, color: TOKENS.colors.gray500 }}>+{pkg.inclusions.length - 3} more</span>}
        </div>
        {/* Price + CTA */}
        <div style={{ borderTop: `1px solid ${TOKENS.colors.gray100}`, paddingTop: "14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: "12px", fontFamily: TOKENS.fonts.body, color: TOKENS.colors.gray500 }}>Starting from</div>
            {s.priceDisplay(pkg.price.adult, pkg.originalPrice, pkg.discount)}
          </div>
          <button style={{ ...s.btnPrimary, padding: "10px 20px", fontSize: "13px" }}>View Details</button>
        </div>
      </div>
    </div>
  );
}

// DestinationCard
function DestinationCard({ dest, onNavigate }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onNavigate("destination", dest)}
      style={{
        borderRadius: TOKENS.radius.lg, overflow: "hidden", cursor: "pointer",
        position: "relative", height: "260px",
        boxShadow: hovered ? TOKENS.shadow.hover : TOKENS.shadow.card,
        transform: hovered ? "translateY(-4px)" : "none",
        transition: "all 0.3s ease",
      }}
    >
      <img src={dest.heroImage} alt={dest.name} style={{ width: "100%", height: "100%", objectFit: "cover", transform: hovered ? "scale(1.07)" : "scale(1)", transition: "transform 0.5s ease" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(27,42,74,0.85) 0%, rgba(27,42,74,0.1) 60%)" }} />
      <div style={{ position: "absolute", top: "12px", right: "12px" }}>
        <span style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(6px)", color: "#fff", borderRadius: TOKENS.radius.full, padding: "4px 12px", fontSize: "11px", fontFamily: TOKENS.fonts.body, fontWeight: 700 }}>{dest.badge}</span>
      </div>
      <div style={{ position: "absolute", bottom: "16px", left: "16px", right: "16px" }}>
        <div style={{ fontFamily: TOKENS.fonts.display, fontSize: "22px", fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>{dest.name}</div>
        <div style={{ fontFamily: TOKENS.fonts.body, fontSize: "12px", color: "rgba(255,255,255,0.8)", marginTop: "4px" }}>{dest.tagline}</div>
        <div style={{ fontFamily: TOKENS.fonts.body, fontSize: "13px", color: "#fff", marginTop: "8px", fontWeight: 600 }}>From ₹{dest.startFrom.toLocaleString()}/person</div>
      </div>
    </div>
  );
}

// ============================================================
// PAGE: HOME
// ============================================================
function HomePage({ onNavigate }) {
  const [searchForm, setSearchForm] = useState({ destination: "", dates: "", travelers: "2 Adults" });
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", "Honeymoon", "Family", "Adventure", "Luxury", "Beach"];

  return (
    <div style={{ fontFamily: TOKENS.fonts.body }}>
      {/* HERO */}
      <div style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        {/* Background */}
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${TOKENS.colors.navy} 0%, #2D4272 40%, #3A1840 100%)` }} />
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "600px", height: "600px", borderRadius: "50%", background: `radial-gradient(circle, ${TOKENS.colors.pink}33 0%, transparent 70%)` }} />
        <div style={{ position: "absolute", bottom: "-150px", left: "-80px", width: "500px", height: "500px", borderRadius: "50%", background: `radial-gradient(circle, ${TOKENS.colors.pinkLight}22 0%, transparent 70%)` }} />
        {/* Floating images */}
        <div style={{ position: "absolute", right: "0", top: "0", bottom: "0", width: "52%", overflow: "hidden", opacity: 0.5 }}>
          <img src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900&q=80" alt="Bali" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, ${TOKENS.colors.navy} 0%, transparent 50%)` }} />
        </div>

        <div style={{ position: "relative", zIndex: 10, maxWidth: "1280px", margin: "0 auto", padding: "0 24px", paddingTop: "100px", paddingBottom: "60px", width: "100%" }}>
          <div style={{ maxWidth: "640px" }}>
            {/* Tag */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: `${TOKENS.colors.pink}22`, border: `1px solid ${TOKENS.colors.pink}44`, borderRadius: TOKENS.radius.full, padding: "6px 18px", marginBottom: "24px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: TOKENS.colors.pink, display: "inline-block" }} />
              <span style={{ color: TOKENS.colors.pinkMid, fontSize: "13px", fontWeight: 600, letterSpacing: "0.5px" }}>✈ YOUR TRAVEL PARTNER SINCE 2018</span>
            </div>

            <h1 style={{ fontFamily: TOKENS.fonts.display, fontSize: "clamp(38px, 5.5vw, 68px)", fontWeight: 700, color: "#fff", lineHeight: 1.08, margin: "0 0 20px 0" }}>
              Explore the World,<br />
              <span style={{ color: TOKENS.colors.pink }}>One Step</span> at a Time
            </h1>
            <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: "36px" }}>
              Handcrafted holidays to 40+ destinations. Personalised itineraries, seamless service, memories that last a lifetime.
            </p>

            {/* SEARCH BOX */}
            <div style={{ background: "rgba(255,255,255,0.97)", borderRadius: TOKENS.radius.xl, padding: "24px", boxShadow: TOKENS.shadow.heavy }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "12px", alignItems: "end" }}>
                <div>
                  <label style={{ display: "block", fontWeight: 700, fontSize: "12px", color: TOKENS.colors.navy, letterSpacing: "0.5px", marginBottom: "6px", textTransform: "uppercase" }}>🌍 Where to?</label>
                  <select
                    value={searchForm.destination}
                    onChange={e => setSearchForm({ ...searchForm, destination: e.target.value })}
                    style={{ width: "100%", border: `1.5px solid ${TOKENS.colors.gray300}`, borderRadius: TOKENS.radius.md, padding: "10px 12px", fontFamily: TOKENS.fonts.body, fontSize: "14px", color: TOKENS.colors.navy, background: TOKENS.colors.offWhite, outline: "none" }}
                  >
                    <option value="">Select Destination</option>
                    {destinations.map(d => <option key={d.id} value={d.id}>{d.name}, {d.country}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontWeight: 700, fontSize: "12px", color: TOKENS.colors.navy, letterSpacing: "0.5px", marginBottom: "6px", textTransform: "uppercase" }}>📅 Travel Dates</label>
                  <input
                    type="text"
                    placeholder="Select dates"
                    value={searchForm.dates}
                    onChange={e => setSearchForm({ ...searchForm, dates: e.target.value })}
                    style={{ width: "100%", border: `1.5px solid ${TOKENS.colors.gray300}`, borderRadius: TOKENS.radius.md, padding: "10px 12px", fontFamily: TOKENS.fonts.body, fontSize: "14px", color: TOKENS.colors.navy, background: TOKENS.colors.offWhite, outline: "none", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontWeight: 700, fontSize: "12px", color: TOKENS.colors.navy, letterSpacing: "0.5px", marginBottom: "6px", textTransform: "uppercase" }}>👥 Travellers</label>
                  <select
                    value={searchForm.travelers}
                    onChange={e => setSearchForm({ ...searchForm, travelers: e.target.value })}
                    style={{ width: "100%", border: `1.5px solid ${TOKENS.colors.gray300}`, borderRadius: TOKENS.radius.md, padding: "10px 12px", fontFamily: TOKENS.fonts.body, fontSize: "14px", color: TOKENS.colors.navy, background: TOKENS.colors.offWhite, outline: "none" }}
                  >
                    {["1 Adult","2 Adults","3 Adults","2 Adults + 1 Child","2 Adults + 2 Children","Family (4+)"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <button onClick={() => onNavigate("search")} style={{ ...s.btnPrimary, padding: "12px 28px", whiteSpace: "nowrap", fontSize: "15px" }}>
                  🔍 Search
                </button>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: "32px", marginTop: "32px" }}>
              {[["10,000+", "Happy Travellers"], ["40+", "Destinations"], ["₹0", "Booking Fee"], ["24/7", "Support"]].map(([num, label]) => (
                <div key={label}>
                  <div style={{ fontFamily: TOKENS.fonts.display, fontSize: "24px", fontWeight: 700, color: "#fff" }}>{num}</div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* POPULAR DESTINATIONS */}
      <section style={{ background: TOKENS.colors.offWhite, padding: "80px 24px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span style={s.badge(TOKENS.colors.pinkPale.replace("#", ""))}>
              <span style={{ color: TOKENS.colors.pink }}>🗺 Popular Destinations</span>
            </span>
            <h2 style={{ ...s.sectionTitle, marginTop: "14px" }}>Where Do You Want to Go?</h2>
            <p style={s.sectionSubtitle}>Curated destinations loved by thousands of Pinkfoot travellers</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            {destinations.slice(0, 6).map(dest => (
              <DestinationCard key={dest.id} dest={dest} onNavigate={onNavigate} />
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <button onClick={() => onNavigate("search")} style={s.btnOutline}>Explore All 40+ Destinations →</button>
          </div>
        </div>
      </section>

      {/* TRENDING PACKAGES */}
      <section style={{ background: "#fff", padding: "80px 24px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <span style={s.badge()}>🔥 Trending Now</span>
              <h2 style={{ ...s.sectionTitle, marginTop: "12px" }}>Hand-Picked Holiday Packages</h2>
            </div>
            {/* Category filters */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    borderRadius: TOKENS.radius.full, padding: "8px 18px",
                    fontFamily: TOKENS.fonts.body, fontWeight: 600, fontSize: "13px",
                    border: `1.5px solid ${activeCategory === cat ? TOKENS.colors.pink : TOKENS.colors.gray300}`,
                    background: activeCategory === cat ? TOKENS.colors.pink : "#fff",
                    color: activeCategory === cat ? "#fff" : TOKENS.colors.gray700,
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                >{cat}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
            {packages
              .filter(p => activeCategory === "All" || p.theme.includes(activeCategory))
              .slice(0, 3)
              .map(pkg => <PackageCard key={pkg.id} pkg={pkg} onNavigate={onNavigate} />)}
          </div>
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <button onClick={() => onNavigate("search")} style={s.btnOutline}>View All Packages →</button>
          </div>
        </div>
      </section>

      {/* WHY PINKFOOT */}
      <section style={{ background: `linear-gradient(135deg, ${TOKENS.colors.navy} 0%, #2D3F6A 100%)`, padding: "80px 24px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <h2 style={{ ...s.sectionTitle, color: "#fff" }}>Why Travel with Pinkfoot?</h2>
            <p style={{ ...s.sectionSubtitle, color: "rgba(255,255,255,0.7)" }}>We handle every detail so you can focus on the moments</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
            {[
              { icon: "🎯", title: "Personalised Itineraries", desc: "Every trip is crafted around your preferences, budget, and travel style." },
              { icon: "💰", title: "Best Price Guarantee", desc: "We match any like-for-like offer. No hidden charges, ever." },
              { icon: "🛡️", title: "Safe & Trusted", desc: "IATA certified. Over 10,000 happy customers since 2018." },
              { icon: "📞", title: "24/7 Travel Support", desc: "Our travel experts are always available, before and during your trip." },
            ].map(item => (
              <div key={item.title} style={{ background: "rgba(255,255,255,0.06)", borderRadius: TOKENS.radius.lg, padding: "32px 24px", border: "1px solid rgba(255,255,255,0.1)", textAlign: "center" }}>
                <div style={{ fontSize: "40px", marginBottom: "16px" }}>{item.icon}</div>
                <h3 style={{ fontFamily: TOKENS.fonts.display, fontSize: "18px", color: "#fff", fontWeight: 700, marginBottom: "10px" }}>{item.title}</h3>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ background: TOKENS.colors.pinkPale, padding: "80px 24px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span style={s.badge()}>⭐ Testimonials</span>
            <h2 style={{ ...s.sectionTitle, marginTop: "12px" }}>Stories from Our Travellers</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
            {reviews.map(rev => (
              <div key={rev.id} style={{ background: "#fff", borderRadius: TOKENS.radius.lg, padding: "28px", boxShadow: TOKENS.shadow.card }}>
                <div style={{ fontSize: "32px", color: TOKENS.colors.pink, fontFamily: "Georgia", lineHeight: 1, marginBottom: "16px" }}>"</div>
                <p style={{ fontSize: "14px", color: TOKENS.colors.gray700, lineHeight: 1.8, marginBottom: "20px" }}>{rev.comment}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: `linear-gradient(135deg, ${TOKENS.colors.pink}, ${TOKENS.colors.navyMid})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontFamily: TOKENS.fonts.body, fontSize: "14px" }}>{rev.avatar}</div>
                  <div>
                    <div style={{ fontFamily: TOKENS.fonts.body, fontWeight: 700, fontSize: "14px", color: TOKENS.colors.navy }}>{rev.name}</div>
                    <div style={{ fontSize: "12px", color: TOKENS.colors.gray500 }}>{rev.location} · {rev.package}</div>
                  </div>
                  <div style={{ marginLeft: "auto" }}>{s.starRating(rev.rating)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER CTA */}
      <section style={{ background: `linear-gradient(135deg, ${TOKENS.colors.pink} 0%, #C2395D 100%)`, padding: "64px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2 style={{ fontFamily: TOKENS.fonts.display, fontSize: "36px", color: "#fff", fontWeight: 700, marginBottom: "12px" }}>Get Exclusive Travel Deals</h2>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.85)", marginBottom: "28px" }}>Join 50,000+ travellers who get our best offers first. No spam, just great deals.</p>
          <div style={{ display: "flex", gap: "10px", maxWidth: "460px", margin: "0 auto" }}>
            <input type="email" placeholder="Enter your email" style={{ flex: 1, border: "none", borderRadius: TOKENS.radius.full, padding: "14px 22px", fontFamily: TOKENS.fonts.body, fontSize: "14px", outline: "none" }} />
            <button style={{ ...s.btnNavy, whiteSpace: "nowrap", borderRadius: TOKENS.radius.full, padding: "14px 28px" }}>Subscribe</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: TOKENS.colors.navy, color: "#fff", padding: "60px 24px 32px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "40px", marginBottom: "40px" }}>
            <div>
              <div style={{ fontFamily: TOKENS.fonts.display, fontSize: "22px", fontWeight: 700, color: TOKENS.colors.pink, marginBottom: "8px" }}>PINKFOOT TRAVEL</div>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.65)", lineHeight: 1.8, maxWidth: "280px" }}>Your trusted travel partner for personalised international holidays since 2018.</p>
              <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                {["📘 Facebook", "📸 Instagram", "🐦 Twitter"].map(s => <a key={s} href="#" style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>{s}</a>)}
              </div>
            </div>
            {[
              { title: "Destinations", links: ["Bali", "Maldives", "Thailand", "Dubai", "Europe", "Singapore"] },
              { title: "Packages", links: ["Honeymoon", "Family Trips", "Adventure", "Luxury", "Group Tours"] },
              { title: "Company", links: ["About Us", "Blog", "Careers", "Contact", "Privacy Policy"] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontFamily: TOKENS.fonts.body, fontWeight: 700, fontSize: "14px", color: "#fff", marginBottom: "16px", letterSpacing: "0.5px" }}>{col.title}</div>
                {col.links.map(link => <div key={link} style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", marginBottom: "10px", cursor: "pointer" }}>{link}</div>)}
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)" }}>© 2025 Pinkfoot Travel. All rights reserved.</div>
            <div style={{ display: "flex", gap: "16px" }}>
              {["IATA Certified", "SSL Secured", "RBI Compliant"].map(b => (
                <span key={b} style={{ background: "rgba(255,255,255,0.08)", borderRadius: TOKENS.radius.sm, padding: "4px 12px", fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>{b}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============================================================
// PAGE: SEARCH / LISTING
// ============================================================
function SearchPage({ onNavigate }) {
  const [filters, setFilters] = useState({ budget: null, duration: null, themes: [], rating: null });
  const [sort, setSort] = useState("Popularity");
  const [viewMode, setViewMode] = useState("grid"); // grid | list
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = packages.filter(p => {
    if (filters.themes.length > 0 && !filters.themes.some(t => p.theme.includes(t))) return false;
    if (filters.budget) {
      const { min, max } = filterOptions.budgetRanges.find(b => b.label === filters.budget);
      if (p.price.adult < min || p.price.adult > max) return false;
    }
    if (filters.rating && p.rating < filters.rating) return false;
    if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase()) && !p.destinationName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ background: TOKENS.colors.offWhite, minHeight: "100vh", paddingTop: "70px", fontFamily: TOKENS.fonts.body }}>
      {/* Search header */}
      <div style={{ background: TOKENS.colors.navy, padding: "32px 24px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <h1 style={{ fontFamily: TOKENS.fonts.display, fontSize: "30px", color: "#fff", marginBottom: "16px" }}>Find Your Perfect Holiday</h1>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div style={{ flex: 1, position: "relative" }}>
              <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" }}>🔍</span>
              <input
                type="text"
                placeholder="Search destinations, packages..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: "100%", border: "none", borderRadius: TOKENS.radius.full, padding: "14px 20px 14px 46px", fontFamily: TOKENS.fonts.body, fontSize: "14px", outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <select style={{ border: "none", borderRadius: TOKENS.radius.full, padding: "14px 20px", fontFamily: TOKENS.fonts.body, fontSize: "14px", background: "#fff", outline: "none" }}>
              <option>All Destinations</option>
              {destinations.map(d => <option key={d.id}>{d.name}</option>)}
            </select>
            <button style={{ ...s.btnPrimary, padding: "14px 32px", whiteSpace: "nowrap" }}>Search</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "24px", display: "grid", gridTemplateColumns: sidebarOpen ? "260px 1fr" : "0px 1fr", gap: "24px", transition: "all 0.3s" }}>
        {/* SIDEBAR */}
        {sidebarOpen && (
          <aside>
            <div style={{ background: "#fff", borderRadius: TOKENS.radius.lg, padding: "24px", boxShadow: TOKENS.shadow.card, position: "sticky", top: "90px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h3 style={{ fontFamily: TOKENS.fonts.display, fontSize: "18px", color: TOKENS.colors.navy, margin: 0 }}>Filters</h3>
                <button onClick={() => setFilters({ budget: null, duration: null, themes: [], rating: null })} style={{ background: "none", border: "none", color: TOKENS.colors.pink, fontSize: "13px", cursor: "pointer", fontWeight: 600 }}>Clear All</button>
              </div>

              {/* Budget */}
              <div style={{ marginBottom: "24px" }}>
                <div style={{ fontWeight: 700, fontSize: "13px", color: TOKENS.colors.navy, letterSpacing: "0.5px", marginBottom: "12px", textTransform: "uppercase" }}>Budget (Per Person)</div>
                {filterOptions.budgetRanges.map(b => (
                  <label key={b.label} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", cursor: "pointer" }}>
                    <input type="radio" name="budget" checked={filters.budget === b.label} onChange={() => setFilters({ ...filters, budget: b.label })} style={{ accentColor: TOKENS.colors.pink }} />
                    <span style={{ fontSize: "13px", color: TOKENS.colors.gray700 }}>{b.label}</span>
                  </label>
                ))}
              </div>

              {/* Themes */}
              <div style={{ marginBottom: "24px" }}>
                <div style={{ fontWeight: 700, fontSize: "13px", color: TOKENS.colors.navy, letterSpacing: "0.5px", marginBottom: "12px", textTransform: "uppercase" }}>Holiday Theme</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {filterOptions.themes.map(t => (
                    <button
                      key={t}
                      onClick={() => setFilters({ ...filters, themes: filters.themes.includes(t) ? filters.themes.filter(x => x !== t) : [...filters.themes, t] })}
                      style={{
                        borderRadius: TOKENS.radius.full, padding: "6px 14px", fontSize: "12px", fontWeight: 600, cursor: "pointer",
                        border: `1.5px solid ${filters.themes.includes(t) ? TOKENS.colors.pink : TOKENS.colors.gray300}`,
                        background: filters.themes.includes(t) ? TOKENS.colors.pinkPale : "#fff",
                        color: filters.themes.includes(t) ? TOKENS.colors.pink : TOKENS.colors.gray700,
                      }}
                    >{t}</button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div style={{ marginBottom: "24px" }}>
                <div style={{ fontWeight: 700, fontSize: "13px", color: TOKENS.colors.navy, letterSpacing: "0.5px", marginBottom: "12px", textTransform: "uppercase" }}>Duration</div>
                {filterOptions.durations.map(d => (
                  <label key={d} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", cursor: "pointer" }}>
                    <input type="radio" name="duration" checked={filters.duration === d} onChange={() => setFilters({ ...filters, duration: d })} style={{ accentColor: TOKENS.colors.pink }} />
                    <span style={{ fontSize: "13px", color: TOKENS.colors.gray700 }}>{d}</span>
                  </label>
                ))}
              </div>

              {/* Rating */}
              <div>
                <div style={{ fontWeight: 700, fontSize: "13px", color: TOKENS.colors.navy, letterSpacing: "0.5px", marginBottom: "12px", textTransform: "uppercase" }}>Minimum Rating</div>
                {filterOptions.ratings.map(r => (
                  <label key={r} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", cursor: "pointer" }}>
                    <input type="radio" name="rating" checked={filters.rating === r} onChange={() => setFilters({ ...filters, rating: r })} style={{ accentColor: TOKENS.colors.pink }} />
                    <span style={{ color: TOKENS.colors.gold }}>{"★".repeat(r)}</span>
                    <span style={{ fontSize: "13px", color: TOKENS.colors.gray700 }}>{r}+ Stars</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>
        )}

        {/* RESULTS */}
        <div>
          {/* Toolbar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", background: "#fff", borderRadius: TOKENS.radius.md, padding: "12px 20px", boxShadow: TOKENS.shadow.card }}>
            <div style={{ fontFamily: TOKENS.fonts.body, fontSize: "14px", color: TOKENS.colors.gray700 }}>
              <strong style={{ color: TOKENS.colors.navy }}>{filtered.length}</strong> packages found
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "13px", color: TOKENS.colors.gray700 }}>Sort by:</span>
                <select value={sort} onChange={e => setSort(e.target.value)} style={{ border: `1px solid ${TOKENS.colors.gray300}`, borderRadius: TOKENS.radius.md, padding: "6px 12px", fontFamily: TOKENS.fonts.body, fontSize: "13px", outline: "none" }}>
                  {filterOptions.sortOptions.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                {["grid", "list"].map(mode => (
                  <button key={mode} onClick={() => setViewMode(mode)} style={{ border: `1px solid ${viewMode === mode ? TOKENS.colors.pink : TOKENS.colors.gray300}`, background: viewMode === mode ? TOKENS.colors.pinkPale : "#fff", borderRadius: TOKENS.radius.sm, padding: "6px 10px", cursor: "pointer", fontSize: "16px" }}>
                    {mode === "grid" ? "⊞" : "☰"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Package Grid */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px", background: "#fff", borderRadius: TOKENS.radius.lg }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🧭</div>
              <h3 style={{ fontFamily: TOKENS.fonts.display, fontSize: "22px", color: TOKENS.colors.navy }}>No packages found</h3>
              <p style={{ color: TOKENS.colors.gray500 }}>Try adjusting your filters</p>
              <button onClick={() => setFilters({ budget: null, duration: null, themes: [], rating: null })} style={{ ...s.btnPrimary, marginTop: "16px" }}>Clear Filters</button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: viewMode === "grid" ? "repeat(2, 1fr)" : "1fr", gap: "20px" }}>
              {filtered.map(pkg => <PackageCard key={pkg.id} pkg={pkg} onNavigate={onNavigate} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PAGE: PRODUCT DETAIL
// ============================================================
function ProductPage({ pkg, onNavigate }) {
  const [activeTab, setActiveTab] = useState("itinerary");
  const [openDay, setOpenDay] = useState(1);
  const [travelers, setTravelers] = useState(2);
  const p = pkg || packages[0];

  const tabs = ["itinerary", "inclusions", "highlights", "reviews"];

  return (
    <div style={{ background: TOKENS.colors.offWhite, minHeight: "100vh", paddingTop: "70px", fontFamily: TOKENS.fonts.body }}>
      {/* HERO */}
      <div style={{ position: "relative", height: "480px", overflow: "hidden" }}>
        <img src={p.coverImage} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(27,42,74,0.85) 0%, rgba(0,0,0,0.2) 60%)" }} />
        {/* Breadcrumb */}
        <div style={{ position: "absolute", top: "24px", left: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "rgba(255,255,255,0.7)", fontFamily: TOKENS.fonts.body }}>
            <span onClick={() => onNavigate("home")} style={{ cursor: "pointer" }}>Home</span>
            <span>/</span>
            <span onClick={() => onNavigate("search")} style={{ cursor: "pointer" }}>Packages</span>
            <span>/</span>
            <span style={{ color: "#fff" }}>{p.title}</span>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: "32px", left: "32px", right: "32px" }}>
          <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
            <span style={s.badge()}>{p.badge}</span>
            {p.theme.map(t => <span key={t} style={{ ...s.badge("rgba(255,255,255,0.2)"), backdropFilter: "blur(4px)" }}>{t}</span>)}
          </div>
          <h1 style={{ fontFamily: TOKENS.fonts.display, fontSize: "clamp(28px, 4vw, 44px)", color: "#fff", fontWeight: 700, margin: "0 0 10px 0" }}>{p.title}</h1>
          <div style={{ display: "flex", align: "center", gap: "20px", flexWrap: "wrap" }}>
            <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "14px" }}>📍 {p.destinationName}</span>
            <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "14px" }}>🗓 {p.duration.nights}N/{p.duration.days}D</span>
            <span style={{ color: TOKENS.colors.gold, fontSize: "14px" }}>★ {p.rating} ({p.reviewCount} reviews)</span>
          </div>
        </div>
      </div>

      {/* CONTENT + SIDEBAR */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 24px", display: "grid", gridTemplateColumns: "1fr 380px", gap: "32px", alignItems: "start" }}>
        {/* LEFT */}
        <div>
          {/* Tabs */}
          <div style={{ background: "#fff", borderRadius: TOKENS.radius.lg, boxShadow: TOKENS.shadow.card, marginBottom: "24px", overflow: "hidden" }}>
            <div style={{ display: "flex", borderBottom: `1px solid ${TOKENS.colors.gray100}` }}>
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    flex: 1, padding: "16px", border: "none", background: "none", cursor: "pointer",
                    fontFamily: TOKENS.fonts.body, fontWeight: 700, fontSize: "13px",
                    color: activeTab === tab ? TOKENS.colors.pink : TOKENS.colors.gray500,
                    borderBottom: `2px solid ${activeTab === tab ? TOKENS.colors.pink : "transparent"}`,
                    textTransform: "capitalize", letterSpacing: "0.3px",
                    transition: "all 0.2s",
                  }}
                >{tab}</button>
              ))}
            </div>

            <div style={{ padding: "28px" }}>
              {/* Itinerary */}
              {activeTab === "itinerary" && (
                <div>
                  <h3 style={{ ...s.sectionTitle, fontSize: "22px", marginBottom: "20px" }}>Day-by-Day Itinerary</h3>
                  {p.itinerary.length > 0 ? p.itinerary.map(day => (
                    <div key={day.day} style={{ marginBottom: "12px", border: `1px solid ${openDay === day.day ? TOKENS.colors.pinkMid : TOKENS.colors.gray100}`, borderRadius: TOKENS.radius.md, overflow: "hidden" }}>
                      <button
                        onClick={() => setOpenDay(openDay === day.day ? null : day.day)}
                        style={{ width: "100%", display: "flex", alignItems: "center", gap: "14px", padding: "16px 20px", border: "none", background: openDay === day.day ? TOKENS.colors.pinkPale : "#fff", cursor: "pointer" }}
                      >
                        <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: openDay === day.day ? TOKENS.colors.pink : TOKENS.colors.navy, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "12px", flexShrink: 0, fontFamily: TOKENS.fonts.body }}>D{day.day}</div>
                        <span style={{ fontFamily: TOKENS.fonts.body, fontWeight: 700, fontSize: "15px", color: TOKENS.colors.navy, textAlign: "left" }}>{day.title}</span>
                        <span style={{ marginLeft: "auto", fontSize: "18px", color: TOKENS.colors.gray500 }}>{openDay === day.day ? "▲" : "▼"}</span>
                      </button>
                      {openDay === day.day && (
                        <div style={{ padding: "16px 20px 20px 68px", background: TOKENS.colors.pinkPale, fontSize: "14px", color: TOKENS.colors.gray700, lineHeight: 1.8 }}>
                          {day.description}
                        </div>
                      )}
                    </div>
                  )) : <p style={{ color: TOKENS.colors.gray500 }}>Detailed itinerary shared upon booking enquiry.</p>}
                </div>
              )}

              {/* Inclusions */}
              {activeTab === "inclusions" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                  <div>
                    <h3 style={{ fontFamily: TOKENS.fonts.display, fontSize: "20px", color: TOKENS.colors.navy, marginBottom: "16px" }}>✅ Inclusions</h3>
                    {p.inclusions.map(inc => (
                      <div key={inc} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 0", borderBottom: `1px solid ${TOKENS.colors.gray100}` }}>
                        <span style={{ color: TOKENS.colors.green, fontWeight: 700 }}>✓</span>
                        <span style={{ fontSize: "14px", color: TOKENS.colors.gray700 }}>{inc}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: TOKENS.fonts.display, fontSize: "20px", color: TOKENS.colors.navy, marginBottom: "16px" }}>❌ Exclusions</h3>
                    {p.exclusions.map(exc => (
                      <div key={exc} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 0", borderBottom: `1px solid ${TOKENS.colors.gray100}` }}>
                        <span style={{ color: "#EF4444", fontWeight: 700 }}>✗</span>
                        <span style={{ fontSize: "14px", color: TOKENS.colors.gray700 }}>{exc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Highlights */}
              {activeTab === "highlights" && (
                <div>
                  <h3 style={{ fontFamily: TOKENS.fonts.display, fontSize: "20px", color: TOKENS.colors.navy, marginBottom: "20px" }}>Trip Highlights</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                    {p.highlights.map((h, i) => (
                      <div key={h} style={{ background: TOKENS.colors.pinkPale, borderRadius: TOKENS.radius.md, padding: "16px 20px", display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ width: "32px", height: "32px", borderRadius: "50%", background: TOKENS.colors.pink, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "12px", flexShrink: 0 }}>{i + 1}</span>
                        <span style={{ fontSize: "14px", fontWeight: 600, color: TOKENS.colors.navy }}>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              {activeTab === "reviews" && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "24px", padding: "20px", background: TOKENS.colors.pinkPale, borderRadius: TOKENS.radius.md }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontFamily: TOKENS.fonts.display, fontSize: "52px", fontWeight: 700, color: TOKENS.colors.navy }}>{p.rating}</div>
                      <div style={{ color: TOKENS.colors.gold, fontSize: "20px" }}>{"★".repeat(Math.round(p.rating))}</div>
                      <div style={{ fontSize: "13px", color: TOKENS.colors.gray500 }}>{p.reviewCount} reviews</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      {[5, 4, 3, 2, 1].map(star => (
                        <div key={star} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                          <span style={{ fontSize: "12px", color: TOKENS.colors.gray700, width: "16px" }}>{star}</span>
                          <span style={{ color: TOKENS.colors.gold, fontSize: "11px" }}>★</span>
                          <div style={{ flex: 1, height: "6px", background: TOKENS.colors.gray100, borderRadius: TOKENS.radius.full, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${star === 5 ? 70 : star === 4 ? 20 : 6}%`, background: TOKENS.colors.gold, borderRadius: TOKENS.radius.full }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {reviews.slice(0, 2).map(rev => (
                    <div key={rev.id} style={{ padding: "20px 0", borderBottom: `1px solid ${TOKENS.colors.gray100}` }}>
                      <div style={{ display: "flex", gap: "12px", marginBottom: "10px" }}>
                        <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: `linear-gradient(135deg, ${TOKENS.colors.pink}, ${TOKENS.colors.navyMid})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "13px" }}>{rev.avatar}</div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "14px", color: TOKENS.colors.navy }}>{rev.name}</div>
                          <div style={{ fontSize: "12px", color: TOKENS.colors.gray500 }}>{rev.location} · {rev.date}</div>
                        </div>
                        <div style={{ marginLeft: "auto", color: TOKENS.colors.gold }}>{"★".repeat(rev.rating)}</div>
                      </div>
                      <p style={{ fontSize: "14px", color: TOKENS.colors.gray700, lineHeight: 1.7, margin: 0 }}>{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Similar Packages */}
          <div>
            <h3 style={{ ...s.sectionTitle, fontSize: "24px", marginBottom: "20px" }}>You May Also Like</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
              {packages.filter(pk => pk.id !== p.id).slice(0, 2).map(pk => <PackageCard key={pk.id} pkg={pk} onNavigate={onNavigate} />)}
            </div>
          </div>
        </div>

        {/* SIDEBAR — BOOKING */}
        <div style={{ position: "sticky", top: "90px" }}>
          <div style={{ background: "#fff", borderRadius: TOKENS.radius.xl, boxShadow: TOKENS.shadow.heavy, overflow: "hidden" }}>
            {/* Price header */}
            <div style={{ background: `linear-gradient(135deg, ${TOKENS.colors.navy} 0%, ${TOKENS.colors.navyMid} 100%)`, padding: "24px" }}>
              {s.priceDisplay(p.price.adult, p.originalPrice, p.discount)}
              <div style={{ marginTop: "8px", fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>incl. flights + hotel + tours</div>
            </div>

            <div style={{ padding: "24px" }}>
              {/* Traveler counter */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontWeight: 700, fontSize: "13px", color: TOKENS.colors.navy, marginBottom: "10px" }}>Number of Travellers</label>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <button onClick={() => setTravelers(Math.max(1, travelers - 1))} style={{ width: "36px", height: "36px", borderRadius: "50%", border: `2px solid ${TOKENS.colors.gray300}`, background: "#fff", cursor: "pointer", fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                  <span style={{ fontFamily: TOKENS.fonts.display, fontSize: "24px", fontWeight: 700, color: TOKENS.colors.navy, minWidth: "32px", textAlign: "center" }}>{travelers}</span>
                  <button onClick={() => setTravelers(travelers + 1)} style={{ width: "36px", height: "36px", borderRadius: "50%", border: `2px solid ${TOKENS.colors.pink}`, background: TOKENS.colors.pinkPale, cursor: "pointer", fontSize: "20px", color: TOKENS.colors.pink, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                  <span style={{ fontSize: "13px", color: TOKENS.colors.gray500 }}>Adults</span>
                </div>
              </div>

              {/* Total */}
              <div style={{ background: TOKENS.colors.pinkPale, borderRadius: TOKENS.radius.md, padding: "16px", marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "14px", color: TOKENS.colors.gray700 }}>₹{p.price.adult.toLocaleString()} × {travelers} adults</span>
                  <span style={{ fontWeight: 700, color: TOKENS.colors.navy }}>₹{(p.price.adult * travelers).toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", paddingTop: "8px", borderTop: `1px solid ${TOKENS.colors.pinkMid}` }}>
                  <span style={{ fontWeight: 700, fontSize: "14px", color: TOKENS.colors.navy }}>Total Estimate</span>
                  <span style={{ fontWeight: 800, fontSize: "18px", color: TOKENS.colors.pink }}>₹{(p.price.adult * travelers).toLocaleString()}</span>
                </div>
              </div>

              <button style={{ ...s.btnPrimary, width: "100%", padding: "16px", fontSize: "16px", marginBottom: "12px", borderRadius: TOKENS.radius.md }}>
                📋 Get Custom Quote
              </button>
              <button style={{ ...s.btnOutline, width: "100%", padding: "14px", fontSize: "14px", borderRadius: TOKENS.radius.md }}>
                📞 Talk to Expert
              </button>

              <div style={{ marginTop: "20px", display: "flex", gap: "12px", justifyContent: "center" }}>
                {["🔒 Secure Booking", "💳 EMI Available"].map(b => (
                  <div key={b} style={{ fontSize: "11px", color: TOKENS.colors.gray500, display: "flex", alignItems: "center", gap: "4px" }}>{b}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PAGE: DESTINATION LANDING
// ============================================================
function DestinationPage({ dest, onNavigate }) {
  const d = dest || destinations[0];
  const destPackages = packages.filter(p => p.destination === d.id);
  const [activeExp, setActiveExp] = useState(0);

  const experiences = [
    { icon: "🏖", title: "Beaches", desc: "Pristine shores and crystal-clear waters await." },
    { icon: "🏛", title: "Culture", desc: "Ancient temples, art, and local traditions." },
    { icon: "🌿", title: "Nature", desc: "Lush landscapes and breathtaking scenery." },
    { icon: "🍜", title: "Cuisine", desc: "Vibrant local food scene and street markets." },
  ];

  return (
    <div style={{ background: TOKENS.colors.offWhite, minHeight: "100vh", paddingTop: "70px", fontFamily: TOKENS.fonts.body }}>
      {/* HERO */}
      <div style={{ position: "relative", height: "580px", overflow: "hidden" }}>
        <img src={d.heroImage} alt={d.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(27,42,74,0.9) 0%, rgba(0,0,0,0.3) 60%)" }} />
        <div style={{ position: "absolute", bottom: "60px", left: "50%", transform: "translateX(-50%)", textAlign: "center", width: "100%" }}>
          <div style={{ display: "inline-block", background: `${TOKENS.colors.pink}cc`, borderRadius: TOKENS.radius.full, padding: "6px 20px", fontSize: "13px", fontWeight: 700, color: "#fff", marginBottom: "16px", letterSpacing: "2px", textTransform: "uppercase" }}>
            {d.country} · {d.region}
          </div>
          <h1 style={{ fontFamily: TOKENS.fonts.display, fontSize: "clamp(48px, 7vw, 80px)", color: "#fff", fontWeight: 700, margin: "0 0 12px 0", textShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>{d.name}</h1>
          <p style={{ fontSize: "22px", color: "rgba(255,255,255,0.85)", marginBottom: "28px" }}>{d.tagline}</p>
          <div style={{ display: "flex", gap: "24px", justifyContent: "center" }}>
            {[["🌡 Best Time", d.bestMonths], ["⭐ Rating", `${d.rating}/5 (${d.reviewCount} reviews)`], ["✈ From", `₹${d.startFrom.toLocaleString()}/person`]].map(([label, val]) => (
              <div key={label} style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", borderRadius: TOKENS.radius.md, padding: "12px 20px", border: "1px solid rgba(255,255,255,0.2)" }}>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", marginBottom: "4px" }}>{label}</div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QUICK NAV */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${TOKENS.colors.gray100}`, position: "sticky", top: "70px", zIndex: 100 }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", display: "flex", gap: "0" }}>
          {["Overview", "Experiences", "Packages", "Best Time", "Travel Tips"].map(tab => (
            <button key={tab} style={{ padding: "16px 20px", border: "none", background: "none", fontFamily: TOKENS.fonts.body, fontWeight: 600, fontSize: "13px", color: TOKENS.colors.gray700, cursor: "pointer", borderBottom: "2px solid transparent", transition: "all 0.2s" }}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "48px 24px" }}>
        {/* ABOUT */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", marginBottom: "60px", alignItems: "center" }}>
          <div>
            <span style={s.badge()}>About {d.name}</span>
            <h2 style={{ ...s.sectionTitle, marginTop: "14px", marginBottom: "16px" }}>Discover {d.name}, {d.country}</h2>
            <p style={{ fontSize: "16px", color: TOKENS.colors.gray700, lineHeight: 1.9, marginBottom: "20px" }}>
              {d.name} is one of the world's most captivating destinations, offering an extraordinary blend of natural beauty, rich culture, and unforgettable experiences. From pristine beaches to ancient temples, every corner has a story to tell.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "28px" }}>
              {d.themes.map(t => <span key={t} style={{ ...s.badge(TOKENS.colors.navyLight.replace("#", "")), color: TOKENS.colors.navy }}>{t}</span>)}
            </div>
            <button style={s.btnPrimary}>Explore Packages →</button>
          </div>
          <div style={{ position: "relative" }}>
            <img src={d.heroImage} alt={d.name} style={{ width: "100%", height: "340px", objectFit: "cover", borderRadius: TOKENS.radius.xl }} />
            <div style={{ position: "absolute", bottom: "-20px", right: "-20px", background: "#fff", borderRadius: TOKENS.radius.lg, padding: "20px", boxShadow: TOKENS.shadow.heavy, textAlign: "center" }}>
              <div style={{ fontFamily: TOKENS.fonts.display, fontSize: "32px", fontWeight: 700, color: TOKENS.colors.pink }}>{d.rating}</div>
              <div style={{ color: TOKENS.colors.gold, fontSize: "16px" }}>★★★★★</div>
              <div style={{ fontSize: "12px", color: TOKENS.colors.gray500, marginTop: "4px" }}>{d.reviewCount} Reviews</div>
            </div>
          </div>
        </div>

        {/* HIGHLIGHTS */}
        <div style={{ marginBottom: "60px" }}>
          <h2 style={{ ...s.sectionTitle, marginBottom: "32px" }}>Top Highlights of {d.name}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
            {d.highlights.map((h, i) => (
              <div key={h} style={{ background: "#fff", borderRadius: TOKENS.radius.lg, padding: "24px 20px", boxShadow: TOKENS.shadow.card, textAlign: "center", borderTop: `3px solid ${TOKENS.colors.pink}` }}>
                <div style={{ fontFamily: TOKENS.fonts.display, fontSize: "32px", fontWeight: 700, color: TOKENS.colors.pinkMid, marginBottom: "8px" }}>0{i + 1}</div>
                <div style={{ fontWeight: 700, fontSize: "14px", color: TOKENS.colors.navy }}>{h}</div>
              </div>
            ))}
          </div>
        </div>

        {/* EXPERIENCES */}
        <div style={{ marginBottom: "60px" }}>
          <h2 style={{ ...s.sectionTitle, marginBottom: "32px" }}>Experiences in {d.name}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: "24px", background: "#fff", borderRadius: TOKENS.radius.xl, overflow: "hidden", boxShadow: TOKENS.shadow.card }}>
            <div style={{ background: TOKENS.colors.navy, padding: "24px 0" }}>
              {experiences.map((exp, i) => (
                <button
                  key={exp.title}
                  onClick={() => setActiveExp(i)}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: "14px", padding: "18px 24px", border: "none", background: activeExp === i ? `${TOKENS.colors.pink}22` : "transparent", cursor: "pointer", borderLeft: `3px solid ${activeExp === i ? TOKENS.colors.pink : "transparent"}` }}
                >
                  <span style={{ fontSize: "24px" }}>{exp.icon}</span>
                  <span style={{ fontFamily: TOKENS.fonts.body, fontWeight: 700, fontSize: "14px", color: "#fff" }}>{exp.title}</span>
                </button>
              ))}
            </div>
            <div style={{ padding: "40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ fontSize: "52px", marginBottom: "16px" }}>{experiences[activeExp].icon}</div>
              <h3 style={{ fontFamily: TOKENS.fonts.display, fontSize: "28px", color: TOKENS.colors.navy, marginBottom: "12px" }}>{experiences[activeExp].title} in {d.name}</h3>
              <p style={{ fontSize: "16px", color: TOKENS.colors.gray700, lineHeight: 1.8 }}>{experiences[activeExp].desc} Pinkfoot Travel curates authentic, off-the-beaten-path experiences to give you the most memorable holiday of your life.</p>
            </div>
          </div>
        </div>

        {/* PACKAGES FOR THIS DESTINATION */}
        <div style={{ marginBottom: "60px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h2 style={s.sectionTitle}>{d.name} Holiday Packages</h2>
            <button onClick={() => onNavigate("search")} style={s.btnOutline}>See All →</button>
          </div>
          {destPackages.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
              {destPackages.map(pkg => <PackageCard key={pkg.id} pkg={pkg} onNavigate={onNavigate} />)}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
              {packages.slice(0, 3).map(pkg => <PackageCard key={pkg.id} pkg={pkg} onNavigate={onNavigate} />)}
            </div>
          )}
        </div>

        {/* BEST TIME BANNER */}
        <div style={{ background: `linear-gradient(135deg, ${TOKENS.colors.pink} 0%, #C2395D 100%)`, borderRadius: TOKENS.radius.xl, padding: "48px", textAlign: "center", color: "#fff" }}>
          <h3 style={{ fontFamily: TOKENS.fonts.display, fontSize: "32px", fontWeight: 700, marginBottom: "12px" }}>Best Time to Visit {d.name}</h3>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.2)", borderRadius: TOKENS.radius.full, padding: "10px 24px", marginBottom: "20px" }}>
            <span style={{ fontSize: "20px" }}>🌤</span>
            <span style={{ fontSize: "18px", fontWeight: 700 }}>{d.bestMonths}</span>
          </div>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.85)", marginBottom: "28px", maxWidth: "500px", margin: "0 auto 28px" }}>
            These months offer the most pleasant weather and best travel conditions for {d.name}.
          </p>
          <button style={{ ...s.btnNavy, padding: "14px 36px", fontSize: "15px" }}>Plan My Trip</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PAGE: DESIGN GUIDE
// ============================================================
function DesignGuide() {
  return (
    <div style={{ background: TOKENS.colors.offWhite, minHeight: "100vh", paddingTop: "90px", fontFamily: TOKENS.fonts.body }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ marginBottom: "40px" }}>
          <span style={s.badge()}>📐 Design System</span>
          <h1 style={{ ...s.sectionTitle, marginTop: "12px" }}>Pinkfoot Travel — Design Guide</h1>
          <p style={s.sectionSubtitle}>Visual language, tokens, and component library for the Pinkfoot Travel web platform.</p>
        </div>

        {/* COLORS */}
        <section style={{ background: "#fff", borderRadius: TOKENS.radius.xl, padding: "36px", boxShadow: TOKENS.shadow.card, marginBottom: "24px" }}>
          <h2 style={{ fontFamily: TOKENS.fonts.display, fontSize: "24px", color: TOKENS.colors.navy, marginBottom: "24px" }}>🎨 Color Palette</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px" }}>
            {[
              { name: "Brand Pink", hex: TOKENS.colors.pink, var: "--color-pink" },
              { name: "Pink Light", hex: TOKENS.colors.pinkLight, var: "--color-pink-light" },
              { name: "Pink Pale", hex: TOKENS.colors.pinkPale, var: "--color-pink-pale" },
              { name: "Navy", hex: TOKENS.colors.navy, var: "--color-navy" },
              { name: "Navy Mid", hex: TOKENS.colors.navyMid, var: "--color-navy-mid" },
              { name: "Navy Light", hex: TOKENS.colors.navyLight, var: "--color-navy-light" },
              { name: "Gold", hex: TOKENS.colors.gold, var: "--color-gold" },
              { name: "Green", hex: TOKENS.colors.green, var: "--color-green" },
              { name: "Gray 500", hex: TOKENS.colors.gray500, var: "--color-gray-500" },
              { name: "Off White", hex: TOKENS.colors.offWhite, var: "--color-off-white", border: true },
            ].map(c => (
              <div key={c.name}>
                <div style={{ height: "64px", background: c.hex, borderRadius: TOKENS.radius.md, border: c.border ? `1px solid ${TOKENS.colors.gray300}` : "none", marginBottom: "8px" }} />
                <div style={{ fontWeight: 700, fontSize: "12px", color: TOKENS.colors.navy }}>{c.name}</div>
                <div style={{ fontSize: "11px", color: TOKENS.colors.gray500 }}>{c.hex}</div>
                <div style={{ fontSize: "10px", color: TOKENS.colors.gray300, fontFamily: "monospace" }}>{c.var}</div>
              </div>
            ))}
          </div>
        </section>

        {/* TYPOGRAPHY */}
        <section style={{ background: "#fff", borderRadius: TOKENS.radius.xl, padding: "36px", boxShadow: TOKENS.shadow.card, marginBottom: "24px" }}>
          <h2 style={{ fontFamily: TOKENS.fonts.display, fontSize: "24px", color: TOKENS.colors.navy, marginBottom: "24px" }}>✍ Typography</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: TOKENS.colors.gray500, letterSpacing: "1px", marginBottom: "12px", textTransform: "uppercase" }}>Display / Headings</div>
              <div style={{ fontFamily: TOKENS.fonts.display, fontSize: "36px", fontWeight: 700, color: TOKENS.colors.navy }}>Playfair Display</div>
              <div style={{ fontFamily: TOKENS.fonts.display, fontSize: "24px", color: TOKENS.colors.navy, marginTop: "4px" }}>Aa Bb Cc 1 2 3</div>
              <div style={{ fontSize: "12px", color: TOKENS.colors.gray500, marginTop: "8px", fontFamily: "monospace" }}>'Playfair Display', Georgia, serif</div>
              <div style={{ marginTop: "16px" }}>
                {[["H1", "clamp(38px, 5.5vw, 68px)"], ["H2", "clamp(28px, 4vw, 40px)"], ["H3", "20–24px"], ["H4", "18px"]].map(([tag, size]) => (
                  <div key={tag} style={{ display: "flex", gap: "12px", alignItems: "baseline", marginBottom: "6px" }}>
                    <span style={{ background: TOKENS.colors.pinkPale, color: TOKENS.colors.pink, borderRadius: "4px", padding: "1px 8px", fontSize: "11px", fontFamily: "monospace", fontWeight: 700 }}>{tag}</span>
                    <span style={{ fontSize: "13px", color: TOKENS.colors.gray700 }}>{size}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: TOKENS.colors.gray500, letterSpacing: "1px", marginBottom: "12px", textTransform: "uppercase" }}>Body / UI</div>
              <div style={{ fontFamily: TOKENS.fonts.body, fontSize: "30px", fontWeight: 700, color: TOKENS.colors.navy }}>DM Sans</div>
              <div style={{ fontFamily: TOKENS.fonts.body, fontSize: "20px", color: TOKENS.colors.navy, marginTop: "4px" }}>Aa Bb Cc 1 2 3</div>
              <div style={{ fontSize: "12px", color: TOKENS.colors.gray500, marginTop: "8px", fontFamily: "monospace" }}>'DM Sans', system-ui, sans-serif</div>
              <div style={{ marginTop: "16px" }}>
                {[["Body L", "18px, 1.7 lh"], ["Body M", "16px, 1.7 lh"], ["Body S", "14px, 1.6 lh"], ["Caption", "12px, 1.5 lh"]].map(([name, spec]) => (
                  <div key={name} style={{ display: "flex", gap: "12px", alignItems: "baseline", marginBottom: "6px" }}>
                    <span style={{ background: TOKENS.colors.navyLight, color: TOKENS.colors.navy, borderRadius: "4px", padding: "1px 8px", fontSize: "11px", fontFamily: "monospace", fontWeight: 700 }}>{name}</span>
                    <span style={{ fontSize: "13px", color: TOKENS.colors.gray700 }}>{spec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* COMPONENTS */}
        <section style={{ background: "#fff", borderRadius: TOKENS.radius.xl, padding: "36px", boxShadow: TOKENS.shadow.card, marginBottom: "24px" }}>
          <h2 style={{ fontFamily: TOKENS.fonts.display, fontSize: "24px", color: TOKENS.colors.navy, marginBottom: "24px" }}>🧩 Buttons & Badges</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginBottom: "28px" }}>
            <button style={s.btnPrimary}>Primary Button</button>
            <button style={s.btnOutline}>Outline Button</button>
            <button style={s.btnNavy}>Navy Button</button>
            <button style={{ ...s.btnPrimary, opacity: 0.5, cursor: "not-allowed" }}>Disabled</button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            <span style={s.badge()}>Best Seller</span>
            <span style={s.badge(TOKENS.colors.navy)}>Premium</span>
            <span style={s.badge(TOKENS.colors.green)}>22% OFF</span>
            <span style={s.badge(TOKENS.colors.gold)}>Hot Deal</span>
            <span style={{ ...s.badge(), background: TOKENS.colors.pinkPale, color: TOKENS.colors.pink }}>Honeymoon</span>
          </div>
        </section>

        {/* SPACING */}
        <section style={{ background: "#fff", borderRadius: TOKENS.radius.xl, padding: "36px", boxShadow: TOKENS.shadow.card, marginBottom: "24px" }}>
          <h2 style={{ fontFamily: TOKENS.fonts.display, fontSize: "24px", color: TOKENS.colors.navy, marginBottom: "24px" }}>📐 Spacing & Radius</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: TOKENS.colors.gray500, marginBottom: "16px", textTransform: "uppercase" }}>Border Radius</div>
              {Object.entries(TOKENS.radius).map(([name, val]) => (
                <div key={name} style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "12px" }}>
                  <div style={{ width: "60px", height: "28px", background: TOKENS.colors.pinkMid, borderRadius: val }} />
                  <span style={{ fontFamily: "monospace", fontSize: "12px", color: TOKENS.colors.gray700 }}>{name}: {val}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: TOKENS.colors.gray500, marginBottom: "16px", textTransform: "uppercase" }}>Section Spacing</div>
              {[["Section Padding", "80px 24px"], ["Container Max-Width", "1280px"], ["Card Padding", "16–28px"], ["Grid Gap", "20–32px"], ["Header Height", "70px"]].map(([n, v]) => (
                <div key={n} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${TOKENS.colors.gray100}` }}>
                  <span style={{ fontSize: "13px", color: TOKENS.colors.gray700 }}>{n}</span>
                  <span style={{ fontSize: "13px", fontFamily: "monospace", color: TOKENS.colors.navy, fontWeight: 700 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PAGES */}
        <section style={{ background: "#fff", borderRadius: TOKENS.radius.xl, padding: "36px", boxShadow: TOKENS.shadow.card }}>
          <h2 style={{ fontFamily: TOKENS.fonts.display, fontSize: "24px", color: TOKENS.colors.navy, marginBottom: "24px" }}>📄 Page Templates</h2>
          {[
            { page: "Home", sections: ["Navbar", "Hero + Search", "Destination Grid", "Package Cards", "Why Us", "Testimonials", "Newsletter CTA", "Footer"] },
            { page: "Search / Listing", sections: ["Search Header", "Filter Sidebar (Budget, Theme, Duration, Rating)", "Sort Toolbar", "Package Grid / List View", "Pagination"] },
            { page: "Product Detail", sections: ["Hero Image + Breadcrumb", "Tabs (Itinerary, Inclusions, Highlights, Reviews)", "Booking Sidebar (Price, Traveller Count, CTA)", "Similar Packages"] },
            { page: "Destination Landing", sections: ["Full-width Hero", "Sticky Nav", "About + Image", "Highlights Grid", "Experiences Tab Panel", "Packages for Destination", "Best Time Banner"] },
          ].map(({ page, sections }) => (
            <div key={page} style={{ marginBottom: "20px", padding: "20px", background: TOKENS.colors.offWhite, borderRadius: TOKENS.radius.md, borderLeft: `3px solid ${TOKENS.colors.pink}` }}>
              <div style={{ fontWeight: 800, fontSize: "15px", color: TOKENS.colors.navy, marginBottom: "10px" }}>{page}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {sections.map(sec => <span key={sec} style={{ background: "#fff", border: `1px solid ${TOKENS.colors.gray300}`, borderRadius: TOKENS.radius.sm, padding: "4px 12px", fontSize: "12px", color: TOKENS.colors.gray700 }}>{sec}</span>)}
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

// ============================================================
// ROOT APP
// ============================================================
export default function App() {
  const [page, setPage] = useState("home");
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [selectedDest, setSelectedDest] = useState(null);

  // Load Google Fonts
  if (typeof document !== "undefined") {
    const existing = document.getElementById("pinkfoot-fonts");
    if (!existing) {
      const link = document.createElement("link");
      link.id = "pinkfoot-fonts";
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700;800&display=swap";
      document.head.appendChild(link);
    }
  }

  const navigate = (targetPage, data = null) => {
    if (targetPage === "product") { setSelectedPkg(data); setPage("product"); }
    else if (targetPage === "destination") { setSelectedDest(data); setPage("destination"); }
    else setPage(targetPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navPages = [
    { label: "🏠 Home", id: "home" },
    { label: "🔍 Search", id: "search" },
    { label: "📦 Product", id: "product" },
    { label: "🗺 Destination", id: "destination" },
    { label: "📐 Design Guide", id: "design" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: TOKENS.colors.offWhite }}>
      {/* Page switcher (prototype nav) */}
      <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 9999, display: "flex", flexDirection: "column", gap: "6px", background: "#fff", borderRadius: TOKENS.radius.lg, padding: "12px", boxShadow: TOKENS.shadow.heavy }}>
        <div style={{ fontSize: "10px", fontWeight: 700, color: TOKENS.colors.gray500, letterSpacing: "0.5px", textAlign: "center", marginBottom: "4px", textTransform: "uppercase" }}>Pages</div>
        {navPages.map(p => (
          <button key={p.id} onClick={() => navigate(p.id)} style={{ border: `1px solid ${page === p.id ? TOKENS.colors.pink : TOKENS.colors.gray200}`, background: page === p.id ? TOKENS.colors.pinkPale : "#fff", color: page === p.id ? TOKENS.colors.pink : TOKENS.colors.gray700, borderRadius: TOKENS.radius.sm, padding: "6px 12px", cursor: "pointer", fontSize: "11px", fontFamily: TOKENS.fonts.body, fontWeight: 600, textAlign: "left", whiteSpace: "nowrap" }}>{p.label}</button>
        ))}
      </div>

      <Navbar currentPage={page} onNavigate={navigate} />

      {page === "home"        && <HomePage onNavigate={navigate} />}
      {page === "search"      && <SearchPage onNavigate={navigate} />}
      {page === "product"     && <ProductPage pkg={selectedPkg} onNavigate={navigate} />}
      {page === "destination" && <DestinationPage dest={selectedDest} onNavigate={navigate} />}
      {page === "design"      && <DesignGuide />}
    </div>
  );
}
