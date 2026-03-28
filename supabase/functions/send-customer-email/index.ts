import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendEmailRequest {
  customer_id: string;
  company_id: string;
  tour_ids?: string[];
  departure_ids?: string[];
  subject?: string;
  custom_message?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const body: SendEmailRequest = await req.json();
    const { customer_id, company_id, tour_ids, departure_ids, subject, custom_message } = body;

    if (!customer_id || !company_id) {
      return new Response(JSON.stringify({ error: "customer_id and company_id are required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Get customer
    const { data: customer, error: custErr } = await supabase.from("customers").select("*").eq("id", customer_id).single();
    if (custErr || !customer) {
      return new Response(JSON.stringify({ error: "Customer not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!customer.email) {
      return new Response(JSON.stringify({ error: "Customer has no email address" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Get company with SMTP settings
    const { data: company, error: compErr } = await supabase.from("companies").select("*").eq("id", company_id).single();
    if (compErr || !company) {
      return new Response(JSON.stringify({ error: "Company not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const settings = (company.settings || {}) as Record<string, string>;
    const rawSmtpHost = (settings.smtp_host || "").trim();
    const smtpHost = rawSmtpHost.replace(/^smtp@/i, "smtp.");
    const smtpPort = Number.parseInt(settings.smtp_port || "587", 10);
    const smtpUser = settings.smtp_user;
    const smtpPass = settings.smtp_password;
    const fromEmail = settings.smtp_from_email || company.email || smtpUser;
    const fromName = settings.smtp_from_name || company.name;

    if (!smtpHost || !smtpUser || !smtpPass || Number.isNaN(smtpPort)) {
      return new Response(JSON.stringify({ error: "SMTP not configured. Please configure SMTP settings in Settings." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const smtpHostIsValid = /^(?!-)[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/.test(smtpHost);
    if (!smtpHostIsValid) {
      return new Response(JSON.stringify({ error: `Invalid SMTP host '${rawSmtpHost}'. Please use a valid host like smtp.gmail.com.` }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Get tours if requested
    let tours: any[] = [];
    if (tour_ids && tour_ids.length > 0) {
      const { data } = await supabase.from("tours").select("*").in("id", tour_ids);
      tours = data || [];
    }

    // Get departures with tour info if requested
    let departures: any[] = [];
    if (departure_ids && departure_ids.length > 0) {
      const { data } = await supabase.from("tour_departures").select("*, tours(title, destination, adult_price, currency, cover_image)").in("id", departure_ids);
      departures = data || [];
    }

    // Build professional HTML email
    const logoUrl = company.logo_url || "";
    const websiteUrl = company.website || "";

    let tourCardsHtml = "";
    for (const tour of tours) {
      tourCardsHtml += `
        <div style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; margin-bottom: 20px;">
          ${tour.cover_image ? `<img src="${tour.cover_image}" alt="${tour.title}" style="width: 100%; height: 200px; object-fit: cover;" />` : ""}
          <div style="padding: 20px;">
            <h3 style="margin: 0 0 8px; color: #1a1a2e; font-size: 18px;">${tour.title}</h3>
            <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">📍 ${tour.destination || "Various Locations"} · ${tour.duration_days} Days / ${tour.duration_nights} Nights</p>
            <p style="margin: 0 0 12px; color: #6b7280; font-size: 13px;">${(tour.description || "").substring(0, 150)}${(tour.description || "").length > 150 ? "..." : ""}</p>
            ${tour.highlights && tour.highlights.length > 0 ? `<p style="margin: 0 0 8px; color: #374151; font-size: 13px;">✨ ${tour.highlights.slice(0, 3).join(" · ")}</p>` : ""}
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px;">
              <span style="font-size: 20px; font-weight: bold; color: #1a1a2e;">${tour.currency} ${Number(tour.adult_price).toLocaleString()}<span style="font-size: 12px; color: #6b7280;"> / person</span></span>
              ${websiteUrl ? `<a href="${websiteUrl}/tours/${tour.slug}" style="background: #1a1a2e; color: white; padding: 8px 20px; border-radius: 6px; text-decoration: none; font-size: 13px;">View Details</a>` : ""}
            </div>
          </div>
        </div>`;
    }

    let departureCardsHtml = "";
    for (const dep of departures) {
      const tour = dep.tours;
      const availableSeats = dep.total_seats - dep.booked_seats;
      departureCardsHtml += `
        <div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: start;">
            <div>
              <h3 style="margin: 0 0 6px; color: #1a1a2e; font-size: 16px;">${tour?.title || "Tour"}</h3>
              <p style="margin: 0 0 4px; color: #6b7280; font-size: 13px;">📍 ${tour?.destination || ""}</p>
              <p style="margin: 0; color: #6b7280; font-size: 13px;">📅 ${new Date(dep.departure_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}${dep.return_date ? ` — ${new Date(dep.return_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}` : ""}</p>
            </div>
            <div style="text-align: right;">
              <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1a1a2e;">${tour?.currency || "GBP"} ${Number(dep.price_override || tour?.adult_price || 0).toLocaleString()}</p>
              <p style="margin: 4px 0 0; font-size: 12px; color: ${availableSeats <= 5 ? "#ef4444" : "#22c55e"};">${availableSeats} seats left</p>
            </div>
          </div>
        </div>`;
    }

    const emailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 640px; margin: 0 auto; background: white;">
    <!-- Header -->
    <div style="background: #1a1a2e; padding: 24px 32px; text-align: center;">
      ${logoUrl ? `<img src="${logoUrl}" alt="${company.name}" style="max-height: 50px; margin-bottom: 8px;" />` : `<h1 style="margin: 0; color: white; font-size: 24px;">${company.name}</h1>`}
    </div>
    
    <!-- Body -->
    <div style="padding: 32px;">
      <p style="font-size: 16px; color: #374151; margin: 0 0 8px;">Dear ${customer.full_name},</p>
      <p style="font-size: 14px; color: #6b7280; margin: 0 0 24px;">${custom_message || "We have curated some amazing travel experiences just for you. Take a look at these handpicked tours and departures!"}</p>
      
      ${tours.length > 0 ? `<h2 style="font-size: 18px; color: #1a1a2e; margin: 0 0 16px; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb;">🌍 Recommended Tours</h2>${tourCardsHtml}` : ""}
      
      ${departures.length > 0 ? `<h2 style="font-size: 18px; color: #1a1a2e; margin: 24px 0 16px; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb;">📅 Upcoming Departures</h2>${departureCardsHtml}` : ""}
      
      <div style="margin-top: 32px; padding: 20px; background: #f9fafb; border-radius: 8px; text-align: center;">
        <p style="margin: 0 0 12px; color: #374151; font-size: 14px;">Interested? Get in touch with us!</p>
        ${company.phone ? `<p style="margin: 0 0 4px; color: #6b7280; font-size: 13px;">📞 ${company.phone}</p>` : ""}
        ${company.email ? `<p style="margin: 0; color: #6b7280; font-size: 13px;">✉️ ${company.email}</p>` : ""}
      </div>
    </div>
    
    <!-- Footer -->
    <div style="background: #f9fafb; padding: 20px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0; font-size: 12px; color: #9ca3af;">${settings.footer_text || `© ${new Date().getFullYear()} ${company.name}. All rights reserved.`}</p>
      ${websiteUrl ? `<p style="margin: 4px 0 0; font-size: 12px;"><a href="${websiteUrl}" style="color: #6b7280;">${websiteUrl}</a></p>` : ""}
    </div>
  </div>
</body>
</html>`;

    // Send email via SMTP using Deno's smtp module
    // Using raw SMTP connection
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const conn = smtpPort === 465
      ? await Deno.connectTls({ hostname: smtpHost, port: smtpPort })
      : await Deno.connect({ hostname: smtpHost, port: smtpPort });

    async function readLine(): Promise<string> {
      const buf = new Uint8Array(4096);
      const n = await conn.read(buf);
      return n ? decoder.decode(buf.subarray(0, n)) : "";
    }

    async function sendCmd(cmd: string): Promise<string> {
      await conn.write(encoder.encode(cmd + "\r\n"));
      return await readLine();
    }

    // Read greeting
    await readLine();

    // EHLO
    await sendCmd(`EHLO ${smtpHost}`);

    // STARTTLS for non-465 ports
    if (smtpPort !== 465) {
      await sendCmd("STARTTLS");
      const tlsConn = await Deno.startTls(conn as Deno.TcpConn, { hostname: smtpHost });
      // Reassign for TLS
      const tlsReadLine = async () => { const b = new Uint8Array(4096); const n = await tlsConn.read(b); return n ? decoder.decode(b.subarray(0, n)) : ""; };
      const tlsSendCmd = async (c: string) => { await tlsConn.write(encoder.encode(c + "\r\n")); return await tlsReadLine(); };

      await tlsSendCmd(`EHLO ${smtpHost}`);

      // AUTH LOGIN
      await tlsSendCmd("AUTH LOGIN");
      await tlsSendCmd(btoa(smtpUser));
      const authResp = await tlsSendCmd(btoa(smtpPass));
      if (!authResp.startsWith("235")) {
        tlsConn.close();
        return new Response(JSON.stringify({ error: "SMTP authentication failed. Check your credentials." }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      await tlsSendCmd(`MAIL FROM:<${fromEmail}>`);
      await tlsSendCmd(`RCPT TO:<${customer.email}>`);
      await tlsSendCmd("DATA");

      const boundary = `boundary_${Date.now()}`;
      const emailData = [
        `From: "${fromName}" <${fromEmail}>`,
        `To: ${customer.email}`,
        `Subject: ${subject || `Exclusive Travel Offers from ${company.name}`}`,
        `MIME-Version: 1.0`,
        `Content-Type: multipart/alternative; boundary="${boundary}"`,
        ``,
        `--${boundary}`,
        `Content-Type: text/html; charset=UTF-8`,
        `Content-Transfer-Encoding: quoted-printable`,
        ``,
        emailHtml,
        ``,
        `--${boundary}--`,
        `.`,
      ].join("\r\n");

      const dataResp = await tlsSendCmd(emailData);
      await tlsSendCmd("QUIT");
      tlsConn.close();

      if (!dataResp.startsWith("250")) {
        return new Response(JSON.stringify({ error: "Failed to send email" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    } else {
      // Already TLS on port 465
      await sendCmd("AUTH LOGIN");
      await sendCmd(btoa(smtpUser));
      const authResp = await sendCmd(btoa(smtpPass));
      if (!authResp.startsWith("235")) {
        conn.close();
        return new Response(JSON.stringify({ error: "SMTP authentication failed" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      await sendCmd(`MAIL FROM:<${fromEmail}>`);
      await sendCmd(`RCPT TO:<${customer.email}>`);
      await sendCmd("DATA");

      const boundary = `boundary_${Date.now()}`;
      const emailData = [
        `From: "${fromName}" <${fromEmail}>`,
        `To: ${customer.email}`,
        `Subject: ${subject || `Exclusive Travel Offers from ${company.name}`}`,
        `MIME-Version: 1.0`,
        `Content-Type: multipart/alternative; boundary="${boundary}"`,
        ``,
        `--${boundary}`,
        `Content-Type: text/html; charset=UTF-8`,
        ``,
        emailHtml,
        ``,
        `--${boundary}--`,
        `.`,
      ].join("\r\n");

      const dataResp = await sendCmd(emailData);
      await sendCmd("QUIT");
      conn.close();

      if (!dataResp.startsWith("250")) {
        return new Response(JSON.stringify({ error: "Failed to send email" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    return new Response(JSON.stringify({ success: true, message: `Email sent to ${customer.email}` }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (error: any) {
    console.error("Send email error:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal server error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
