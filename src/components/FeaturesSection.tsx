import { Shield, Headphones, CreditCard, Sparkles } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Secure Booking",
    description: "Your payments and personal data are protected with enterprise-grade security.",
  },
  {
    icon: Headphones,
    title: "24/7 Concierge",
    description: "Dedicated travel experts available around the clock for your peace of mind.",
  },
  {
    icon: CreditCard,
    title: "Flexible Payments",
    description: "Split payments, deposits, and multi-currency support for your convenience.",
  },
  {
    icon: Sparkles,
    title: "AI Itineraries",
    description: "Get personalized travel plans crafted by AI, tailored to your preferences.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-gold text-sm font-medium tracking-widest uppercase mb-2">Why TravelHub</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
            Travel With Confidence
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="text-center group"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-secondary flex items-center justify-center mb-5 group-hover:bg-gold/10 transition-colors">
                <feature.icon className="h-7 w-7 text-gold" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
