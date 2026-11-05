import { motion } from "framer-motion";
import { MessageCircle, Play, CheckCircle, Zap, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const WhatsAppDemo = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    { type: "user", text: "Hi, looking for 3BHK in Bandra", delay: 0 },
    { type: "ai", text: "Perfect! Found 3 matching properties in Bandra. Budget range?", delay: 1500 },
    { type: "user", text: "2-3 Cr budget", delay: 3000 },
    {
      type: "ai",
      text: "Great! Top picks:\n\nSea View 3BHK — ₹2.5Cr\nGarden 3BHK — ₹2.8Cr\n\nSchedule visit?",
      delay: 4500,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % (messages.length + 2));
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.35, duration: 0.7 }}
      className="relative"
    >
      <div className="absolute -inset-4 bg-gradient-to-r from-primary/15 via-secondary/10 to-primary/15 blur-3xl opacity-60" />

      <div className="relative glass-strong rounded-3xl p-2 max-w-sm mx-auto">
        <div className="bg-primary/15 rounded-t-2xl px-4 py-3 flex items-center gap-3">
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

        <div className="bg-background/50 p-4 min-h-[280px] space-y-3">
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
    <section className="relative min-h-[100svh] flex items-center overflow-hidden pt-16">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-[100px]" />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.25)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.25)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="container relative z-10 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center lg:text-left"
          >
            <p className="font-display text-sm md:text-base font-semibold tracking-wide text-primary mb-4">
              EstateFlow
            </p>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6"
            >
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm">AI-powered real estate CRM</span>
            </motion.div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-[3.25rem] font-bold leading-[1.1] mb-5 tracking-tight">
              Never lose another{" "}
              <span className="text-gradient">WhatsApp lead</span> again
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              AI answers 24/7, qualifies buyers, and fills your pipeline so your team closes more deals.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
              <Link to="/auth">
                <Button size="lg" className="w-full sm:w-auto text-base px-8 py-6 glow-emerald">
                  Enter Demo Dashboard
                </Button>
              </Link>
              <Link to="/auth">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-base px-8 py-6 border-border hover:bg-muted"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Try Live Demo
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>No signup required</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>Dummy data included</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span>Light &amp; dark themes</span>
              </div>
            </div>
          </motion.div>

          <WhatsAppDemo />
        </div>
      </div>
    </section>
  );
};

export default Hero;
