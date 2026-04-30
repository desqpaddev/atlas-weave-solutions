import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="bg-primary text-primary-foreground py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-4">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">Legal</span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold">Privacy Policy</h1>
          <p className="text-primary-foreground/80 mt-3">Last updated: April 30, 2026</p>
        </div>
      </div>

      <article className="container mx-auto px-4 py-16 max-w-3xl prose prose-slate dark:prose-invert">
        <h2 className="font-display text-2xl font-bold text-foreground mt-2 mb-3">1. Introduction</h2>
        <p className="text-muted-foreground leading-relaxed">Joanna Holidays Pvt Ltd ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and disclose information when you use our website and travel services.</p>

        <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-3">2. Information We Collect</h2>
        <p className="text-muted-foreground leading-relaxed">We collect personal information you provide such as name, email address, phone number, passport details, payment information, and travel preferences. We also automatically collect technical data like IP address, browser type, and usage patterns through cookies.</p>

        <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-3">3. How We Use Your Information</h2>
        <ul className="text-muted-foreground leading-relaxed list-disc pl-6 space-y-1">
          <li>Process bookings, payments, and travel arrangements</li>
          <li>Communicate booking confirmations and travel updates</li>
          <li>Send marketing communications (with your consent)</li>
          <li>Improve our website, services, and customer experience</li>
          <li>Comply with legal and regulatory obligations</li>
        </ul>

        <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-3">4. Sharing Your Information</h2>
        <p className="text-muted-foreground leading-relaxed">We share your data only with trusted third parties necessary to deliver your travel — such as airlines, hotels, transport providers, visa authorities, and payment processors. We never sell your personal information.</p>

        <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-3">5. Data Security</h2>
        <p className="text-muted-foreground leading-relaxed">We use industry-standard security measures including encryption, secure servers, and access controls to protect your information from unauthorised access, alteration, or disclosure.</p>

        <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-3">6. Your Rights</h2>
        <p className="text-muted-foreground leading-relaxed">Under UK GDPR, you have the right to access, correct, delete, or port your personal data, and to object to or restrict processing. To exercise any of these rights, contact us at admin@joannaholidays.uk.</p>

        <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-3">7. Data Retention</h2>
        <p className="text-muted-foreground leading-relaxed">We retain your personal data only as long as necessary to fulfil the purposes outlined in this policy or to comply with legal obligations.</p>

        <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-3">8. Contact Us</h2>
        <p className="text-muted-foreground leading-relaxed">For privacy questions, contact us at <span className="text-primary font-medium">admin@joannaholidays.uk</span> or +44 7418375151. The Business Terrace, Maidstone House, King Street, Maidstone, Kent. ME 15 6JQ, United Kingdom.</p>
      </article>
      <Footer />
    </div>
  );
}
