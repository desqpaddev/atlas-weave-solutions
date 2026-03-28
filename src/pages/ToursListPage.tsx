import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link, useSearchParams } from "react-router-dom";
import { MapPin, Clock, ArrowRight, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const normalizeText = (value?: string | null) =>
  (value ?? "")
    .toLowerCase()
    .replace(/activities?/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const matchesFilter = (source: string, filter: string) =>
  !filter || source.includes(filter) || filter.includes(source);

export default function ToursListPage() {
  const [searchParams] = useSearchParams();

  const destinationFilter = normalizeText(searchParams.get("destination"));
  const categoryFilter = normalizeText(searchParams.get("category"));
  const searchFilter = normalizeText(searchParams.get("search") ?? searchParams.get("q"));

  const { data: tours = [], isLoading } = useQuery({
    queryKey: ["public-tours"],
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

  const filteredTours = useMemo(() => {
    return tours.filter((tour) => {
      const destination = normalizeText(tour.destination);
      const category = normalizeText(tour.category);
      const searchable = normalizeText(`${tour.title} ${tour.destination ?? ""} ${tour.category ?? ""} ${tour.description ?? ""} ${tour.difficulty ?? ""} ${(tour.highlights ?? []).join(" ")} ${(tour.inclusions ?? []).join(" ")}`);

      if (!matchesFilter(destination, destinationFilter)) return false;
      if (!matchesFilter(category, categoryFilter)) return false;
      if (searchFilter && !searchable.includes(searchFilter)) return false;

      return true;
    });
  }, [tours, destinationFilter, categoryFilter, searchFilter]);

  const hasActiveFilters = Boolean(destinationFilter || categoryFilter || searchFilter);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-3xl md:text-5xl font-bold mb-3">Tours & Experiences</h1>
          <p className="text-primary-foreground/80 max-w-lg mx-auto">
            Discover guided tours and unique experiences across the world.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {hasActiveFilters && (
          <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Filtered results</span>
            {destinationFilter && <Badge variant="outline">Destination: {searchParams.get("destination")}</Badge>}
            {categoryFilter && <Badge variant="outline">Category: {searchParams.get("category")}</Badge>}
            {searchFilter && <Badge variant="outline">Search: {searchParams.get("search") ?? searchParams.get("q")}</Badge>}
            <Link to="/tours" className="text-primary font-semibold hover:underline ml-auto">
              Clear filters
            </Link>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
          </div>
        ) : filteredTours.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">No tours found for your selected filters.</p>
            {hasActiveFilters && (
              <Link to="/tours" className="inline-flex mt-3 text-primary font-semibold hover:underline">
                View all tours
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTours.map((tour) => (
              <Link
                key={tour.id}
                to={`/tours/${tour.slug}`}
                className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-elevated transition-all duration-300 group block"
              >
                {tour.cover_image && (
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src={tour.cover_image} alt={tour.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex gap-2 mb-2">
                    {tour.category && <Badge variant="outline" className="text-xs">{tour.category}</Badge>}
                    {tour.difficulty && <Badge variant="outline" className="text-xs">{tour.difficulty}</Badge>}
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground">{tour.title}</h3>
                  <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                    {tour.destination && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {tour.destination}</span>}
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {tour.duration_days}D/{tour.duration_nights}N</span>
                    {tour.max_group_size && <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> Max {tour.max_group_size}</span>}
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <div>
                      <p className="text-xl font-bold text-primary">${Number(tour.adult_price).toLocaleString()}</p>
                      <span className="text-xs text-muted-foreground">per adult</span>
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