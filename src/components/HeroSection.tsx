import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import heroSlide1 from "@/assets/hero-slide-1.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import heroSlide3 from "@/assets/hero-slide-3.jpg";

const slides = [
  {
    image: heroSlide1,
    title: "Explore the Beauty of",
    highlight: "Greece",
    subtitle: "Starting at $1,299",
    cta: "Explore Now",
  },
  {
    image: heroSlide2,
    title: "Escape to Paradise in",
    highlight: "Maldives",
    subtitle: "Starting at $2,499",
    cta: "Book Now",
  },
  {
    image: heroSlide3,
    title: "Adventure Awaits in",
    highlight: "Swiss Alps",
    subtitle: "Starting at $2,199",
    cta: "Discover More",
  },
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative w-full overflow-hidden" style={{ height: "clamp(400px, 60vw, 600px)" }}>
      {/* Slides */}
      {slides.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <img
            src={s.image}
            alt={s.highlight}
            className="w-full h-full object-cover"
            width={1920}
            height={800}
            {...(i === 0 ? {} : { loading: "lazy" as const })}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 via-foreground/30 to-transparent" />
        </div>
      ))}

      {/* Content overlay */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-xl" key={current}>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight animate-fade-up opacity-0" style={{ animationDelay: "0.1s" }}>
              {slide.title}
              <br />
              <span className="text-accent">{slide.highlight}</span>
            </h1>
            <p className="text-white/90 text-lg md:text-xl mt-4 font-medium animate-fade-up opacity-0" style={{ animationDelay: "0.2s" }}>
              {slide.subtitle}
            </p>
            <Button variant="brand-yellow" size="lg" className="mt-6 animate-fade-up opacity-0" style={{ animationDelay: "0.3s" }}>
              {slide.cta}
            </Button>
          </div>
        </div>
      </div>

      {/* Nav arrows */}
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors">
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors">
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition-all ${i === current ? "bg-white w-8" : "bg-white/50"}`}
          />
        ))}
      </div>

      {/* Search bar */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20 w-full max-w-2xl px-4">
        <div className="bg-background rounded-full shadow-elevated flex items-center px-6 py-3 gap-3">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Search destinations, packages, tours..."
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm focus:outline-none"
          />
          <Button variant="brand" size="sm" className="rounded-full px-6">
            Search
          </Button>
        </div>
      </div>
    </section>
  );
}
