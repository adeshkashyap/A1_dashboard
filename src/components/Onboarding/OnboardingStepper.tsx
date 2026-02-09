import { Check } from "lucide-react";

interface Step {
  id: number;
  label: string;
}

interface OnboardingStepperProps {
  currentStep: number;
  steps: Step[];
}

export function OnboardingStepper({ currentStep, steps }: OnboardingStepperProps) {
  return (
    <div className="flex items-center justify-center gap-3 mb-16">
      {steps.map((s, index) => {
        const isActive = currentStep === s.id;
        const isCompleted = currentStep > s.id;

        return (
          <div key={s.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`h-12 w-12 rounded-[18px] flex items-center justify-center font-bold transition-all duration-700 ${
                isActive ? "bg-indigo-600 text-white shadow-[0_10px_25px_-5px_rgba(79,70,229,0.4)] scale-110" : 
                isCompleted ? "bg-emerald-500 text-white" : "bg-white border border-slate-200 text-slate-300"
              }`}>
                {isCompleted ? <Check className="h-5 w-5" strokeWidth={3} /> : <span className="text-sm">{s.id}</span>}
              </div>
              <span className={`mt-3 text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-500 ${
                isActive ? "text-slate-900 opacity-100" : "text-slate-300 opacity-80"
              }`}>
                {s.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="mx-4 mb-7 w-8 h-[2px] rounded-full overflow-hidden bg-slate-100">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-1000 ease-out"
                  style={{ width: isCompleted ? '100%' : '0%' }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
