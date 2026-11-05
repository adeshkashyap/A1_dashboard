import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Is this a real backend CRM or a UI demo?",
    a: "EstateFlow ships as a polished UI demo with localStorage dummy data so buyers can explore every screen offline. Wire it to your API when you build.",
  },
  {
    q: "Can I white-label the brand?",
    a: "Yes. Search-and-replace EstateFlow, swap the logo in the navbar/sidebar, and update colors via CSS variables in index.css.",
  },
  {
    q: "Does light and dark mode work?",
    a: "Both themes are included. Use the sun/moon toggle in the navbar or dashboard header — preference is saved locally.",
  },
  {
    q: "What's included in the dashboard?",
    a: "Dashboard KPIs, properties with detail drawer, leads kanban, clients, visits calendar, WhatsApp mock, automation, team, reports, and settings.",
  },
  {
    q: "Do I need WhatsApp Business API keys?",
    a: "Not for the demo. WhatsApp screens show connected/mock states. Integrate your provider when you go to production.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-20 lg:py-28 scroll-mt-20 bg-muted/20">
      <div className="container max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-sm font-semibold text-primary mb-3 uppercase tracking-wider">
            FAQ
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Questions, answered
          </h2>
          <p className="text-muted-foreground">
            Everything buyers ask before purchasing the UI kit.
          </p>
        </motion.div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((item, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`} className="border-border">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
