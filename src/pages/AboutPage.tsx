import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Shield, Users, Award, Globe, MapPin, Plane, Heart, Star, Sparkles, Compass } from "lucide-react";

const stats = [
  { value: "8+", label: "Years of Excellence" },
  { value: "10K+", label: "Happy Travelers" },
  { value: "50+", label: "Destinations" },
  { value: "500+", label: "Tour Packages" },
];

const values = [
  { icon: Shield, title: "IATA Accredited", desc: "We are a fully IATA Accredited Travel Management Company, ensuring the highest standards of service and reliability." },
  { icon: Users, title: "Expert Local Team", desc: "Our team of travel experts brings deep local knowledge, professional excellence, and a commitment to quality from start to finish." },
  { icon: Award, title: "Trusted Direct DMC", desc: "A leading Destination Management Company for the UK and Europe, dedicated to creating exceptional travel experiences." },
  { icon: Globe, title: "Worldwide Coverage", desc: "From iconic landmarks to hidden gems across the UK and Europe, we deliver experiences that go beyond expectations." },
  { icon: Heart, title: "Personalized Service", desc: "Every traveler is unique. We listen, understand, and design your journey to match your dreams and preferences." },
  { icon: Star, title: "Comprehensive Solutions", desc: "From flights and hotels to visas and tours, we handle every detail so you can focus on making memories." },
  { icon: Sparkles, title: "Luxury & Private Tours", desc: "Specialists in luxury tours, private tours, minivan tours, and group tours blending comfort, culture, and class." },
  { icon: Compass, title: "Personal Touch", desc: "Every journey is crafted with precision, passion, and a personal touch — turning dreams into lifelong memories." },
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
          <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">Crafting Journeys, Creating Memories</h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
            Your trusted Direct DMC for the UK and Europe — where every journey is crafted with precision, passion, and a personal touch.
          </p>
        </div>
      </div>

      {/* About content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <span className="text-primary font-semibold text-sm tracking-widest uppercase mb-3 block">About Joanna Holidays</span>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                Where Exceptional <span className="text-primary">Memories Begin</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Welcome to Joanna Holidays, your trusted Direct DMC for the UK and Europe. Based in the heart of the United Kingdom, Kent, we have proudly built our reputation as a leading destination management company dedicated to creating exceptional travel experiences for discerning clients and global travel partners.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We specialize in curating luxury tours, private tours, minivan tours, group tours, and premium vacations, ensuring that every itinerary reflects the perfect blend of comfort, culture, and class. From iconic landmarks to hidden gems, we deliver experiences that go beyond expectations — turning travel dreams into lifelong memories.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our team of travel experts brings deep local knowledge, professional excellence, and a commitment to quality that ensures seamless service from start to finish. Whether it's a family getaway, a corporate incentive trip, or a luxury European escape, Joanna Holidays guarantees a smooth, memorable, and enriching journey every time.
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
