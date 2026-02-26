import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Serene Dental | Family Dentistry in Davao City",
  description:
    "Comprehensive dental care for the whole family. From routine cleanings to advanced cosmetic procedures, Serene Dental provides gentle, personalized treatment in Davao City.",
  keywords: [
    "dentist davao",
    "dental clinic davao city",
    "teeth cleaning",
    "dental implants",
    "invisalign davao",
    "teeth whitening",
    "family dentist",
  ],
  openGraph: {
    title: "Serene Dental | Gentle Care, Beautiful Smiles",
    description:
      "Book your dental appointment today. Family dentistry in Davao City.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${dmSerif.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
