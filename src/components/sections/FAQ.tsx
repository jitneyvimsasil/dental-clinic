import { FAQS } from "@/lib/constants";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
  return (
    <section id="faq" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium tracking-widest uppercase text-primary/70 mb-3">
            Common Questions
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Everything you need to know before your visit. Can&apos;t find your
            answer? Chat with us or give us a call.
          </p>
        </div>

        {/* Accordion */}
        <Accordion type="single" collapsible className="space-y-3">
          {FAQS.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="border border-border/50 rounded-xl px-6 data-[state=open]:bg-sage-light/20 data-[state=open]:border-primary/20 transition-colors"
            >
              <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary hover:no-underline py-5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
