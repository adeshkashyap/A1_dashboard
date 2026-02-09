import { motion } from "framer-motion";
import { Check, Rocket, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessScreenProps {
  onDashboard: () => void;
}

export function SuccessScreen({ onDashboard }: SuccessScreenProps) {
  return (
    <div className="text-center py-24 bg-white rounded-[60px] shadow-2xl shadow-indigo-100/50 px-12 relative overflow-hidden border border-slate-50">
      {/* Background circles for flair */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-indigo-50/50 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-indigo-50/50 rounded-full blur-3xl opacity-50" />

      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
        transition={{ duration: 0.6, type: "spring" }}
        className="w-28 h-28 bg-emerald-500 rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-emerald-200 z-10 relative"
      >
        <Check className="h-14 w-14 text-white" strokeWidth={3} />
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="z-10 relative"
      >
        <h2 className="text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">You're All Set! 🚀</h2>
        <p className="text-lg text-slate-500 mb-14 max-w-xl mx-auto font-medium leading-relaxed">
          Your Intelligent Sales Hub is now active. We've optimized your workspace for peak performance.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-16">
          {[
            { label: "Profile", icon: "👤" },
            { label: "Billed", icon: "💳" },
            { label: "WhatsApp", icon: "📱" },
            { label: "Active", icon: "⚡" }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col items-center gap-2"
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
              <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
            </motion.div>
          ))}
        </div>

        <Button 
          onClick={onDashboard} 
          className="h-16 px-16 rounded-2xl text-xl font-bold shadow-xl shadow-indigo-100 bg-indigo-600 hover:bg-slate-900 active:scale-95 transition-all group"
        >
          Launch Your Dashboard 
          <Rocket className="ml-3 h-6 w-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Button>
      </motion.div>

      {/* Confetti simulation (simplified for now) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              top: "100%", 
              left: `${Math.random() * 100}%`,
              opacity: 1
            }}
            animate={{ 
              top: "-50%",
              left: `${Math.random() * 100}%`,
              opacity: 0,
              rotate: 360
            }}
            transition={{ 
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
            className="absolute h-3 w-3 rounded-sm opacity-20"
            style={{ backgroundColor: ['#6366f1', '#a855f7', '#ec4899', '#22c55e'][i % 4] }}
          />
        ))}
      </div>
    </div>
  );
}
