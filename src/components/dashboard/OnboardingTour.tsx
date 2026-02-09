import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, ArrowRight, Sparkles, Building2, Zap, MessageSquare } from "lucide-react";

const steps = [
  {
    title: "Welcome to ApnaCodex! 🎊",
    description: "Your agency is now equipped with elite-level CRM tools. Let's show you around your new command center.",
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
            <Card className="relative p-10 rounded-[40px] shadow-3xl border-0 overflow-hidden">
              <div className="absolute top-0 right-0 p-6">
                <button onClick={handleComplete} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex flex-col items-center text-center">
                <motion.div 
                  key={currentStep}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="mb-8 p-6 bg-slate-50 rounded-[32px]"
                >
                  {steps[currentStep].icon}
                </motion.div>

                <motion.h2 
                  key={`title-${currentStep}`}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-3xl font-black text-slate-900 mb-4"
                >
                  {steps[currentStep].title}
                </motion.h2>

                <motion.p 
                  key={`desc-${currentStep}`}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-lg text-slate-500 mb-10 leading-relaxed"
                >
                  {steps[currentStep].description}
                </motion.p>

                <div className="flex items-center gap-2 mb-8">
                  {steps.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-2 rounded-full transition-all duration-300 ${i === currentStep ? "w-8 bg-primary" : "w-2 bg-slate-200"}`} 
                    />
                  ))}
                </div>

                <Button 
                  onClick={handleNext} 
                  className="w-full h-16 rounded-[24px] text-xl font-black bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100"
                >
                  {currentStep === steps.length - 1 ? "Start Closing Deals" : "Next Insight"}
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
                
                {currentStep === 0 && (
                  <button onClick={handleComplete} className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600">
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
