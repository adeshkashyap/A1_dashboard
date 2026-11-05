import { motion } from "framer-motion";
import { Check, Sparkles, Zap, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    price: "2,999",
    description: "Perfect for solo agents",
    icon: Zap,
    features: [
      "500 leads/month",
      "3 team members",
      "1 WhatsApp number",
      "Basic analytics",
      "Email support",
    ],
    popular: false,
  },
  {
    name: "Pro",
    price: "5,999",
    description: "Most popular for agencies",
    icon: Sparkles,
    features: [
      "2,000 leads/month",
      "10 team members",
      "2 WhatsApp numbers",
      "Advanced analytics",
      "Priority support",
      "Property management",
      "Team leaderboard",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "15,999",
    description: "For large organizations",
    icon: Building2,
    features: [
      "Unlimited leads",
      "Unlimited team",
      "5 WhatsApp numbers",
      "Custom integrations",
      "Dedicated manager",
      "White-label option",
      "SLA guarantee",
      "Custom training",
    ],
    popular: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 lg:py-32 relative overflow-hidden bg-card/30 scroll-mt-20">
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Simple,{" "}
            <span className="text-gradient">Transparent Pricing</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Start free. Scale as you grow. Cancel anytime.
          </p>
          
          {/* Special offer badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex flex-wrap items-center justify-center gap-2 bg-gradient-to-r from-warning/20 to-warning/10 border border-warning/30 px-4 sm:px-6 py-3 rounded-full max-w-full text-center"
          >
            <Sparkles className="w-5 h-5 text-warning shrink-0" />
            <span className="font-bold text-warning text-sm sm:text-base">
              50% OFF first 3 months with code POC2026
            </span>
          </motion.div>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`relative rounded-3xl p-8 ${
                plan.popular 
                  ? "glass-strong border-primary glow-emerald" 
                  : "glass"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-sm font-bold px-4 py-1 rounded-full">
                    ⭐ RECOMMENDED
                  </span>
                </div>
              )}
              
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl ${plan.popular ? "bg-primary" : "bg-primary/10"} flex items-center justify-center`}>
                  <plan.icon className={`w-6 h-6 ${plan.popular ? "text-primary-foreground" : "text-primary"}`} />
                </div>
                <div>
                  <h3 className="font-bold text-xl">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-sm text-muted-foreground">₹</span>
                  <span className="text-4xl font-black">{plan.price}</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, fidx) => (
                  <li key={fidx} className="flex items-center gap-3 text-sm">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link to="/auth" className="block">
                <Button 
                  className={`w-full py-6 text-lg ${plan.popular ? "glow-emerald" : ""}`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  Enter Demo Dashboard
                </Button>
              </Link>
              
              <p className="text-center text-xs text-muted-foreground mt-4">
                Local demo — no signup required
              </p>
            </motion.div>
          ))}
        </div>
        
        {/* ROI Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="glass rounded-2xl p-8 max-w-2xl mx-auto">
            <p className="text-lg mb-4">
              Pro Plan = <span className="text-primary font-bold">₹5,999/month</span>
            </p>
            <p className="text-2xl font-bold mb-2">
              Close just <span className="text-gradient">3 EXTRA deals</span> = ₹30L+ revenue
            </p>
            <p className="text-muted-foreground">
              That's <span className="text-warning font-bold">500x ROI</span>. The math makes sense.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;