import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Shield, Users, Award, Globe, MapPin, Plane, Heart, Star } from "lucide-react";

const stats = [
  { value: "8+", label: "Years of Excellence" },
  { value: "10K+", label: "Happy Travelers" },
  { value: "50+", label: "Destinations" },
  { value: "500+", label: "Tour Packages" },
];

const values = [
  { icon: Shield, title: "IATA Accredited", desc: "We are a fully IATA Accredited Travel Management Company, ensuring the highest standards of service and reliability." },
  { icon: Users, title: "Expert Team", desc: "Our dynamic team of experienced travel professionals is dedicated to crafting exceptional travel experiences." },
  { icon: Award, title: "Excellence Since 2017", desc: "With over 8 years of excellence, we have established ourselves as leaders in the hospitality & tourism sector." },
  { icon: Globe, title: "Worldwide Coverage", desc: "From exotic beaches to historic cities, we cover destinations across every continent." },
  { icon: Heart, title: "Tailored Experiences", desc: "Every journey is personally crafted to match your preferences, budget, and travel style." },
  { icon: Star, title: "Best Price Guarantee", desc: "We ensure competitive pricing without compromising on quality or experience." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="bg-primary text-primary-foreground py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-4">
            <Plane className="h-4 w-4" />
            <span className="text-sm font-medium">About Joanna Holidays</span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">Your Trusted Travel Partner</h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
            Headquartered in South India, serving travelers worldwide with passion and expertise.
          </p>
        </div>
      </div>

      {/* About content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <span className="text-primary font-semibold text-sm tracking-widest uppercase mb-3 block">Our Story</span>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                Where Exceptional <span className="text-primary">Memories Begin</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Joanna Holidays Pvt Ltd is an IATA Accredited Travel Management Company headquartered in South India. With over 8 years of excellence since 2017, we have established ourselves as leaders in the hospitality & Tourism sector.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our dynamic team of experienced travel professionals is dedicated to crafting exceptional travel experiences tailored to your needs. We believe travel should be transformative — creating memories that last a lifetime.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-primary/5 rounded-2xl p-6 text-center border border-primary/10">
                  <p className="font-display text-3xl font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Values */}
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm tracking-widest uppercase mb-3 block">Why Choose Us</span>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              What Makes Us <span className="text-primary">Different</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 hover:shadow-card transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <v.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>

          {/* Location */}
          <div className="mt-20 bg-secondary/50 rounded-3xl p-8 md:p-12 text-center">
            <MapPin className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold text-foreground mb-2">Visit Our Office</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              The Business Terrace, Maidstone House, King Street, Maidstone, Kent. ME 15 6JQ, United Kingdom
            </p>
            <p className="text-primary font-medium mt-3">+44 7418375151 · admin@joannaholidays.uk</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
