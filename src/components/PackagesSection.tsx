import { Clock, Users, ArrowRight, MapPin, Star, Heart, Plane } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export function PackagesSection() {
  const { data: tours = [] } = useQuery({
    queryKey: ["homepage-tours"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tours")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data;
    },
  });

  if (tours.length === 0) return null;

  return (
    <section id="packages" className="py-20 bg-background relative overflow-hidden">
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/[0.05] rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm tracking-widest uppercase mb-3">
              <Plane className="h-4 w-4" /> Popular Tours
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              Best Holiday <span className="text-primary">Packages</span>
            </h2>
            <p className="text-muted-foreground mt-2 text-base max-w-lg">
              Crafted for unforgettable experiences across the world.
            </p>
          </div>
          <Button variant="brand-outline" asChild className="rounded-full gap-2 self-start md:self-auto">
            <Link to="/tours">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <Link key={tour.id} to={`/tours/${tour.slug}`} className="group block">
              <div className="bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 shadow-soft hover:shadow-elevated transition-all duration-500 h-full flex flex-col">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  {tour.cover_image ? (
                    <img src={tour.cover_image} alt={tour.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full bg-secondary flex items-center justify-center">
                      <MapPin className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    {tour.category && (
                      <span className="text-[11px] bg-primary text-primary-foreground px-3 py-1 rounded-full font-semibold shadow-lg backdrop-blur-sm">
                        {tour.category}
                      </span>
                    )}
                  </div>

                  <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-white transition-all duration-300 shadow-lg" onClick={(e) => e.preventDefault()}>
                    <Heart className="h-3.5 w-3.5" />
                  </button>

                  {/* Duration pill */}
                  <div className="absolute bottom-3 left-3">
                    <span className="inline-flex items-center gap-1 text-[11px] bg-white/90 backdrop-blur-sm text-foreground px-3 py-1.5 rounded-full font-medium shadow-lg">
                      <Clock className="h-3 w-3 text-primary" />
                      {tour.duration_days}D / {tour.duration_nights}N
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  {tour.destination && (
                    <div className="flex items-center gap-1.5 text-primary text-xs font-medium mb-1.5">
                      <MapPin className="h-3 w-3" />
                      {tour.destination}
                    </div>
                  )}

                  <h3 className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-snug">
                    {tour.title}
                  </h3>

                  <div className="flex items-center gap-3 mt-2.5 text-xs text-muted-foreground">
                    {tour.max_group_size && (
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" /> Max {tour.max_group_size}</span>
                    )}
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-accent fill-accent" /> 4.8
                    </span>
                  </div>

                  <div className="flex-1" />

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">From</span>
                      <p className="text-lg font-bold text-primary font-display">
                        {tour.currency === "GBP" ? "£" : "$"}{Number(tour.adult_price).toLocaleString()}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-4 py-2 rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      Book Now <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
