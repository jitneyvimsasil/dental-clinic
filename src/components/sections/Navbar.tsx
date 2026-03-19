"use client";

import { useState, useEffect } from "react";
import { CLINIC, NAV_LINKS } from "@/lib/constants";
import { Phone, Menu, X } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-serif font-bold text-sm">
              S
            </span>
          </div>
          <span className="font-serif text-xl font-bold text-foreground">
            {CLINIC.name}
          </span>
        </a>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <a
            href={`tel:${CLINIC.phoneRaw}`}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Phone className="w-4 h-4" />
            {CLINIC.phone}
          </a>
          <a
            href="#intake-form"
            className="inline-flex items-center justify-center h-10 px-5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            Book Now
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg text-foreground hover:bg-muted transition-colors"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-background/98 backdrop-blur-md">
          <div className="flex flex-col px-6 py-8 gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-3 text-lg font-medium text-foreground hover:text-primary transition-colors border-b border-border/30"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-6 flex flex-col gap-3">
              <a
                href={`tel:${CLINIC.phoneRaw}`}
                className="flex items-center justify-center gap-2 h-12 rounded-xl border border-border text-foreground font-medium"
              >
                <Phone className="w-4 h-4" />
                {CLINIC.phone}
              </a>
              <a
                href="#intake-form"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center h-12 bg-primary text-primary-foreground font-medium rounded-xl"
              >
                Book an Appointment
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
