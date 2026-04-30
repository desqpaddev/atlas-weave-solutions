import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FileText } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="bg-primary text-primary-foreground py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-4">
            <FileText className="h-4 w-4" />
            <span className="text-sm font-medium">Legal</span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold">Terms of Service</h1>
          <p className="text-primary-foreground/80 mt-3">Last updated: April 30, 2026</p>
        </div>
      </div>

      <article className="container mx-auto px-4 py-16 max-w-3xl">
        <h2 className="font-display text-2xl font-bold text-foreground mt-2 mb-3">1. Agreement</h2>
        <p className="text-muted-foreground leading-relaxed">By accessing or using the Joanna Holidays website and services, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>

        <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-3">2. Bookings & Payments</h2>
        <p className="text-muted-foreground leading-relaxed">All bookings are subject to availability and confirmation. A deposit may be required at the time of booking, with the balance due before travel. Prices are quoted in the currency displayed and may change until full payment is received.</p>

        <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-3">3. Cancellations & Refunds</h2>
        <p className="text-muted-foreground leading-relaxed">Cancellation charges apply based on the time of cancellation and the policies of suppliers (airlines, hotels, cruises). Refunds, where applicable, are processed within 14–30 business days.</p>

        <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-3">4. Travel Documents</h2>
        <p className="text-muted-foreground leading-relaxed">It is your responsibility to ensure you hold valid passports, visas, and any required health certificates. Joanna Holidays is not liable for issues arising from invalid or missing documentation.</p>

        <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-3">5. Liability</h2>
        <p className="text-muted-foreground leading-relaxed">Joanna Holidays acts as an intermediary between travellers and third-party suppliers. We are not liable for losses caused by suppliers, force majeure, or events outside our reasonable control. We strongly recommend comprehensive travel insurance.</p>

        <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-3">6. Conduct</h2>
        <p className="text-muted-foreground leading-relaxed">Travellers must behave respectfully and comply with local laws and supplier policies. We reserve the right to terminate services for disruptive behaviour without refund.</p>

        <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-3">7. Intellectual Property</h2>
        <p className="text-muted-foreground leading-relaxed">All content on this website — including text, images, logos, and itineraries — is the property of Joanna Holidays and may not be reproduced without permission.</p>

        <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-3">8. Governing Law</h2>
        <p className="text-muted-foreground leading-relaxed">These Terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the English courts.</p>

        <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-3">9. Contact</h2>
        <p className="text-muted-foreground leading-relaxed">Questions about these Terms? Email <span className="text-primary font-medium">admin@joannaholidays.uk</span> or call +44 7418375151.</p>
      </article>
      <Footer />
    </div>
  );
}
