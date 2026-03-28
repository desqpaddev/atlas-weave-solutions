import { Shield, Headphones, CreditCard, Sparkles, Award, Clock } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Secure Booking",
    description: "Enterprise-grade security for your payments and personal data.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated travel experts available around the clock.",
  },
  {
    icon: CreditCard,
    title: "Flexible Payments",
    description: "Split payments, deposits, and multi-currency support.",
  },
  {
    icon: Sparkles,
    title: "AI Itineraries",
    description: "Personalized travel plans crafted by AI for your preferences.",
  },
  {
    icon: Award,
    title: "Best Price Guarantee",
    description: "We match any lower price you find for the same package.",
  },
  {
    icon: Clock,
    title: "Instant Confirmation",
    description: "Get immediate booking confirmation and e-vouchers.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Why Choose TravelHub
          </h2>
          <p className="text-muted-foreground mt-2 text-sm max-w-lg mx-auto">
            Trusted by thousands of travelers for seamless booking experiences.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="text-center group"
            >
              <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-sm font-semibold text-foreground mb-1">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
