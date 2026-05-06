import { Compass, Award, Sparkles, Headphones } from "lucide-react";

const pillars = [
  {
    icon: Compass,
    title: "Privately Guided",
    description: "Every journey is led by an expert local guide, chosen for their depth of knowledge and character.",
  },
  {
    icon: Sparkles,
    title: "Tailor-Made",
    description: "No two itineraries are the same. Every detail is shaped around how you like to travel.",
  },
  {
    icon: Award,
    title: "Three Decades of Trust",
    description: "An IATA-accredited DMC with deep relationships across the UK, Europe and beyond.",
  },
  {
    icon: Headphones,
    title: "24 / 7 Concierge",
    description: "From the moment you enquire to the day you return — a single dedicated point of contact.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 md:py-32 bg-cream">
      <div className="container mx-auto px-6 md:px-10">
        <div className="max-w-3xl mb-16 md:mb-20">
          <span className="block text-[11px] font-sans-ui font-semibold tracking-[0.28em] uppercase text-primary mb-5">
            The Joanna Holidays Way
          </span>
          <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] text-foreground">
            A different way to <em className="italic text-primary">travel</em>.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
          {pillars.map((p) => (
            <div key={p.title} className="border-t border-foreground/15 pt-8">
              <p.icon className="h-7 w-7 text-primary mb-6" strokeWidth={1.25} />
              <h3 className="font-display text-xl md:text-2xl text-foreground mb-3 leading-snug">
                {p.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
