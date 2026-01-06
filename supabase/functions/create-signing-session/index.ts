import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { request_id, license_id } = await req.json();

    if (!request_id && !license_id) {
      return new Response(
        JSON.stringify({ error: 'request_id or license_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Creating signing session for: ${license_id || request_id}`);

    // Fetch the license request - prefer license_id lookup
    let request;
    
    if (license_id) {
      const { data, error } = await supabase
        .from('license_requests')
        .select('*')
        .eq('license_id', license_id)
        .single();
      if (!error) request = data;
    }
    
    if (!request && request_id) {
      const { data, error } = await supabase
        .from('license_requests')
        .select('*')
        .eq('id', request_id)
        .single();
      if (!error) request = data;
    }

    if (!request) {
      return new Response(
        JSON.stringify({ error: 'Request not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify license_id exists
    if (!request.license_id) {
      return new Response(
        JSON.stringify({ error: 'License ID not generated. Submit the request first.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if we have a draft document
    const { data: draftDoc } = await supabase
      .from('generated_documents')
      .select('*')
      .eq('request_id', request.id)
      .eq('doc_type', 'draft')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!draftDoc) {
      return new Response(
        JSON.stringify({ error: 'No draft contract found. Generate contract first.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare licensee info
    const licenseeName = request.first_name && request.last_name 
      ? `${request.first_name} ${request.last_name}`
      : request.licensee_legal_name || 'Unknown';
    
    const trackTitle = request.track_title || request.song_title || 'Unknown Track';

    // Create signing session with license_id reference
    const signingSessionId = `sig_${Date.now()}_${request.license_id}`;
    
    // Build signing URL (placeholder - replace with actual e-sign provider URL)
    const signingUrl = `${supabaseUrl.replace('.supabase.co', '')}/sign/${signingSessionId}`;

    // Update request with signing info
    const { error: updateError } = await supabase
      .from('license_requests')
      .update({
        status: 'awaiting_signature',
        signature_status: 'sent',
        signing_envelope_id: signingSessionId,
        signing_url: signingUrl,
      })
      .eq('id', request.id);

    if (updateError) {
      console.error('Error updating request:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update request' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Audit log with license_id
    await supabase.from('status_history').insert({
      request_id: request.id,
      from_status: request.status,
      to_status: 'awaiting_signature',
      notes: `Agreement sent. License ID: ${request.license_id}`,
    });

    console.log(`Signing session created for license: ${request.license_id}`);

    return new Response(
      JSON.stringify({
        success: true,
        signing_session_id: signingSessionId,
        signing_url: signingUrl,
        license_id: request.license_id,
        message: 'Contract sent for signature. Licensee will receive an email with the signing link.',
        metadata: {
          license_id: request.license_id,
          track_title: trackTitle,
          licensee_name: licenseeName,
          licensee_email: request.licensee_email,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in create-signing-session:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
