export const CLINIC = {
  name: "Serene Dental",
  tagline: "Gentle Care, Beautiful Smiles",
  description:
    "Comprehensive dental care for the whole family in Davao City. From routine cleanings to advanced cosmetic procedures, we provide gentle, personalized treatment in a calm and welcoming environment.",
  address: "Davao City",
  phone: "0917-555-3842",
  phoneRaw: "09175553842",
  email: "hello@serenedental.ph",
  mapQuery: "Davao+City",
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

export const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Gallery", href: "#gallery" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
] as const;

export const STATS = [
  { value: "15+", label: "Years Experience" },
  { value: "10,000+", label: "Happy Patients" },
  { value: "8", label: "Specialist Dentists" },
  { value: "4.9", label: "Google Rating" },
] as const;

export const WHY_CHOOSE_US = [
  {
    title: "Gentle & Pain-Free",
    description:
      "We use the latest sedation techniques and gentle approaches so every visit is comfortable and stress-free.",
    icon: "Heart" as const,
  },
  {
    title: "Modern Technology",
    description:
      "Digital X-rays, 3D imaging, and laser dentistry for faster, more accurate treatments with less downtime.",
    icon: "Cpu" as const,
  },
  {
    title: "Family-Friendly",
    description:
      "From toddlers to grandparents, we treat the whole family with personalized care plans for every age.",
    icon: "Users" as const,
  },
  {
    title: "Flexible Scheduling",
    description:
      "Early morning, evening, and Saturday appointments available. We work around your schedule, not the other way around.",
    icon: "CalendarCheck" as const,
  },
] as const;

export const TESTIMONIALS = [
  {
    name: "Maria Santos",
    treatment: "Teeth Whitening",
    rating: 5,
    text: "I was nervous about whitening but Dr. Cruz made the whole process so comfortable. My smile has never looked better! The staff is incredibly warm and welcoming.",
    avatar: "MS",
  },
  {
    name: "Carlos Reyes",
    treatment: "Dental Implants",
    rating: 5,
    text: "After years of hiding my smile, Serene Dental gave me the confidence to smile again. The implant procedure was painless and the results are amazing.",
    avatar: "CR",
  },
  {
    name: "Ana Lim",
    treatment: "Invisalign",
    rating: 5,
    text: "Best dental experience I've ever had. The Invisalign treatment was worth every penny. Dr. Dela Cruz explained everything clearly and the results speak for themselves.",
    avatar: "AL",
  },
  {
    name: "Jose Garcia",
    treatment: "Emergency Care",
    rating: 5,
    text: "Had a dental emergency on a Saturday and they fit me in immediately. Professional, fast, and caring. This is what healthcare should be like.",
    avatar: "JG",
  },
  {
    name: "Patricia Mendoza",
    treatment: "Family Cleaning",
    rating: 5,
    text: "We bring our whole family here. The kids actually look forward to their dental visits now — that's how you know it's a great practice!",
    avatar: "PM",
  },
  {
    name: "Roberto Tan",
    treatment: "Root Canal",
    rating: 5,
    text: "I was dreading my root canal but it was completely painless. The team kept me informed at every step. Highly recommend Serene Dental to anyone.",
    avatar: "RT",
  },
] as const;

export const GALLERY_ITEMS = [
  {
    id: "smile-1",
    treatment: "Teeth Whitening",
    description: "Professional whitening — 6 shades brighter in one session",
  },
  {
    id: "smile-2",
    treatment: "Dental Veneers",
    description: "Porcelain veneers for a complete smile transformation",
  },
  {
    id: "smile-3",
    treatment: "Invisalign",
    description: "12-month Invisalign journey — perfectly aligned teeth",
  },
  {
    id: "smile-4",
    treatment: "Dental Implants",
    description: "Full implant restoration — natural-looking replacement",
  },
] as const;

export const FAQS = [
  {
    question: "Do you accept walk-in patients?",
    answer:
      "We welcome walk-ins for emergencies. For routine visits, we recommend booking an appointment to minimize your wait time. You can book online or call us directly.",
  },
  {
    question: "What insurance plans do you accept?",
    answer:
      "We accept most major insurance plans including PhilHealth, Maxicare, Medicard, and Intellicare. We also offer flexible payment plans for uninsured patients. Contact us to verify your specific plan.",
  },
  {
    question: "Is teeth whitening safe?",
    answer:
      "Yes, professional teeth whitening performed by our dentists is completely safe. We use clinically-proven products and customize the treatment to your sensitivity level. Results can last 6-12 months with proper care.",
  },
  {
    question: "How often should I visit the dentist?",
    answer:
      "We recommend a check-up and professional cleaning every 6 months. However, if you have specific dental conditions, your dentist may recommend more frequent visits. Regular check-ups help catch issues early.",
  },
  {
    question: "What should I do in a dental emergency?",
    answer:
      "Call us immediately at 0917-555-3842. We offer same-day emergency appointments for severe pain, knocked-out teeth, broken restorations, and infections. If it's after hours, our voicemail will guide you to emergency resources.",
  },
  {
    question: "Do you offer sedation for anxious patients?",
    answer:
      "Absolutely. We understand dental anxiety is real. We offer nitrous oxide (laughing gas) and oral sedation options to help you feel relaxed and comfortable during your procedure. Let us know about your anxiety level when booking.",
  },
  {
    question: "How long does an Invisalign treatment take?",
    answer:
      "Invisalign treatment typically takes 6-18 months depending on the complexity of your case. During your free consultation, we'll provide a personalized timeline and show you a 3D preview of your expected results.",
  },
] as const;

export const SOCIAL_LINKS = [
  { platform: "Facebook", href: "#", icon: "Facebook" as const },
  { platform: "Instagram", href: "#", icon: "Instagram" as const },
  { platform: "Twitter", href: "#", icon: "Twitter" as const },
] as const;

export const FOOTER_LINKS = [
  {
    title: "Services",
    links: [
      { label: "Teeth Cleaning", href: "#services" },
      { label: "Dental Implants", href: "#services" },
      { label: "Invisalign", href: "#services" },
      { label: "Teeth Whitening", href: "#services" },
      { label: "Emergency Care", href: "#services" },
    ],
  },
  {
    title: "Quick Links",
    links: [
      { label: "About Us", href: "#about" },
      { label: "Our Team", href: "#about" },
      { label: "Testimonials", href: "#testimonials" },
      { label: "Book Appointment", href: "#intake-form" },
      { label: "FAQ", href: "#faq" },
    ],
  },
] as const;
