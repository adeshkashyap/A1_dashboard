import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const FinalCTA = () => {
  return (
    <section className="py-20 lg:py-28">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-border bg-card px-8 py-14 md:px-16 md:py-20 text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Ready to explore the full CRM?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Open the live demo dashboard with seeded properties, leads, visits, and team data — no signup required.
            </p>
            <Link to="/auth">
              <Button size="lg" className="text-base px-8 gap-2 glow-emerald">
                Enter Demo Dashboard
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
