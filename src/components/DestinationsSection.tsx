import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
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

  return (
    <section id="destinations" className="py-16 pt-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Trending Destinations
          </h2>
          <Link to="/tours" className="hidden md:flex items-center gap-1 text-primary text-sm font-semibold hover:underline">
            Explore Now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="relative">
          <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: "none" }}>
            {tours.map((tour) => (
              <Link
                key={tour.id}
                to={`/tours/${tour.slug}`}
                className="snap-start shrink-0 w-[220px] md:w-[260px] group"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-card">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={tour.cover_image || "/placeholder.svg"}
                      alt={tour.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-display text-lg font-bold">{tour.destination || tour.title}</h3>
                    <p className="text-sm text-white/80 mt-0.5">
                      From {tour.currency === 'GBP' ? '£' : '$'}{Number(tour.adult_price).toLocaleString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
