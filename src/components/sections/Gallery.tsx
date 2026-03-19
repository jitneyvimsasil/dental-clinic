import { GALLERY_ITEMS } from "@/lib/constants";
import { ArrowRight } from "lucide-react";

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
              className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-secondary via-sage-light to-secondary aspect-[16/10]"
            >
              {/* Before/After placeholder layout */}
              <div className="absolute inset-0 flex">
                <div className="flex-1 bg-muted/40 flex items-center justify-center border-r border-dashed border-primary/20">
                  <div className="text-center">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/60 mb-1">
                      Before
                    </p>
                    <div className="w-16 h-16 rounded-full bg-primary/5 mx-auto" />
                  </div>
                </div>
                <div className="flex-1 bg-sage-light/30 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-xs font-medium uppercase tracking-wider text-primary/60 mb-1">
                      After
                    </p>
                    <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto" />
                  </div>
                </div>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/70 transition-all duration-300 flex items-end">
                <div className="p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-primary-foreground font-semibold mb-1">
                    {item.treatment}
                  </p>
                  <p className="text-primary-foreground/70 text-sm">
                    {item.description}
                  </p>
                </div>
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
