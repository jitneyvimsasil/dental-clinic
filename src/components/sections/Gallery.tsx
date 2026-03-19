import { GALLERY_ITEMS } from "@/lib/constants";
import { ArrowRight } from "lucide-react";
import { BeforeAfterVisual } from "@/components/illustrations/BeforeAfterVisual";

const variantMap: Record<string, "whitening" | "veneers" | "invisalign" | "implants"> = {
  "smile-1": "whitening",
  "smile-2": "veneers",
  "smile-3": "invisalign",
  "smile-4": "implants",
};

export function Gallery() {
  return (
    <section id="gallery" className="py-24 px-6 bg-sage-light/20">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium tracking-widest uppercase text-primary/70 mb-3">
            Smile Transformations
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Before &amp; After
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            See the life-changing results our patients have achieved with our
            cosmetic and restorative treatments.
          </p>
        </div>

        {/* Gallery grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {GALLERY_ITEMS.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl overflow-hidden bg-card border border-border/50 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
            >
              {/* SVG visual */}
              <div className="aspect-[16/10]">
                <BeforeAfterVisual
                  variant={variantMap[item.id] || "whitening"}
                  className="w-full h-full text-primary"
                />
              </div>

              {/* Bottom info bar */}
              <div className="px-5 py-4 border-t border-border/30 bg-card">
                <p className="font-semibold text-foreground text-sm">
                  {item.treatment}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="#intake-form"
            className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
          >
            Start your smile transformation
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
