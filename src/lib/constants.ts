export const CLINIC = {
  name: "Serene Dental",
  tagline: "Gentle Care, Beautiful Smiles",
  description:
    "Comprehensive dental care for the whole family in Davao City. From routine cleanings to advanced cosmetic procedures, we provide gentle, personalized treatment in a calm and welcoming environment.",
  address: "909 Aurora St., Deca Indangan, Davao City",
  phone: "0927-112-1480",
  phoneRaw: "09271121480",
  email: "hello@serenedental.ph",
  mapQuery: "909+Aurora+St+Deca+Indangan+Davao+City",
} as const;

export const HOURS = [
  { days: "Monday - Friday", hours: "8:00 AM - 5:00 PM" },
  { days: "Saturday", hours: "9:00 AM - 2:00 PM" },
  { days: "Sunday", hours: "Closed" },
] as const;

export const SERVICES = [
  {
    id: "cleaning",
    name: "Teeth Cleaning",
    icon: "Sparkles" as const,
    description: "Professional cleaning and preventive care to keep your smile healthy",
  },
  {
    id: "fillings",
    name: "Fillings",
    icon: "ShieldCheck" as const,
    description: "Tooth-colored composite fillings that blend naturally",
  },
  {
    id: "crowns",
    name: "Crowns & Bridges",
    icon: "Crown" as const,
    description: "Custom dental crowns and bridges for lasting restoration",
  },
  {
    id: "implants",
    name: "Dental Implants",
    icon: "CircleDot" as const,
    description: "Permanent tooth replacement solutions that look and feel natural",
  },
  {
    id: "invisalign",
    name: "Invisalign",
    icon: "AlignCenter" as const,
    description: "Clear aligner orthodontic treatment for a straighter smile",
  },
  {
    id: "whitening",
    name: "Teeth Whitening",
    icon: "Sun" as const,
    description: "Professional whitening for a brighter, more confident smile",
  },
  {
    id: "rootcanal",
    name: "Root Canal",
    icon: "Heart" as const,
    description: "Gentle endodontic treatment to save and restore damaged teeth",
  },
  {
    id: "emergency",
    name: "Emergency Care",
    icon: "Siren" as const,
    description: "Same-day emergency dental services when you need them most",
  },
] as const;

export const TREATMENT_OPTIONS = [
  "Cleaning & Checkup",
  "Fillings",
  "Crowns & Bridges",
  "Dental Implants",
  "Invisalign",
  "Teeth Whitening",
  "Root Canal",
  "Emergency / Pain",
  "Other",
] as const;
