import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AppRole, AccountStatus } from "@/types";

interface Profile {
  id: string;
  email: string;
  name: string | null;
  role: AppRole;
  account_status: AccountStatus;
  approved_at: string | null;
  approved_by: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: AppRole | null;
  accountStatus: AccountStatus | null;
  isLoading: boolean;
  isSuperAdmin: boolean;
  isAdminView: boolean;
  isAnyAdmin: boolean;
  isActiveUser: boolean;
  signInWithMagicLink: (email: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {
          setTimeout(() => {
            fetchUserData(newSession.user.id);
          }, 0);
        } else {
          setProfile(null);
          setRole(null);
          setAccountStatus(null);
          setIsLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      setSession(existingSession);
      setUser(existingSession?.user ?? null);
      
      if (existingSession?.user) {
        fetchUserData(existingSession.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchUserData(userId: string) {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        setRole("user");
        setAccountStatus("pending");
      } else {
        setProfile(profileData as Profile);
        setRole((profileData?.role as AppRole) ?? "user");
        setAccountStatus((profileData?.account_status as AccountStatus) ?? "pending");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setRole("user");
      setAccountStatus("pending");
    } finally {
      setIsLoading(false);
    }
  }

  async function signInWithMagicLink(email: string) {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    return { error: error ? new Error(error.message) : null };
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setRole(null);
    setAccountStatus(null);
  }

  const isSuperAdmin = role === "super_admin";
  const isAdminView = role === "admin_view";
  const isAnyAdmin = isSuperAdmin || isAdminView;
  const isActiveUser = accountStatus === "active";

  const value = {
    user,
    session,
    profile,
    role,
    accountStatus,
    isLoading,
    isSuperAdmin,
    isAdminView,
    isAnyAdmin,
    isActiveUser,
    signInWithMagicLink,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}