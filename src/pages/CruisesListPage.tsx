import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { ChevronRight, Ship } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const IMG = (p: string) => `https://www.msccruises.com/int/-/media/global-contents/ships/${p}`;
const FLEET = [
  { name: "World Atlantic", image: IMG("fleet/world-atlantic/miniature_world_atlantic_1260x405px.png?bc=transparent&as=1&mh=405&mw=1260&hash=7EEDC267BA37C740414B9D288B203F96") },
  { name: "World Asia", image: IMG("fleet-page/as_miniature.png?bc=transparent&as=1&mh=405&mw=1260&hash=E07329441A72339EE27B83CF416B98B6") },
  { name: "World America", image: IMG("fleet-page/am_miniature.png?bc=transparent&as=1&mh=405&mw=1260&hash=8C3DB307CB6EAF2FAC1673DE13C08064") },
  { name: "Euribia", image: IMG("fleet-page/er_silhouette.png?bc=transparent&as=1&mh=405&mw=1260&hash=B727D67C8D44D7D6F85FC80DD8B735F2") },
  { name: "Seascape", image: IMG("fleet-page/sc_miniature.png?bc=transparent&as=1&mh=203&mw=630&hash=7F552F5E9EF6B3E53469AB0FE51BF6AB") },
  { name: "World Europa", image: IMG("fleet-page/eu_miniature.png?bc=transparent&as=1&mh=405&mw=1260&hash=A4B48F1237AD0650BED16637011704F5") },
  { name: "Seashore", image: IMG("fleet-page/sh_miniature.png?bc=transparent&as=1&mh=405&mw=1260&hash=EA8DCBE50A7A1EEF520496F231C1439C") },
  { name: "Virtuosa", image: IMG("fleet-page/vi-miniature.png?bc=transparent&as=1&mh=405&mw=1260&hash=F7B6D1B21A781D14CC7054F323981901") },
  { name: "Grandiosa", image: IMG("fleet-page/gr_miniature.png?bc=transparent&as=1&mh=405&mw=1260&hash=3D86929CB136365470A018947210D533") },
  { name: "Bellissima", image: IMG("fleet-page/bellissima_miniature.png?bc=transparent&as=1&mh=405&mw=1260&hash=D9AFBCFC84DDD85765AB5706DD4FC59E") },
  { name: "Seaview", image: IMG("fleet-page/sv_miniature.png?bc=transparent&as=1&mh=405&mw=1260&hash=D830FBC7ECBEB0A3F5B45D0CA6A897F9") },
  { name: "Meraviglia", image: IMG("fleet-page/mr__miniature.png?bc=transparent&as=1&mh=405&mw=1260&hash=1B8D3755EC8119AF28F941B84045EA57") },
  { name: "Preziosa", image: IMG("fleet-page/pr_miniature.png?bc=transparent&as=1&mh=405&mw=1260&hash=2AD90F07F39415787F5F437EEED7244A") },
  { name: "Divina", image: IMG("fleet-page/di_miniature.png?bc=transparent&as=1&mh=405&mw=1260&hash=A46EBCCA3C14F76075D7FEA90B6C7FD9") },
  { name: "Splendida", image: IMG("fleet-page/splendida_miniature_ok.png?bc=transparent&as=1&mh=405&mw=1260&hash=6878CA5116F521FDBC8E926E9EB5FFE0") },
  { name: "Fantasia", image: IMG("fleet-page/fa_miniature.png?bc=transparent&as=1&mh=405&mw=1260&hash=BD159B0F1F8E6BBA60D883F598AF341C") },
  { name: "Magnifica", image: IMG("fleet-page/ma_miniature.png?bc=transparent&as=1&mh=405&mw=1260&hash=36F93DD2A2230ACF9798A7FC44D184FE") },
  { name: "Poesia", image: IMG("fleet-page/po_miniature.png?bc=transparent&as=1&mh=405&mw=1260&hash=C63093BCD478B8B829419C66C5620D21") },
  { name: "Orchestra", image: IMG("fleet-page/or_miniature.png?bc=transparent&as=1&mh=405&mw=1260&hash=720248F08FB1B0F9461511625A715B43") },
  { name: "Musica", image: IMG("fleet-page/mu_miniature.png?bc=transparent&as=1&mh=405&mw=1260&hash=4344E39BFDE830CDA95539F310C3E7FF") },
  { name: "Opera", image: IMG("fleet-page/ox_miniature.png?bc=transparent&as=1&mh=405&mw=1260&hash=454448BB17E6610957881CB074DA8F81") },
  { name: "Lirica", image: IMG("fleet-page/li_miniature.png?bc=transparent&as=1&mh=405&mw=1260&hash=9378D399A3E4E762AD4BC9750F78B161") },
  { name: "Sinfonia", image: IMG("fleet-page/sx_miniature.png?bc=transparent&as=1&mh=405&mw=1260&hash=041A792AA8533C37495F0F40A0588C9F") },
  { name: "Armonia", image: IMG("fleet-page/armonia_minuature.png?bc=transparent&as=1&mh=405&mw=1260&hash=113E50E3E6C9957403D267A0613A1BCC") },
];

export default function CruisesListPage() {
  const [activeShip, setActiveShip] = useState<{ name: string; image: string } | null>(null);
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
            <button
              type="button"
              key={ship.name}
              onClick={() => setActiveShip(ship)}
              className="group relative bg-gradient-to-b from-slate-50 to-slate-200 border border-border overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 cursor-pointer text-left"
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
            </button>
          ))}
        </div>
      </section>

      <Dialog open={!!activeShip} onOpenChange={(o) => !o && setActiveShip(null)}>
        <DialogContent className="max-w-5xl bg-white p-0 overflow-hidden">
          {activeShip && (
            <div>
              <div className="flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-8">
                <img
                  src={activeShip.image}
                  alt={activeShip.name}
                  className="max-h-[70vh] w-auto object-contain"
                />
              </div>
              <div className="px-6 py-4 border-t border-border bg-white">
                <h3 className="font-display text-xl md:text-2xl font-semibold text-primary tracking-wide uppercase text-center">
                  {activeShip.name}
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
