import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { IntakeForm } from "@/components/sections/IntakeForm";
import { Footer } from "@/components/sections/Footer";
import { ChatWidget } from "@/components/chat/ChatWidget";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <Services />
      <IntakeForm />
      <Footer />
      <ChatWidget />
    </main>
  );
}
