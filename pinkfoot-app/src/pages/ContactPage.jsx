import SectionHeader from "../components/SectionHeader.jsx";
import { Icon, Phone, Mail, MessageCircle } from "../components/icons/index.jsx";

export default function ContactPage() {
  const channels = [
    { IconComp: Phone,         label: "Call us",   value: "+91 98765 43210" },
    { IconComp: Mail,          label: "Email",     value: "hello@pinkfoot.travel" },
    { IconComp: MessageCircle, label: "WhatsApp",  value: "+91 98765 43210" },
  ];
  return (
    <main className="pt-[72px]">
      <section className="bg-[var(--color-pink-pale)] py-20">
        <div className="container-page">
          <SectionHeader
            eyebrow="Get in Touch"
            title="Let's plan your next escape."
            subtitle="WhatsApp, email, or call — our trip designers reply within an hour during business hours."
          />
          <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-3">
            {channels.map((c) => (
              <div key={c.label} className="rounded-2xl bg-white p-6 text-center shadow-[var(--shadow-card)]">
                <div className="mx-auto inline-grid h-14 w-14 place-items-center rounded-full bg-[var(--color-pink-pale)] text-[var(--color-pink)]">
                  <Icon size={26} animateOnHover><c.IconComp /></Icon>
                </div>
                <div className="mt-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                  {c.label}
                </div>
                <div className="mt-1 font-display text-lg font-bold text-[var(--color-navy)]">
                  {c.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
