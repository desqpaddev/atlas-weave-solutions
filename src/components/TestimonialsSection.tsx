import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Italian Lakes, 2024",
    content:
      "Our guide knew Lake Como as a friend would. Every dinner reservation, every garden, every quiet view — perfectly chosen. The most considered trip we have ever taken.",
    rating: 5,
  },
  {
    name: "James Chen",
    role: "Scottish Highlands, 2024",
    content:
      "From the chauffeur at Edinburgh airport to the final farewell — flawless. Joanna Holidays is the rare agency that genuinely cares about the small things.",
    rating: 5,
  },
  {
    name: "Amara Okafor",
    role: "Honeymoon, Greek Islands",
    content:
      "A private yacht day in the Cyclades that we will never forget. They listened, planned, and then over-delivered on every promise.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6 md:px-10">
        <div className="max-w-3xl mb-16">
          <span className="block text-[11px] font-sans-ui font-semibold tracking-[0.28em] uppercase text-primary mb-5">
            In their words
          </span>
          <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] text-foreground">
            Stories from <em className="italic text-primary">our travellers</em>.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10">
          {testimonials.map((t) => (
            <figure key={t.name} className="border-t border-foreground/15 pt-8">
              <div className="flex gap-1 mb-5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 text-accent fill-accent" />
                ))}
              </div>
              <blockquote className="font-display text-xl md:text-[22px] leading-snug text-foreground italic">
                &ldquo;{t.content}&rdquo;
              </blockquote>
              <figcaption className="mt-6">
                <p className="font-sans-ui text-[11px] tracking-[0.2em] uppercase font-semibold text-foreground">
                  {t.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{t.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
