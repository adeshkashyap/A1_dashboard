import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Building2, Loader2, Mail, User, Phone, ArrowRight, ShieldCheck, RefreshCw, Globe, Check, ChevronDown, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import countryCodes from "@/data/countryCodes.json";
import api from "@/lib/api-client";

const getFlagEmoji = (countryCode: string) => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [authStep, setAuthStep] = useState<'identify' | 'verify' | 'password'>('identify');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  
  // Form fields
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<{name: string, dial_code: string, code: string}>({
    name: "India",
    dial_code: "+91",
    code: "IN"
  });
  
  // Timer for OTP resend
  const [timer, setTimer] = useState(0);
  
  // Country select popover state
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { requestOtp, verifyOtp, verifyOtpSMS, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (user) {
      // If user has no company name, they need onboarding
      if (!user.companyProfile?.companyName) {
        navigate("/onboarding");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, navigate]);

  const filteredCountries = countryCodes.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.dial_code.includes(searchQuery)
  );

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    if (authMode === 'signin') {
      const { error } = await requestOtp(email, false);
      setIsLoading(false);

      if (!error) {
        setAuthStep('verify');
        setTimer(60);
        toast({ title: "OTP Sent!", description: `Verification code sent to ${email}` });
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
      return;
    }

    // Signup flow with phone
    if (!phoneNumber) {
      toast({ title: "Required", description: "Please enter your phone number", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    const fullPhone = selectedCountry.dial_code + phoneNumber.replace(/\D/g, '');
    
    try {
      const response = await api.auth.requestOtpSMS(fullPhone);
      setIsLoading(false);

      if (response.error || response.success === false) {
        toast({ title: "Failed", description: response.error || "Failed to send SMS", variant: "destructive" });
      } else {
        setAuthStep('verify');
        setTimer(60);
        toast({ title: "SMS Sent", description: "Verification code sent to your phone." });
      }
    } catch (err: any) {
      setIsLoading(false);
      toast({ title: "Error", description: err.message || "Something went wrong", variant: "destructive" });
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) return;

    setIsLoading(true);
    
    if (authMode === 'signup') {
      // For signup, OTP verification is part of the final signup step
      // Here we just transition to the password step
      setAuthStep('password');
      setIsLoading(false);
      return;
    }

    const { error } = await verifyOtp(email, otp, false);
    setIsLoading(false);

    if (error) {
      toast({ title: "Verification Failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Signed In", description: "Welcome back to ApnaCodex!" });
    }
  };

  const handleFinalSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Passwords match", description: "Passwords do not match.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    const fullPhone = selectedCountry.dial_code + phoneNumber.replace(/\D/g, '');
    const data = { 
      phone: fullPhone, 
      otp, 
      name: fullName, 
      password,
      email: email 
    };

    try {
      const { error } = await verifyOtpSMS(data);
      setIsLoading(false);
      
      if (error) {
        toast({ title: "Signup Failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Welcome!", description: "Account created successfully." });
        // Navigation is handled by the useEffect watching the 'user' state
      }
    } catch (err: any) {
      setIsLoading(false);
      toast({ title: "Error", description: err.message || "Something went wrong", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfcfd] p-6 md:p-12 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden relative">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-slate-50 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="p-5 bg-indigo-50 rounded-3xl text-indigo-600 ring-8 ring-indigo-50/50 mb-6 transition-transform hover:scale-105 duration-500">
            <Building2 className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-extrabold text-[#0f172a] tracking-tight mb-2">ApnaCodex</h1>
          <p className="text-slate-500 font-medium tracking-wide">Enterprise Real Estate Management Hub</p>
        </div>

        <Card className="border-0 shadow-2xl shadow-indigo-100/50 rounded-[48px] overflow-hidden bg-white">
          <CardHeader className="text-center pt-12 pb-6">
            <CardTitle className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {authStep === 'identify' 
                ? (authMode === 'signin' ? 'Welcome Back' : 'Create Account') 
                : authStep === 'verify' ? 'Verify Interface' : 'Final Security'}
            </CardTitle>
            <CardDescription className="text-slate-500 text-lg font-medium px-6 mt-2">
              {authStep === 'identify' 
                ? '90% of elite dealers manage their portfolio here.'
                : authStep === 'verify' 
                  ? `Secure verification code sent to your ${authMode === 'signup' ? 'phone' : 'email'}.`
                  : 'Establish a cryptographic password for your hub.'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-8 pb-10">
            {authStep === 'identify' ? (
              <form onSubmit={handleRequestOtp} className="space-y-6">
                <div className="flex p-1.5 bg-slate-50 rounded-2xl mb-8 border border-slate-100">
                  <button 
                    type="button"
                    onClick={() => setAuthMode('signin')}
                    className={`flex-1 py-3 rounded-[14px] text-sm font-bold transition-all ${authMode === 'signin' ? 'bg-white text-indigo-600 shadow-lg shadow-indigo-100/50' : 'text-slate-400 hover:text-slate-600'}`}
                  >Sign In</button>
                  <button 
                    type="button"
                    onClick={() => setAuthMode('signup')}
                    className={`flex-1 py-3 rounded-[14px] text-sm font-bold transition-all ${authMode === 'signup' ? 'bg-white text-indigo-600 shadow-lg shadow-indigo-100/50' : 'text-slate-400 hover:text-slate-600'}`}
                  >Get Started</button>
                </div>

                <div className="space-y-4">
                  {authMode === 'signup' && (
                    <div className="space-y-2">
                       <Label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Account Administrator</Label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input
                          placeholder="e.g. Adesh Kashyap"
                          className="pl-12 h-14 rounded-2xl border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-semibold"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Work Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        type="email"
                        placeholder="e.g. adesh@apnacodex.com"
                        className="pl-12 h-14 rounded-2xl border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-semibold"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {authMode === 'signup' && (
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Direct Contact</Label>
                      <div className="flex gap-3">
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={open}
                              className="w-[110px] h-14 rounded-2xl border-slate-200 bg-white font-semibold"
                            >
                              {getFlagEmoji(selectedCountry.code)} {selectedCountry.dial_code}
                              <ChevronDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[300px] p-0 rounded-3xl shadow-2xl border-slate-100 h-[320px] overflow-hidden flex flex-col z-[100]">
                            <div className="p-3 border-b border-slate-50 bg-slate-50/50">
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input 
                                  placeholder="Search countries..." 
                                  className="pl-9 h-10 rounded-xl border-slate-200 bg-white"
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-1.5 custom-scrollbar">
                              {filteredCountries.map((country) => (
                                <div
                                  key={country.code}
                                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                                  onClick={() => {
                                    setSelectedCountry(country);
                                    setOpen(false);
                                  }}
                                >
                                  <span className="text-xl">{getFlagEmoji(country.code)}</span>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-bold text-slate-700">{country.name}</span>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{country.dial_code}</span>
                                  </div>
                                  {selectedCountry.code === country.code && (
                                    <Check className="ml-auto h-4 w-4 text-indigo-600" strokeWidth={3} />
                                  )}
                                </div>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                        <div className="relative flex-1">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                          <Input
                            placeholder="Phone number"
                            className="pl-12 h-14 rounded-2xl border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-semibold"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required={authMode === 'signup'}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full h-16 rounded-[24px] bg-indigo-600 hover:bg-slate-900 text-lg font-bold shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] mt-6 group" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (authMode === 'signup' ? "Initialize Setup" : "Request Access")}
                  {!isLoading && <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />}
                </Button>
              </form>
            ) : authStep === 'verify' ? (
              <div className="space-y-8 py-4">
                <form onSubmit={handleVerifyOtp} className="space-y-8">
                  <div className="flex justify-center gap-4">
                    {[...Array(6)].map((_, i) => (
                      <input
                        key={i}
                        type="text"
                        id={`otp-${i}`}
                        maxLength={1}
                        className="w-12 h-16 text-center text-3xl font-extrabold bg-[#fcfcfd] border border-slate-200 rounded-2xl focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-slate-900"
                        value={otp[i] || ''}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          if (val) {
                            const newOtp = otp.split('');
                            newOtp[i] = val;
                            const finalOtp = newOtp.join('').slice(0, 6);
                            setOtp(finalOtp);
                            if (i < 5) {
                              (document.getElementById(`otp-${i+1}`) as HTMLInputElement)?.focus();
                            }
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !otp[i] && i > 0) {
                            (document.getElementById(`otp-${i-1}`) as HTMLInputElement)?.focus();
                          }
                        }}
                        autoFocus={i === 0}
                      />
                    ))}
                  </div>

                  <Button type="submit" className="w-full h-16 rounded-[24px] bg-indigo-600 hover:bg-slate-900 text-lg font-bold shadow-xl shadow-indigo-100 transition-all" disabled={isLoading || otp.length < 6}>
                    {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Verify Identity"}
                    {!isLoading && <ShieldCheck className="ml-2 h-6 w-6" />}
                  </Button>

                  <div className="text-center">
                    <button 
                      type="button"
                      disabled={timer > 0 || isLoading}
                      onClick={handleRequestOtp}
                      className="text-sm font-semibold text-slate-500 hover:text-indigo-600 disabled:opacity-50 flex items-center justify-center mx-auto"
                    >
                      {timer > 0 ? (
                        `Resend OTP in ${timer}s`
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Didn't receive code? Resend
                        </>
                      )}
                    </button>
                  </div>
                </form>
                
                <div className="text-center">
                  <button 
                    type="button" 
                    onClick={() => setAuthStep('identify')}
                    className="text-xs text-indigo-500 underline mt-4 hover:text-indigo-700 font-medium"
                  >
                    Change info
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFinalSignup} className="space-y-5">
                 <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Create Access Token</Label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="pl-12 h-14 rounded-2xl border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-semibold"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Confirm Access Token</Label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="pl-12 h-14 rounded-2xl border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-semibold"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full h-16 rounded-[24px] bg-indigo-600 hover:bg-slate-900 text-lg font-bold shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] mt-6" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Initialize Final Access"}
                  {!isLoading && <ArrowRight className="ml-2 h-6 w-6" />}
                </Button>

                <div className="text-center px-4">
                   <button 
                    type="button" 
                    onClick={() => setAuthStep('verify')}
                    className="text-xs text-indigo-500 underline hover:text-indigo-700"
                  >
                    Back to OTP
                  </button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 text-slate-400 font-semibold text-[10px] uppercase tracking-widest py-2 px-6 rounded-xl bg-slate-50 border border-slate-100/50">
            <ShieldCheck className="h-4 w-4 text-emerald-500" /> Authorized Connection
          </div>
          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-tight">© 2026 APNACODEX • ENTERPRISE EDITION</p>
        </div>
      </div>
    </div>
  );
}