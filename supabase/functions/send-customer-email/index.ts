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

function buildEmailHtml(customer: any, company: any, tours: any[], departures: any[], subject: string, customMessage: string): string {
  const settings = (company.settings || {}) as Record<string, string>;
  const logoUrl = company.logo_url || "";
  const websiteUrl = company.website || "";
  const companyPhone = company.phone || "";
  const companyEmail = company.email || "";
  const companyAddress = company.address || "";
  const primaryColor = "#1a1a2e";
  const accentColor = "#f59e0b";

  let tourCardsHtml = "";
  for (const tour of tours) {
    tourCardsHtml += `
      <tr><td style="padding: 0 0 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
          ${tour.cover_image ? `<tr><td><img src="${tour.cover_image}" alt="${tour.title}" width="100%" height="200" style="display: block; object-fit: cover;" /></td></tr>` : ""}
          <tr><td style="padding: 24px;">
            <h3 style="margin: 0 0 8px; color: ${primaryColor}; font-size: 18px; font-weight: 700;">${tour.title}</h3>
            <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">📍 ${tour.destination || "Various Locations"} &nbsp;·&nbsp; ${tour.duration_days} Days / ${tour.duration_nights} Nights</p>
            <p style="margin: 0 0 12px; color: #6b7280; font-size: 13px; line-height: 1.5;">${(tour.description || "").substring(0, 180)}${(tour.description || "").length > 180 ? "..." : ""}</p>
            ${tour.highlights && tour.highlights.length > 0 ? `<p style="margin: 0 0 16px; color: #374151; font-size: 13px;">✨ ${tour.highlights.slice(0, 3).join(" &nbsp;·&nbsp; ")}</p>` : ""}
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td><span style="font-size: 22px; font-weight: 800; color: ${primaryColor};">${tour.currency} ${Number(tour.adult_price).toLocaleString()}</span><span style="font-size: 12px; color: #6b7280;"> / person</span></td>
              <td align="right">${websiteUrl ? `<a href="${websiteUrl}/tours/${tour.slug}" style="display: inline-block; background: ${accentColor}; color: ${primaryColor}; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 700;">View Details →</a>` : ""}</td>
            </tr></table>
          </td></tr>
        </table>
      </td></tr>`;
  }

  let departureCardsHtml = "";
  for (const dep of departures) {
    const tour = dep.tours;
    const availableSeats = dep.total_seats - dep.booked_seats;
    const seatColor = availableSeats <= 5 ? "#ef4444" : "#22c55e";
    departureCardsHtml += `
      <tr><td style="padding: 0 0 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
          <tr><td style="padding: 20px;">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td style="vertical-align: top;">
                <h3 style="margin: 0 0 6px; color: ${primaryColor}; font-size: 16px; font-weight: 700;">${tour?.title || "Tour"}</h3>
                <p style="margin: 0 0 4px; color: #6b7280; font-size: 13px;">📍 ${tour?.destination || ""}</p>
                <p style="margin: 0; color: #6b7280; font-size: 13px;">📅 ${new Date(dep.departure_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}${dep.return_date ? ` — ${new Date(dep.return_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}` : ""}</p>
              </td>
              <td style="vertical-align: top; text-align: right; white-space: nowrap;">
                <p style="margin: 0; font-size: 20px; font-weight: 800; color: ${primaryColor};">${tour?.currency || "GBP"} ${Number(dep.price_override || tour?.adult_price || 0).toLocaleString()}</p>
                <p style="margin: 6px 0 0; font-size: 12px; font-weight: 600; color: ${seatColor};">${availableSeats} seats left</p>
              </td>
            </tr></table>
          </td></tr>
        </table>
      </td></tr>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${subject}</title></head>
<body style="margin: 0; padding: 0; background: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
<table width="100%" cellpadding="0" cellspacing="0" style="background: #f3f4f6; padding: 40px 0;">
<tr><td align="center">
<table width="640" cellpadding="0" cellspacing="0" style="max-width: 640px; width: 100%; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">

  <!-- Header -->
  <tr><td style="background: linear-gradient(135deg, ${primaryColor} 0%, #16213e 100%); padding: 32px 40px; text-align: center;">
    ${logoUrl
      ? `<img src="${logoUrl}" alt="${company.name}" style="max-height: 56px; margin-bottom: 8px;" />`
      : `<h1 style="margin: 0; color: white; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">${company.name}</h1>`
    }
    <p style="margin: 8px 0 0; color: rgba(255,255,255,0.6); font-size: 13px; letter-spacing: 1px;">YOUR TRUSTED TRAVEL PARTNER</p>
  </td></tr>

  <!-- Accent bar -->
  <tr><td style="height: 4px; background: linear-gradient(90deg, ${accentColor}, #f97316, ${accentColor});"></td></tr>

  <!-- Greeting -->
  <tr><td style="padding: 40px 40px 0;">
    <h2 style="margin: 0 0 8px; font-size: 22px; color: ${primaryColor}; font-weight: 700;">Dear ${customer.full_name},</h2>
    <p style="margin: 0 0 0; font-size: 15px; color: #6b7280; line-height: 1.6;">${customMessage}</p>
  </td></tr>

  <!-- Tours Section -->
  ${tours.length > 0 ? `
  <tr><td style="padding: 32px 40px 0;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding-bottom: 20px; border-bottom: 2px solid #f3f4f6;">
        <h2 style="margin: 0; font-size: 18px; color: ${primaryColor}; font-weight: 700;">🌍 Recommended Tours</h2>
      </td></tr>
      <tr><td style="padding-top: 20px;">
        <table width="100%" cellpadding="0" cellspacing="0">${tourCardsHtml}</table>
      </td></tr>
    </table>
  </td></tr>` : ""}

  <!-- Departures Section -->
  ${departures.length > 0 ? `
  <tr><td style="padding: 32px 40px 0;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding-bottom: 20px; border-bottom: 2px solid #f3f4f6;">
        <h2 style="margin: 0; font-size: 18px; color: ${primaryColor}; font-weight: 700;">📅 Upcoming Fixed Departures</h2>
      </td></tr>
      <tr><td style="padding-top: 20px;">
        <table width="100%" cellpadding="0" cellspacing="0">${departureCardsHtml}</table>
      </td></tr>
    </table>
  </td></tr>` : ""}

  <!-- CTA Banner -->
  <tr><td style="padding: 32px 40px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 12px;">
      <tr><td style="padding: 28px; text-align: center;">
        <p style="margin: 0 0 4px; font-size: 16px; font-weight: 700; color: ${primaryColor};">Ready to Book Your Next Adventure? 🎉</p>
        <p style="margin: 0 0 16px; font-size: 13px; color: #92400e;">Contact us today for exclusive offers and personalized travel plans.</p>
        <table cellpadding="0" cellspacing="0" align="center"><tr>
          ${companyPhone ? `<td style="padding: 0 8px;"><a href="tel:${companyPhone}" style="display: inline-block; background: ${primaryColor}; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 700;">📞 Call Us</a></td>` : ""}
          ${companyEmail ? `<td style="padding: 0 8px;"><a href="mailto:${companyEmail}" style="display: inline-block; background: ${accentColor}; color: ${primaryColor}; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 700;">✉️ Email Us</a></td>` : ""}
          ${websiteUrl ? `<td style="padding: 0 8px;"><a href="${websiteUrl}" style="display: inline-block; background: white; color: ${primaryColor}; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 700; border: 2px solid ${primaryColor};">🌐 Visit Website</a></td>` : ""}
        </tr></table>
      </td></tr>
    </table>
  </td></tr>

  <!-- Footer -->
  <tr><td style="background: ${primaryColor}; padding: 32px 40px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center">
        ${logoUrl ? `<img src="${logoUrl}" alt="${company.name}" style="max-height: 36px; margin-bottom: 12px; opacity: 0.9;" />` : `<p style="margin: 0 0 12px; color: white; font-size: 18px; font-weight: 700;">${company.name}</p>`}
      </td></tr>
      <tr><td align="center" style="padding: 8px 0;">
        <table cellpadding="0" cellspacing="0" align="center"><tr>
          ${companyPhone ? `<td style="padding: 0 12px;"><a href="tel:${companyPhone}" style="color: rgba(255,255,255,0.7); font-size: 12px; text-decoration: none;">📞 ${companyPhone}</a></td>` : ""}
          ${companyEmail ? `<td style="padding: 0 12px;"><a href="mailto:${companyEmail}" style="color: rgba(255,255,255,0.7); font-size: 12px; text-decoration: none;">✉️ ${companyEmail}</a></td>` : ""}
        </tr></table>
      </td></tr>
      ${companyAddress ? `<tr><td align="center" style="padding: 8px 0;"><p style="margin: 0; color: rgba(255,255,255,0.5); font-size: 11px; line-height: 1.5;">📍 ${companyAddress}</p></td></tr>` : ""}
      ${websiteUrl ? `<tr><td align="center" style="padding: 8px 0;"><a href="${websiteUrl}" style="color: ${accentColor}; font-size: 12px; text-decoration: none; font-weight: 600;">${websiteUrl}</a></td></tr>` : ""}
      <tr><td align="center" style="padding: 16px 0 0; border-top: 1px solid rgba(255,255,255,0.1);">
        <p style="margin: 0; color: rgba(255,255,255,0.4); font-size: 11px;">${settings.footer_text || `© ${new Date().getFullYear()} ${company.name}. All rights reserved.`}</p>
        <p style="margin: 4px 0 0; color: rgba(255,255,255,0.3); font-size: 10px;">IATA Accredited Travel Management Company</p>
      </td></tr>
    </table>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

async function sendViaSMTP(smtpHost: string, smtpPort: number, smtpUser: string, smtpPass: string, fromEmail: string, fromName: string, toEmail: string, subject: string, htmlBody: string): Promise<void> {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const conn = smtpPort === 465
    ? await Deno.connectTls({ hostname: smtpHost, port: smtpPort })
    : await Deno.connect({ hostname: smtpHost, port: smtpPort });

  const readLine = async (c: any) => { const buf = new Uint8Array(4096); const n = await c.read(buf); return n ? decoder.decode(buf.subarray(0, n)) : ""; };
  const sendCmd = async (c: any, cmd: string) => { await c.write(encoder.encode(cmd + "\r\n")); return await readLine(c); };

  await readLine(conn);
  await sendCmd(conn, `EHLO ${smtpHost}`);

  let activeConn = conn;
  if (smtpPort !== 465) {
    await sendCmd(conn, "STARTTLS");
    activeConn = await Deno.startTls(conn as Deno.TcpConn, { hostname: smtpHost });
    await sendCmd(activeConn, `EHLO ${smtpHost}`);
  }

  await sendCmd(activeConn, "AUTH LOGIN");
  await sendCmd(activeConn, btoa(smtpUser));
  const authResp = await sendCmd(activeConn, btoa(smtpPass));
  if (!authResp.startsWith("235")) {
    activeConn.close();
    throw new Error("SMTP authentication failed. Check your credentials.");
  }

  await sendCmd(activeConn, `MAIL FROM:<${fromEmail}>`);
  await sendCmd(activeConn, `RCPT TO:<${toEmail}>`);
  await sendCmd(activeConn, "DATA");

  const boundary = `boundary_${Date.now()}`;
  const emailData = [
    `From: "${fromName}" <${fromEmail}>`,
    `To: ${toEmail}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset=UTF-8`,
    `Content-Transfer-Encoding: quoted-printable`,
    ``,
    htmlBody,
    ``,
    `--${boundary}--`,
    `.`,
  ].join("\r\n");

  const dataResp = await sendCmd(activeConn, emailData);
  await sendCmd(activeConn, "QUIT");
  activeConn.close();

  if (!dataResp.startsWith("250")) {
    throw new Error("Failed to send email via SMTP");
  }
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

    const { data: customer, error: custErr } = await supabase.from("customers").select("*").eq("id", customer_id).single();
    if (custErr || !customer) return new Response(JSON.stringify({ error: "Customer not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!customer.email) return new Response(JSON.stringify({ error: "Customer has no email address" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { data: company, error: compErr } = await supabase.from("companies").select("*").eq("id", company_id).single();
    if (compErr || !company) return new Response(JSON.stringify({ error: "Company not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });

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

    if (!/^(?!-)[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/.test(smtpHost)) {
      return new Response(JSON.stringify({ error: `Invalid SMTP host '${rawSmtpHost}'.` }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    let tours: any[] = [];
    if (tour_ids && tour_ids.length > 0) {
      const { data } = await supabase.from("tours").select("*").in("id", tour_ids);
      tours = data || [];
    }

    let departures: any[] = [];
    if (departure_ids && departure_ids.length > 0) {
      const { data } = await supabase.from("tour_departures").select("*, tours(title, destination, adult_price, currency, cover_image)").in("id", departure_ids);
      departures = data || [];
    }

    const emailSubject = subject || `Exclusive Travel Offers from ${company.name}`;
    const message = custom_message || "We have curated some amazing travel experiences just for you. Take a look at these handpicked tours and departures!";
    const emailHtml = buildEmailHtml(customer, company, tours, departures, emailSubject, message);

    await sendViaSMTP(smtpHost, smtpPort, smtpUser, smtpPass, fromEmail, fromName, customer.email, emailSubject, emailHtml);

    return new Response(JSON.stringify({ success: true, message: `Email sent to ${customer.email}` }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (error: any) {
    console.error("Send email error:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal server error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
