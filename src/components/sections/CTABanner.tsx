import { CLINIC } from "@/lib/constants";
import { Phone } from "lucide-react";

export function CTABanner() {
  return (
    <section className="py-20 px-6 bg-primary relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/5 translate-x-1/3 translate-y-1/3" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
          Ready for Your Best Smile?
        </h2>
        <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto mb-8">
          Book your appointment today and experience the Serene Dental
          difference. New patients always welcome.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#intake-form"
            className="inline-flex items-center justify-center h-13 px-8 bg-white text-primary font-semibold rounded-xl hover:bg-white/90 transition-colors shadow-lg"
          >
            Book an Appointment
          </a>
          <a
            href={`tel:${CLINIC.phoneRaw}`}
            className="inline-flex items-center justify-center gap-2 h-13 px-8 border-2 border-primary-foreground/30 text-primary-foreground font-medium rounded-xl hover:bg-primary-foreground/10 transition-colors"
          >
            <Phone className="w-4 h-4" />
            Call {CLINIC.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
