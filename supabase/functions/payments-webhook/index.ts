import { createClient } from "npm:@supabase/supabase-js@2";
import { type StripeEnv, verifyWebhook, createStripeClient } from "../_shared/stripe.ts";

let _supabase: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
  }
  return _supabase;
}

async function findCompanyId(): Promise<string | null> {
  const { data } = await getSupabase().from("companies").select("id").limit(1).maybeSingle();
  return (data as any)?.id ?? null;
}

async function handleCheckoutCompleted(session: any, env: StripeEnv) {
  const md = session.metadata || {};
  const bookingType = md.booking_type as string | undefined;
  const payloadStr = md.booking_payload as string | undefined;
  if (!bookingType || !payloadStr) {
    console.warn("Skipping session without booking metadata", session.id);
    return;
  }

  let payload: any;
  try { payload = JSON.parse(payloadStr); } catch { console.error("Invalid payload JSON"); return; }

  // Idempotency — bail if booking already exists for this session.
  const { data: existing } = await getSupabase()
    .from("bookings")
    .select("id")
    .eq("reference_number", payload.reference_number)
    .maybeSingle();
  if (existing) { console.log("Booking already exists, skipping"); return; }

  const companyId = payload.company_id || await findCompanyId();
  if (!companyId) { console.error("No company_id available"); return; }

  const amountTotal = (session.amount_total || 0) / 100;
  const currency = (session.currency || "gbp").toUpperCase();
  const customerEmail = session.customer_details?.email || payload.customer_email || session.customer_email;

  // 1. Create booking
  const { data: bookingRow, error: bookingErr } = await getSupabase().from("bookings").insert({
    company_id: companyId,
    title: payload.title,
    booking_type: bookingType,
    status: "confirmed",
    total_amount: amountTotal,
    paid_amount: amountTotal,
    payment_status: "paid",
    currency,
    destination: payload.destination ?? null,
    pax: payload.pax ?? 1,
    check_in: payload.check_in ?? null,
    check_out: payload.check_out ?? null,
    reference_number: payload.reference_number,
    description: payload.description ?? null,
    metadata: {
      ...payload.metadata,
      customer_email: customerEmail,
      stripe_session_id: session.id,
      stripe_payment_intent: session.payment_intent,
      environment: env,
    },
  }).select("id").single();

  if (bookingErr) { console.error("Booking insert failed:", bookingErr); return; }

  // 2. Create payment row
  const { error: payErr } = await getSupabase().from("payments").insert({
    booking_id: (bookingRow as any).id,
    amount: amountTotal,
    currency,
    method: "card",
    status: "paid",
    transaction_id: session.payment_intent || session.id,
    paid_at: new Date().toISOString(),
    notes: `Stripe checkout session ${session.id} (${env})`,
  });
  if (payErr) console.error("Payment insert failed:", payErr);

  // 3. Create lead for CRM tracking (non-blocking)
  if (customerEmail) {
    await getSupabase().from("leads").insert({
      company_id: companyId,
      full_name: payload.metadata?.customer_name || customerEmail,
      email: customerEmail,
      phone: payload.metadata?.customer_phone || null,
      destination: payload.destination ?? null,
      travel_dates: payload.check_in ?? null,
      pax: payload.pax ?? 1,
      budget: amountTotal,
      currency,
      source: "website",
      status: "won",
      notes: `Auto-created from paid booking ${payload.reference_number}`,
    });
  }

  // 4. Bump booked_seats for fixed departures
  if (bookingType === "fixed_departure" && payload.metadata?.departure_id) {
    const seats = payload.pax ?? 1;
    const { data: dep } = await getSupabase()
      .from("tour_departures")
      .select("booked_seats")
      .eq("id", payload.metadata.departure_id)
      .maybeSingle();
    if (dep) {
      await getSupabase()
        .from("tour_departures")
        .update({ booked_seats: ((dep as any).booked_seats || 0) + seats })
        .eq("id", payload.metadata.departure_id);
    }
  }
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const rawEnv = new URL(req.url).searchParams.get("env");
  if (rawEnv !== "sandbox" && rawEnv !== "live") {
    console.error("Invalid env query param:", rawEnv);
    return new Response(JSON.stringify({ ignored: "invalid env" }), { status: 200 });
  }
  const env: StripeEnv = rawEnv;

  try {
    const event = await verifyWebhook(req, env);
    console.log("Webhook event:", event.type);

    switch (event.type) {
      case "checkout.session.completed":
      case "transaction.completed": {
        // Lovable's payments-webhook subscribes to transaction.completed; the underlying
        // Stripe event can also arrive as checkout.session.completed. Handle both.
        const obj = event.data.object;
        // If it's a payment intent or transaction, fetch the related session.
        if (obj.object === "checkout.session") {
          await handleCheckoutCompleted(obj, env);
        } else if (obj.payment_intent || obj.id) {
          // Fetch the session for this payment intent
          const stripe = createStripeClient(env);
          const piId = obj.payment_intent || obj.id;
          const sessions = await stripe.checkout.sessions.list({ payment_intent: piId, limit: 1 });
          if (sessions.data[0]) await handleCheckoutCompleted(sessions.data[0], env);
        }
        break;
      }
      default:
        console.log("Unhandled event:", event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response("Webhook error", { status: 400 });
  }
});
