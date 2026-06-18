import SectionHeader from "../components/SectionHeader.jsx";
import { Icon, Phone, Mail, MessageCircle, MapPin } from "../components/icons/index.jsx";

export default function ContactPage() {
  const channels = [
    {
      IconComp: Phone,
      label: "Call us",
      value: "+91 8109030897",
      href: "tel:+918109030897",
    },
    {
      IconComp: Mail,
      label: "Email",
      value: "info@pinkfoottravel.com",
      href: "mailto:info@pinkfoottravel.com",
    },
    {
      IconComp: MessageCircle,
      label: "WhatsApp",
      value: "+91 8109030897",
      href: "https://wa.me/918109030897",
    },
    {
      IconComp: MapPin,
      label: "Address",
      value: "First Floor - 27, Kailash Puri, Opp Sai Baba Mandir, near Khandaka Hospital, Tonk Road, Jaipur - 302018, Rajasthan",
      href: "https://maps.google.com/?q=First+Floor+-+27,+Kailash+Puri,+Opp+Sai+Baba+Mandir,+near+Khandaka+Hospital,+Tonk+Road,+Jaipur+-+302018,+Rajasthan",
    },
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
          <div className="mx-auto mt-10 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {channels.map((c) => {
              const CardTag = c.href ? "a" : "div";
              return (
                <CardTag
                  key={c.label}
                  href={c.href}
                  {...(c.href ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex flex-col items-center justify-start rounded-2xl bg-white p-6 text-center shadow-[var(--shadow-card)] transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mx-auto inline-grid h-14 w-14 flex-shrink-0 place-items-center rounded-full bg-[var(--color-pink-pale)] text-[var(--color-pink)]">
                    <Icon size={26} animateOnHover><c.IconComp /></Icon>
                  </div>
                  <div className="mt-3 text-xs font-bold uppercase tracking-wider text-gray-500">
                    {c.label}
                  </div>
                  <div className={`mt-2 font-display text-[var(--color-navy)] leading-snug break-words ${c.label === "Address" ? "text-xs font-semibold" : "text-lg font-bold"}`}>
                    {c.value}
                  </div>
                </CardTag>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
