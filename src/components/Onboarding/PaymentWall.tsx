import { motion } from "framer-motion";
import { Check, Zap, ShieldCheck, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Plan {
  id: string;
  planName: string;
  price: number;
  features: string;
}

interface PaymentWallProps {
  plans: Plan[];
  selectedPlanId: string | null;
  onSelectPlan: (id: string) => void;
  onCheckout: () => void;
  isLoading: boolean;
}

export function PaymentWall({ plans, selectedPlanId, onSelectPlan, onCheckout, isLoading }: PaymentWallProps) {
  return (
    <div className="space-y-12">
      <div className="text-center space-y-3 mb-12">
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Select Your <span className="text-indigo-600">Professional</span> Engine 🚀
        </h2>
        <p className="text-slate-500 text-lg font-medium max-w-lg mx-auto leading-relaxed">
          Scale your real estate operations with industrial-grade AI automation and dedicated support.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const features = JSON.parse(plan.features);
          const isPro = plan.planName === 'Pro';
          const isSelected = selectedPlanId === plan.id;

          return (
            <motion.div 
              key={plan.id}
              whileHover={{ y: -5 }}
              onClick={() => onSelectPlan(plan.id)}
              className={`relative p-8 rounded-[40px] cursor-pointer transition-all border-2 ${
                isSelected 
                ? "bg-white border-indigo-600 shadow-2xl shadow-indigo-100" 
                : "bg-slate-50 border-transparent hover:bg-white hover:border-slate-200"
              }`}
            >
              {isPro && (
                <div className="absolute top-[-15px] left-8 bg-indigo-600 text-white text-[9px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest shadow-lg shadow-indigo-200">
                  Most Popular
                </div>
              )}
              
              <div className="mb-10">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.planName}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">₹{plan.price}</span>
                  <span className="text-slate-400 font-bold text-sm">/month</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8 min-h-[160px]">
                {features.map((feat: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-600 font-medium text-sm">
                    <div className="mt-1 h-5 w-5 shrink-0 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    {feat}
                  </li>
                ))}
              </ul>

              <div className={`w-full py-4 rounded-2xl flex items-center justify-center font-bold text-sm transition-all ${
                isSelected ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-white text-slate-400 border border-slate-100"
              }`}>
                {isSelected ? <Check className="mr-2 h-4 w-4" strokeWidth={3} /> : null}
                {isSelected ? "Current Selection" : "Connect Plan"}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-center mt-12">
        <Button 
          onClick={onCheckout} 
          disabled={isLoading || !selectedPlanId} 
          className="h-16 px-16 rounded-2xl text-xl font-bold shadow-xl shadow-indigo-100 bg-indigo-600 hover:bg-slate-900 active:scale-95 transition-all w-full md:w-auto"
        >
          {isLoading ? (
            <Loader2 className="animate-spin h-6 w-6" />
          ) : (
            <>
              Confirm & Continue
              <ArrowRight className="ml-3 h-6 w-6" />
            </>
          )}
        </Button>
      </div>
      
      <p className="text-center text-slate-400 text-sm font-medium">
        SSL Secured Checkout • Cancel Anytime • No Hidden Fees
      </p>
    </div>
  );
}
