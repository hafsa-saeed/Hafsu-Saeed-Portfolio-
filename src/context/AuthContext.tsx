import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

export const DEFAULT_ADMIN_EMAIL = "hafsasaeed192@gmail.com";
export const DEFAULT_ADMIN_PASSWORD = "Hafsa@Saeed2026";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  signIn: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if local admin session exists in localStorage
    const savedUser = localStorage.getItem("hafsa_dev_admin_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        // ignore
      }
    }

    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    // Get active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSession(session);
        setUser(session.user);
      }
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setSession(session);
        setUser(session.user);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, pass: string) => {
    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    // Check if credentials match master admin credentials
    const isMasterAdmin =
      cleanEmail === DEFAULT_ADMIN_EMAIL.toLowerCase() &&
      pass === DEFAULT_ADMIN_PASSWORD;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: pass,
        });

        if (!error && data.user) {
          setUser(data.user);
          setSession(data.session);
          setLoading(false);
          return { success: true };
        }

        // If Supabase returned an error (e.g. user not created yet in Supabase Auth console)
        // but user entered master admin credentials, allow login as Admin
        if (isMasterAdmin) {
          const adminUser = {
            id: "master-admin-id",
            email: DEFAULT_ADMIN_EMAIL,
            app_metadata: { role: "admin" },
            user_metadata: { name: "Hafsa Saeed (Admin)" },
            aud: "authenticated",
            created_at: new Date().toISOString(),
          } as unknown as User;
          setUser(adminUser);
          localStorage.setItem("hafsa_dev_admin_user", JSON.stringify(adminUser));
          setLoading(false);
          return { success: true };
        }

        setLoading(false);
        return { success: false, error: error?.message || "Invalid credentials." };
      } catch (err: any) {
        if (isMasterAdmin) {
          const adminUser = {
            id: "master-admin-id",
            email: DEFAULT_ADMIN_EMAIL,
            app_metadata: { role: "admin" },
            user_metadata: { name: "Hafsa Saeed (Admin)" },
            aud: "authenticated",
            created_at: new Date().toISOString(),
          } as unknown as User;
          setUser(adminUser);
          localStorage.setItem("hafsa_dev_admin_user", JSON.stringify(adminUser));
          setLoading(false);
          return { success: true };
        }
        setLoading(false);
        return { success: false, error: err.message || "Failed to sign in." };
      }
    } else {
      // Local / Offline mode
      if (isMasterAdmin || cleanEmail.includes("hafsa") || cleanEmail.includes("admin")) {
        const adminUser = {
          id: "master-admin-id",
          email: DEFAULT_ADMIN_EMAIL,
          app_metadata: { role: "admin" },
          user_metadata: { name: "Hafsa Saeed (Admin)" },
          aud: "authenticated",
          created_at: new Date().toISOString(),
        } as unknown as User;
        setUser(adminUser);
        localStorage.setItem("hafsa_dev_admin_user", JSON.stringify(adminUser));
        setLoading(false);
        return { success: true };
      } else {
        setLoading(false);
        return {
          success: false,
          error: "Invalid credentials. Use email: hafsasaeed192@gmail.com and password: Hafsa@Saeed2026",
        };
      }
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    localStorage.removeItem("hafsa_dev_admin_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isConfigured: isSupabaseConfigured,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
