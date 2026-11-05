import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const CountUpNumber = ({ end, suffix = "" }: { end: number; suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1600;
    const steps = 48;
    const increment = end / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [end]);

  return (
    <span>
      {count.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
};

const stats = [
  { value: 60, suffix: "%", label: "More qualified leads" },
  { value: 140, suffix: "%", label: "Deals closed lift" },
  { value: 85, suffix: "%", label: "Lead response rate" },
];

const StatsBand = () => {
  return (
    <section className="py-12 lg:py-16 border-b border-border/60">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
            >
              <p className="font-display text-3xl md:text-4xl font-bold text-primary mb-1">
                +
                <CountUpNumber end={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBand;
