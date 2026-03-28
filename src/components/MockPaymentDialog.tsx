import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Lock, CheckCircle, Loader2 } from "lucide-react";

interface MockPaymentDialogProps {
  open: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  amount: number;
  currency?: string;
  title: string;
}

export function MockPaymentDialog({ open, onClose, onPaymentSuccess, amount, currency = "USD", title }: MockPaymentDialogProps) {
  const [step, setStep] = useState<"form" | "processing" | "success">("form");
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "", name: "" });

  const formatCardNumber = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("processing");
    setTimeout(() => {
      setStep("success");
      setTimeout(() => {
        onPaymentSuccess();
        setStep("form");
        setCard({ number: "", expiry: "", cvv: "", name: "" });
      }, 1500);
    }, 2000);
  };

  const isValid = card.number.replace(/\s/g, "").length === 16 && card.expiry.length === 5 && card.cvv.length >= 3 && card.name.length > 1;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o && step === "form") { onClose(); } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display">
            <CreditCard className="h-5 w-5 text-primary" /> Secure Payment
          </DialogTitle>
          <DialogDescription>Pay for: {title}</DialogDescription>
        </DialogHeader>

        {step === "form" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-secondary rounded-lg p-4 flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Amount</span>
              <span className="text-2xl font-bold text-primary font-display">
                {currency === "USD" ? "$" : currency} {amount.toLocaleString()}
              </span>
            </div>

            <div>
              <Label className="text-xs">Cardholder Name</Label>
              <Input value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} placeholder="John Doe" className="mt-1" required />
            </div>

            <div>
              <Label className="text-xs">Card Number</Label>
              <Input value={card.number} onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })} placeholder="4242 4242 4242 4242" className="mt-1 font-mono" required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Expiry</Label>
                <Input value={card.expiry} onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })} placeholder="MM/YY" className="mt-1 font-mono" required />
              </div>
              <div>
                <Label className="text-xs">CVV</Label>
                <Input value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })} placeholder="123" className="mt-1 font-mono" type="password" required />
              </div>
            </div>

            <Button variant="brand" size="lg" className="w-full" disabled={!isValid} type="submit">
              <Lock className="h-4 w-4 mr-2" /> Pay ${amount.toLocaleString()}
            </Button>

            <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
              <Lock className="h-3 w-3" /> This is a simulated payment gateway (demo mode)
            </p>
          </form>
        )}

        {step === "processing" && (
          <div className="py-12 text-center space-y-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
            <p className="text-muted-foreground font-medium">Processing your payment...</p>
            <p className="text-xs text-muted-foreground">Please do not close this window</p>
          </div>
        )}

        {step === "success" && (
          <div className="py-12 text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <p className="text-foreground font-bold text-lg">Payment Successful!</p>
            <p className="text-sm text-muted-foreground">Finalizing your booking...</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
