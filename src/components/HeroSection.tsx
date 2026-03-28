import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MapPin, CalendarDays, Users, Search, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import heroSlide3 from "@/assets/hero-slide-3.jpg";

const TRAVEL_VIDEO_URL = "https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4";

const slides = [
  {
    type: "video" as const,
    video: TRAVEL_VIDEO_URL,
    title: "Discover Your Next",
    highlight: "Adventure",
    subtitle: "Explore breathtaking destinations around the world with curated travel experiences",
  },
  {
    type: "image" as const,
    image: heroSlide2,
    title: "Unforgettable Escapes to",
    highlight: "Paradise",
    subtitle: "Luxury resorts, pristine beaches, and memories that last forever",
  },
  {
    type: "image" as const,
    image: heroSlide3,
    title: "Experience the Magic of",
    highlight: "Europe",
    subtitle: "From the Alps to the Mediterranean — journeys crafted just for you",
  },
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    location: "",
    checkIn: "",
    guests: "2 Adults",
  });

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchData.location) params.set("destination", searchData.location);
    navigate(`/tours?${params.toString()}`);
  };

  return (
    <section className="relative w-full overflow-hidden" style={{ height: "clamp(500px, 70vh, 750px)" }}>
      {/* Slides */}
      {slides.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-all duration-1000 ease-in-out"
          style={{
            opacity: i === current ? 1 : 0,
            transform: i === current ? "scale(1)" : "scale(1.08)",
          }}
        >
          {s.type === "video" ? (
            <video
              src={s.video}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={s.image}
              alt={s.highlight}
              className="w-full h-full object-cover"
              width={1920}
              height={800}
              loading={i === 0 ? undefined : ("lazy" as const)}
            />
          )}
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/50 via-foreground/30 to-foreground/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/40 via-transparent to-transparent" />
        </div>
      ))}

      {/* Content overlay */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-3xl" key={current}>
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6 animate-fade-up opacity-0"
            style={{ animationDelay: "0.05s" }}
          >
            {slide.type === "video" && <Play className="h-3 w-3 text-accent fill-accent" />}
            <span className="text-white/90 text-xs font-medium tracking-wider uppercase">
              {slide.type === "video" ? "Featured Experience" : "Handpicked Destinations"}
            </span>
          </div>

          <h1
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] animate-fade-up opacity-0"
            style={{ animationDelay: "0.15s" }}
          >
            {slide.title}
            <br />
            <span className="text-accent drop-shadow-lg">{slide.highlight}</span>
          </h1>
          <p
            className="text-white/85 text-base md:text-lg lg:text-xl mt-4 max-w-xl mx-auto font-light animate-fade-up opacity-0"
            style={{ animationDelay: "0.25s" }}
          >
            {slide.subtitle}
          </p>
        </div>
      </div>

      {/* Nav arrows */}
      <button
        onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-all duration-300 group"
      >
        <ChevronLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-all duration-300 group"
      >
        <ChevronRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-36 md:bottom-32 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="relative h-1 rounded-full overflow-hidden transition-all duration-500"
            style={{ width: i === current ? 40 : 16 }}
          >
            <div className="absolute inset-0 bg-white/30 rounded-full" />
            {i === current && (
              <div
                className="absolute inset-0 bg-accent rounded-full"
                style={{
                  animation: "progress-fill 7s linear forwards",
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Advanced Search Bar */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20 w-full max-w-4xl px-4">
        <div className="bg-background rounded-2xl shadow-elevated border border-border overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border">
            {/* Location */}
            <div className="px-5 py-4 group hover:bg-secondary/50 transition-colors">
              <label className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 mb-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                Location
              </label>
              <input
                type="text"
                placeholder="Where to?"
                value={searchData.location}
                onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
                className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
              />
            </div>

            {/* Check In */}
            <div className="px-5 py-4 group hover:bg-secondary/50 transition-colors">
              <label className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 mb-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-primary" />
                Travel Date
              </label>
              <input
                type="date"
                value={searchData.checkIn}
                onChange={(e) => setSearchData({ ...searchData, checkIn: e.target.value })}
                className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
              />
            </div>

            {/* Guests */}
            <div className="px-5 py-4 group hover:bg-secondary/50 transition-colors">
              <label className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 mb-1.5">
                <Users className="h-3.5 w-3.5 text-primary" />
                Guests
              </label>
              <select
                value={searchData.guests}
                onChange={(e) => setSearchData({ ...searchData, guests: e.target.value })}
                className="w-full bg-transparent text-sm font-medium text-foreground focus:outline-none appearance-none cursor-pointer"
              >
                <option>1 Adult</option>
                <option>2 Adults</option>
                <option>2 Adults, 1 Child</option>
                <option>2 Adults, 2 Children</option>
                <option>Group (5+)</option>
              </select>
            </div>

            {/* Search Button */}
            <div className="p-3 flex items-center justify-center">
              <Button
                onClick={handleSearch}
                className="w-full h-full rounded-xl bg-gradient-blue text-white font-semibold text-sm hover:opacity-90 transition-opacity gap-2"
              >
                <Search className="h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress animation keyframe */}
      <style>{`
        @keyframes progress-fill {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}
