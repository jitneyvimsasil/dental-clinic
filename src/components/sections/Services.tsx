import { Card, CardContent } from "@/components/ui/card";
import { SERVICES } from "@/lib/constants";
import {
  Sparkles,
  ShieldCheck,
  Crown,
  CircleDot,
  AlignCenter,
  Sun,
  Heart,
  Siren,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Sparkles,
  ShieldCheck,
  Crown,
  CircleDot,
  AlignCenter,
  Sun,
  Heart,
  Siren,
};

export function Services() {
  return (
    <section id="services" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium tracking-widest uppercase text-primary/70 mb-3">
            What We Offer
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Our Services
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Comprehensive dental care tailored to your needs, delivered with
            warmth and precision.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((service) => {
            const Icon = iconMap[service.icon];
            return (
              <Card
                key={service.id}
                className="group border-border/50 bg-card hover:bg-secondary/30 hover:border-primary/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"
              >
                <CardContent className="p-6">
                  <div className="w-11 h-11 rounded-xl bg-sage-light flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                    {Icon && (
                      <Icon className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {service.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
