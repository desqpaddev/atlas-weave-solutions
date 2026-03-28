import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Frequent Traveler",
    content: "TravelHub transformed how I plan vacations. The AI itinerary builder saved me hours, and every hotel was exactly as described.",
    rating: 5,
  },
  {
    name: "James Chen",
    role: "Business Executive",
    content: "The seamless booking experience and concierge support are unmatched. Worth every penny for the peace of mind.",
    rating: 5,
  },
  {
    name: "Amara Okafor",
    role: "Honeymoon Trip",
    content: "Our Maldives package was perfect — from the overwater villa to the private dinner. Absolutely magical experience.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            What Our Travelers Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-card rounded-xl p-6 border border-border shadow-soft relative">
              <Quote className="h-8 w-8 text-primary/15 absolute top-4 right-4" />
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-accent fill-accent" />
                ))}
              </div>
              <p className="text-foreground/80 text-sm leading-relaxed mb-5">"{t.content}"</p>
              <div className="border-t border-border pt-4">
                <p className="font-semibold text-foreground text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
