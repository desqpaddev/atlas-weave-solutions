import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  MapPin, Clock, Plane, Hotel, Map, Car, Check, X, Star, Users, CalendarDays, ArrowLeft, ChevronRight
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Json } from "@/integrations/supabase/types";
import { StripeCheckoutDialog, type CheckoutBookingPayload } from "@/components/StripeCheckoutDialog";

type ItineraryDay = { day: number; title: string; description: string; activities: string[] };

export default function PackageDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [bookingForm, setBookingForm] = useState({
    fullName: "", email: "", phone: "", pax: 1, checkIn: "", notes: "",
  });
  const [showPayment, setShowPayment] = useState(false);
  const [checkoutPayload, setCheckoutPayload] = useState<CheckoutBookingPayload | null>(null);

  const { data: pkg, isLoading } = useQuery({
    queryKey: ["package-detail", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("packages")
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
    if (!pkg) return;
    if (!bookingForm.fullName || !bookingForm.email) {
      toast.error("Please fill in your name and email.");
      return;
    }
    const total = Number(pkg.base_price) * bookingForm.pax;
    if (total < 1) {
      toast.error("Invalid total amount.");
      return;
    }
    const refNumber = `BK-${Date.now().toString(36).toUpperCase()}`;
    setCheckoutPayload({
      reference_number: refNumber,
      title: pkg.title,
      destination: pkg.destination ?? null,
      pax: bookingForm.pax,
      check_in: bookingForm.checkIn || null,
      description: `Customer: ${bookingForm.fullName}\nEmail: ${bookingForm.email}\nPhone: ${bookingForm.phone}\nTravelers: ${bookingForm.pax}\n${bookingForm.notes}`,
      company_id: pkg.company_id,
      customer_email: bookingForm.email,
      metadata: {
        customer_name: bookingForm.fullName,
        customer_email: bookingForm.email,
        customer_phone: bookingForm.phone,
        package_slug: pkg.slug,
        notes: bookingForm.notes,
      },
    });
    setShowPayment(true);
  };

  const itinerary: ItineraryDay[] = Array.isArray(pkg?.itinerary)
    ? (pkg.itinerary as unknown as ItineraryDay[])
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

  if (!pkg) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Package Not Found</h1>
          <Button variant="brand" asChild><Link to="/packages">Browse Packages</Link></Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-secondary border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/packages" className="hover:text-primary">Packages</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{pkg.title}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <h1 className="font-display text-2xl md:text-4xl font-bold text-foreground">{pkg.title}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                {pkg.destination && (
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4 text-primary" /> {pkg.destination}</span>
                )}
                <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-primary" /> {pkg.duration_days}D / {pkg.duration_nights}N</span>
                <div className="flex items-center gap-2">
                  {pkg.includes_flight && <Badge variant="outline" className="gap-1 text-xs"><Plane className="h-3 w-3" /> Flight</Badge>}
                  {pkg.includes_hotel && <Badge variant="outline" className="gap-1 text-xs"><Hotel className="h-3 w-3" /> Hotel</Badge>}
                  {pkg.includes_tour && <Badge variant="outline" className="gap-1 text-xs"><Map className="h-3 w-3" /> Tour</Badge>}
                  {pkg.includes_transfer && <Badge variant="outline" className="gap-1 text-xs"><Car className="h-3 w-3" /> Transfer</Badge>}
                </div>
              </div>
            </div>

            {/* Cover image */}
            {pkg.cover_image && (
              <img src={pkg.cover_image} alt={pkg.title} className="w-full rounded-xl object-cover max-h-[400px]" />
            )}

            {/* Description */}
            {pkg.description && (
              <div>
                <h2 className="font-display text-xl font-bold text-foreground mb-3">Overview</h2>
                <p className="text-muted-foreground leading-relaxed">{pkg.description}</p>
              </div>
            )}

            {/* Highlights */}
            {pkg.highlights && pkg.highlights.length > 0 && (
              <div>
                <h2 className="font-display text-xl font-bold text-foreground mb-3">Highlights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {pkg.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <Star className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Itinerary */}
            {itinerary.length > 0 && (
              <div>
                <h2 className="font-display text-xl font-bold text-foreground mb-4">Day-wise Itinerary</h2>
                <div className="space-y-4">
                  {itinerary.map((day) => (
                    <div key={day.day} className="border border-border rounded-xl p-5 bg-card">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">
                          {day.day}
                        </span>
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

            {/* Inclusions / Exclusions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {pkg.inclusions && pkg.inclusions.length > 0 && (
                <div>
                  <h2 className="font-display text-lg font-bold text-foreground mb-3">Inclusions</h2>
                  <ul className="space-y-2">
                    {pkg.inclusions.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-green-500 shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {pkg.exclusions && pkg.exclusions.length > 0 && (
                <div>
                  <h2 className="font-display text-lg font-bold text-foreground mb-3">Exclusions</h2>
                  <ul className="space-y-2">
                    {pkg.exclusions.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <X className="h-4 w-4 text-destructive shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Booking sidebar */}
          <div>
            <div className="sticky top-28 bg-card border border-border rounded-xl p-6 shadow-card">
              <div className="mb-5">
                <p className="text-xs text-muted-foreground">Starting from</p>
                <p className="text-3xl font-bold text-primary font-display">£{Number(pkg.base_price).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">per person</p>
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

                {bookingForm.pax > 0 && (
                  <div className="bg-secondary rounded-lg p-3 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>£{Number(pkg.base_price).toLocaleString()} × {bookingForm.pax}</span>
                      <span className="font-semibold text-foreground">£{(Number(pkg.base_price) * bookingForm.pax).toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <Button variant="brand-yellow" size="lg" className="w-full">
                  Pay £{(Number(pkg.base_price) * bookingForm.pax).toLocaleString()} & Book Now
                </Button>
                <p className="text-xs text-center text-muted-foreground">Secure payment via Stripe. Test mode in preview.</p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {pkg && checkoutPayload && (
        <StripeCheckoutDialog
          open={showPayment}
          onClose={() => setShowPayment(false)}
          amount={Number(pkg.base_price) * bookingForm.pax}
          currency="GBP"
          productName={pkg.title}
          customerEmail={bookingForm.email}
          bookingType="package"
          bookingPayload={checkoutPayload}
        />
      )}

      <Footer />
    </div>
  );
}
