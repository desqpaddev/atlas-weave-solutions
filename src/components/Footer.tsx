import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plane, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      {/* Newsletter */}
      <div className="container mx-auto px-4 py-16">
        <div className="glass-card rounded-2xl p-8 md:p-12 text-center max-w-3xl mx-auto">
          <Plane className="h-8 w-8 text-gold mx-auto mb-4" />
          <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
            Get Exclusive Travel Deals
          </h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
            Subscribe to receive handpicked destinations and early access to our best packages.
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-secondary/50 border-border"
            />
            <Button variant="hero">Subscribe</Button>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <span className="font-display text-xl font-bold text-gradient-gold">TravelHub</span>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              Luxury travel experiences curated for the discerning traveler.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm">Explore</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-gold transition-colors">Destinations</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Packages</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Tours</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Flights</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-gold transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Press</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-gold" /> hello@travelhub.com</li>
              <li className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-gold" /> +1 (800) 555-0199</li>
              <li className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-gold" /> New York, NY</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 TravelHub. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gold transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
