import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Shield, Users, Award, Globe, MapPin, Plane, Heart, Star, Sparkles, Compass, Phone, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImg from "@/assets/about-hero.jpg";
import teamImg from "@/assets/about-team.jpg";
import travelersImg from "@/assets/about-travelers.jpg";
import landscapeImg from "@/assets/about-landscape.jpg";

const stats = [
  { value: "8+", label: "Years of Excellence" },
  { value: "10K+", label: "Happy Travelers" },
  { value: "50+", label: "Destinations" },
  { value: "500+", label: "Tour Packages" },
];

const values = [
  { icon: Shield, title: "IATA Accredited", desc: "A fully IATA Accredited Travel Management Company, ensuring the highest standards of service and reliability." },
  { icon: Users, title: "Expert Local Team", desc: "Our travel experts bring deep local knowledge, professional excellence and an unwavering commitment to quality." },
  { icon: Award, title: "Trusted Direct DMC", desc: "A leading Destination Management Company for the UK and Europe, dedicated to crafting exceptional journeys." },
  { icon: Globe, title: "Worldwide Coverage", desc: "From iconic landmarks to hidden gems across the UK and Europe, we deliver experiences beyond expectations." },
  { icon: Heart, title: "Personalized Service", desc: "Every traveler is unique. We listen, understand, and design journeys that match your dreams and preferences." },
  { icon: Star, title: "Comprehensive Solutions", desc: "Flights, hotels, visas, transfers and tours — we handle every detail so you can focus on making memories." },
  { icon: Sparkles, title: "Luxury & Private Tours", desc: "Specialists in luxury, private, minivan and group tours blending comfort, culture and class." },
  { icon: Compass, title: "Personal Touch", desc: "Every journey is crafted with precision, passion and a personal touch — turning dreams into lifelong memories." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero with image */}
      <section className="relative h-[60vh] min-h-[420px] flex items-center justify-center overflow-hidden">
        <img src={heroImg} alt="London skyline at sunset" className="absolute inset-0 w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/50 to-primary/80" />
        <div className="container mx-auto px-4 relative z-10 text-center text-primary-foreground">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 mb-5 border border-white/20">
            <Plane className="h-4 w-4" />
            <span className="text-sm font-medium tracking-wide">About Joanna Holidays</span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-5 leading-tight drop-shadow-lg">
            Crafting Journeys,<br /><span className="text-accent">Creating Memories</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/90 leading-relaxed">
            Your trusted Direct DMC for the UK and Europe — where every journey is crafted with precision, passion and a personal touch.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <Button asChild variant="brand-yellow" size="lg" className="rounded-full">
              <Link to="/tours">Explore Tours <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary">
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="container mx-auto px-4 -mt-12 relative z-20">
        <div className="bg-card border border-border rounded-3xl shadow-card p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center px-2">
              <p className="font-display text-3xl md:text-4xl font-bold text-primary">{s.value}</p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story section with image */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="relative">
            <img src={travelersImg} alt="Travelers in Paris" loading="lazy" width={1200} height={1500} className="w-full h-[500px] object-cover rounded-3xl shadow-card" />
            <div className="absolute -bottom-6 -right-6 bg-accent text-accent-foreground rounded-2xl p-5 shadow-lg max-w-[200px] hidden md:block">
              <Award className="h-6 w-6 mb-2" />
              <p className="font-display font-bold text-lg leading-tight">IATA Accredited</p>
              <p className="text-xs opacity-90 mt-1">Trusted worldwide</p>
            </div>
          </div>
          <div>
            <span className="text-primary font-semibold text-sm tracking-widest uppercase mb-3 block">Our Story</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-5 leading-tight">
              Where Exceptional <span className="text-primary">Memories Begin</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Welcome to Joanna Holidays, your trusted Direct DMC for the UK and Europe. Based in the heart of Kent, United Kingdom, we have proudly built our reputation as a leading destination management company creating exceptional travel experiences for discerning clients and global travel partners.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We specialize in curating luxury tours, private tours, minivan tours, group tours and premium vacations — every itinerary reflects the perfect blend of comfort, culture and class. From iconic landmarks to hidden gems, we deliver experiences that go beyond expectations.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Whether it's a family getaway, a corporate incentive trip or a luxury European escape, Joanna Holidays guarantees a smooth, memorable and enriching journey every time.
            </p>
          </div>
        </div>
      </section>

      {/* Team / Mission split */}
      <section className="bg-secondary/40 py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <span className="text-primary font-semibold text-sm tracking-widest uppercase mb-3 block">Our Mission</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-5 leading-tight">
                People at the heart of every <span className="text-primary">journey</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Our team of travel experts brings deep local knowledge, professional excellence and a commitment to quality that ensures seamless service from start to finish. We believe travel should be effortless, immersive and unforgettable.
              </p>
              <ul className="space-y-3">
                {["Direct DMC for UK & Europe", "24/7 dedicated traveler support", "Tailor-made luxury & group itineraries", "Transparent pricing in GBP"].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Star className="h-3 w-3 text-primary fill-primary" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-1 md:order-2 relative">
              <img src={teamImg} alt="Joanna Holidays team" loading="lazy" width={1200} height={1200} className="w-full h-[500px] object-cover rounded-3xl shadow-card" />
              <div className="absolute -top-6 -left-6 bg-primary text-primary-foreground rounded-2xl p-5 shadow-lg max-w-[200px] hidden md:block">
                <Heart className="h-6 w-6 mb-2 text-accent" />
                <p className="font-display font-bold text-lg leading-tight">10K+ Happy Travelers</p>
                <p className="text-xs opacity-90 mt-1">And counting</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <span className="text-primary font-semibold text-sm tracking-widest uppercase mb-3 block">Why Choose Us</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            What Makes Us <span className="text-primary">Different</span>
          </h2>
          <p className="text-muted-foreground mt-4">Eight reasons travelers and partners worldwide choose Joanna Holidays for their UK and European journeys.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {values.map((v) => (
            <div key={v.title} className="bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-card hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <v.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA banner with landscape */}
      <section className="container mx-auto px-4 pb-20">
        <div className="relative rounded-3xl overflow-hidden h-[400px] flex items-center">
          <img src={landscapeImg} alt="Scottish highlands" loading="lazy" width={1600} height={900} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
          <div className="relative z-10 p-8 md:p-14 max-w-xl text-primary-foreground">
            <MapPin className="h-10 w-10 text-accent mb-4" />
            <h3 className="font-display text-3xl md:text-4xl font-bold mb-3 leading-tight">Visit Our Office in Kent</h3>
            <p className="text-white/90 mb-6 leading-relaxed">
              The Business Terrace, Maidstone House, King Street, Maidstone, Kent. ME 15 6JQ, United Kingdom
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <a href="tel:+447418375151" className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 hover:bg-white hover:text-primary transition-colors border border-white/20">
                <Phone className="h-4 w-4" /> +44 7418375151
              </a>
              <a href="mailto:admin@joannaholidays.uk" className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 hover:bg-white hover:text-primary transition-colors border border-white/20">
                <Mail className="h-4 w-4" /> admin@joannaholidays.uk
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
