import { motion } from "framer-motion";

const brands = [
  "Skyline Realty",
  "Harbour Homes",
  "Metro Estates",
  "Palm Grove",
  "Summit Brokers",
  "Lotus Properties",
];

const TrustStrip = () => {
  return (
    <section className="py-10 border-y border-border/60 bg-muted/30">
      <div className="container">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-6"
        >
          Trusted by agencies across Mumbai &amp; beyond
        </motion.p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {brands.map((name, idx) => (
            <motion.span
              key={name}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="font-display text-lg md:text-xl text-muted-foreground/70 tracking-tight"
            >
              {name}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustStrip;
