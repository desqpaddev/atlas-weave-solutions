import { Button } from "@/components/ui/button";
import { Star, Clock, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import destBali from "@/assets/dest-bali.jpg";
import destSwiss from "@/assets/dest-swiss.jpg";
import destDubai from "@/assets/dest-dubai.jpg";

const packages = [
  {
    title: "Bali Wellness Retreat",
    duration: "7 Days / 6 Nights",
    guests: "2-6 People",
    rating: 4.9,
    reviews: 324,
    price: 1299,
    originalPrice: 1699,
    image: destBali,
    tags: ["Spa", "Nature", "Yoga"],
  },
  {
    title: "Swiss Alpine Adventure",
    duration: "5 Days / 4 Nights",
    guests: "2-8 People",
    rating: 4.8,
    reviews: 218,
    price: 2199,
    originalPrice: 2799,
    image: destSwiss,
    tags: ["Adventure", "Skiing", "Luxury"],
  },
  {
    title: "Dubai Gold Experience",
    duration: "4 Days / 3 Nights",
    guests: "2-4 People",
    rating: 4.9,
    reviews: 456,
    price: 1599,
    originalPrice: 2099,
    image: destDubai,
    tags: ["City", "Luxury", "Shopping"],
  },
];

export function PackagesSection() {
  return (
    <section id="packages" className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Holiday Packages
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Hand-picked packages for an unforgettable journey.
            </p>
          </div>
          <Link to="/packages" className="hidden md:flex items-center gap-1 text-primary text-sm font-semibold hover:underline">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.title}
              className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-elevated transition-all duration-300 group"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  loading="lazy"
                  width={640}
                  height={400}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 bg-destructive text-destructive-foreground text-xs font-bold px-2.5 py-1 rounded-full">
                  Save ${pkg.originalPrice - pkg.price}
                </div>
              </div>

              <div className="p-5">
                <div className="flex flex-wrap gap-2 mb-3">
                  {pkg.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full font-medium">
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="font-display text-lg font-bold text-foreground">{pkg.title}</h3>

                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {pkg.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" /> {pkg.guests}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 mt-2">
                  <Star className="h-4 w-4 text-accent fill-accent" />
                  <span className="text-sm font-semibold text-foreground">{pkg.rating}</span>
                  <span className="text-xs text-muted-foreground">({pkg.reviews} reviews)</span>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <div>
                    <span className="text-xs text-muted-foreground line-through">${pkg.originalPrice}</span>
                    <p className="text-xl font-bold text-primary">${pkg.price}</p>
                    <span className="text-xs text-muted-foreground">per person</span>
                  </div>
              <Link to="/packages">
                    <Button variant="brand" size="sm" className="gap-1">
                      Book Now <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
