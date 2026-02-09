import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Check, Sparkles, CreditCard, MessageSquare, Rocket, Loader2, ArrowRight, ArrowLeft, ShieldCheck, Zap, RefreshCw, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api, { User, WhatsAppStatus } from "@/lib/api-client";
import { motion, AnimatePresence } from "framer-motion";
import { OnboardingStepper } from "@/components/Onboarding/OnboardingStepper";
import { PaymentWall } from "@/components/Onboarding/PaymentWall";
import { SuccessScreen } from "@/components/Onboarding/SuccessScreen";

const STEPS = [
  { id: 1, label: "Profile" },
  { id: 2, label: "Payment" },
  { id: 3, label: "Connect" },
  { id: 4, label: "Launch" }
];

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [plans, setPlans] = useState<{ id: string; planName: string; price: number; features: string }[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [whatsappStatus, setWhatsappStatus] = useState<WhatsAppStatus | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    companyName: user?.companyProfile?.companyName || "",
    companyType: "agency",
    botName: "Property Assistant",
    botTone: "professional",
  });

  const fetchPlans = async () => {
    try {
      const data = await api.subscription.listPlans();
      setPlans(data);
      if (data.length > 0) setSelectedPlan(data[0].id);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load pricing plans", variant: "destructive" });
    }
  };

  const pollWhatsappStatus = async () => {
    try {
      const status = await api.whatsapp.status();
      setWhatsappStatus(status);
      if (status.status === 'CONNECTED') {
        setStep(4); // Auto-advance to success if connected
      } else {
        const qr = await api.whatsapp.qr();
        if (qr.base64) setQrCode(qr.base64);
      }
    } catch (error) {
      console.error("WhatsApp status poll error:", error);
    }
  };

  useEffect(() => {
    // If we are at payment step but already have an active subscription (like Trial), skip it
    if (step === 2 && user?.subscription?.status === 'active') {
      setStep(3);
      return;
    }

    if (step === 2) {
      fetchPlans();
    }
    if (step === 3) {
      pollWhatsappStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, user?.subscription?.status]);

  const handleProfileComplete = async () => {
    setIsLoading(true);
    try {
      const updatedProfile = await api.company.updateProfile({
        companyName: formData.companyName,
        companyType: formData.companyType,
        botName: formData.botName,
        botTone: formData.botTone,
      });

      // Update user state so ProtectedRoute knows we are done
      if (user) {
        const updatedUser = { ...user, companyProfile: updatedProfile };
        console.log('👤 Profile updated, syncing session:', updatedUser);
        setUser(updatedUser);
      }

      // If subscription is active (e.g. Free/Trial), go straight to dashboard
      if (user?.subscription?.status === 'active' || (user as any)?.subscriptionId) {
        console.log('✨ Subscription active, skipping to dashboard');
        toast({ title: "Setup Complete!", description: "Taking you to your dashboard..." });
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        setStep(2);
      }
    } catch (error) {
      console.error('❌ Profile Update Failed:', error);
      const message = error instanceof Error ? error.message : "Update failed";
      toast({ title: "Update failed", description: message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!selectedPlan) return;
    console.log('💳 Initiating checkout for plan:', selectedPlan);
    setIsLoading(true);
    try {
      const response = await api.subscription.createCheckout(selectedPlan, 'razorpay');
      console.log('💳 Checkout Response:', response);
      
      if (response.success) {
        console.log('✅ Success! Free plan activated. Updating state...');
        toast({ title: "Welcome!", description: "Subscription activated. Taking you to your dashboard..." });
        
        // Force update user context with new subscription
        const updatedSubscription = response.subscription || { status: 'active', planId: selectedPlan };
        if (user) {
          const updatedUser = { ...user, subscription: updatedSubscription };
          console.log('👤 Updating session with:', updatedUser);
          setUser(updatedUser); // This now persists to localStorage via our AuthContext fix
        }
        
        // Immediate redirect to break out of onboarding steps
        console.log('🚀 Executing immediate navigation to /dashboard');
        navigate('/dashboard');
        return;
      }

      const { gateway, orderId, checkoutUrl } = response;
      console.log('💳 Gateway response:', { gateway, orderId, checkoutUrl });
      
      if (gateway === 'razorpay') {
        const plan = plans.find(p => p.id === selectedPlan);
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_123",
          amount: plan.price * 100,
          currency: "INR",
          name: "ApnaCodex",
          description: `${plan.planName} Subscription`,
          order_id: orderId,
          handler: function (response: any) {
            console.log('✅ Razorpay success:', response);
            toast({ title: "Payment Successful!", description: "Taking you to your dashboard..." });
            navigate('/dashboard');
          },
          theme: { color: "#6366f1" }
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error: any) {
      console.error('❌ Checkout Failed:', error);
      toast({ title: "Payment failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex items-center justify-center p-6 md:p-12 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <div className="w-full max-w-4xl">
        <OnboardingStepper currentStep={step} steps={STEPS} />

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -20 }}
            transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
          >
            {step === 1 && (
              <Card className="border-0 shadow-2xl shadow-indigo-100/50 rounded-[48px] overflow-hidden bg-white">
                <CardHeader className="p-12 text-center">
                  <div className="flex flex-col items-center gap-6 mb-2">
                    <div className="p-5 bg-indigo-50 rounded-3xl text-indigo-600 ring-8 ring-indigo-50/50">
                      <Building2 className="h-10 w-10" />
                    </div>
                    <div>
                      <CardTitle className="text-4xl font-extrabold text-slate-900 tracking-tight">Your Agency Profile</CardTitle>
                      <CardDescription className="text-slate-500 text-lg font-medium mt-2 max-w-md mx-auto">
                        Personalize your AI-powered workspace in just a few seconds.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-12 space-y-8">
                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">Company Name</Label>
                        <Input 
                          placeholder="e.g. Skyline Realty" 
                          className="h-14 text-lg rounded-2xl border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-semibold"
                          value={formData.companyName}
                          onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Business Category</Label>
                        <Select value={formData.companyType} onValueChange={(v) => setFormData({...formData, companyType: v})}>
                          <SelectTrigger className="h-14 text-lg rounded-2xl border-slate-200 font-semibold focus:ring-indigo-500/10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                            <SelectItem value="agency">Real Estate Agency</SelectItem>
                            <SelectItem value="builder">Property Builder</SelectItem>
                            <SelectItem value="agent">Individual Agent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">AI Assistant Name</Label>
                        <div className="relative">
                          <Bot className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300" />
                          <Input 
                            placeholder="e.g. PropBot" 
                            className="h-14 text-lg rounded-2xl border-slate-200 pl-14 font-semibold focus:ring-indigo-500/10"
                            value={formData.botName}
                            onChange={(e) => setFormData({...formData, botName: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Assistant's Tone</Label>
                        <Select value={formData.botTone} onValueChange={(v) => setFormData({...formData, botTone: v})}>
                          <SelectTrigger className="h-14 text-lg rounded-2xl border-slate-200 font-semibold focus:ring-indigo-500/10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                            <SelectItem value="professional">Professional & Detail-Oriented</SelectItem>
                            <SelectItem value="friendly">Friendly & Direct</SelectItem>
                            <SelectItem value="casual">Casual & Relaxed</SelectItem>
                            <SelectItem value="luxury">Luxury & Premium</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <div className="pt-10 flex flex-col items-center">
                    <Button 
                      onClick={handleProfileComplete} 
                      disabled={isLoading || !formData.companyName} 
                      className="h-16 px-12 rounded-[24px] text-xl font-bold shadow-xl shadow-indigo-200/50 bg-indigo-600 hover:bg-slate-900 active:scale-95 transition-all w-full md:w-auto overflow-hidden group relative"
                    >
                      {isLoading ? (
                        <Loader2 className="animate-spin h-6 w-6" />
                      ) : (
                        <div className="flex items-center gap-3">
                          <span>Confirm Configuration</span>
                          <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                        </div>
                      )}
                    </Button>
                    <div className="mt-8 flex items-center gap-3 text-slate-400 font-semibold text-xs uppercase tracking-widest py-3 px-6 rounded-2xl bg-slate-50 border border-slate-100/50">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" /> Fully Encrypted & Secure
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <PaymentWall 
                plans={plans}
                selectedPlanId={selectedPlan}
                onSelectPlan={setSelectedPlan}
                onCheckout={handleCheckout}
                isLoading={isLoading}
              />
            )}

            {step === 3 && (
              <Card className="border-0 shadow-3xl rounded-[40px] overflow-hidden bg-white">
                <div className="grid md:grid-cols-2">
                  <div className="bg-slate-50 p-16 text-slate-900 flex flex-col justify-between border-r border-slate-100">
                    <div>
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest mb-8 border border-orange-100">
                        <Zap className="h-3 w-3 fill-current" /> Live Connection
                      </div>
                      <h2 className="text-4xl font-extrabold mb-6 tracking-tight leading-tight">Link your <span className="text-indigo-600">WhatsApp</span></h2>
                      <p className="text-slate-500 text-lg mb-12 leading-relaxed font-medium">
                        Enable AI-powered automation on your business number instantly.
                      </p>
                      
                      <div className="space-y-5">
                        {[
                          "Open WhatsApp on your mobile device",
                          "Select Linked Devices from the menu",
                          "Point camera at this screen to finish"
                        ].map((text, i) => (
                          <div key={i} className="flex items-center gap-5">
                            <div className="h-10 w-10 shrink-0 rounded-[14px] bg-white flex items-center justify-center font-bold text-slate-900 text-sm border border-slate-200 shadow-sm">{i + 1}</div>
                            <span className="font-semibold text-slate-600">{text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-12 border-t border-slate-200/60 mt-16">
                      <div className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-wider">
                        <Loader2 className="h-4 w-4 animate-spin text-indigo-500" /> 
                        Awaiting secure API response...
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-16 flex items-center justify-center bg-white relative">
                    {qrCode ? (
                      <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative p-8 bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-indigo-100 group overflow-hidden"
                      >
                        <img src={qrCode} alt="WhatsApp QR" className="w-[300px] h-[300px] rounded-2xl" />
                        <div 
                          className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-white/95 backdrop-blur-sm rounded-[40px] cursor-pointer" 
                          onClick={pollWhatsappStatus}
                        >
                          <div className="p-4 bg-indigo-50 rounded-2xl mb-4 text-indigo-600">
                            <RefreshCw className="h-10 w-10" />
                          </div>
                          <span className="text-xs font-black uppercase tracking-widest text-slate-900">Refresh Authentication</span>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="flex flex-col items-center gap-6 text-slate-300">
                        <Loader2 className="h-16 w-16 text-indigo-500 animate-spin" strokeWidth={1.5} />
                        <span className="font-bold uppercase tracking-widest text-[10px] text-slate-400">Encrypting Connection...</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {step === 4 && (
              <SuccessScreen onDashboard={() => navigate('/dashboard')} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
