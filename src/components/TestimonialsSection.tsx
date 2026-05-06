import { Star } from "lucide-react";

const TRUSTPILOT_URL = "https://www.trustpilot.com/review/joannaholidays.uk";

const testimonials = [
  {
    name: "Ajmal Sha L",
    role: "Verified review · May 2026",
    title: "A fantastic experience",
    content:
      "I had a fantastic experience with Joanna Holidays while applying for my mom's visa. After her previous application was rejected, we were quite worried, but their expertise and guidance made all the difference. Special thanks to Priya, who handled the case with exceptional care — patient, reassuring, and thorough. The entire experience was smooth and stress-free.",
    rating: 5,
  },
  {
    name: "Saran Raj",
    role: "Europe group tour · Nov 2025",
    title: "Wonderful job for our 40-pax Europe trip",
    content:
      "Joanna Holidays UK did a wonderful job handling our 40 pax Europe trip. Everything was very carefully curated to our group members' liking. Mr. Jomon and team were humble, kind, and available throughout our trip. Looking forward to the next amazing experience. Cheers team!",
    rating: 5,
  },
  {
    name: "Riya Raju",
    role: "Verified review · March 2026",
    title: "Transparent and professional",
    content:
      "Thank you Priya for the support throughout my booking at this stressful time. Their transparency throughout the process is admirable. Priya spent ages to find an affordable flight during a high demand season. Very professional — thank you so much again for the service.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <div className="max-w-3xl">
            <span className="block text-[11px] font-sans-ui font-semibold tracking-[0.28em] uppercase text-primary mb-5">
              In their words
            </span>
            <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] text-foreground">
              Stories from <em className="italic text-primary">our travellers</em>.
            </h2>
          </div>

          {/* Trustpilot summary */}
          <a
            href={TRUSTPILOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 border border-foreground/15 rounded-md px-5 py-3 hover:bg-foreground/[0.03] transition-colors"
          >
            <div className="flex flex-col">
              <span className="text-[10px] font-sans-ui tracking-[0.22em] uppercase text-muted-foreground">
                Rated Great on
              </span>
              <span className="font-display text-lg font-semibold text-foreground leading-tight">
                Trustpilot
              </span>
            </div>
            <div className="h-8 w-px bg-foreground/15" />
            <div className="flex flex-col items-start">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`inline-block w-4 h-4 ${i < 4 ? "bg-[#00b67a]" : "bg-[#00b67a]/40"} flex items-center justify-center`}
                  >
                    <Star className="h-3 w-3 text-white fill-white" />
                  </span>
                ))}
              </div>
              <span className="text-xs text-muted-foreground mt-1">
                <strong className="text-foreground">4.1</strong> · 6 reviews
              </span>
            </div>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10">
          {testimonials.map((t) => (
            <figure key={t.name} className="border-t border-foreground/15 pt-8">
              <div className="flex gap-0.5 mb-5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="inline-block w-4 h-4 bg-[#00b67a] flex items-center justify-center">
                    <Star className="h-3 w-3 text-white fill-white" />
                  </span>
                ))}
              </div>
              <p className="font-sans-ui text-xs uppercase tracking-[0.18em] text-primary mb-3">
                {t.title}
              </p>
              <blockquote className="font-display text-lg md:text-[20px] leading-snug text-foreground italic">
                &ldquo;{t.content}&rdquo;
              </blockquote>
              <figcaption className="mt-6">
                <p className="font-sans-ui text-[11px] tracking-[0.2em] uppercase font-semibold text-foreground">
                  {t.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{t.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href={TRUSTPILOT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-sans-ui font-semibold text-primary hover:underline"
          >
            Read all reviews on Trustpilot →
          </a>
        </div>
      </div>
    </section>
  );
}
