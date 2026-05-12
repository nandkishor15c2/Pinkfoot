import { useDestinations } from "../lib/useData.js";
import DestinationCard from "../components/DestinationCard.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import Carousel from "../components/Carousel.jsx";

export default function DestinationsIndexPage() {
  const { data: destinations } = useDestinations();
  const list = destinations || [];
  return (
    <main className="pt-[72px]">
      <section className="bg-[var(--color-off-white)] py-16">
        <div className="container-page">
          <SectionHeader
            eyebrow="Destinations"
            title="40+ Worlds, One Travel Partner"
            subtitle="From Balinese sunsets to Swiss snow — explore the destinations Pinkfoot travellers love most."
          />
          <Carousel itemClassName="w-[280px] sm:w-[320px] lg:w-[360px]" gap={24}>
            {list.map((d, i) => (
              <DestinationCard key={d.id} dest={d} index={i} height={320} />
            ))}
          </Carousel>
        </div>
      </section>
    </main>
  );
}
