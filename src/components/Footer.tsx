import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Phone, Facebook, Instagram, Youtube, Send, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const enquirySchema = z.object({
  full_name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  destination: z.string().trim().max(100).optional().or(z.literal("")),
  travel_dates: z.string().trim().max(100).optional().or(z.literal("")),
  pax: z.coerce.number().int().min(1).max(50).optional(),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

export function Footer() {
  const { data: company } = useQuery({
    queryKey: ["footer-company"],
    queryFn: async () => {
      const { data } = await supabase.from("companies").select("id, name, logo_url, phone, email, address, website, settings").limit(1).maybeSingle();
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const companyName = company?.name || "Joanna Holidays";
  const companyEmail = company?.email || "admin@joannaholidays.uk";
  const companyPhone = company?.phone || "+44 7418375151";
  const companyAddress = company?.address || "The Business Terrace, Maidstone House, King Street, Maidstone, Kent. ME 15 6JQ";
  const logoUrl = company?.logo_url;

  const [form, setForm] = useState({ full_name: "", email: "", phone: "", destination: "", travel_dates: "", pax: "2", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company?.id) {
      toast.error("Unable to submit, please try again later.");
      return;
    }
    const parsed = enquirySchema.safeParse(form);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      toast.error(first.message);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("leads").insert({
      company_id: company.id,
      full_name: parsed.data.full_name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      destination: parsed.data.destination || null,
      travel_dates: parsed.data.travel_dates || null,
      pax: parsed.data.pax || 1,
      notes: parsed.data.notes || null,
      source: "website",
      status: "new",
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not submit enquiry. Please try again.");
      return;
    }
    toast.success("Thank you! Our team will be in touch shortly.");
    setForm({ full_name: "", email: "", phone: "", destination: "", travel_dates: "", pax: "2", notes: "" });
  };

  return (
    <footer className="bg-foreground text-background">
      {/* Enquiry band */}
      <div className="border-b border-background/10">
        <div className="container mx-auto px-6 md:px-10 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <span className="block text-[11px] font-sans-ui font-semibold tracking-[0.28em] uppercase text-accent mb-4">
              Start your journey
            </span>
            <h3 className="font-display text-3xl md:text-4xl text-background leading-tight mb-5">
              Make an <em className="italic">enquiry</em> — let our experts craft your trip.
            </h3>
            <p className="text-sm text-background/60 leading-relaxed max-w-md">
              Share a few details and one of our travel specialists will get in touch within 24 hours to design your perfect journey.
            </p>
          </div>

          <form onSubmit={handleEnquiry} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-1">
              <Label className="text-background/70 text-xs font-sans-ui tracking-wider uppercase">Full Name *</Label>
              <Input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="mt-1.5 bg-background/5 border-background/20 text-background placeholder:text-background/40 focus-visible:ring-accent" />
            </div>
            <div className="sm:col-span-1">
              <Label className="text-background/70 text-xs font-sans-ui tracking-wider uppercase">Email *</Label>
              <Input
                required
                type="email"
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  if (emailError) setEmailError("");
                }}
                onBlur={(e) => {
                  const v = e.target.value.trim();
                  setEmailError(v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Please enter a valid email address." : "");
                }}
                className="mt-1.5 bg-background/5 border-background/20 text-background placeholder:text-background/40 focus-visible:ring-accent"
              />
              {emailError && <p className="mt-1 text-xs text-accent">{emailError}</p>}
            </div>
            <div>
              <Label className="text-background/70 text-xs font-sans-ui tracking-wider uppercase">Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1.5 bg-background/5 border-background/20 text-background placeholder:text-background/40 focus-visible:ring-accent" />
            </div>
            <div>
              <Label className="text-background/70 text-xs font-sans-ui tracking-wider uppercase">Destination</Label>
              <Input value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} placeholder="e.g. Switzerland" className="mt-1.5 bg-background/5 border-background/20 text-background placeholder:text-background/40 focus-visible:ring-accent" />
            </div>
            <div>
              <Label className="text-background/70 text-xs font-sans-ui tracking-wider uppercase">Travel Dates</Label>
              <Input value={form.travel_dates} onChange={(e) => setForm({ ...form, travel_dates: e.target.value })} placeholder="e.g. June 2026" className="mt-1.5 bg-background/5 border-background/20 text-background placeholder:text-background/40 focus-visible:ring-accent" />
            </div>
            <div>
              <Label className="text-background/70 text-xs font-sans-ui tracking-wider uppercase">Travellers</Label>
              <Input type="number" min={1} value={form.pax} onChange={(e) => setForm({ ...form, pax: e.target.value })} className="mt-1.5 bg-background/5 border-background/20 text-background placeholder:text-background/40 focus-visible:ring-accent" />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-background/70 text-xs font-sans-ui tracking-wider uppercase">Tell us about your trip</Label>
              <Textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="mt-1.5 bg-background/5 border-background/20 text-background placeholder:text-background/40 focus-visible:ring-accent resize-none" />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={submitting} className="bg-accent hover:bg-accent/90 text-accent-foreground text-xs font-sans-ui font-semibold tracking-[0.22em] uppercase px-8 h-12 gap-2">
                {submitting ? "Sending..." : <>Submit Enquiry <Send className="h-4 w-4" /></>}
              </Button>
            </div>
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
            <div className="flex gap-3 mb-6">
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

            {/* Trustpilot badge */}
            <a
              href="https://www.trustpilot.com/review/joannaholidays.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border border-background/20 rounded-md px-4 py-2.5 hover:bg-background/5 transition-colors"
              aria-label="See our reviews on Trustpilot"
            >
              <div className="flex flex-col">
                <span className="text-[9px] font-sans-ui tracking-[0.22em] uppercase text-background/60">
                  Reviews
                </span>
                <span className="font-display text-sm font-semibold text-background leading-tight">
                  Trustpilot
                </span>
              </div>
              <div className="flex flex-col items-start">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`inline-flex items-center justify-center w-3.5 h-3.5 ${i < 4 ? "bg-[#00b67a]" : "bg-[#00b67a]/40"}`}
                    >
                      <Star className="h-2.5 w-2.5 text-white fill-white" />
                    </span>
                  ))}
                </div>
                <span className="text-[10px] text-background/70 mt-1">
                  <strong className="text-background">4.1</strong> · 6 reviews
                </span>
              </div>
            </a>
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
