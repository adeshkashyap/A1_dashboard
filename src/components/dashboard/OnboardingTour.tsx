import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, ArrowRight, Sparkles, Building2, Zap, MessageSquare } from "lucide-react";

const steps = [
  {
    title: "Welcome to EstateFlow!",
    description: "Explore this real-estate CRM UI demo. Data is local — add leads and properties freely.",
    icon: <Sparkles className="h-8 w-8 text-yellow-500" />
  },
  {
    title: "Property Portfolio 🏘️",
    description: "This is where your property inventory lives. Add your first 2BHK or Villa to start generating leads.",
    icon: <Building2 className="h-8 w-8 text-indigo-500" />
  },
  {
    title: "Automated WhatsApp ⚡",
    description: "Your bot is active! Any catalog link you share will automatically capture leads and notify you.",
    icon: <Zap className="h-8 w-8 text-green-500" />
  },
  {
    title: "Quick Win Checklist ✅",
    description: "Add a property, create a test lead, and link your second official WhatsApp for max conversion.",
    icon: <MessageSquare className="h-8 w-8 text-blue-500" />
  }
];

export function OnboardingTour() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("has_seen_tour");
    if (!hasSeenTour) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    localStorage.setItem("has_seen_tour", "true");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-lg"
          >
            <Card className="relative p-6 sm:p-10 rounded-3xl sm:rounded-[40px] shadow-3xl border-0 overflow-hidden bg-card">
              <div className="absolute top-0 right-0 p-4 sm:p-6">
                <button onClick={handleComplete} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>

              <div className="flex flex-col items-center text-center">
                <motion.div 
                  key={currentStep}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="mb-6 sm:mb-8 p-4 sm:p-6 bg-muted rounded-2xl sm:rounded-[32px]"
                >
                  {steps[currentStep].icon}
                </motion.div>

                <motion.h2 
                  key={`title-${currentStep}`}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-2xl sm:text-3xl font-black text-foreground mb-3 sm:mb-4 px-2"
                >
                  {steps[currentStep].title}
                </motion.h2>

                <motion.p 
                  key={`desc-${currentStep}`}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-base sm:text-lg text-muted-foreground mb-8 sm:mb-10 leading-relaxed px-1"
                >
                  {steps[currentStep].description}
                </motion.p>

                <div className="flex items-center gap-2 mb-6 sm:mb-8">
                  {steps.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-2 rounded-full transition-all duration-300 ${i === currentStep ? "w-8 bg-primary" : "w-2 bg-muted"}`} 
                    />
                  ))}
                </div>

                <Button 
                  onClick={handleNext} 
                  className="w-full h-12 sm:h-14 rounded-2xl text-base sm:text-lg font-bold"
                >
                  {currentStep === steps.length - 1 ? "Start Exploring" : "Next Insight"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                {currentStep === 0 && (
                  <button onClick={handleComplete} className="mt-4 text-xs font-bold text-muted-foreground uppercase tracking-widest hover:text-foreground">
                    Skip Tour
                  </button>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
