import { useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { supabase } from "@/integrations/supabase/client";

export interface CheckoutBookingPayload {
  reference_number: string;
  title: string;
  destination?: string | null;
  pax?: number;
  check_in?: string | null;
  check_out?: string | null;
  description?: string | null;
  company_id?: string | null;
  customer_email?: string;
  metadata?: Record<string, any>;
}

interface Props {
  open: boolean;
  onClose: () => void;
  amount: number; // in major units (e.g. 1299 GBP)
  currency?: string;
  productName: string;
  customerEmail?: string;
  bookingType: "tour" | "package" | "fixed_departure" | "cruise" | "hotel" | "flight";
  bookingPayload: CheckoutBookingPayload;
}

export function StripeCheckoutDialog({
  open, onClose, amount, currency = "GBP", productName, customerEmail, bookingType, bookingPayload,
}: Props) {
  const fetchClientSecret = useCallback(async (): Promise<string> => {
    const returnUrl = `${window.location.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}&ref=${encodeURIComponent(bookingPayload.reference_number)}`;
    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: {
        amount: Math.round(amount * 100),
        currency: currency.toLowerCase(),
        productName,
        customerEmail,
        bookingType,
        bookingPayload,
        returnUrl,
        environment: getStripeEnvironment(),
      },
    });
    if (error || !data?.clientSecret) {
      throw new Error(error?.message || data?.error || "Failed to start checkout");
    }
    return data.clientSecret as string;
  }, [amount, currency, productName, customerEmail, bookingType, bookingPayload]);

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="font-display">Secure payment</DialogTitle>
        </DialogHeader>
        <div className="px-2 pb-2">
          {open && (
            <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
