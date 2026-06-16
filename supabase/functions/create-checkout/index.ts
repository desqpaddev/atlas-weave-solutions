import { z } from "https://esm.sh/zod@3.23.8";
import { type StripeEnv, createStripeClient } from "../_shared/stripe.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const BodySchema = z.object({
  amount: z.number().int().min(50).max(100_000_000), // pence
  currency: z.string().length(3).default("gbp"),
  productName: z.string().min(1).max(255),
  customerEmail: z.string().email().optional(),
  bookingType: z.enum(["tour", "package", "fixed_departure", "cruise", "hotel", "flight"]),
  bookingPayload: z.record(z.any()), // saved as metadata, used by webhook to create booking
  returnUrl: z.string().url(),
  environment: z.enum(["sandbox", "live"]),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  try {
    const json = await req.json();
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten() }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { amount, currency, productName, customerEmail, bookingType, bookingPayload, returnUrl, environment } = parsed.data;

    const stripe = createStripeClient(environment as StripeEnv);

    // Stripe metadata values must be strings ≤ 500 chars. Pack the booking
    // payload as a single JSON string so the webhook can rebuild it.
    const payloadStr = JSON.stringify(bookingPayload);
    if (payloadStr.length > 4500) {
      return new Response(JSON.stringify({ error: "Booking payload too large" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [{
        price_data: {
          currency: currency.toLowerCase(),
          product_data: { name: productName },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      mode: "payment",
      ui_mode: "embedded_page",
      return_url: returnUrl,
      ...(customerEmail && { customer_email: customerEmail }),
      metadata: {
        booking_type: bookingType,
        booking_payload: payloadStr,
      },
      payment_intent_data: {
        metadata: {
          booking_type: bookingType,
          booking_payload: payloadStr,
        },
      },
    });

    return new Response(JSON.stringify({ clientSecret: session.client_secret }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("create-checkout error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
