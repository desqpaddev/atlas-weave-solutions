import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link, useSearchParams } from "react-router-dom";
import { MapPin, Clock, ArrowRight, Plane, Hotel, Map, Car } from "lucide-react";

const normalizeText = (value?: string | null) =>
  (value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export default function PackagesListPage() {
  const [searchParams] = useSearchParams();
  const destinationFilter = normalizeText(searchParams.get("destination"));

  const { data: packages = [], isLoading } = useQuery({
    queryKey: ["public-packages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("packages")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filteredPackages = useMemo(() => {
    if (!destinationFilter) return packages;
    return packages.filter((pkg) => {
      const destination = normalizeText(pkg.destination);
      return destination.includes(destinationFilter) || destinationFilter.includes(destination);
    });
  }, [packages, destinationFilter]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-3xl md:text-5xl font-bold mb-3">Holiday Packages</h1>
          <p className="text-primary-foreground/80 max-w-lg mx-auto">
            Explore our curated collection of travel packages designed for unforgettable experiences.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {destinationFilter && (
          <div className="mb-6 flex items-center gap-3 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Destination filter:</span>
            <span className="px-3 py-1 rounded-full bg-secondary text-foreground">{searchParams.get("destination")}</span>
            <Link to="/packages" className="ml-auto text-primary font-semibold hover:underline">Clear filter</Link>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">No packages found for this destination.</p>
            {destinationFilter && (
              <Link to="/packages" className="inline-flex mt-3 text-primary font-semibold hover:underline">
                View all packages
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => (
              <Link
                key={pkg.id}
                to={`/packages/${pkg.slug}`}
                className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-elevated transition-all duration-300 group block"
              >
                {pkg.cover_image && (
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src={pkg.cover_image} alt={pkg.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-display text-lg font-bold text-foreground">{pkg.title}</h3>
                  <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                    {pkg.destination && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {pkg.destination}</span>}
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {pkg.duration_days}D/{pkg.duration_nights}N</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    {pkg.includes_flight && <Plane className="h-3.5 w-3.5 text-primary" />}
                    {pkg.includes_hotel && <Hotel className="h-3.5 w-3.5 text-primary" />}
                    {pkg.includes_tour && <Map className="h-3.5 w-3.5 text-primary" />}
                    {pkg.includes_transfer && <Car className="h-3.5 w-3.5 text-primary" />}
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <div>
                      <p className="text-xl font-bold text-primary">${Number(pkg.base_price).toLocaleString()}</p>
                      <span className="text-xs text-muted-foreground">per person</span>
                    </div>
                    <span className="text-primary text-sm font-semibold flex items-center gap-1">
                      View Details <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}