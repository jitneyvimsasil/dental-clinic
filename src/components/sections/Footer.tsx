import { CLINIC, HOURS } from "@/lib/constants";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Clinic info */}
          <div>
            <h3 className="font-serif text-2xl font-bold mb-3">
              {CLINIC.name}
            </h3>
            <p className="text-primary-foreground/60 text-sm leading-relaxed mb-6">
              {CLINIC.tagline}. Providing quality dental care for families in
              Davao City.
            </p>
            <div className="space-y-3">
              <a
                href={`tel:${CLINIC.phoneRaw}`}
                className="flex items-center gap-3 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                <Phone className="w-4 h-4 shrink-0" />
                {CLINIC.phone}
              </a>
              <a
                href={`mailto:${CLINIC.email}`}
                className="flex items-center gap-3 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                <Mail className="w-4 h-4 shrink-0" />
                {CLINIC.email}
              </a>
              <div className="flex items-start gap-3 text-sm text-primary-foreground/70">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                {CLINIC.address}
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Office Hours
            </h4>
            <div className="space-y-3">
              {HOURS.map((h) => (
                <div
                  key={h.days}
                  className="flex justify-between text-sm"
                >
                  <span className="text-primary-foreground/70">{h.days}</span>
                  <span
                    className={
                      h.hours === "Closed"
                        ? "text-primary-foreground/40"
                        : "text-primary-foreground/90"
                    }
                  >
                    {h.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Map */}
          <div>
            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Find Us
            </h4>
            <div className="rounded-xl overflow-hidden border border-primary-foreground/10">
              <iframe
                title="Serene Dental Location"
                src={`https://www.google.com/maps?q=${CLINIC.mapQuery}&output=embed`}
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        <Separator className="my-10 bg-primary-foreground/10" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-primary-foreground/40">
          <p>&copy; {new Date().getFullYear()} {CLINIC.name}. All rights reserved.</p>
          <p>Davao City, Philippines</p>
        </div>
      </div>
    </footer>
  );
}
