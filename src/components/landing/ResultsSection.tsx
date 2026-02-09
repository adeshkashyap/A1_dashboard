import { motion } from "framer-motion";
import { TrendingUp, ArrowRight, Star, Quote } from "lucide-react";

const ResultsSection = () => {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-warning/10 rounded-full blur-[120px] -translate-y-1/2" />
      </div>
      
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 glass border-warning/30 px-4 py-2 rounded-full mb-6">
            <TrendingUp className="w-4 h-4 text-warning" />
            <span className="text-sm text-warning">Real Results</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6">
            See What's Possible in{" "}
            <span className="text-gradient-gold">3 Months</span>
          </h2>
        </motion.div>
        
        {/* Before/After comparison */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="glass-strong rounded-3xl p-8 md:p-12">
            <h3 className="text-center font-bold text-xl mb-8 text-muted-foreground">
              Mumbai Properties Case Study
            </h3>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { label: "Leads", before: "50", after: "80", change: "+60%" },
                { label: "Deals Closed", before: "5", after: "12", change: "+140%" },
                { label: "Monthly Revenue", before: "₹10L", after: "₹24L", change: "+140%" },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center"
                >
                  <p className="text-sm text-muted-foreground mb-4">{stat.label}</p>
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <span className="text-2xl text-muted-foreground line-through">{stat.before}</span>
                    <ArrowRight className="w-5 h-5 text-primary" />
                    <span className="text-3xl font-black text-primary">{stat.after}</span>
                  </div>
                  <span className="inline-block bg-primary/10 text-primary text-sm font-bold px-3 py-1 rounded-full">
                    {stat.change}
                  </span>
                </motion.div>
              ))}
            </div>
            
            <div className="text-center mt-10 pt-8 border-t border-border">
              <p className="text-2xl md:text-3xl font-black">
                ROI: <span className="text-gradient-gold">2,333%</span> in 3 months
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="glass rounded-3xl p-8 md:p-12 text-center relative">
            <Quote className="absolute top-6 left-6 w-12 h-12 text-primary/20" />
            
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-warning text-warning" />
              ))}
            </div>
            
            <p className="text-xl md:text-2xl font-medium mb-6 relative z-10">
              "Closed <span className="text-primary font-bold">3 EXTRA deals</span> in month 1! 
              The AI handles everything while we sleep. Best investment for our agency."
            </p>
            
            <div className="flex items-center justify-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xl font-bold">
                RS
              </div>
              <div className="text-left">
                <p className="font-bold">Rajesh Sharma</p>
                <p className="text-sm text-muted-foreground">Mumbai Properties</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ResultsSection;