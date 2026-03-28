import destSantorini from "@/assets/dest-santorini.jpg";
import destBali from "@/assets/dest-bali.jpg";
import destSwiss from "@/assets/dest-swiss.jpg";
import destDubai from "@/assets/dest-dubai.jpg";
import destMaldives from "@/assets/dest-maldives.jpg";
import destKyoto from "@/assets/dest-kyoto.jpg";
import { ArrowRight } from "lucide-react";

const destinations = [
  { name: "Santorini", country: "Greece", image: destSantorini, price: "From $1,299" },
  { name: "Bali", country: "Indonesia", image: destBali, price: "From $899" },
  { name: "Swiss Alps", country: "Switzerland", image: destSwiss, price: "From $2,199" },
  { name: "Dubai", country: "UAE", image: destDubai, price: "From $1,599" },
  { name: "Maldives", country: "Indian Ocean", image: destMaldives, price: "From $2,499" },
  { name: "Kyoto", country: "Japan", image: destKyoto, price: "From $1,799" },
];

export function DestinationsSection() {
  return (
    <section id="destinations" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-gold text-sm font-medium tracking-widest uppercase mb-2">Explore</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
              Trending Destinations
            </h2>
          </div>
          <a href="#" className="hidden md:flex items-center gap-2 text-gold hover:text-gold-light transition-colors text-sm font-medium">
            View All <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest) => (
            <div
              key={dest.name}
              className="group relative rounded-xl overflow-hidden cursor-pointer shadow-card"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  loading="lazy"
                  width={640}
                  height={800}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-gold text-xs font-medium tracking-wider uppercase">{dest.country}</p>
                <h3 className="font-display text-2xl font-bold text-foreground mt-1">{dest.name}</h3>
                <p className="text-muted-foreground text-sm mt-2">{dest.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
