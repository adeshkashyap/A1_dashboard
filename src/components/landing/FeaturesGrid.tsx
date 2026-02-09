import { motion } from "framer-motion";
import { 
  MessageCircle, 
  Kanban, 
  Home, 
  Users, 
  IndianRupee, 
  Smartphone,
  Target,
  Languages,
  Zap
} from "lucide-react";

const features = [
  {
    icon: MessageCircle,
    title: "24/7 WhatsApp AI",
    description: "Instant replies, qualifies budget/location automatically",
    color: "primary",
  },
  {
    icon: Kanban,
    title: "Lead Kanban",
    description: "NEW → QUALIFIED → VISIT → CLOSED (drag-drop)",
    color: "secondary",
  },
  {
    icon: Home,
    title: "Property Vault",
    description: "Unlimited listings + images, organized perfectly",
    color: "primary",
  },
  {
    icon: Users,
    title: "Team Radar",
    description: "Top rep: Rahul (5 deals) - track everyone",
    color: "secondary",
  },
  {
    icon: IndianRupee,
    title: "₹ Pipeline",
    description: "₹3.5Cr potential revenue at a glance",
    color: "warning",
  },
  {
    icon: Smartphone,
    title: "Mobile-First",
    description: "Manage your entire business from anywhere",
    color: "primary",
  },
  {
    icon: Target,
    title: "85% Conversion",
    description: "AI pre-qualifies only hot, ready-to-buy leads",
    color: "success",
  },
  {
    icon: Languages,
    title: "Multi-Language",
    description: "Hindi/English auto-detect for all customers",
    color: "secondary",
  },
  {
    icon: Zap,
    title: "1-Click Setup",
    description: "Go live in 15 minutes, not 15 days",
    color: "primary",
  },
];

const FeaturesGrid = () => {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden bg-card/30">
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6">
            Everything You Need to{" "}
            <span className="text-gradient">Close More Deals</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            9 powerful features designed specifically for Indian real estate dealers
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="glass rounded-2xl p-6 hover:border-primary/30 transition-all group hover:-translate-y-1"
            >
              <div className={`w-14 h-14 rounded-2xl bg-${feature.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-7 h-7 text-${feature.color}`} />
              </div>
              <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;