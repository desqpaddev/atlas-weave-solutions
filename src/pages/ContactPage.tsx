import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock, Send, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
      <div className="bg-primary text-primary-foreground py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-display text-3xl md:text-5xl font-bold mb-3">Contact Us</h1>
          <p className="text-primary-foreground/80 max-w-lg mx-auto">
            Have questions about your dream trip? We'd love to hear from you. Our travel experts are here to help.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-14">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="space-y-5">
            {[
              { icon: Phone, title: "Phone", info: "+44 7418375151", sub: "Mon-Sat, 9am-6pm" },
              { icon: Mail, title: "Email", info: "admin@joannaholidays.uk", sub: "We reply within 24 hours" },
              { icon: MapPin, title: "Office", info: "The Business Terrace, Maidstone House, King Street", sub: "Maidstone, Kent. ME 15 6JQ" },
              { icon: Clock, title: "Hours", info: "Mon - Sat: 9AM - 6PM", sub: "Sunday: Closed" },
              { icon: Globe, title: "Website", info: "joannaholidays.uk", sub: "IATA Accredited" },
            ].map((item) => (
              <Card key={item.title} className="bg-card border-border hover:border-primary/30 hover:shadow-card transition-all duration-300">
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
                    <p className="text-foreground text-sm">{item.info}</p>
                    <p className="text-muted-foreground text-xs">{item.sub}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="md:col-span-2 bg-card border-border">
            <CardContent className="p-6 md:p-8">
              <h2 className="font-display text-xl font-bold text-foreground mb-1">Send us a Message</h2>
              <p className="text-sm text-muted-foreground mb-6">Let us know about your dream trip and we'll craft the perfect itinerary.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Full Name *</label>
                    <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Email *</label>
                    <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" required />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Phone</label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+44 7XXX XXXXXX" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Message</label>
                  <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us about your dream trip..." rows={5} />
                </div>
                <Button type="submit" variant="brand" size="lg" disabled={loading} className="w-full sm:w-auto gap-2">
                  {loading ? "Sending..." : <><Send className="h-4 w-4" /> Send Message</>}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
