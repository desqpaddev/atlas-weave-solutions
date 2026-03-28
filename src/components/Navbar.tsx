import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, MapPin, Globe, Plane, Hotel, Compass, Ship, ChevronDown, User } from "lucide-react";
import { Link } from "react-router-dom";

const navLinks = [
  { label: "Holidays", href: "/packages", icon: Compass },
  { label: "Flights", href: "#flights", icon: Plane },
  { label: "Hotels", href: "#hotels", icon: Hotel },
  { label: "Tours", href: "/tours", icon: Compass },
  { label: "Cruise", href: "/cruises", icon: Ship },
  { label: "Contact", href: "/contact", icon: Phone },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background shadow-soft">
      {/* Top utility bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto flex items-center justify-between h-9 px-4 text-xs">
          <div className="flex items-center gap-1.5">
            <Phone className="h-3 w-3" />
            <span className="font-medium">1800-123-4567</span>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <a href="#" className="flex items-center gap-1 hover:underline">
              <Phone className="h-3 w-3" /> Contact Us
            </a>
            <span className="w-px h-3 bg-primary-foreground/30" />
            <a href="#" className="flex items-center gap-1 hover:underline">
              <MapPin className="h-3 w-3" /> Stores
            </a>
            <span className="w-px h-3 bg-primary-foreground/30" />
            <button className="flex items-center gap-1 hover:underline">
              <Globe className="h-3 w-3" /> English <ChevronDown className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-2xl font-bold text-primary">TravelHub</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const isInternal = link.href.startsWith("/");
              const Comp = isInternal ? Link : "a";
              const props = isInternal ? { to: link.href } : { href: link.href };
              return (
                <Comp
                  key={link.label}
                  {...(props as any)}
                  className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-primary transition-colors group"
                >
                  <link.icon className="h-5 w-5 group-hover:text-primary" />
                  <span className="text-xs font-medium">{link.label}</span>
                </Comp>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Button variant="brand" size="sm" asChild>
              <Link to="/auth" className="gap-1.5">
                <User className="h-4 w-4" />
                Login
              </Link>
            </Button>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} className="lg:hidden text-foreground">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-background border-b border-border animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => {
              const isInternal = link.href.startsWith("/");
              const Comp = isInternal ? Link : "a";
              const props = isInternal ? { to: link.href } : { href: link.href };
              return (
                <Comp
                  key={link.label}
                  {...(props as any)}
                  className="flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-primary py-3 px-2 rounded-lg hover:bg-secondary transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </Comp>
              );
            })}
            <div className="flex gap-3 pt-3 border-t border-border mt-2">
              <Button variant="brand" size="sm" className="flex-1" asChild>
                <Link to="/auth">Login</Link>
              </Button>
              <Button variant="brand-outline" size="sm" className="flex-1" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
