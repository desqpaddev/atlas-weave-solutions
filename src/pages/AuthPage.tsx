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
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
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
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
      else navigate("/dashboard");
    } else if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: fullName }, emailRedirectTo: window.location.origin },
      });
      if (error) toast.error(error.message);
      else toast.success("Check your email to confirm your account!");
    }
    setSubmitting(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) toast.error(error.message);
    else toast.success("Password reset link sent! Check your email.");
    setSubmitting(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
    </div>
  );

  const heading = mode === "login" ? "Welcome back" : mode === "signup" ? "Create your account" : "Reset your password";

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
          <p className="text-muted-foreground">{heading}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 shadow-card">
          {mode === "forgot" ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="mt-1" /></div>
              <Button variant="brand" className="w-full h-11" disabled={submitting}>{submitting ? "Sending..." : "Send Reset Link"}</Button>
            </form>
          ) : (
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {mode === "signup" && (
                <div><Label htmlFor="fullName">Full Name</Label><Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" className="mt-1" /></div>
              )}
              <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="mt-1" /></div>
              <div><Label htmlFor="password">Password</Label><Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} className="mt-1" /></div>
              {mode === "login" && (
                <div className="text-right">
                  <button type="button" onClick={() => setMode("forgot")} className="text-sm text-primary hover:text-primary-light transition-colors font-medium">Forgot password?</button>
                </div>
              )}
              <Button variant="brand" className="w-full h-11" disabled={submitting}>{submitting ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}</Button>
            </form>
          )}
          <p className="text-center text-sm text-muted-foreground mt-4">
            {mode === "forgot" ? (
              <button onClick={() => setMode("login")} className="text-primary hover:text-primary-light transition-colors font-medium">Back to Sign In</button>
            ) : mode === "login" ? (
              <>Don't have an account?{" "}<button onClick={() => setMode("signup")} className="text-primary hover:text-primary-light transition-colors font-medium">Sign Up</button></>
            ) : (
              <>Already have an account?{" "}<button onClick={() => setMode("login")} className="text-primary hover:text-primary-light transition-colors font-medium">Sign In</button></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
