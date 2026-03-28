import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Plane, Hotel, MapPin, CalendarDays, Users } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const tabs = [
  { id: "flights", label: "Flights", icon: Plane },
  { id: "hotels", label: "Hotels", icon: Hotel },
  { id: "tours", label: "Tours", icon: MapPin },
];

export function HeroSection() {
  const [activeTab, setActiveTab] = useState("flights");

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Luxury beach resort"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-20 pb-12 text-center">
        <p className="text-gold font-medium tracking-widest uppercase text-sm mb-4 animate-fade-up opacity-0" style={{ animationDelay: "0.1s" }}>
          Luxury Travel Redefined
        </p>
        <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-foreground leading-tight mb-6 animate-fade-up opacity-0" style={{ animationDelay: "0.2s" }}>
          Discover the World's
          <br />
          <span className="text-gradient-gold">Most Exquisite</span> Destinations
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-fade-up opacity-0" style={{ animationDelay: "0.3s" }}>
          Curated journeys to extraordinary places. From pristine beaches to alpine retreats, 
          your perfect escape awaits.
        </p>

        {/* Search Card */}
        <div className="max-w-4xl mx-auto glass-card rounded-xl p-1 animate-fade-up opacity-0" style={{ animationDelay: "0.4s" }}>
          {/* Tabs */}
          <div className="flex gap-1 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-gold text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4">
            <div className="flex items-center gap-3 bg-secondary/50 rounded-lg px-4 py-3">
              <MapPin className="h-4 w-4 text-gold shrink-0" />
              <div className="text-left">
                <p className="text-xs text-muted-foreground">Destination</p>
                <p className="text-sm text-foreground font-medium">Where to?</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-secondary/50 rounded-lg px-4 py-3">
              <CalendarDays className="h-4 w-4 text-gold shrink-0" />
              <div className="text-left">
                <p className="text-xs text-muted-foreground">Check In</p>
                <p className="text-sm text-foreground font-medium">Select Date</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-secondary/50 rounded-lg px-4 py-3">
              <CalendarDays className="h-4 w-4 text-gold shrink-0" />
              <div className="text-left">
                <p className="text-xs text-muted-foreground">Check Out</p>
                <p className="text-sm text-foreground font-medium">Select Date</p>
              </div>
            </div>
            <Button variant="hero" className="h-full min-h-[52px] text-base gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-12 animate-fade-up opacity-0" style={{ animationDelay: "0.5s" }}>
          {[
            { value: "500+", label: "Destinations" },
            { value: "10K+", label: "Happy Travelers" },
            { value: "4.9", label: "Average Rating" },
            { value: "24/7", label: "Support" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl md:text-3xl font-display font-bold text-gradient-gold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
