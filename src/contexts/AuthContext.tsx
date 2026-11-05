import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { DEMO_USER } from "@/lib/api-client";
import type { User } from "@/lib/api-client";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInAsDemo: () => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  setUser: (user: User | null, persist?: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = "auth_token";
const USER_DATA_KEY = "user_data";

function persistDemoSession(user: User = DEMO_USER) {
  localStorage.setItem(AUTH_TOKEN_KEY, "demo-token");
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const userData = localStorage.getItem(USER_DATA_KEY);

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(USER_DATA_KEY);
      }
    }

    setLoading(false);
  }, []);

  const signInAsDemo = async () => {
    try {
      persistDemoSession(DEMO_USER);
      setUser(DEMO_USER);
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error("Demo login failed") };
    }
  };

  const signIn = async (_email: string, _password: string) => signInAsDemo();

  const handleSetUser = (newUser: User | null, persist: boolean = true) => {
    setUser(newUser);
    if (persist) {
      if (newUser) {
        persistDemoSession(newUser);
      } else {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(USER_DATA_KEY);
      }
    }
  };

  const signOut = async () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInAsDemo,
        signIn,
        signOut,
        setUser: handleSetUser,
      }}
    >
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
