import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AuthCheckRequest {
  email: string;
}

interface AuthCheckResponse {
  status: "active" | "pending" | "rejected" | "new_request";
  message: string;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { email }: AuthCheckRequest = await req.json();
    
    if (!email || typeof email !== "string") {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if profile exists
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, account_status")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (profileError) {
      console.error("Error checking profile:", profileError);
      return new Response(
        JSON.stringify({ error: "Failed to check account status" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Profile exists
    if (profile) {
      const response: AuthCheckResponse = {
        status: profile.account_status as AuthCheckResponse["status"],
        message: profile.account_status === "active" 
          ? "Account is active" 
          : profile.account_status === "pending"
          ? "Account is pending approval"
          : "Account access was denied",
      };

      return new Response(
        JSON.stringify(response),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Profile doesn't exist - create new pending profile
    // First, we need to create an auth user, then the profile will be created via trigger
    // But we want to create just the profile without sending any auth email
    
    // Create profile directly (without auth user for now - they'll get one when approved)
    const newProfileId = crypto.randomUUID();
    const { error: insertError } = await supabase
      .from("profiles")
      .insert({
        id: newProfileId,
        email: normalizedEmail,
        name: normalizedEmail.split("@")[0], // Use email prefix as temp name
        role: "user",
        account_status: "pending",
      });

    if (insertError) {
      // If duplicate, the profile was just created by another request
      if (insertError.code === "23505") {
        return new Response(
          JSON.stringify({ status: "pending", message: "Account is pending approval" }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      
      console.error("Error creating profile:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to create access request" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const response: AuthCheckResponse = {
      status: "new_request",
      message: "Access request submitted",
    };

    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error) {
    console.error("Error in auth-check:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});