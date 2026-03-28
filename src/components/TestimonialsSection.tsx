import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Frequent Traveler",
    content: "TravelHub transformed how I plan vacations. The AI itinerary builder saved me hours, and every hotel was exactly as described. Truly premium service.",
    rating: 5,
  },
  {
    name: "James Chen",
    role: "Business Executive",
    content: "As someone who travels weekly, the seamless booking experience and concierge support are unmatched. Worth every penny for the peace of mind.",
    rating: 5,
  },
  {
    name: "Amara Okafor",
    role: "Honeymoon Trip",
    content: "Our Maldives package was perfect — from the overwater villa to the private dinner. TravelHub made our honeymoon absolutely magical.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-gold text-sm font-medium tracking-widest uppercase mb-2">Testimonials</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
            Loved by Travelers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-card rounded-xl p-6 border border-border">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-gold fill-gold" />
                ))}
              </div>
              <p className="text-foreground/80 text-sm leading-relaxed mb-6">"{t.content}"</p>
              <div>
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
