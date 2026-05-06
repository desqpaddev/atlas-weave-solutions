import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Menu, X, Phone, Search, User, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleTranslate } from "@/components/GoogleTranslate";

const primaryLinks = [
  { label: "Destinations", href: "/tours" },
  { label: "Our Journeys", href: "/packages" },
  { label: "Cruises", href: "/cruises" },
  { label: "Fixed Departures", href: "/departures" },
];

type DestinationRegion = {
  label: string;
  href: string;
  blurb: string;
  image: string;
  countries: { label: string; href: string }[];
};

const destinationRegions: DestinationRegion[] = [
  {
    label: "Europe",
    href: "/tours?region=europe",
    blurb:
      "From Alpine peaks to Mediterranean shores — timeless cities, romantic countryside and grand journeys across the continent.",
    image:
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=70",
    countries: [
      { label: "Switzerland", href: "/tours?country=switzerland" },
      { label: "France", href: "/tours?country=france" },
      { label: "Belgium", href: "/tours?country=belgium" },
      { label: "Netherlands", href: "/tours?country=netherlands" },
      { label: "Germany", href: "/tours?country=germany" },
      { label: "Italy", href: "/tours?country=italy" },
      { label: "Austria", href: "/tours?country=austria" },
      { label: "Hungary", href: "/tours?country=hungary" },
      { label: "Poland", href: "/tours?country=poland" },
      { label: "Czech Republic", href: "/tours?country=czech-republic" },
    ],
  },
];

const drawerLinks = [
  { label: "Destinations", href: "/tours" },
  { label: "Our Journeys", href: "/packages" },
  { label: "Cruises", href: "/cruises" },
  { label: "Fixed Departures", href: "/departures" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Sign In", href: "/auth" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [destOpen, setDestOpen] = useState(false);
  const [activeRegion, setActiveRegion] = useState<string>(destinationRegions[0].label);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const closeTimer = useRef<number | null>(null);

  const openDest = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setDestOpen(true);
  };
  const scheduleCloseDest = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setDestOpen(false), 150);
  };

  const { data: company } = useQuery({
    queryKey: ["public-company-branding"],
    queryFn: async () => {
      const { data } = await supabase.from("companies").select("name, logo_url, phone, email").limit(1).maybeSingle();
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/tours?search=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
    setQuery("");
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border/60">
      {/* Slim utility bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto flex items-center justify-between h-9 px-4 text-[11px] tracking-wide uppercase font-sans-ui">
          <a href={`tel:${company?.phone || "+447418375151"}`} className="flex items-center gap-1.5 hover:opacity-90">
            <Phone className="h-3 w-3" />
            <span className="font-medium normal-case tracking-normal">Speak to us · {company?.phone || "+44 7418 375151"}</span>
          </a>
          <div className="hidden sm:flex items-center gap-5">
            <Link to="/about" className="hover:underline">About</Link>
            <Link to="/contact" className="hover:underline">Contact</Link>
            <span className="w-px h-3 bg-primary-foreground/30" />
            <GoogleTranslate />
          </div>
        </div>
      </div>

      {/* Main row: hamburger left · centered serif wordmark · search + login right */}
      <nav>
        <div className="container mx-auto grid grid-cols-3 items-center h-20 px-4">
          {/* Left: Menu */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <Menu className="h-5 w-5" />
              <span className="hidden sm:inline text-xs font-sans-ui font-semibold tracking-[0.18em] uppercase">Menu</span>
            </button>

            {/* Inline primary links on large screens */}
            <ul className="hidden xl:flex items-center gap-7 ml-4">
              {primaryLinks.slice(0, 3).map((l) => {
                const isDest = l.label === "Destinations";
                return (
                  <li
                    key={l.label}
                    onMouseEnter={isDest ? openDest : undefined}
                    onMouseLeave={isDest ? scheduleCloseDest : undefined}
                  >
                    <Link
                      to={l.href}
                      onClick={(e) => {
                        if (isDest) {
                          e.preventDefault();
                          setDestOpen((v) => !v);
                        }
                      }}
                      aria-expanded={isDest ? destOpen : undefined}
                      className={`text-xs font-sans-ui font-semibold tracking-[0.18em] uppercase transition-colors ${
                        isDest && destOpen ? "text-primary" : "text-foreground/80 hover:text-primary"
                      }`}
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Center: Wordmark */}
          <Link to="/" className="flex items-center justify-center">
            {company?.logo_url ? (
              <img src={company.logo_url} alt={company.name || "Joanna Holidays"} className="h-12 w-auto max-w-[200px] object-contain" />
            ) : (
              <span className="font-display text-xl sm:text-2xl md:text-[28px] tracking-[0.08em] uppercase text-foreground text-center leading-none">
                {company?.name || "Joanna Holidays"}
              </span>
            )}
          </Link>

          {/* Right: search + login */}
          <div className="flex items-center justify-end gap-5">
            <button
              onClick={() => setSearchOpen((s) => !s)}
              aria-label="Find your journey"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors group"
            >
              <Search className="h-4 w-4" />
              <span className="hidden md:inline text-xs font-sans-ui font-semibold tracking-[0.18em] uppercase">
                Find your Journey
              </span>
            </button>
            <Link
              to="/auth"
              aria-label="Sign in"
              className="hidden sm:flex items-center gap-1.5 text-xs font-sans-ui font-semibold tracking-[0.18em] uppercase text-foreground hover:text-primary transition-colors"
            >
              <User className="h-4 w-4" />
              <span className="hidden lg:inline">Sign in</span>
            </Link>
          </div>
        </div>

        {/* Search drawer */}
        {searchOpen && (
          <div className="border-t border-border bg-background animate-fade-in">
            <form onSubmit={submitSearch} className="container mx-auto px-4 py-5 flex items-center gap-3">
              <Search className="h-5 w-5 text-muted-foreground shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Where would you like to go?"
                className="flex-1 bg-transparent text-base font-display italic placeholder:text-muted-foreground/60 focus:outline-none"
              />
              <button
                type="submit"
                className="text-xs font-sans-ui font-semibold tracking-[0.18em] uppercase text-primary hover:underline"
              >
                Search →
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}

        {/* Destinations mega menu (A&K-style) */}
        {destOpen && (
          <div
            onMouseEnter={openDest}
            onMouseLeave={scheduleCloseDest}
            className="hidden xl:block absolute left-0 right-0 top-full border-t border-border bg-background shadow-elevated animate-fade-in z-40"
          >
            <div className="container mx-auto px-8 py-10 grid grid-cols-12 gap-10">
              {/* Regions rail */}
              <div className="col-span-3 border-r border-border pr-8">
                <p className="text-[10px] font-sans-ui font-semibold tracking-[0.22em] uppercase text-muted-foreground mb-5">
                  Regions
                </p>
                <ul className="space-y-1">
                  {destinationRegions.map((r) => {
                    const active = r.label === activeRegion;
                    return (
                      <li key={r.label}>
                        <button
                          onMouseEnter={() => setActiveRegion(r.label)}
                          onClick={() => {
                            setDestOpen(false);
                            navigate(r.href);
                          }}
                          className={`group w-full flex items-center justify-between py-2.5 font-display text-2xl transition-colors ${
                            active ? "text-primary" : "text-foreground hover:text-primary"
                          }`}
                        >
                          <span>{r.label}</span>
                          <ChevronRight
                            className={`h-4 w-4 transition-all ${
                              active ? "opacity-100 translate-x-0 text-primary" : "opacity-0 -translate-x-1"
                            }`}
                          />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Countries grid */}
              <div className="col-span-6 pr-6">
                {destinationRegions
                  .filter((r) => r.label === activeRegion)
                  .map((r) => (
                    <div key={r.label}>
                      <p className="text-[10px] font-sans-ui font-semibold tracking-[0.22em] uppercase text-muted-foreground mb-5">
                        Countries · {r.label}
                      </p>
                      <ul className="grid grid-cols-2 gap-x-8 gap-y-3">
                        {r.countries.map((c) => (
                          <li key={c.label}>
                            <Link
                              to={c.href}
                              onClick={() => setDestOpen(false)}
                              className="group flex items-center justify-between border-b border-border/60 py-2.5 text-sm font-sans-ui tracking-wide text-foreground/85 hover:text-primary hover:border-primary/40 transition-colors"
                            >
                              <span>{c.label}</span>
                              <ChevronRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>

              {/* Editorial tile */}
              <div className="col-span-3">
                {destinationRegions
                  .filter((r) => r.label === activeRegion)
                  .map((r) => (
                    <Link
                      key={r.label}
                      to={r.href}
                      onClick={() => setDestOpen(false)}
                      className="group block"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                        <img
                          src={r.image}
                          alt={r.label}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-5 text-background">
                          <p className="text-[10px] font-sans-ui font-semibold tracking-[0.22em] uppercase opacity-90 mb-1">
                            Discover
                          </p>
                          <h3 className="font-display text-2xl leading-tight">{r.label}</h3>
                        </div>
                      </div>
                      <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{r.blurb}</p>
                      <span className="mt-3 inline-flex items-center gap-2 text-xs font-sans-ui font-semibold tracking-[0.18em] uppercase text-primary">
                        Explore {r.label} <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Full drawer menu */}
      {open && (
        <div className="fixed inset-0 z-50 animate-fade-in">
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-full sm:w-[420px] bg-background shadow-elevated p-8 overflow-y-auto">
            <div className="flex items-center justify-between mb-10">
              <span className="text-xs font-sans-ui font-semibold tracking-[0.22em] uppercase text-muted-foreground">
                Menu
              </span>
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="text-foreground hover:text-primary">
                <X className="h-5 w-5" />
              </button>
            </div>
            <ul className="space-y-1">
              {drawerLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 border-b border-border font-display text-2xl text-foreground hover:text-primary transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-10 text-sm text-muted-foreground space-y-2">
              <p className="font-sans-ui text-[11px] tracking-[0.2em] uppercase text-foreground/60">Speak to us</p>
              <a href={`tel:${company?.phone || "+447418375151"}`} className="block font-display text-xl text-primary">
                {company?.phone || "+44 7418 375151"}
              </a>
              <a href={`mailto:${company?.email || "admin@joannaholidays.uk"}`} className="block">
                {company?.email || "admin@joannaholidays.uk"}
              </a>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
