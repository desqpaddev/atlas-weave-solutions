import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
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

  const destMap = new Map<string, typeof tours>();
  tours.forEach((t) => {
    const dest = t.destination || "Other";
    if (!destMap.has(dest)) destMap.set(dest, []);
    destMap.get(dest)!.push(t);
  });
  const topDestinations = Array.from(destMap.entries())
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 6);

  return (
    <section id="destinations" className="py-24 md:py-32 bg-cream">
      <div className="container mx-auto px-6 md:px-10">
        <div className="max-w-3xl mb-14 md:mb-20">
          <span className="block text-[11px] font-sans-ui font-semibold tracking-[0.28em] uppercase text-primary mb-5">
            Destinations
          </span>
          <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] text-foreground">
            Inspiration for your next <em className="italic text-primary">unforgettable</em> journey.
          </h2>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
            From the Scottish Highlands to the Italian Lakes — six regions, expertly-guided, privately-curated.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          {topDestinations.map(([dest, destTours], i) => {
            const tour = destTours[0];
            return (
              <Link
                key={dest}
                to={`/tours?destination=${encodeURIComponent(dest)}`}
                className="group block"
              >
                <div className="relative overflow-hidden aspect-[4/5] mb-5">
                  <img
                    src={tour.cover_image || "/placeholder.svg"}
                    alt={dest}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent opacity-60" />
                  <span className="absolute top-5 left-5 text-[10px] font-sans-ui font-semibold tracking-[0.25em] uppercase text-white/90">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-2xl text-foreground group-hover:text-primary transition-colors">
                      {dest}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {destTours.length} {destTours.length === 1 ? "journey" : "journeys"} · from £
                      {Number(tour.adult_price).toLocaleString()}
                    </p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-foreground/60 group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Link
            to="/tours"
            className="inline-flex items-center gap-3 px-8 py-3.5 border border-foreground text-foreground text-xs font-sans-ui font-semibold tracking-[0.22em] uppercase hover:bg-foreground hover:text-background transition-colors"
          >
            View All Destinations
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
