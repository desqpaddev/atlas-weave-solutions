import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { ChevronRight, Ship } from "lucide-react";

export default function CruisesListPage() {
  const { data: cruises = [], isLoading } = useQuery({
    queryKey: ["public-cruises"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tours")
        .select("*")
        .eq("is_active", true)
        .eq("category", "cruise")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-secondary border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span>Our Cruises</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-primary font-semibold border-b-2 border-accent pb-1">Ships</span>
        </div>
      </div>

      {/* Editorial intro */}
      <section className="container mx-auto px-4 pt-16 pb-12 text-center max-w-4xl">
        <div className="w-12 h-0.5 bg-accent mx-auto mb-6" />
        <h1 className="font-display text-3xl md:text-5xl font-bold text-primary tracking-wide uppercase mb-6">
          Our Cruise Ships
        </h1>
        <p className="text-foreground/80 leading-relaxed text-base md:text-lg">
          As we continue to grow and improve our fleet, there's a huge range of unique features for our guests to explore on every <strong>cruise ship</strong>.
          Blending classic elegance and innovation, our cruise ships offer the utmost in <strong>comfort, dining, innovation, entertainment,</strong> and <strong>onboard experience</strong>. Our newest ships also feature onboard technology that focuses on mitigating our impact on the environments we operate in.
        </p>
        <p className="text-foreground/80 leading-relaxed text-base md:text-lg mt-4">
          Browse, explore, and choose a ship from our fleet today, and discover a spectacular way to sail the seas.
        </p>
      </section>

      {/* Fleet tiles */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {FLEET.map((ship) => (
            <div
              key={ship.name}
              className="group relative bg-gradient-to-b from-slate-50 to-slate-200 border border-border overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 cursor-pointer"
            >
              <div className="aspect-[16/9] flex items-center justify-center p-3 bg-white">
                <img
                  src={ship.image}
                  alt={ship.name}
                  loading="lazy"
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="px-4 py-3 bg-gradient-to-b from-slate-100 to-slate-200 border-t border-slate-200">
                <h3 className="font-display text-sm md:text-base font-semibold text-primary tracking-wide uppercase text-center">
                  {ship.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ships grid (dynamic from DB) */}
      <section className="container mx-auto px-4 pb-20">
        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
          </div>
        ) : cruises.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Ship className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No cruise ships available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cruises.map((cruise) => (
              <Link
                key={cruise.id}
                to={`/tours/${cruise.slug}`}
                className="group relative block overflow-hidden bg-white border border-border shadow-soft hover:shadow-elevated transition-all duration-300"
              >
                {/* Ship image area on light backdrop */}
                <div className="relative aspect-[16/10] bg-gradient-to-b from-slate-50 to-slate-100 overflow-hidden flex items-center justify-center">
                  {cruise.cover_image ? (
                    <img
                      src={cruise.cover_image}
                      alt={cruise.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <Ship className="h-20 w-20 text-slate-300" />
                  )}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <div className="w-10 h-10 rounded-md bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                      <Ship className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                {/* Name strip */}
                <div className="relative bg-gradient-to-b from-slate-100 via-slate-200 to-slate-300 px-6 py-6 border-t border-slate-200">
                  <h3 className="font-display text-2xl md:text-3xl font-semibold text-primary tracking-wide">
                    {cruise.title}
                  </h3>
                  <div className="mt-2 flex items-center justify-between text-sm text-foreground/70">
                    <span>{cruise.destination ?? "Worldwide"}</span>
                    <span className="font-semibold text-primary">
                      from £{Number(cruise.adult_price).toLocaleString()}
                    </span>
                  </div>
                  {/* Discover overlay on hover */}
                  <div className="absolute inset-0 bg-primary/95 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="font-semibold tracking-widest text-sm uppercase flex items-center gap-2">
                      Discover the ship <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
