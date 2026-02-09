import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import api, { User } from "@/lib/api-client";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<{ error: Error | null }>;
  requestOtp: (email: string, isSignup: boolean) => Promise<{ error: Error | null }>;
  verifyOtp: (email: string, otp: string, isSignup: boolean, extraData?: Record<string, unknown>) => Promise<{ error: Error | null }>;
  verifyOtpSMS: (data: { phone: string; otp: string; name: string; password?: string; email: string }) => Promise<{ error: Error | null }>;
  validateOtp: (identifier: string, otp: string, isPhone?: boolean) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  setUser: (user: User | null, persist?: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
    
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.auth.login(email, password);
      localStorage.setItem('auth_token', response.accessToken);
      localStorage.setItem('user_data', JSON.stringify(response.dealer));
      setUser(response.dealer);
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Login failed') };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, phone?: string) => {
    try {
      const response = await api.auth.signup(email, password, fullName, phone);
      localStorage.setItem('auth_token', response.accessToken);
      localStorage.setItem('user_data', JSON.stringify(response.dealer));
      setUser(response.dealer);
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Signup failed') };
    }
  };

  const requestOtp = async (email: string, isSignup: boolean) => {
    try {
      await api.auth.requestOtp(email, isSignup);
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('OTP request failed') };
    }
  };

  const verifyOtp = async (email: string, otp: string, isSignup: boolean, extraData?: Record<string, unknown>) => {
    try {
      const response = await api.auth.verifyOtp(email, otp, isSignup, extraData);
      localStorage.setItem('auth_token', response.accessToken);
      localStorage.setItem('user_data', JSON.stringify(response.dealer));
      setUser(response.dealer);
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('OTP verification failed') };
    }
  };

  const verifyOtpSMS = async (data: { phone: string; otp: string; name: string; password?: string; email: string }) => {
    try {
      const response = await api.auth.verifyOtpSMS(data);
      localStorage.setItem('auth_token', response.accessToken);
      localStorage.setItem('user_data', JSON.stringify(response.dealer));
      setUser(response.dealer);
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('SMS OTP verification failed') };
    }
  };

  const validateOtp = async (identifier: string, otp: string, isPhone: boolean = false) => {
    try {
      await api.auth.validateOtp(identifier, otp, isPhone);
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('OTP validation failed') };
    }
  };

  const handleSetUser = (newUser: User | null, persist: boolean = true) => {
    setUser(newUser);
    if (persist) {
      if (newUser) {
        localStorage.setItem('user_data', JSON.stringify(newUser));
      } else {
        localStorage.removeItem('user_data');
      }
    }
  };

  const signOut = async () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, requestOtp, verifyOtp, verifyOtpSMS, validateOtp, signOut, setUser: handleSetUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}