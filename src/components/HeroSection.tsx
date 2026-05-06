import { useState, useEffect, useCallback } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

// Curated travel & tour videos (Pexels, royalty-free)
const slides = [
  {
    type: "video" as const,
    video: "https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4",
    eyebrow: "Tailor-Made Journeys",
    title: "Extraordinary Travel,",
    titleItalic: "thoughtfully crafted.",
    subtitle:
      "For more than three decades, Joanna Holidays has been creating private, expertly-guided journeys across the UK, Europe and beyond.",
    cta: { label: "Explore Our Journeys", href: "/packages" },
  },
  {
    type: "video" as const,
    video: "https://videos.pexels.com/video-files/2169880/2169880-uhd_2560_1440_30fps.mp4",
    eyebrow: "Private Escapes",
    title: "Sun-drenched coasts,",
    titleItalic: "timeless luxury.",
    subtitle:
      "From the Amalfi to the Aegean — discreet hideaways, private guides and seamless travel from door to door.",
    cta: { label: "Discover Beach & Coast", href: "/tours?destination=Maldives" },
  },
  {
    type: "video" as const,
    video: "https://videos.pexels.com/video-files/4763824/4763824-uhd_2560_1440_24fps.mp4",
    eyebrow: "Cultural Discovery",
    title: "The grand cities of",
    titleItalic: "Europe await.",
    subtitle:
      "Privately-guided experiences in Paris, Rome, Vienna and Prague — all crafted around your interests.",
    cta: { label: "Explore Europe", href: "/tours?destination=Europe" },
  },
  {
    type: "video" as const,
    video: "https://videos.pexels.com/video-files/2169307/2169307-uhd_2560_1440_30fps.mp4",
    eyebrow: "Adventure Awaits",
    title: "Mountains, jungles &",
    titleItalic: "open horizons.",
    subtitle:
      "Trek the Himalayas, drift through Halong Bay or cruise the Nile — adventures designed around you.",
    cta: { label: "Explore Adventures", href: "/tours" },
  },
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative w-full overflow-hidden" style={{ height: "clamp(580px, 88vh, 880px)" }}>
      {slides.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          {s.type === "video" ? (
            <video src={s.video} autoPlay muted loop playsInline className="w-full h-full object-cover" />
          ) : (
            <img
              src={s.image}
              alt=""
              className="w-full h-full object-cover"
              width={1920}
              height={1080}
              loading={i === 0 ? undefined : "lazy"}
            />
          )}
          {/* Editorial gradient — darker at bottom-left for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-tr from-foreground/75 via-foreground/35 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/15 via-transparent to-foreground/40" />
        </div>
      ))}

      {/* Content — left-aligned editorial */}
      <div className="relative z-10 h-full container mx-auto px-6 md:px-10 flex items-end pb-32 md:pb-36">
        <div className="max-w-2xl text-white" key={current}>
          <span
            className="inline-block text-[11px] font-sans-ui font-semibold tracking-[0.28em] uppercase text-white/85 mb-5 animate-fade-up opacity-0"
            style={{ animationDelay: "0.05s" }}
          >
            {slide.eyebrow}
          </span>
          <h1
            className="font-display font-medium text-white leading-[1.05] text-[clamp(2.25rem,6vw,4.75rem)] animate-fade-up opacity-0"
            style={{ animationDelay: "0.15s" }}
          >
            {slide.title}
            <br />
            <em className="font-normal italic text-white/95">{slide.titleItalic}</em>
          </h1>
          <p
            className="mt-5 max-w-xl text-base md:text-lg text-white/85 font-light leading-relaxed animate-fade-up opacity-0"
            style={{ animationDelay: "0.25s" }}
          >
            {slide.subtitle}
          </p>
          <div className="mt-8 animate-fade-up opacity-0" style={{ animationDelay: "0.35s" }}>
            <Link
              to={slide.cta.href}
              className="group inline-flex items-center gap-3 px-7 py-3.5 border border-white/70 text-white text-xs font-sans-ui font-semibold tracking-[0.22em] uppercase hover:bg-white hover:text-foreground transition-all duration-300"
            >
              {slide.cta.label}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Slide controls — bottom-right, minimal */}
      <div className="absolute bottom-8 right-8 z-20 flex items-center gap-4 text-white">
        <span className="font-display text-sm tabular-nums">
          {String(current + 1).padStart(2, "0")}
          <span className="text-white/50"> / {String(slides.length).padStart(2, "0")}</span>
        </span>
        <div className="flex items-center gap-2 ml-2">
          <button
            onClick={prev}
            aria-label="Previous"
            className="w-10 h-10 border border-white/40 flex items-center justify-center hover:bg-white hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={next}
            aria-label="Next"
            className="w-10 h-10 border border-white/40 flex items-center justify-center hover:bg-white hover:text-foreground transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Slide indicator bar bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20 h-[2px] bg-white/15">
        <div
          key={current}
          className="h-full bg-accent"
          style={{ animation: "hero-progress 8s linear forwards" }}
        />
      </div>

      <style>{`
        @keyframes hero-progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}
