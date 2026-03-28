import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plane, Mail, MapPin, Phone, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      {/* Newsletter */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-primary rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="font-display text-xl md:text-2xl font-bold text-primary-foreground mb-1">
              Get Exclusive Travel Deals
            </h3>
            <p className="text-primary-foreground/80 text-sm">
              Subscribe to receive handpicked destinations and early access to our best packages.
            </p>
          </div>
          <div className="flex gap-2 w-full max-w-sm">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
            />
            <Button variant="brand-yellow">Subscribe</Button>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <span className="font-display text-xl font-bold text-accent">TravelHub</span>
            <p className="text-sm text-background/60 mt-3 leading-relaxed">
              Your trusted partner for unforgettable travel experiences worldwide.
            </p>
            <div className="flex gap-3 mt-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-full bg-background/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-background mb-4 text-sm">Explore</h4>
            <ul className="space-y-2 text-sm text-background/60">
              <li><a href="#" className="hover:text-accent transition-colors">Holidays</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Flights</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Hotels</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Tours</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-background mb-4 text-sm">Company</h4>
            <ul className="space-y-2 text-sm text-background/60">
              <li><a href="#" className="hover:text-accent transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Press</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-background mb-4 text-sm">Contact</h4>
            <ul className="space-y-2 text-sm text-background/60">
              <li className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-accent" /> hello@travelhub.com</li>
              <li className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-accent" /> +1 (800) 555-0199</li>
              <li className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-accent" /> New York, NY</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-background/50">
          <p>© 2026 TravelHub. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-accent transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
