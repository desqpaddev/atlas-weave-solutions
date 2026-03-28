import { Star, Clock, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function PackagesSection() {
  const { data: tours = [] } = useQuery({
    queryKey: ["homepage-tours"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tours")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  if (tours.length === 0) return null;

  return (
    <section id="packages" className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Holiday Packages
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Hand-picked packages for an unforgettable journey.
            </p>
          </div>
          <Link to="/tours" className="hidden md:flex items-center gap-1 text-primary text-sm font-semibold hover:underline">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <Link
              key={tour.id}
              to={`/tours/${tour.slug}`}
              className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-elevated transition-all duration-300 group block"
            >
              {tour.cover_image && (
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={tour.cover_image}
                    alt={tour.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}

              <div className="p-5">
                <div className="flex flex-wrap gap-2 mb-3">
                  {tour.category && (
                    <span className="text-xs bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full font-medium">
                      {tour.category}
                    </span>
                  )}
                  {tour.difficulty && (
                    <span className="text-xs bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full font-medium">
                      {tour.difficulty}
                    </span>
                  )}
                </div>

                <h3 className="font-display text-lg font-bold text-foreground">{tour.title}</h3>

                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {tour.duration_days}D / {tour.duration_nights}N
                  </span>
                  {tour.max_group_size && (
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" /> Max {tour.max_group_size}
                    </span>
                  )}
                </div>

                {tour.destination && (
                  <p className="text-sm text-muted-foreground mt-2">{tour.destination}</p>
                )}

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <div>
                    <p className="text-xl font-bold text-primary">
                      {tour.currency === 'GBP' ? '£' : '$'}{Number(tour.adult_price).toLocaleString()}
                    </p>
                    <span className="text-xs text-muted-foreground">per person</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    View Tour <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
