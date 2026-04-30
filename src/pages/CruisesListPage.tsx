import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { Link } from "react-router-dom";
import { MapPin, Clock, ArrowRight, Users, Ship } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import cruisesHero from "@/assets/cruises-hero.jpg";

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
      <PageHero
        image={cruisesHero}
        eyebrow={<><Ship className="h-4 w-4" /> Set Sail in Style</>}
        title={<>Cruise <span className="text-accent">Adventures</span></>}
        subtitle="From the Mediterranean to the Caribbean — board world-class ships and wake up in a new paradise every morning."
      />

      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
          </div>
        ) : cruises.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Ship className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No cruise tours available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cruises.map((cruise) => (
              <Link
                key={cruise.id}
                to={`/tours/${cruise.slug}`}
                className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-elevated transition-all duration-300 group block"
              >
                {cruise.cover_image && (
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img src={cruise.cover_image} alt={cruise.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-primary text-primary-foreground gap-1">
                        <Ship className="h-3 w-3" /> Cruise
                      </Badge>
                    </div>
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-display text-lg font-bold text-foreground">{cruise.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{cruise.description}</p>
                  <div className="flex items-center gap-3 mt-3 text-sm text-muted-foreground">
                    {cruise.destination && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {cruise.destination}</span>}
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {cruise.duration_days}D/{cruise.duration_nights}N</span>
                    {cruise.max_group_size && <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> Max {cruise.max_group_size}</span>}
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <div>
                      <p className="text-xl font-bold text-primary">£{Number(cruise.adult_price).toLocaleString()}</p>
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
