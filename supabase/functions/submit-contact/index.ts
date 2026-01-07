import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple hash function for IP (privacy-preserving)
async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")?.slice(0, 16));
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.slice(0, 8).map(b => b.toString(16).padStart(2, "0")).join("");
}

// Basic spam detection
function isSpam(message: string, name: string): boolean {
  const spamPatterns = [
    /\b(viagra|cialis|casino|lottery|winner|million\s*dollars?)\b/i,
    /\b(click\s*here|buy\s*now|free\s*money)\b/i,
    /<\s*(a|script|iframe)\b/i,
    /\[url=/i,
  ];
  const combined = `${name} ${message}`;
  return spamPatterns.some(pattern => pattern.test(combined));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    const { full_name, email, location, message, source_page = "contact" } = body;

    // Validate required fields
    if (!full_name?.trim() || !email?.trim() || !location?.trim() || !message?.trim()) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate field lengths
    if (full_name.length > 200 || email.length > 255 || location.length > 100 || message.length > 5000) {
      return new Response(
        JSON.stringify({ error: "Field length exceeded" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Basic spam check
    if (isSpam(message, full_name)) {
      // Silently reject spam but return success to not inform spammers
      console.log("Spam detected, rejecting submission");
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get IP and User-Agent for rate limiting and analytics
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("x-real-ip") || 
                     "unknown";
    const userAgent = req.headers.get("user-agent") || null;
    const ipHash = await hashIP(clientIP);

    // Check rate limit
    const { data: canSubmit } = await supabase.rpc("check_contact_rate_limit", { p_ip_hash: ipHash });
    
    if (!canSubmit) {
      return new Response(
        JSON.stringify({ error: "Please wait a moment before submitting again" }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get user_id from auth header if present
    let userId: string | null = null;
    const authHeader = req.headers.get("authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    // Insert submission
    const { data: submission, error } = await supabase
      .from("contact_submissions")
      .insert({
        full_name: full_name.trim(),
        email: email.trim().toLowerCase(),
        location: location.trim(),
        message: message.trim(),
        source_page,
        user_id: userId,
        ip_hash: ipHash,
        user_agent: userAgent,
      })
      .select()
      .single();

    if (error) {
      console.error("Insert error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to submit. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Log new submission for admin notification
    console.log("New contact submission:", {
      id: submission.id,
      name: full_name.trim(),
      email: email.trim().toLowerCase(),
      location: location.trim(),
      message_preview: message.trim().substring(0, 200),
      timestamp: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({ success: true, id: submission.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
