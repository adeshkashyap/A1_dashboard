import { motion } from "framer-motion";
import { Link2, Bot, LayoutDashboard, Handshake } from "lucide-react";

const steps = [
  {
    icon: Link2,
    title: "Connect WhatsApp",
    description: "Link your business number in minutes. No complex setup or developers required.",
  },
  {
    icon: Bot,
    title: "AI qualifies leads",
    description: "Budget, location, and intent captured automatically — day or night.",
  },
  {
    icon: LayoutDashboard,
    title: "Pipeline fills itself",
    description: "Leads land on your kanban with properties matched and reps assigned.",
  },
  {
    icon: Handshake,
    title: "Close more deals",
    description: "Schedule visits, track follow-ups, and watch conversion climb.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 scroll-mt-20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14 max-w-2xl mx-auto"
        >
          <p className="text-sm font-semibold text-primary mb-3 uppercase tracking-wider">
            How it works
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Live in four steps
          </h2>
          <p className="text-muted-foreground text-lg">
            From first WhatsApp message to closed deal — without spreadsheet chaos.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="relative rounded-2xl border border-border bg-card p-6"
            >
              <span className="absolute -top-3 left-6 text-xs font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                {idx + 1}
              </span>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 mt-2">
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
