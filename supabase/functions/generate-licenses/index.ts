import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LicenseType {
  code: string;
  name: string;
  base_fee: number | null;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { request_id } = await req.json();
    
    if (!request_id) {
      return new Response(
        JSON.stringify({ error: "request_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Generating licenses for request: ${request_id}`);

    // Fetch the license request
    const { data: request, error: requestError } = await supabase
      .from("license_requests")
      .select("*")
      .eq("id", request_id)
      .single();

    if (requestError || !request) {
      console.error("Request not found:", requestError);
      return new Response(
        JSON.stringify({ error: "License request not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate status - only generate on approval
    if (request.status !== "approved" && request.status !== "in_review") {
      return new Response(
        JSON.stringify({ error: `Cannot generate licenses for status: ${request.status}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const selectedTypes: string[] = request.selected_license_types || [];
    
    if (selectedTypes.length === 0) {
      return new Response(
        JSON.stringify({ error: "No license types selected" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch license type details
    const { data: licenseTypes, error: typesError } = await supabase
      .from("license_types")
      .select("code, name, base_fee")
      .in("code", selectedTypes);

    if (typesError) {
      console.error("Error fetching license types:", typesError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch license types" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if licenses already exist for this request
    const { data: existingLicenses } = await supabase
      .from("licenses")
      .select("id, license_type_code")
      .eq("request_id", request_id);

    if (existingLicenses && existingLicenses.length > 0) {
      console.log(`Licenses already exist for request ${request_id}`);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Licenses already generated",
          licenses: existingLicenses 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate license IDs and create licenses
    const createdLicenses = [];
    let totalFee = 0;

    for (const typeCode of selectedTypes) {
      const licenseType = licenseTypes?.find((t: LicenseType) => t.code === typeCode);
      
      // Generate unique license ID using versioned function
      const { data: newLicenseId, error: idError } = await supabase
        .rpc("generate_license_id_v2");

      if (idError) {
        console.error("Error generating license ID:", idError);
        throw new Error("Failed to generate license ID");
      }

      const fee = licenseType?.base_fee || 0;
      totalFee += fee;

      const license = {
        license_id: newLicenseId,
        request_id: request_id,
        license_type_code: typeCode,
        term: request.term || "Perpetual",
        territory: request.territory || "Worldwide",
        fee: fee,
        status: "approved",
      };

      const { data: createdLicense, error: insertError } = await supabase
        .from("licenses")
        .insert(license)
        .select()
        .single();

      if (insertError) {
        console.error("Error creating license:", insertError);
        throw new Error(`Failed to create license for type: ${typeCode}`);
      }

      createdLicenses.push({
        id: createdLicense.id,
        license_id: newLicenseId,
        type: licenseType?.name || typeCode,
        fee: fee,
      });

      console.log(`Created license ${newLicenseId} for type ${typeCode}`);
    }

    // Update the request with the first license ID as package reference
    const packageReference = createdLicenses[0]?.license_id;
    
    await supabase
      .from("license_requests")
      .update({ 
        package_reference: packageReference,
        license_fee: totalFee,
        status: "approved"
      })
      .eq("id", request_id);

    console.log(`Successfully generated ${createdLicenses.length} licenses for request ${request_id}`);

    return new Response(
      JSON.stringify({
        success: true,
        package_reference: packageReference,
        total_fee: totalFee,
        licenses: createdLicenses,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error generating licenses:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
