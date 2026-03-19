import { TESTIMONIALS } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium tracking-widest uppercase text-primary/70 mb-3">
            Patient Stories
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            What Our Patients Say
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Real stories from real patients who trust us with their smiles.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <Card
              key={t.name}
              className="border-border/50 bg-card hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <CardContent className="p-6">
                <Quote className="w-8 h-8 text-primary/20 mb-4" />
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">
                      {t.avatar}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{t.treatment}</p>
                  </div>
                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 fill-warm text-warm"
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
