import { WHY_CHOOSE_US } from "@/lib/constants";
import { Heart, Cpu, Users, CalendarCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Heart,
  Cpu,
  Users,
  CalendarCheck,
};

export function About() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: text content */}
          <div>
            <p className="text-sm font-medium tracking-widest uppercase text-primary/70 mb-3">
              Why Choose Us
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Dentistry That Puts{" "}
              <span className="text-primary">You First</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              At Serene Dental, we believe every patient deserves a comfortable,
              judgement-free experience. Our team combines clinical excellence
              with genuine compassion to deliver care that makes you want to
              come back.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {WHY_CHOOSE_US.map((item) => {
                const Icon = iconMap[item.icon];
                return (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-sage-light flex items-center justify-center shrink-0">
                      {Icon && <Icon className="w-5 h-5 text-primary" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: image placeholder with decorative elements */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl bg-gradient-to-br from-sage-light via-secondary to-sage-light/50 overflow-hidden relative">
              {/* Decorative pattern */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-8 left-8 w-24 h-24 rounded-full border-2 border-primary/20" />
                <div className="absolute bottom-12 right-12 w-32 h-32 rounded-full border-2 border-warm/20" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-2 border-primary/10" />
              </div>
              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Heart className="w-10 h-10 text-primary" />
                </div>
                <p className="font-serif text-2xl font-bold text-foreground mb-2">
                  Your Comfort
                </p>
                <p className="font-serif text-2xl font-bold text-primary">
                  Our Priority
                </p>
                <p className="text-sm text-muted-foreground mt-4 max-w-xs">
                  Serving families in Davao City with gentle, personalized dental care since 2010
                </p>
              </div>
            </div>
            {/* Floating accent card */}
            <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl shadow-xl border border-border/50 p-5">
              <p className="text-3xl font-bold text-primary">15+</p>
              <p className="text-sm text-muted-foreground">Years of Trust</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
