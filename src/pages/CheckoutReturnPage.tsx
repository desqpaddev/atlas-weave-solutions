import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function CheckoutReturnPage() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const ref = params.get("ref");
  const [status, setStatus] = useState<"loading" | "ready">("loading");

  useEffect(() => {
    if (!ref) { setStatus("ready"); return; }
    let cancelled = false;
    let attempts = 0;
    const poll = async () => {
      attempts++;
      const { data } = await supabase.from("bookings").select("id").eq("reference_number", ref).maybeSingle();
      if (cancelled) return;
      if (data || attempts > 10) { setStatus("ready"); return; }
      setTimeout(poll, 1500);
    };
    poll();
    return () => { cancelled = true; };
  }, [ref]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-20">
        <div className="max-w-lg mx-auto bg-card border border-border rounded-2xl p-10 text-center shadow-soft">
          {status === "loading" ? (
            <>
              <Loader2 className="h-14 w-14 text-primary animate-spin mx-auto mb-6" />
              <h1 className="font-display text-2xl font-bold mb-2">Confirming your booking…</h1>
              <p className="text-muted-foreground text-sm">Please don't close this window.</p>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h1 className="font-display text-3xl font-bold mb-3">Payment successful!</h1>
              {ref && (
                <p className="text-muted-foreground mb-2">
                  Reference: <span className="font-mono text-primary font-semibold">{ref}</span>
                </p>
              )}
              <p className="text-muted-foreground mb-8 text-sm">
                A confirmation email is on its way. You can view this booking from your dashboard.
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="brand" asChild><Link to="/dashboard/bookings">View my bookings</Link></Button>
                <Button variant="outline" asChild><Link to="/">Back to home</Link></Button>
              </div>
              {sessionId && <p className="text-xs text-muted-foreground mt-6">Session: {sessionId.slice(0, 24)}…</p>}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
