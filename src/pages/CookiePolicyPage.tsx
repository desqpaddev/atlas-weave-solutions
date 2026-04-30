import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Cookie } from "lucide-react";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="bg-primary text-primary-foreground py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-4">
            <Cookie className="h-4 w-4" />
            <span className="text-sm font-medium">Legal</span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold">Cookie Policy</h1>
          <p className="text-primary-foreground/80 mt-3">Last updated: April 30, 2026</p>
        </div>
      </div>

      <article className="container mx-auto px-4 py-16 max-w-3xl">
        <h2 className="font-display text-2xl font-bold text-foreground mt-2 mb-3">1. What Are Cookies?</h2>
        <p className="text-muted-foreground leading-relaxed">Cookies are small text files placed on your device when you visit a website. They help websites remember your preferences and improve your browsing experience.</p>

        <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-3">2. How We Use Cookies</h2>
        <p className="text-muted-foreground leading-relaxed">Joanna Holidays uses cookies to operate our website, analyse traffic, personalise content, and remember your booking preferences and login session.</p>

        <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-3">3. Types of Cookies We Use</h2>
        <ul className="text-muted-foreground leading-relaxed list-disc pl-6 space-y-2">
          <li><strong className="text-foreground">Essential cookies:</strong> Required for the website to function — login, security, and shopping cart.</li>
          <li><strong className="text-foreground">Performance cookies:</strong> Help us understand how visitors use the site so we can improve it.</li>
          <li><strong className="text-foreground">Functionality cookies:</strong> Remember your preferences such as language or region.</li>
          <li><strong className="text-foreground">Targeting cookies:</strong> Used by us and partners to deliver relevant advertising.</li>
        </ul>

        <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-3">4. Third-Party Cookies</h2>
        <p className="text-muted-foreground leading-relaxed">We may use trusted third-party services such as Google Analytics, payment processors, and social media plugins, which set their own cookies governed by their privacy policies.</p>

        <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-3">5. Managing Cookies</h2>
        <p className="text-muted-foreground leading-relaxed">You can control or disable cookies through your browser settings. Note that disabling essential cookies may affect website functionality, including the ability to make bookings.</p>

        <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-3">6. Updates</h2>
        <p className="text-muted-foreground leading-relaxed">We may update this Cookie Policy from time to time. The latest version will always be available on this page.</p>

        <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-3">7. Contact</h2>
        <p className="text-muted-foreground leading-relaxed">For questions about cookies, contact <span className="text-primary font-medium">admin@joannaholidays.uk</span>.</p>
      </article>
      <Footer />
    </div>
  );
}
