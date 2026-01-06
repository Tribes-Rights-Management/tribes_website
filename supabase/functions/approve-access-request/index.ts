import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ApproveRequest {
  profileId: string;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the authorization header to verify the caller is a super admin
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Verify the caller's identity
    const token = authHeader.replace("Bearer ", "");
    const { data: { user: caller }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !caller) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check if caller is super admin
    const { data: callerProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", caller.id)
      .single();

    if (callerProfile?.role !== "super_admin") {
      return new Response(
        JSON.stringify({ error: "Forbidden: Super admin access required" }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { profileId }: ApproveRequest = await req.json();

    if (!profileId) {
      return new Response(
        JSON.stringify({ error: "Profile ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get the profile to approve
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, email, name, account_status")
      .eq("id", profileId)
      .single();

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ error: "Profile not found" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (profile.account_status !== "pending") {
      return new Response(
        JSON.stringify({ error: "Profile is not in pending status" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check if auth user already exists for this email
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingAuthUser = existingUsers?.users?.find(
      (u) => u.email?.toLowerCase() === profile.email.toLowerCase()
    );

    let authUserId: string;

    if (existingAuthUser) {
      // User already exists in auth, use their ID
      authUserId = existingAuthUser.id;
    } else {
      // Create the auth user with a random password (they'll use magic link)
      const tempPassword = crypto.randomUUID() + crypto.randomUUID();
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: profile.email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: { name: profile.name },
      });

      if (createError) {
        console.error("Error creating auth user:", createError);
        return new Response(
          JSON.stringify({ error: "Failed to create user account" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      authUserId = newUser.user.id;
    }

    // Update the profile with the auth user ID and set status to active
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        id: authUserId,
        account_status: "active",
        approved_at: new Date().toISOString(),
        approved_by: caller.id,
      })
      .eq("id", profileId);

    if (updateError) {
      console.error("Error updating profile:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update profile" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Send magic link email
    const siteUrl = Deno.env.get("SITE_URL") || supabaseUrl.replace(".supabase.co", ".lovable.app");
    const { error: magicLinkError } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: profile.email,
      options: {
        redirectTo: `${siteUrl}/auth/callback`,
      },
    });

    if (magicLinkError) {
      console.error("Error generating magic link:", magicLinkError);
      // Don't fail the whole operation, user can request login later
    }

    // Log the approval action
    await supabase.from("audit_log").insert({
      actor_id: caller.id,
      action: "access_request_approved",
      target_type: "profile",
      target_id: authUserId,
      target_email: profile.email,
      details: { profile_name: profile.name },
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Access request approved",
        userId: authUserId,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error) {
    console.error("Error in approve-access-request:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
