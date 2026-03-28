import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function DestinationsSection() {
  const { data: tours = [] } = useQuery({
    queryKey: ["destination-tours"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tours")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (tours.length === 0) return null;

  // Group by destination, pick top 6
  const destMap = new Map<string, typeof tours>();
  tours.forEach((t) => {
    const dest = t.destination || "Other";
    if (!destMap.has(dest)) destMap.set(dest, []);
    destMap.get(dest)!.push(t);
  });
  const topDestinations = Array.from(destMap.entries())
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 6);

  // Layout: first item large, rest in grid
  const layoutSizes = ["col-span-2 row-span-2", "col-span-1 row-span-1", "col-span-1 row-span-1", "col-span-1 row-span-1", "col-span-1 row-span-1", "col-span-2 row-span-1"];

  return (
    <section id="destinations" className="py-20 pt-28 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block text-primary font-semibold text-sm tracking-widest uppercase mb-3">
            ✦ Trending Destinations
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
            Explore <span className="text-primary">Popular Places</span>
          </h2>
          <p className="text-muted-foreground mt-3 text-base max-w-lg mx-auto">
            Handpicked destinations loved by travelers worldwide
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[200px] gap-4">
          {topDestinations.map(([dest, destTours], i) => {
            const tour = destTours[0];
            const sizeClass = layoutSizes[i] || "col-span-1 row-span-1";
            return (
              <Link
                key={dest}
                to={`/tours?destination=${encodeURIComponent(dest)}`}
                className={`${sizeClass} group relative rounded-2xl overflow-hidden`}
              >
                <img
                  src={tour.cover_image || "/placeholder.svg"}
                  alt={dest}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                
                {/* Tour count badge */}
                <div className="absolute top-3 right-3 bg-accent text-accent-foreground text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg">
                  {destTours.length} {destTours.length === 1 ? "Tour" : "Tours"}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                  <div className="flex items-center gap-1.5 text-accent text-xs font-medium mb-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {dest}
                  </div>
                  <h3 className="font-display text-lg md:text-xl font-bold text-white leading-tight">
                    {dest}
                  </h3>
                  <p className="text-white/70 text-xs mt-1">
                    From {tour.currency === "GBP" ? "£" : "$"}{Number(tour.adult_price).toLocaleString()}
                  </p>
                </div>

                {/* Hover border effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-accent/50 rounded-2xl transition-all duration-500" />
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link to="/tours" className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all">
            Explore All Destinations <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
