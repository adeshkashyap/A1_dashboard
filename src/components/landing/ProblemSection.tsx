import { motion } from "framer-motion";
import { X, Clock, Users, FileSpreadsheet, BellOff, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";

const LostRevenueCounter = () => {
  const [amount, setAmount] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setAmount((prev) => prev + Math.floor(Math.random() * 5000) + 2000);
    }, 100);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="glass border-destructive/30 rounded-2xl p-6 text-center"
    >
      <p className="text-sm text-muted-foreground mb-2">Revenue Lost TODAY</p>
      <p className="text-3xl md:text-4xl font-black text-destructive">
        ₹{amount.toLocaleString('en-IN')}
      </p>
      <p className="text-xs text-destructive/70 mt-2 animate-pulse">
        ⬆ Increasing every second...
      </p>
    </motion.div>
  );
};

const problems = [
  {
    icon: Clock,
    title: "No replies after 6 PM",
    description: "Customers message at night. Nobody answers. They go to competitors.",
  },
  {
    icon: Users,
    title: "80% leads unqualified",
    description: "Your team wastes time on tire-kickers who can't afford your properties.",
  },
  {
    icon: FileSpreadsheet,
    title: "Excel chaos for properties",
    description: "Can't find that 3BHK listing. Images scattered. No tracking.",
  },
  {
    icon: BellOff,
    title: "Team misses follow-ups",
    description: "No reminders. Hot leads go cold. Deals lost to competitors.",
  },
];

const ProblemSection = () => {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-destructive/5 to-background" />
      
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 glass border-destructive/30 px-4 py-2 rounded-full mb-6">
            <TrendingDown className="w-4 h-4 text-destructive" />
            <span className="text-sm text-destructive">The Painful Truth</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6">
            You're Losing{" "}
            <span className="text-destructive">₹6-8L Every Month</span>{" "}
            Because:
          </h2>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {problems.map((problem, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass rounded-2xl p-6 hover:border-destructive/30 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center mb-4 group-hover:bg-destructive/20 transition-colors">
                <X className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="font-bold mb-2">{problem.title}</h3>
              <p className="text-sm text-muted-foreground">{problem.description}</p>
            </motion.div>
          ))}
        </div>
        
        <div className="max-w-md mx-auto">
          <LostRevenueCounter />
        </div>
        
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8 text-xl font-bold text-destructive"
        >
          RESULT: 40% leads → GONE FOREVER 💸
        </motion.p>
      </div>
    </section>
  );
};

export default ProblemSection;