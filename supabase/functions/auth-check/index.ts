import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AuthCheckRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  country?: string;
  companyType?: string;
  companyDescription?: string;
  isRequestAccess?: boolean;
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

    const body: AuthCheckRequest = await req.json();
    const { email, firstName, lastName, company, country, companyType, companyDescription, isRequestAccess } = body;
    
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

    // Profile doesn't exist - only create if this is a request access submission
    if (!isRequestAccess) {
      // For login attempts with no profile, tell them to request access
      return new Response(
        JSON.stringify({ 
          status: "no_account", 
          message: "No account found. Please request access." 
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create profile with all the provided information
    const newProfileId = crypto.randomUUID();
    const name = firstName && lastName ? `${firstName} ${lastName}` : normalizedEmail.split("@")[0];
    
    const { error: insertError } = await supabase
      .from("profiles")
      .insert({
        id: newProfileId,
        email: normalizedEmail,
        name: name,
        company: company || null,
        country: country || null,
        company_type: companyType || null,
        company_description: companyDescription || null,
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
