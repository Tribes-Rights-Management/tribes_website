import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactSubmission {
  full_name: string;
  email: string;
  location: string;
  subject: string;
  message: string;
  source_page: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: ContactSubmission = await req.json();
    const { full_name, email, location, subject, message, source_page } = body;

    console.log("Processing contact submission:", { 
      full_name, 
      email, 
      location, 
      subject,
      source_page 
    });

    // Validate required fields
    if (!full_name || !email || !location || !subject || !message) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get Mailgun credentials
    const mailgunApiKey = Deno.env.get("MAILGUN_API_KEY");
    const mailgunDomain = "mail.tribesassets.com";
    const recipientEmail = "support@mail.tribesassets.com";

    if (!mailgunApiKey) {
      console.error("MAILGUN_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Construct email body
    const emailBody = `
New Contact Form Submission

From: ${full_name}
Email: ${email}
Location: ${location}
Source: ${source_page}

Subject: ${subject}

Message:
${message}
    `.trim();

    // Send email via Mailgun
    const mailgunUrl = `https://api.mailgun.net/v3/${mailgunDomain}/messages`;
    
    const formData = new FormData();
    formData.append("from", `${full_name} <noreply@${mailgunDomain}>`);
    formData.append("to", recipientEmail);
    formData.append("subject", subject);
    formData.append("text", emailBody);
    formData.append("h:Reply-To", email);

    console.log("Sending email via Mailgun to:", recipientEmail);

    const mailgunResponse = await fetch(mailgunUrl, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${btoa(`api:${mailgunApiKey}`)}`,
      },
      body: formData,
    });

    if (!mailgunResponse.ok) {
      const errorText = await mailgunResponse.text();
      console.error("Mailgun error:", mailgunResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to send email" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const mailgunResult = await mailgunResponse.json();
    console.log("Email sent successfully:", mailgunResult);

    return new Response(
      JSON.stringify({ success: true, message: "Contact form submitted successfully" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error processing contact submission:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
