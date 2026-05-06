import { ArrowUpRight, Clock, MapPin } from "lucide-react";
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
        .limit(6);
      if (error) throw error;
      return data;
    },
  });

  if (tours.length === 0) return null;

  return (
    <section id="packages" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14 md:mb-20">
          <div className="max-w-2xl">
            <span className="block text-[11px] font-sans-ui font-semibold tracking-[0.28em] uppercase text-primary mb-5">
              Featured Journeys
            </span>
            <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] text-foreground">
              Hand-crafted itineraries, <em className="italic text-primary">privately</em> guided.
            </h2>
          </div>
          <Link
            to="/tours"
            className="inline-flex items-center gap-2 text-xs font-sans-ui font-semibold tracking-[0.22em] uppercase text-foreground hover:text-primary transition-colors self-start md:self-auto"
          >
            View All <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          {tours.map((tour) => (
            <Link key={tour.id} to={`/tours/${tour.slug}`} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden mb-5">
                {tour.cover_image ? (
                  <img
                    src={tour.cover_image}
                    alt={tour.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-secondary flex items-center justify-center">
                    <MapPin className="h-12 w-12 text-muted-foreground/30" />
                  </div>
                )}
                {tour.category && (
                  <span className="absolute top-5 left-5 text-[10px] font-sans-ui font-semibold tracking-[0.25em] uppercase text-white bg-foreground/40 backdrop-blur-sm px-3 py-1.5">
                    {tour.category}
                  </span>
                )}
              </div>

              <div>
                {tour.destination && (
                  <p className="text-[11px] font-sans-ui font-semibold tracking-[0.22em] uppercase text-primary mb-2">
                    {tour.destination}
                  </p>
                )}
                <h3 className="font-display text-xl md:text-2xl text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                  {tour.title}
                </h3>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {tour.duration_days} days · {tour.duration_nights} nights
                  </span>
                  <span className="text-sm font-display text-foreground">
                    From £{Number(tour.adult_price).toLocaleString()}
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
