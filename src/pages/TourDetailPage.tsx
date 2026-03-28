import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Check, X, Star, Users, ChevronRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Json } from "@/integrations/supabase/types";

type ItineraryDay = { day: number; title: string; description: string; activities: string[] };

export default function TourDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [bookingForm, setBookingForm] = useState({
    fullName: "", email: "", phone: "", pax: 1, checkIn: "", notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const { data: tour, isLoading } = useQuery({
    queryKey: ["tour-detail", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tours")
        .select("*")
        .eq("slug", slug!)
        .eq("is_active", true)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tour) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("leads").insert({
        company_id: tour.company_id,
        full_name: bookingForm.fullName,
        email: bookingForm.email,
        phone: bookingForm.phone,
        pax: bookingForm.pax,
        destination: tour.destination,
        travel_dates: bookingForm.checkIn,
        budget: tour.adult_price * bookingForm.pax,
        source: "website",
        notes: `Tour: ${tour.title}\n${bookingForm.notes}`,
        status: "new",
      });
      if (error) throw error;
      toast.success("Booking inquiry submitted! We'll contact you shortly.");
      setBookingForm({ fullName: "", email: "", phone: "", pax: 1, checkIn: "", notes: "" });
    } catch (err: any) {
      toast.error(err.message || "Failed to submit inquiry");
    } finally {
      setSubmitting(false);
    }
  };

  const itinerary: ItineraryDay[] = Array.isArray(tour?.itinerary)
    ? (tour.itinerary as unknown as ItineraryDay[])
    : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-32 text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Tour Not Found</h1>
          <Button variant="brand" asChild><Link to="/tours">Browse Tours</Link></Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="bg-secondary border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/tours" className="hover:text-primary">Tours</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{tour.title}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="font-display text-2xl md:text-4xl font-bold text-foreground">{tour.title}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                {tour.destination && <span className="flex items-center gap-1"><MapPin className="h-4 w-4 text-primary" /> {tour.destination}</span>}
                <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-primary" /> {tour.duration_days}D / {tour.duration_nights}N</span>
                {tour.category && <Badge variant="outline">{tour.category}</Badge>}
                {tour.difficulty && <Badge variant="outline">{tour.difficulty}</Badge>}
                {tour.max_group_size && <span className="flex items-center gap-1"><Users className="h-4 w-4 text-primary" /> Max {tour.max_group_size}</span>}
              </div>
            </div>

            {tour.cover_image && (
              <img src={tour.cover_image} alt={tour.title} className="w-full rounded-xl object-cover max-h-[400px]" />
            )}

            {tour.description && (
              <div>
                <h2 className="font-display text-xl font-bold text-foreground mb-3">Overview</h2>
                <p className="text-muted-foreground leading-relaxed">{tour.description}</p>
              </div>
            )}

            {tour.highlights && tour.highlights.length > 0 && (
              <div>
                <h2 className="font-display text-xl font-bold text-foreground mb-3">Highlights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {tour.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <Star className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {itinerary.length > 0 && (
              <div>
                <h2 className="font-display text-xl font-bold text-foreground mb-4">Day-wise Itinerary</h2>
                <div className="space-y-4">
                  {itinerary.map((day) => (
                    <div key={day.day} className="border border-border rounded-xl p-5 bg-card">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">{day.day}</span>
                        <h3 className="font-display font-semibold text-foreground">{day.title}</h3>
                      </div>
                      {day.description && <p className="text-muted-foreground text-sm ml-[52px] mb-2">{day.description}</p>}
                      {day.activities && day.activities.length > 0 && (
                        <ul className="ml-[52px] space-y-1">
                          {day.activities.map((a, j) => (
                            <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Check className="h-3.5 w-3.5 text-primary shrink-0" /> {a}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {tour.inclusions && tour.inclusions.length > 0 && (
                <div>
                  <h2 className="font-display text-lg font-bold text-foreground mb-3">Inclusions</h2>
                  <ul className="space-y-2">
                    {tour.inclusions.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-green-500 shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {tour.exclusions && tour.exclusions.length > 0 && (
                <div>
                  <h2 className="font-display text-lg font-bold text-foreground mb-3">Exclusions</h2>
                  <ul className="space-y-2">
                    {tour.exclusions.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <X className="h-4 w-4 text-destructive shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Pricing table */}
            <div>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">Pricing</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-card border border-border rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Adult</p>
                  <p className="text-2xl font-bold text-primary">${Number(tour.adult_price).toLocaleString()}</p>
                </div>
                {tour.child_price && Number(tour.child_price) > 0 && (
                  <div className="bg-card border border-border rounded-xl p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Child</p>
                    <p className="text-2xl font-bold text-primary">${Number(tour.child_price).toLocaleString()}</p>
                  </div>
                )}
                {tour.group_price && Number(tour.group_price) > 0 && (
                  <div className="bg-card border border-border rounded-xl p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Group</p>
                    <p className="text-2xl font-bold text-primary">${Number(tour.group_price).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking sidebar */}
          <div>
            <div className="sticky top-28 bg-card border border-border rounded-xl p-6 shadow-card">
              <div className="mb-5">
                <p className="text-xs text-muted-foreground">Starting from</p>
                <p className="text-3xl font-bold text-primary font-display">${Number(tour.adult_price).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">per adult</p>
              </div>

              <form onSubmit={handleBooking} className="space-y-3">
                <div>
                  <Label className="text-xs">Full Name *</Label>
                  <Input required value={bookingForm.fullName} onChange={(e) => setBookingForm({ ...bookingForm, fullName: e.target.value })} placeholder="Your name" className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Email *</Label>
                  <Input required type="email" value={bookingForm.email} onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })} placeholder="email@example.com" className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Phone</Label>
                  <Input value={bookingForm.phone} onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })} placeholder="+1 234 567 8900" className="mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Travelers</Label>
                    <Input type="number" min={1} value={bookingForm.pax} onChange={(e) => setBookingForm({ ...bookingForm, pax: Number(e.target.value) })} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs">Travel Date</Label>
                    <Input type="date" value={bookingForm.checkIn} onChange={(e) => setBookingForm({ ...bookingForm, checkIn: e.target.value })} className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Special Requests</Label>
                  <textarea value={bookingForm.notes} onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })} rows={2} className="mt-1 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="Any special requirements..." />
                </div>

                <Button variant="brand-yellow" size="lg" className="w-full" disabled={submitting}>
                  {submitting ? "Submitting..." : "Book Now"}
                </Button>
                <p className="text-xs text-center text-muted-foreground">No payment required. We'll contact you to confirm.</p>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
