import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import destSantorini from "@/assets/dest-santorini.jpg";
import destBali from "@/assets/dest-bali.jpg";
import destSwiss from "@/assets/dest-swiss.jpg";
import destDubai from "@/assets/dest-dubai.jpg";
import destMaldives from "@/assets/dest-maldives.jpg";
import destKyoto from "@/assets/dest-kyoto.jpg";

const tabs = ["Domestic", "International"];

const destinations: Record<string, { name: string; image: string; price: string; slug: string }[]> = {
  Domestic: [
    { name: "Santorini", image: destSantorini, price: "From $1,299", slug: "santorini-sunset-romance" },
    { name: "Swiss Alps", image: destSwiss, price: "From $2,199", slug: "swiss-alpine-adventure" },
    { name: "Kyoto", image: destKyoto, price: "From $1,799", slug: "kyoto-cultural-journey" },
    { name: "Bali", image: destBali, price: "From $899", slug: "bali-wellness-retreat" },
  ],
  International: [
    { name: "Dubai", image: destDubai, price: "From $1,599", slug: "dubai-gold-experience" },
    { name: "Maldives", image: destMaldives, price: "From $2,499", slug: "maldives-ocean-escape" },
    { name: "Bali", image: destBali, price: "From $899", slug: "bali-wellness-retreat" },
    { name: "Santorini", image: destSantorini, price: "From $1,299", slug: "santorini-sunset-romance" },
    { name: "Swiss Alps", image: destSwiss, price: "From $2,199", slug: "swiss-alpine-adventure" },
    { name: "Kyoto", image: destKyoto, price: "From $1,799", slug: "kyoto-cultural-journey" },
  ],
};

export function DestinationsSection() {
  const [activeTab, setActiveTab] = useState("Domestic");
  const items = destinations[activeTab];

  return (
    <section id="destinations" className="py-16 pt-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Trending Destinations
          </h2>
          <a href="#" className="hidden md:flex items-center gap-1 text-primary text-sm font-semibold hover:underline">
            Explore Now <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Scrollable cards */}
        <div className="relative">
          <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: "none" }}>
            {items.map((dest) => (
              <Link
                key={dest.name + activeTab}
                to={`/packages?destination=${encodeURIComponent(dest.name)}`}
                className="snap-start shrink-0 w-[220px] md:w-[260px] group"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-card">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      loading="lazy"
                      width={260}
                      height={347}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-display text-lg font-bold">{dest.name}</h3>
                    <p className="text-sm text-white/80 mt-0.5">{dest.price}</p>
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
