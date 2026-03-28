import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

export default function AuthPage() {
  const { user, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const { data: company } = useQuery({
    queryKey: ["auth-company-branding"],
    queryFn: async () => {
      const { data } = await supabase.from("companies").select("name, logo_url").limit(1).maybeSingle();
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (!loading && user) navigate("/dashboard", { replace: true });
  }, [user, loading, navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
      else navigate("/dashboard");
    } else {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: fullName }, emailRedirectTo: window.location.origin },
      });
      if (error) toast.error(error.message);
      else toast.success("Check your email to confirm your account!");
    }
    setSubmitting(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            {company?.logo_url ? (
              <img src={company.logo_url} alt={company.name || "Logo"} className="h-12 w-auto max-w-[200px] object-contain" />
            ) : (
              <span className="font-display text-3xl font-bold text-gradient-blue">{company?.name || "Joanna Holidays"}</span>
            )}
          </div>
          <p className="text-muted-foreground">{isLogin ? "Welcome back" : "Create your account"}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 shadow-card">
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {!isLogin && (
              <div><Label htmlFor="fullName">Full Name</Label><Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" className="mt-1" /></div>
            )}
            <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="mt-1" /></div>
            <div><Label htmlFor="password">Password</Label><Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} className="mt-1" /></div>
            <Button variant="brand" className="w-full h-11" disabled={submitting}>{submitting ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}</Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-4">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-primary hover:text-primary-light transition-colors font-medium">{isLogin ? "Sign Up" : "Sign In"}</button>
          </p>
        </div>
      </div>
    </div>
  );
}
