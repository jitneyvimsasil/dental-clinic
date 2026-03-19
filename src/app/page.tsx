import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { StatsBar } from "@/components/sections/StatsBar";
import { Services } from "@/components/sections/Services";
import { About } from "@/components/sections/About";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTABanner } from "@/components/sections/CTABanner";
import { Gallery } from "@/components/sections/Gallery";
import { IntakeForm } from "@/components/sections/IntakeForm";
import { FAQ } from "@/components/sections/FAQ";
import { Footer } from "@/components/sections/Footer";
import { ChatWidget } from "@/components/chat/ChatWidget";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <StatsBar />
      <Services />
      <About />
      <Testimonials />
      <CTABanner />
      <Gallery />
      <IntakeForm />
      <FAQ />
      <Footer />
      <ChatWidget />
    </main>
  );
}
