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
    <footer className="bg-foreground text-background">
      {/* Newsletter band */}
      <div className="border-b border-background/10">
        <div className="container mx-auto px-6 md:px-10 py-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="block text-[11px] font-sans-ui font-semibold tracking-[0.28em] uppercase text-accent mb-4">
              Stay in touch
            </span>
            <h3 className="font-display text-3xl md:text-4xl text-background leading-tight">
              Receive our <em className="italic">latest journeys</em>, directly.
            </h3>
          </div>
          <form className="flex items-center gap-0 border-b border-background/30 focus-within:border-accent transition-colors">
            <Input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-transparent border-0 rounded-none text-background placeholder:text-background/50 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-14"
            />
            <Button
              type="submit"
              className="bg-transparent hover:bg-transparent text-accent text-xs font-sans-ui font-semibold tracking-[0.22em] uppercase px-0 gap-2"
            >
              Subscribe <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-6 md:px-10 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            {logoUrl ? (
              <img src={logoUrl} alt={companyName} className="h-12 w-auto max-w-[180px] object-contain mb-5 brightness-0 invert" />
            ) : (
              <span className="font-display text-2xl text-background block mb-5 tracking-[0.05em]">
                {companyName}
              </span>
            )}
            <p className="text-sm text-background/60 leading-relaxed mb-6">
              Your trusted Direct DMC for the UK and Europe — crafting private, expertly-guided journeys from our home in Kent.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Facebook, href: "#", label: "Facebook" },
                { Icon: Instagram, href: "https://www.instagram.com/joannaholidays.uk.europe/", label: "Instagram" },
                { Icon: Youtube, href: "#", label: "YouTube" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-background/20 flex items-center justify-center hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Journeys */}
          <div>
            <h4 className="font-sans-ui text-[11px] font-semibold tracking-[0.22em] uppercase text-background mb-5">
              Journeys
            </h4>
            <ul className="space-y-3 text-sm text-background/65">
              {[
                { label: "Destinations", href: "/tours" },
                { label: "Holiday Packages", href: "/packages" },
                { label: "Cruises", href: "/cruises" },
                { label: "Fixed Departures", href: "/departures" },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="hover:text-accent transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-sans-ui text-[11px] font-semibold tracking-[0.22em] uppercase text-background mb-5">
              About
            </h4>
            <ul className="space-y-3 text-sm text-background/65">
              {[
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Terms of Service", href: "/terms-of-service" },
                { label: "Cookie Policy", href: "/cookie-policy" },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="hover:text-accent transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-sans-ui text-[11px] font-semibold tracking-[0.22em] uppercase text-background mb-5">
              Speak to us
            </h4>
            <ul className="space-y-4 text-sm text-background/65">
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <a href={`tel:${companyPhone}`} className="hover:text-accent transition-colors">{companyPhone}</a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <a href={`mailto:${companyEmail}`} className="hover:text-accent transition-colors break-all">{companyEmail}</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <span className="leading-relaxed">{companyAddress}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-14 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-background/45">
          <p>© {new Date().getFullYear()} {companyName}. All rights reserved.</p>
          <p className="font-sans-ui tracking-[0.18em] uppercase text-[10px]">IATA Accredited Travel Management Company</p>
        </div>
      </div>
    </footer>
  );
}
