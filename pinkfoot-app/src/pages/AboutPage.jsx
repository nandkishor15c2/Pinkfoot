import SectionHeader from "../components/SectionHeader.jsx";

export default function AboutPage() {
  return (
    <main className="pt-[72px]">
      <section className="bg-[var(--color-pink-pale)] py-20">
        <div className="container-page">
          <SectionHeader
            eyebrow="About Us"
            title="Travel is who we are."
            subtitle="Since 2018 Pinkfoot has been quietly building India's most personal travel company — every itinerary handcrafted, every traveller treated like family."
          />
        </div>
      </section>
      <section className="container-page py-20">
        <div className="prose mx-auto max-w-3xl text-gray-700">
          <p>We're a small team of obsessive trip designers, ground-staff veterans, and on-call concierges scattered across India and four time zones abroad.</p>
          <p>This page is intentionally brief while we finish the rest of the site — full story coming soon.</p>
        </div>
      </section>
    </main>
  );
}
