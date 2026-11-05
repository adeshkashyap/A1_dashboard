import { motion } from "framer-motion";
import { MessageCircle, Play, CheckCircle, Zap, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const CountUpNumber = ({ end, suffix = "", prefix = "" }: { end: number; suffix?: string; prefix?: string }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
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
  
  return <span>{prefix}{count.toLocaleString('en-IN')}{suffix}</span>;
};

const WhatsAppDemo = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  
  const messages = [
    { type: "user", text: "Hi, looking for 3BHK in Bandra", delay: 0 },
    { type: "ai", text: "Perfect! 🏠 Found 3 matching properties in Bandra. Budget range?", delay: 1500 },
    { type: "user", text: "2-3 Cr budget", delay: 3000 },
    { type: "ai", text: "Great! Here are top picks:\n\n🏢 Sea View 3BHK - ₹2.5Cr\n🏢 Garden 3BHK - ₹2.8Cr\n\nSchedule visit?", delay: 4500 },
  ];
  
  useEffect(() => {
    const timer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % (messages.length + 2));
    }, 1800);
    return () => clearInterval(timer);
  }, []);
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="relative"
    >
      {/* Glow effect */}
      <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 blur-3xl opacity-50 animate-gradient" />
      
      {/* Phone mockup */}
      <div className="relative glass-strong rounded-3xl p-2 max-w-sm mx-auto">
        {/* Phone header */}
        <div className="bg-primary/20 rounded-t-2xl px-4 py-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <p className="font-semibold text-sm">EstateFlow AI</p>
            <p className="text-xs text-primary flex items-center gap-1">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Online 24/7
            </p>
          </div>
        </div>
        
        {/* Chat area */}
        <div className="bg-background/50 p-4 min-h-[300px] space-y-3">
          {messages.slice(0, messageIndex + 1).map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div 
                className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm whitespace-pre-line ${
                  msg.type === "user" 
                    ? "bg-primary text-primary-foreground rounded-br-sm" 
                    : "glass border-primary/30 rounded-bl-sm"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
          
          {messageIndex >= messages.length && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-center"
            >
              <div className="glass border-primary/50 px-4 py-2 rounded-full text-xs text-primary flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Lead created in Dashboard!
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: "-3s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 rounded-full blur-3xl" />
      </div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      <div className="container relative z-10 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6"
            >
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm">India's #1 AI Real Estate CRM</span>
            </motion.div>
            
            {/* Main heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Never Lose Another{" "}
              <span className="text-gradient">WhatsApp Lead</span>{" "}
              Again
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              AI answers 24/7, qualifies customers, fills your pipeline. 
              <span className="text-foreground font-semibold"> Close 2X more deals.</span>
            </p>
            
            {/* Stats row */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-10">
              {[
                { value: 60, suffix: "%", label: "More Leads" },
                { value: 140, suffix: "%", label: "Deals Closed" },
                { value: 85, suffix: "%", label: "Conversion" },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className="text-center"
                >
                  <p className="text-2xl md:text-3xl font-black text-primary">
                    +<CountUpNumber end={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Link to="/auth">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 glow-emerald animate-pulse-glow">
                  Enter Demo Dashboard
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 border-primary/50 hover:bg-primary/10">
                  <Play className="w-5 h-5 mr-2" />
                  Try Live Demo
                </Button>
              </Link>
            </div>
            
            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>50+ agencies</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>99.9% uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span>Bank-level security</span>
              </div>
            </div>
          </motion.div>
          
          {/* Right - WhatsApp Demo */}
          <WhatsAppDemo />
        </div>
      </div>
    </section>
  );
};

export default Hero;