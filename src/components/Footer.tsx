import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, MapPin, Phone, Facebook, Instagram, Youtube, ArrowRight, Globe, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function Footer() {
  const { data: company } = useQuery({
    queryKey: ["footer-company"],
    queryFn: async () => {
      const { data } = await supabase.from("companies").select("name, logo_url, phone, email, address, website, settings").limit(1).maybeSingle();
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const companyName = company?.name || "Joanna Holidays";
  const companyEmail = company?.email || "admin@joannaholidays.uk";
  const companyPhone = company?.phone || "+44 7418375151";
  const companyAddress = company?.address || "The Business Terrace, Maidstone House, King Street, Maidstone, Kent. ME 15 6JQ";
  const logoUrl = company?.logo_url;

  return (
    <footer className="bg-foreground text-background relative overflow-hidden">
      {/* Decorative top wave */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />

      {/* Newsletter */}
      <div className="container mx-auto px-4 py-14">
        <div className="relative bg-gradient-blue rounded-3xl p-8 md:p-12 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="font-display text-xl md:text-2xl font-bold text-white mb-2">
                Get Exclusive Travel Deals ✈
              </h3>
              <p className="text-white/70 text-sm max-w-md">
                Subscribe to receive handpicked destinations and early access to our best packages.
              </p>
            </div>
            <div className="flex gap-2 w-full max-w-sm">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl h-12"
              />
              <Button variant="brand-yellow" className="rounded-xl h-12 px-6 gap-2">
                <Send className="h-4 w-4" /> Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            {logoUrl ? (
              <img src={logoUrl} alt={companyName} className="h-12 w-auto max-w-[180px] object-contain mb-4 brightness-0 invert" />
            ) : (
              <span className="font-display text-2xl font-bold text-accent block mb-4">{companyName}</span>
            )}
            <p className="text-sm text-background/60 leading-relaxed mb-5">
              Joanna Holidays Pvt Ltd is an IATA Accredited Travel Management Company. With over 8 years of excellence, we craft exceptional travel experiences tailored to your needs.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Youtube, Globe].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:scale-110">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Travel Itineraries */}
          <div>
            <h4 className="font-display font-semibold text-background mb-5 text-sm relative inline-block">
              Travel Itineraries
              <span className="absolute -bottom-1.5 left-0 w-8 h-0.5 bg-accent rounded-full" />
            </h4>
            <ul className="space-y-3 text-sm text-background/60">
              {[
                { label: "Tour Listings", href: "/tours" },
                { label: "Holiday Packages", href: "/packages" },
                { label: "Cruise Tours", href: "/cruises" },
                { label: "Fixed Departures", href: "/departures" },
                { label: "Destinations", href: "/tours" },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="hover:text-accent transition-colors flex items-center gap-1.5 group">
                    <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-accent" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-display font-semibold text-background mb-5 text-sm relative inline-block">
              Explore Now
              <span className="absolute -bottom-1.5 left-0 w-8 h-0.5 bg-accent rounded-full" />
            </h4>
            <ul className="space-y-3 text-sm text-background/60">
              {[
                { label: "About Us", href: "/about" },
                { label: "Contact Us", href: "/contact" },
                { label: "Privacy Policy", href: "#" },
                { label: "Terms of Service", href: "#" },
                { label: "Cookie Policy", href: "#" },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="hover:text-accent transition-colors flex items-center gap-1.5 group">
                    <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-accent" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-background mb-5 text-sm relative inline-block">
              Contact Info
              <span className="absolute -bottom-1.5 left-0 w-8 h-0.5 bg-accent rounded-full" />
            </h4>
            <ul className="space-y-4 text-sm text-background/60">
              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-background text-xs mb-0.5">Need Help?</p>
                  <p>{companyPhone}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-background text-xs mb-0.5">Email Us</p>
                  <p>{companyEmail}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-background text-xs mb-0.5">Location</p>
                  <p className="leading-relaxed">{companyAddress}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-background/40">
          <p>© {new Date().getFullYear()} {companyName}. All rights reserved.</p>
          <p>IATA Accredited Travel Management Company</p>
        </div>
      </div>
    </footer>
  );
}
