import { ReactNode } from "react";

interface PageHeroProps {
  image: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  height?: string;
  align?: "center" | "left";
}

export function PageHero({ image, eyebrow, title, subtitle, children, height = "h-[55vh] min-h-[380px]", align = "center" }: PageHeroProps) {
  return (
    <section className={`relative ${height} flex items-center justify-center overflow-hidden`}>
      <img
        src={image}
        alt=""
        className="absolute inset-0 w-full h-full object-cover scale-105"
        width={1920}
        height={1080}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/55 to-primary/85" />
      <div className={`container mx-auto px-4 relative z-10 text-primary-foreground ${align === "center" ? "text-center" : "text-left"}`}>
        {eyebrow && (
          <div className={`inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 mb-5 border border-white/20 text-sm font-medium tracking-wide`}>
            {eyebrow}
          </div>
        )}
        <h1 className="font-display text-4xl md:text-6xl font-bold mb-4 leading-tight drop-shadow-lg">{title}</h1>
        {subtitle && <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/90 leading-relaxed">{subtitle}</p>}
        {children && <div className="mt-7">{children}</div>}
      </div>
    </section>
  );
}
