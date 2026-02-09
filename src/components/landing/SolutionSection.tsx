import { motion } from "framer-motion";
import { Bot, LayoutDashboard, Building2, Users, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const solutions = [
  {
    icon: Bot,
    title: "AI WhatsApp Agent",
    description: "Works at 2 AM. Responds instantly. Never sleeps.",
    highlight: "24/7 Active",
  },
  {
    icon: LayoutDashboard,
    title: "Smart Dashboard",
    description: "₹3.5Cr pipeline at a glance. Real-time updates.",
    highlight: "Live Tracking",
  },
  {
    icon: Building2,
    title: "Property Manager",
    description: "Add listings in 2 mins. Images, details, all organized.",
    highlight: "2 Min Setup",
  },
  {
    icon: Users,
    title: "Team Tracker",
    description: "See who's closing deals. Motivate your top performers.",
    highlight: "Analytics",
  },
];

const SolutionSection = () => {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[150px]" />
      </div>
      
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 glass border-primary/30 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary">The Solution</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6">
            ApnaCodex{" "}
            <span className="text-gradient">Fixes Everything</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stop losing money. Start closing deals. Even while you sleep.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {solutions.map((solution, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass rounded-2xl p-6 hover:border-primary/30 transition-all group hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <solution.icon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                  {solution.highlight}
                </span>
              </div>
              <h3 className="font-bold text-lg mb-2">{solution.title}</h3>
              <p className="text-sm text-muted-foreground">{solution.description}</p>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link to="/login">
            <Button size="lg" className="text-lg px-8 py-6 glow-emerald group">
              See Live Demo
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default SolutionSection;