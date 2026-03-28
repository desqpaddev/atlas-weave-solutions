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
import { MockPaymentDialog } from "@/components/MockPaymentDialog";
import destBali from "@/assets/dest-bali.jpg";
import destSwiss from "@/assets/dest-swiss.jpg";
import destDubai from "@/assets/dest-dubai.jpg";
import destMaldives from "@/assets/dest-maldives.jpg";
import destSantorini from "@/assets/dest-santorini.jpg";
import destKyoto from "@/assets/dest-kyoto.jpg";

type ItineraryDay = { day: number; title: string; description: string; activities: string[] };

type TourFallback = {
  slug: string; title: string; destination: string; duration_days: number; duration_nights: number;
  adult_price: number; child_price: number | null; group_price: number | null; category: string;
  difficulty: string; max_group_size: number; cover_image: string; description: string;
  highlights: string[]; inclusions: string[]; exclusions: string[]; itinerary: ItineraryDay[];
  company_id: string | null;
};

const fallbackToursBySlug: Record<string, TourFallback> = {
  "bali-wellness-retreat": { slug: "bali-wellness-retreat", title: "Bali Wellness Retreat", destination: "Bali", duration_days: 7, duration_nights: 6, adult_price: 1299, child_price: 899, group_price: 6999, category: "Wellness", difficulty: "easy", max_group_size: 12, cover_image: destBali, description: "Rejuvenate in Bali with curated spa rituals, yoga sessions, and immersive cultural experiences.", highlights: ["Sunrise yoga", "Ubud cultural tour", "Private spa therapy", "Beachside sunset dinner"], inclusions: ["6-night stay", "Daily breakfast", "Airport transfers", "Guided excursions", "Wellness sessions"], exclusions: ["International flights", "Visa fees", "Personal expenses"], itinerary: [{ day: 1, title: "Arrival in Bali", description: "Airport welcome and resort check-in.", activities: ["Private transfer", "Welcome dinner"] }, { day: 2, title: "Wellness & Relaxation", description: "Slow day focused on body and mind.", activities: ["Morning yoga", "Signature spa session"] }, { day: 3, title: "Ubud Discovery", description: "Explore Bali's cultural center.", activities: ["Rice terrace visit", "Temple walk", "Local market"] }], company_id: null },
  "swiss-alpine-adventure": { slug: "swiss-alpine-adventure", title: "Swiss Alpine Adventure", destination: "Swiss Alps", duration_days: 5, duration_nights: 4, adult_price: 2199, child_price: 1599, group_price: 10999, category: "Adventure", difficulty: "moderate", max_group_size: 10, cover_image: destSwiss, description: "A scenic alpine journey through iconic Swiss peaks, mountain trains, and adrenaline activities.", highlights: ["Glacier viewpoints", "Alpine rail routes", "Adventure activities", "Lakeside villages"], inclusions: ["4-night stay", "Breakfast", "Transport pass", "Guided mountain experience"], exclusions: ["Visa fees", "Travel insurance", "Lunch and dinners"], itinerary: [{ day: 1, title: "Arrival & Orientation", description: "Settle into your alpine base.", activities: ["Hotel check-in", "Town orientation walk"] }, { day: 2, title: "Peak Experience", description: "Day at high altitude viewpoints.", activities: ["Cable car ascent", "Glacier platform visit"] }, { day: 3, title: "Adventure Day", description: "Choose your thrill in the Alps.", activities: ["Optional skiing", "Mountain trek", "Photo stops"] }], company_id: null },
  "dubai-gold-experience": { slug: "dubai-gold-experience", title: "Dubai Gold Experience", destination: "Dubai", duration_days: 4, duration_nights: 3, adult_price: 1599, child_price: 1099, group_price: 7999, category: "City", difficulty: "easy", max_group_size: 15, cover_image: destDubai, description: "Experience Dubai's luxury lifestyle with skyline views, desert adventure, and premium shopping.", highlights: ["Burj skyline views", "Desert safari", "Luxury shopping", "Marina cruise"], inclusions: ["3-night stay", "Daily breakfast", "Airport transfers", "Desert safari"], exclusions: ["Visa", "Personal shopping", "Travel insurance"], itinerary: [{ day: 1, title: "Welcome to Dubai", description: "Arrival and evening marina leisure.", activities: ["Airport transfer", "Marina walk"] }, { day: 2, title: "Iconic City Tour", description: "Discover landmarks and cultural zones.", activities: ["City tour", "Observation deck", "Fountain show"] }, { day: 3, title: "Desert & Entertainment", description: "Evening dune adventure and show.", activities: ["Desert safari", "BBQ dinner", "Live performances"] }], company_id: null },
  "maldives-ocean-escape": { slug: "maldives-ocean-escape", title: "Maldives Ocean Escape", destination: "Maldives", duration_days: 6, duration_nights: 5, adult_price: 2499, child_price: 1799, group_price: 12499, category: "Beach", difficulty: "easy", max_group_size: 8, cover_image: destMaldives, description: "A luxury island retreat with turquoise lagoons, water villas, and curated experiences.", highlights: ["Overwater villa", "Coral snorkeling", "Sunset cruise", "Island hopping"], inclusions: ["5-night stay", "All meals", "Boat transfers", "Water activities"], exclusions: ["International airfare", "Personal expenses"], itinerary: [{ day: 1, title: "Island Arrival", description: "Transfer to your island resort.", activities: ["Speedboat transfer", "Resort orientation"] }, { day: 2, title: "Ocean Discovery", description: "Explore reefs and marine life.", activities: ["Snorkeling", "Lagoon kayaking"] }, { day: 3, title: "Leisure & Sunset", description: "Slow travel day in paradise.", activities: ["Spa session", "Sunset cruise"] }], company_id: null },
  "santorini-sunset-romance": { slug: "santorini-sunset-romance", title: "Santorini Sunset Romance", destination: "Santorini", duration_days: 5, duration_nights: 4, adult_price: 1499, child_price: 999, group_price: 7499, category: "Romance", difficulty: "easy", max_group_size: 10, cover_image: destSantorini, description: "Romantic cliffside stays, caldera views, and Greek island charm.", highlights: ["Caldera sunset", "Winery tasting", "Blue-dome photo spots", "Catamaran cruise"], inclusions: ["4-night stay", "Breakfast", "Port transfers", "Sunset cruise"], exclusions: ["Flights", "Visa fees"], itinerary: [{ day: 1, title: "Arrival in Santorini", description: "Check in to a cliffside hotel.", activities: ["Transfer", "Village walk"] }, { day: 2, title: "Caldera Discovery", description: "Explore iconic viewpoints.", activities: ["Oia visit", "Sunset photos"] }, { day: 3, title: "Sea & Wine", description: "Cruise and tasting day.", activities: ["Catamaran cruise", "Winery experience"] }], company_id: null },
  "kyoto-cultural-journey": { slug: "kyoto-cultural-journey", title: "Kyoto Cultural Journey", destination: "Kyoto", duration_days: 6, duration_nights: 5, adult_price: 1799, child_price: 1299, group_price: 8999, category: "Culture", difficulty: "easy", max_group_size: 14, cover_image: destKyoto, description: "A deep cultural immersion into Kyoto's temples, traditions, and culinary gems.", highlights: ["Historic temples", "Tea ceremony", "Arashiyama district", "Traditional cuisine"], inclusions: ["5-night stay", "Daily breakfast", "Local guide", "Cultural activities"], exclusions: ["International flights", "Personal shopping"], itinerary: [{ day: 1, title: "Arrival & Check-in", description: "Welcome to Kyoto.", activities: ["Transfer", "Evening stroll"] }, { day: 2, title: "Temple Circuit", description: "Visit iconic heritage sites.", activities: ["Temple visits", "Zen garden experience"] }, { day: 3, title: "Cultural Workshop", description: "Hands-on local experiences.", activities: ["Tea ceremony", "Local market walk"] }], company_id: null },
};

export default function TourDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [bookingForm, setBookingForm] = useState({
    fullName: "", email: "", phone: "", adults: 1, children: 0, checkIn: "", notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const { data: tour, isLoading } = useQuery({
    queryKey: ["tour-detail", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("tours").select("*").eq("slug", slug!).eq("is_active", true).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const activeTour = tour ?? (slug ? fallbackToursBySlug[slug] : undefined);
  const itinerary: ItineraryDay[] = Array.isArray(activeTour?.itinerary) ? (activeTour.itinerary as unknown as ItineraryDay[]) : [];

  const adultPrice = Number(activeTour?.adult_price || 0);
  const childPrice = Number(activeTour?.child_price || 0);
  const totalPrice = (adultPrice * bookingForm.adults) + (childPrice * bookingForm.children);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTour) return;
    if (!bookingForm.fullName || !bookingForm.email) {
      toast.error("Please fill in your name and email.");
      return;
    }
    setShowPayment(true);
  };

  const finalizeBooking = async () => {
    if (!activeTour) return;
    setSubmitting(true);
    setShowPayment(false);
    try {
      let companyId = activeTour.company_id;
      if (!companyId) {
        const { data: company } = await supabase.from("companies").select("id").limit(1).single();
        companyId = company?.id ?? null;
      }
      if (!companyId) {
        toast.error("No company configured. Please contact support.");
        setSubmitting(false);
        return;
      }
      const refNumber = `BK-${Date.now().toString(36).toUpperCase()}`;

      // Create lead
      const { error: leadError } = await supabase.from("leads").insert({
        company_id: companyId,
        full_name: bookingForm.fullName, email: bookingForm.email, phone: bookingForm.phone,
        pax: bookingForm.adults + bookingForm.children,
        destination: activeTour.destination, travel_dates: bookingForm.checkIn,
        budget: totalPrice, source: "website",
        notes: `Tour: ${activeTour.title}\nAdults: ${bookingForm.adults}, Children: ${bookingForm.children}\nCheck-in: ${bookingForm.checkIn}\n${bookingForm.notes}`,
        status: "new",
      });
      if (leadError) throw leadError;

      // Create booking (paid)
      const { error: bookingError } = await supabase.from("bookings").insert({
        company_id: companyId,
        title: activeTour.title,
        booking_type: "tour" as const,
        status: "confirmed" as const,
        total_amount: totalPrice,
        paid_amount: totalPrice,
        payment_status: "paid" as const,
        destination: activeTour.destination || null,
        pax: bookingForm.adults + bookingForm.children,
        check_in: bookingForm.checkIn || null,
        reference_number: refNumber,
        description: `Customer: ${bookingForm.fullName}\nEmail: ${bookingForm.email}\nPhone: ${bookingForm.phone}\nAdults: ${bookingForm.adults}, Children: ${bookingForm.children}\n${bookingForm.notes}`,
        metadata: {
          customer_name: bookingForm.fullName,
          customer_email: bookingForm.email,
          customer_phone: bookingForm.phone,
          adults: bookingForm.adults,
          children: bookingForm.children,
          tour_slug: activeTour.slug,
          payment_method: "card",
          payment_status: "paid",
        },
      });
      if (bookingError) console.error("Booking creation failed:", bookingError);

      toast.success(`Booking confirmed! Ref: ${refNumber}`);
      setBookingForm({ fullName: "", email: "", phone: "", adults: 1, children: 0, checkIn: "", notes: "" });
    } catch (err: any) {
      toast.error(err.message || "Failed to complete booking");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-background"><Navbar /><div className="container mx-auto px-4 py-32 text-center"><div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto" /></div></div>
  );

  if (!activeTour) return (
    <div className="min-h-screen bg-background"><Navbar /><div className="container mx-auto px-4 py-32 text-center"><h1 className="font-display text-3xl font-bold text-foreground mb-4">Tour Not Found</h1><Button variant="brand" asChild><Link to="/tours">Browse Tours</Link></Button></div><Footer /></div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="bg-secondary border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link><ChevronRight className="h-3 w-3" />
          <Link to="/tours" className="hover:text-primary">Tours</Link><ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{activeTour.title}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="font-display text-2xl md:text-4xl font-bold text-foreground">{activeTour.title}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                {activeTour.destination && <span className="flex items-center gap-1"><MapPin className="h-4 w-4 text-primary" /> {activeTour.destination}</span>}
                <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-primary" /> {activeTour.duration_days}D / {activeTour.duration_nights}N</span>
                {activeTour.category && <Badge variant="outline">{activeTour.category}</Badge>}
                {activeTour.difficulty && <Badge variant="outline">{activeTour.difficulty}</Badge>}
                {activeTour.max_group_size && <span className="flex items-center gap-1"><Users className="h-4 w-4 text-primary" /> Max {activeTour.max_group_size}</span>}
              </div>
            </div>
            {activeTour.cover_image && <img src={activeTour.cover_image} alt={activeTour.title} className="w-full rounded-xl object-cover max-h-[400px]" />}
            {activeTour.description && <div><h2 className="font-display text-xl font-bold text-foreground mb-3">Overview</h2><p className="text-muted-foreground leading-relaxed">{activeTour.description}</p></div>}
            {activeTour.highlights && activeTour.highlights.length > 0 && (
              <div><h2 className="font-display text-xl font-bold text-foreground mb-3">Highlights</h2><div className="grid grid-cols-1 sm:grid-cols-2 gap-2">{activeTour.highlights.map((h, i) => (<div key={i} className="flex items-start gap-2 text-sm"><Star className="h-4 w-4 text-accent shrink-0 mt-0.5" /><span className="text-muted-foreground">{h}</span></div>))}</div></div>
            )}
            {itinerary.length > 0 && (
              <div><h2 className="font-display text-xl font-bold text-foreground mb-4">Day-wise Itinerary</h2><div className="space-y-4">{itinerary.map((day) => (
                <div key={day.day} className="border border-border rounded-xl p-5 bg-card">
                  <div className="flex items-center gap-3 mb-2"><span className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">{day.day}</span><h3 className="font-display font-semibold text-foreground">{day.title}</h3></div>
                  {day.description && <p className="text-muted-foreground text-sm ml-[52px] mb-2">{day.description}</p>}
                  {day.activities?.length > 0 && <ul className="ml-[52px] space-y-1">{day.activities.map((a, j) => (<li key={j} className="flex items-center gap-2 text-sm text-muted-foreground"><Check className="h-3.5 w-3.5 text-primary shrink-0" /> {a}</li>))}</ul>}
                </div>
              ))}</div></div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {activeTour.inclusions?.length > 0 && <div><h2 className="font-display text-lg font-bold text-foreground mb-3">Inclusions</h2><ul className="space-y-2">{activeTour.inclusions.map((item, i) => (<li key={i} className="flex items-center gap-2 text-sm text-muted-foreground"><Check className="h-4 w-4 text-primary shrink-0" /> {item}</li>))}</ul></div>}
              {activeTour.exclusions?.length > 0 && <div><h2 className="font-display text-lg font-bold text-foreground mb-3">Exclusions</h2><ul className="space-y-2">{activeTour.exclusions.map((item, i) => (<li key={i} className="flex items-center gap-2 text-sm text-muted-foreground"><X className="h-4 w-4 text-destructive shrink-0" /> {item}</li>))}</ul></div>}
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-foreground mb-3">Pricing</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-card border border-border rounded-xl p-4 text-center"><p className="text-xs text-muted-foreground mb-1">Adult</p><p className="text-2xl font-bold text-primary">${adultPrice.toLocaleString()}</p></div>
                {childPrice > 0 && <div className="bg-card border border-border rounded-xl p-4 text-center"><p className="text-xs text-muted-foreground mb-1">Child</p><p className="text-2xl font-bold text-primary">${childPrice.toLocaleString()}</p></div>}
                {activeTour.group_price && Number(activeTour.group_price) > 0 && <div className="bg-card border border-border rounded-xl p-4 text-center"><p className="text-xs text-muted-foreground mb-1">Group</p><p className="text-2xl font-bold text-primary">${Number(activeTour.group_price).toLocaleString()}</p></div>}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div>
            <div className="sticky top-28 bg-card border border-border rounded-xl p-6 shadow-card">
              <div className="mb-5">
                <p className="text-xs text-muted-foreground">Starting from</p>
                <p className="text-3xl font-bold text-primary font-display">${adultPrice.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">per adult</p>
              </div>

              <form onSubmit={handleBooking} className="space-y-3">
                <div><Label className="text-xs">Full Name *</Label><Input required value={bookingForm.fullName} onChange={(e) => setBookingForm({ ...bookingForm, fullName: e.target.value })} placeholder="Your name" className="mt-1" /></div>
                <div><Label className="text-xs">Email *</Label><Input required type="email" value={bookingForm.email} onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })} placeholder="email@example.com" className="mt-1" /></div>
                <div><Label className="text-xs">Phone</Label><Input value={bookingForm.phone} onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })} placeholder="+1 234 567 8900" className="mt-1" /></div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Adults</Label>
                    <Input type="number" min={1} value={bookingForm.adults} onChange={(e) => setBookingForm({ ...bookingForm, adults: Number(e.target.value) })} className="mt-1" />
                    <p className="text-xs text-muted-foreground mt-0.5">${adultPrice.toLocaleString()} each</p>
                  </div>
                  <div>
                    <Label className="text-xs">Children</Label>
                    <Input type="number" min={0} value={bookingForm.children} onChange={(e) => setBookingForm({ ...bookingForm, children: Number(e.target.value) })} className="mt-1" />
                    <p className="text-xs text-muted-foreground mt-0.5">{childPrice > 0 ? `$${childPrice.toLocaleString()} each` : "Free"}</p>
                  </div>
                </div>

                <div><Label className="text-xs">Travel Date</Label><Input type="date" value={bookingForm.checkIn} onChange={(e) => setBookingForm({ ...bookingForm, checkIn: e.target.value })} className="mt-1" /></div>

                {/* Price Summary */}
                <div className="bg-secondary rounded-lg p-3 space-y-1">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{bookingForm.adults} Adult{bookingForm.adults > 1 ? "s" : ""}</span>
                    <span>${(adultPrice * bookingForm.adults).toLocaleString()}</span>
                  </div>
                  {bookingForm.children > 0 && (
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{bookingForm.children} Child{bookingForm.children > 1 ? "ren" : ""}</span>
                      <span>${(childPrice * bookingForm.children).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-foreground border-t border-border pt-1">
                    <span>Total</span>
                    <span className="text-primary">${totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <div><Label className="text-xs">Special Requests</Label><textarea value={bookingForm.notes} onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })} rows={2} className="mt-1 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="Any special requirements..." /></div>
                <Button variant="brand-yellow" size="lg" className="w-full" disabled={submitting}>{submitting ? "Submitting..." : "Book Now"}</Button>
                <p className="text-xs text-center text-muted-foreground">No payment required. We'll contact you to confirm.</p>
              </form>
            </div>
          </div>
        </div>
      </div>
      {activeTour && (
        <MockPaymentDialog
          open={showPayment}
          onClose={() => setShowPayment(false)}
          onPaymentSuccess={finalizeBooking}
          amount={totalPrice}
          title={activeTour.title}
        />
      )}
      <Footer />
    </div>
  );
}
