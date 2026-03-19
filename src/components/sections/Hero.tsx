import { CLINIC } from "@/lib/constants";
import { MapPin, ChevronDown, Phone } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-sage-light via-background to-background" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-sage-light/40 to-transparent rounded-bl-[120px]" />

      {/* Decorative shapes */}
      <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-sage/5 blur-3xl" />
      <div className="absolute bottom-32 left-16 w-48 h-48 rounded-full bg-warm/10 blur-2xl" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-20">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <p className="text-sm font-medium tracking-widest uppercase text-primary/70 mb-6">
            Family Dentistry in Davao City
          </p>

          {/* Heading */}
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-foreground mb-6">
            {CLINIC.tagline}
          </h1>

          {/* Description */}
          <p className="text-lg text-muted-foreground leading-relaxed max-w-lg mb-10">
            {CLINIC.description}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <a
              href="#intake-form"
              className="inline-flex items-center justify-center h-13 px-8 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              Book an Appointment
            </a>
            <a
              href={`tel:${CLINIC.phoneRaw}`}
              className="inline-flex items-center justify-center gap-2 h-13 px-8 border border-border bg-card/50 text-foreground font-medium rounded-xl hover:bg-card transition-colors"
            >
              <Phone className="w-4 h-4" />
              Call Us Today
            </a>
          </div>

          {/* Quick info */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{CLINIC.address}</span>
            <span className="mx-2 text-border">|</span>
            <span>Mon-Fri 8AM-5PM</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#services"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground/50 hover:text-primary transition-colors"
      >
        <span className="text-xs tracking-wider uppercase">Explore</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </a>
    </section>
  );
}
