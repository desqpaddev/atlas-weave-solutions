import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock, Send, Globe, MessageCircle, Headphones, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import contactHero from "@/assets/contact-hero.jpg";
import landscapeImg from "@/assets/about-landscape.jpg";

const quickContacts = [
  { icon: Phone, title: "Call Us", info: "+44 7418375151", sub: "Mon–Sat, 9am–6pm", href: "tel:+447418375151", color: "from-primary/20 to-primary/5" },
  { icon: Mail, title: "Email Us", info: "admin@joannaholidays.uk", sub: "Reply within 24 hours", href: "mailto:admin@joannaholidays.uk", color: "from-accent/30 to-accent/5" },
  { icon: MessageCircle, title: "WhatsApp", info: "Chat with our team", sub: "Fast & friendly support", href: "https://wa.me/447418375151", color: "from-emerald-500/20 to-emerald-500/5" },
  { icon: MapPin, title: "Visit Office", info: "Maidstone, Kent", sub: "ME 15 6JQ, United Kingdom", href: "#office", color: "from-primary/20 to-primary/5" },
];

const features = [
  { icon: Sparkles, title: "Tailor-made Trips", desc: "Itineraries built around your style, pace and budget." },
  { icon: Headphones, title: "24/7 Support", desc: "Dedicated travel concierge before, during and after your trip." },
  { icon: Globe, title: "IATA Accredited", desc: "Trusted Direct DMC for the UK and Europe with 8+ years of excellence." },
];

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    setLoading(true);
    try {
      const { data: companies } = await supabase.from("companies").select("id").limit(1);
      const companyId = companies?.[0]?.id;
      if (!companyId) { toast.error("Unable to submit. Please try again later."); setLoading(false); return; }
      const { error } = await supabase.from("leads").insert({
        full_name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        notes: form.message.trim() || null,
        source: "website",
        company_id: companyId,
      });
      if (error) throw error;
      toast.success("Thank you! We'll get back to you soon.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <PageHero
        image={contactHero}
        eyebrow={<><MessageCircle className="h-4 w-4" /> We'd love to hear from you</>}
        title={<>Let's Plan Your <span className="text-accent">Perfect Journey</span></>}
        subtitle="From quick questions to fully tailor-made itineraries — our travel experts in Kent are here to help every step of the way."
      />

      {/* Quick contact cards floating over hero */}
      <section className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickContacts.map((c) => (
            <a
              key={c.title}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="group bg-card border border-border rounded-2xl p-5 shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <c.icon className="h-5 w-5 text-primary" />
              </div>
              <p className="font-display font-bold text-foreground">{c.title}</p>
              <p className="text-sm text-foreground mt-1 line-clamp-1">{c.info}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{c.sub}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Form + side info */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-5 gap-10 max-w-6xl mx-auto items-start">
          {/* Form */}
          <div className="lg:col-span-3 bg-card border border-border rounded-3xl p-6 md:p-10 shadow-card">
            <span className="text-primary font-semibold text-sm tracking-widest uppercase block mb-2">Send a Message</span>
            <h2 className="font-display text-3xl font-bold text-foreground mb-2 leading-tight">
              Tell us about your dream trip
            </h2>
            <p className="text-muted-foreground mb-7">Fill in the form and one of our travel experts will get back to you within 24 hours with a personalised proposal.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name *</label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" required className="h-12" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Email *</label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" required className="h-12" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Phone</label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+44 7XXX XXXXXX" className="h-12" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Tell us about your trip</label>
                <Textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Destinations, travel dates, number of travellers, budget, special interests…"
                  rows={6}
                />
              </div>
              <Button type="submit" variant="brand" size="lg" disabled={loading} className="w-full sm:w-auto gap-2 rounded-full px-8">
                {loading ? "Sending..." : <><Send className="h-4 w-4" /> Send Message</>}
              </Button>
            </form>
          </div>

          {/* Side info */}
          <aside className="lg:col-span-2 space-y-6">
            <div className="relative rounded-3xl overflow-hidden h-56 shadow-card">
              <img src={landscapeImg} alt="UK & European landscape" loading="lazy" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 text-primary-foreground">
                <p className="font-display text-xl font-bold leading-tight">Direct DMC for the UK & Europe</p>
                <p className="text-sm text-white/85 mt-1">From iconic landmarks to hidden gems</p>
              </div>
            </div>

            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-4 bg-secondary/40 rounded-2xl p-5 border border-border/50">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-display font-semibold text-foreground">{f.title}</p>
                  <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </aside>
        </div>
      </section>

      {/* Office banner */}
      <section id="office" className="container mx-auto px-4 pb-20">
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl overflow-hidden p-8 md:p-12 text-primary-foreground relative">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <MapPin className="h-10 w-10 text-accent mb-3" />
              <h3 className="font-display text-3xl font-bold mb-2">Visit Our Office in Kent</h3>
              <p className="text-white/85 leading-relaxed mb-4">
                The Business Terrace, Maidstone House, King Street,<br /> Maidstone, Kent. ME 15 6JQ, United Kingdom
              </p>
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <Clock className="h-4 w-4 text-accent" /> Mon – Sat: 9AM – 6PM · Sunday closed
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border-2 border-white/20 shadow-elevated h-64">
              <iframe
                title="Joanna Holidays Office Location"
                src="https://www.google.com/maps?q=Maidstone+House+King+Street+Maidstone+Kent+ME15+6JQ&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
