import { Clock, Users, ArrowRight, MapPin, Star, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function PackagesSection() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center mb-14">
          <span className="inline-block text-primary font-semibold text-sm tracking-widest uppercase mb-3">
            ✈ Popular Tours
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
            Explore Our Best <span className="text-primary">Holiday Packages</span>
          </h2>
          <p className="text-muted-foreground mt-3 text-base max-w-2xl mx-auto">
            Hand-picked tours and packages crafted for unforgettable experiences. Choose your dream destination.
          </p>
        </div>

        {/* Tour cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((tour, index) => (
            <Link
              key={tour.id}
              to={`/tours/${tour.slug}`}
              className="group block"
              onMouseEnter={() => setHoveredId(tour.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 shadow-soft hover:shadow-elevated transition-all duration-500 h-full flex flex-col">
                {/* Image container */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  {tour.cover_image ? (
                    <img
                      src={tour.cover_image}
                      alt={tour.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-secondary flex items-center justify-center">
                      <MapPin className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                  )}

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Top badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    {tour.category && (
                      <span className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded-full font-semibold shadow-lg">
                        {tour.category}
                      </span>
                    )}
                    {tour.difficulty && (
                      <span className="text-xs bg-accent text-accent-foreground px-3 py-1 rounded-full font-semibold shadow-lg">
                        {tour.difficulty}
                      </span>
                    )}
                  </div>

                  {/* Favorite button */}
                  <button
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-white transition-all duration-300 shadow-lg"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Heart className="h-4 w-4" />
                  </button>

                  {/* Duration badge at bottom of image */}
                  <div className="absolute bottom-3 left-3">
                    <span className="inline-flex items-center gap-1.5 text-xs bg-white/90 backdrop-blur-sm text-foreground px-3 py-1.5 rounded-full font-medium shadow-lg">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                      {tour.duration_days}D / {tour.duration_nights}N
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  {/* Location */}
                  {tour.destination && (
                    <div className="flex items-center gap-1.5 text-primary text-xs font-medium mb-2">
                      <MapPin className="h-3.5 w-3.5" />
                      {tour.destination}
                    </div>
                  )}

                  <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
                    {tour.title}
                  </h3>

                  {/* Features row */}
                  <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                    {tour.max_group_size && (
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" /> Max {tour.max_group_size}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-accent fill-accent" /> 4.8
                    </span>
                  </div>

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <div>
                      <span className="text-xs text-muted-foreground">From</span>
                      <p className="text-xl font-bold text-primary font-display">
                        {tour.currency === "GBP" ? "£" : "$"}
                        {Number(tour.adult_price).toLocaleString()}
                      </p>
                      <span className="text-[10px] text-muted-foreground">per person</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      Explore <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-12">
          <Button variant="brand" size="lg" asChild className="rounded-full px-8 gap-2 shadow-lg">
            <Link to="/tours">
              View All Tours <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
