import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { Link } from "react-router-dom";
import { MapPin, Clock, ArrowRight, Users, CalendarDays, Ticket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import departuresHero from "@/assets/departures-hero.jpg";

export default function FixedDeparturesPage() {
  const { data: departures = [], isLoading } = useQuery({
    queryKey: ["public-departures"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tour_departures")
        .select("*, tours(*)")
        .eq("status", "open")
        .gte("departure_date", new Date().toISOString().split("T")[0])
        .order("departure_date", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHero
        image={departuresHero}
        eyebrow={<><Ticket className="h-4 w-4" /> Guaranteed Group Departures</>}
        title={<>Fixed <span className="text-accent">Departures</span></>}
        subtitle="Locked-in dates, fixed group sizes, unbeatable value — secure your seat on our most loved guided journeys."
      />

      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
          </div>
        ) : departures.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-40" />
            <p className="text-lg">No upcoming fixed departures. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departures.map((dep: any) => {
              const tour = dep.tours;
              if (!tour) return null;
              const seatsLeft = dep.total_seats - dep.booked_seats;
              const price = dep.price_override ? Number(dep.price_override) : Number(tour.adult_price);
              return (
                <div key={dep.id} className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-elevated transition-all duration-300 group">
                  {tour.cover_image && (
                    <div className="aspect-[16/10] overflow-hidden relative">
                      <img src={tour.cover_image} alt={tour.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-accent text-accent-foreground font-semibold">
                          {format(new Date(dep.departure_date), "dd MMM yyyy")}
                        </Badge>
                      </div>
                      {seatsLeft <= 5 && seatsLeft > 0 && (
                        <div className="absolute top-3 right-3">
                          <Badge variant="destructive" className="font-semibold">Only {seatsLeft} seats left!</Badge>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex gap-2 mb-2">
                      {tour.category && <Badge variant="outline" className="text-xs capitalize">{tour.category}</Badge>}
                      {tour.difficulty && <Badge variant="outline" className="text-xs">{tour.difficulty}</Badge>}
                    </div>
                    <h3 className="font-display text-lg font-bold text-foreground">{tour.title}</h3>
                    <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground flex-wrap">
                      {tour.destination && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {tour.destination}</span>}
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {tour.duration_days}D/{tour.duration_nights}N</span>
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {seatsLeft}/{dep.total_seats} seats</span>
                    </div>
                    {dep.return_date && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Return: {format(new Date(dep.return_date), "dd MMM yyyy")}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                      <div>
                        <p className="text-xl font-bold text-primary">£{price.toLocaleString()}</p>
                        <span className="text-xs text-muted-foreground">per adult</span>
                      </div>
                      <Button variant="brand" size="sm" asChild disabled={seatsLeft <= 0}>
                        <Link to={`/tours/${tour.slug}?departure=${dep.id}&date=${dep.departure_date}`} className="gap-1">
                          {seatsLeft <= 0 ? "Sold Out" : "Book Seats"} <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
