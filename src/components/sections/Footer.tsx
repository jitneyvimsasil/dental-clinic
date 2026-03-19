import { CLINIC, HOURS, FOOTER_LINKS } from "@/lib/constants";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { LucideIcon } from "lucide-react";

const socialIconMap: Record<string, LucideIcon> = {
  Facebook,
  Instagram,
  Twitter,
};

export function Footer() {
  return (
    <footer id="contact" className="bg-foreground text-primary-foreground">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Clinic info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-serif font-bold text-sm">
                  S
                </span>
              </div>
              <span className="font-serif text-xl font-bold">
                {CLINIC.name}
              </span>
            </div>
            <p className="text-primary-foreground/60 text-sm leading-relaxed mb-6">
              {CLINIC.tagline}. Providing quality dental care for families in
              Davao City since 2010.
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              {(["Facebook", "Instagram", "Twitter"] as const).map(
                (platform) => {
                  const Icon = socialIconMap[platform];
                  return (
                    <a
                      key={platform}
                      href="#"
                      className="w-9 h-9 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-primary/80 transition-colors"
                      aria-label={platform}
                    >
                      {Icon && (
                        <Icon className="w-4 h-4 text-primary-foreground/70" />
                      )}
                    </a>
                  );
                }
              )}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-primary-foreground/80">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact & Hours */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-primary-foreground/80">
              Contact Us
            </h4>
            <div className="space-y-3 mb-6">
              <a
                href={`tel:${CLINIC.phoneRaw}`}
                className="flex items-center gap-3 text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              >
                <Phone className="w-4 h-4 shrink-0" />
                {CLINIC.phone}
              </a>
              <a
                href={`mailto:${CLINIC.email}`}
                className="flex items-center gap-3 text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              >
                <Mail className="w-4 h-4 shrink-0" />
                {CLINIC.email}
              </a>
              <div className="flex items-start gap-3 text-sm text-primary-foreground/60">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                {CLINIC.address}
              </div>
            </div>

            <h4 className="font-semibold text-sm uppercase tracking-wider mb-3 text-primary-foreground/80 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              Hours
            </h4>
            <div className="space-y-1.5">
              {HOURS.map((h) => (
                <div
                  key={h.days}
                  className="flex justify-between text-xs gap-4"
                >
                  <span className="text-primary-foreground/50">{h.days}</span>
                  <span
                    className={
                      h.hours === "Closed"
                        ? "text-primary-foreground/30"
                        : "text-primary-foreground/70"
                    }
                  >
                    {h.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="mt-12 rounded-xl overflow-hidden border border-primary-foreground/10">
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

        <Separator className="my-10 bg-primary-foreground/10" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-primary-foreground/40">
          <p>
            &copy; {new Date().getFullYear()} {CLINIC.name}. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary-foreground/60 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary-foreground/60 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
