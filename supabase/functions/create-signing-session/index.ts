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

    const { request_id } = await req.json();

    if (!request_id) {
      return new Response(
        JSON.stringify({ error: 'request_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Creating signing session for request: ${request_id}`);

    // Fetch the license request
    const { data: request, error: requestError } = await supabase
      .from('license_requests')
      .select('*')
      .eq('id', request_id)
      .single();

    if (requestError || !request) {
      return new Response(
        JSON.stringify({ error: 'Request not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if we have a draft document
    const { data: draftDoc } = await supabase
      .from('generated_documents')
      .select('*')
      .eq('request_id', request_id)
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

    // TODO: Integrate with actual e-signature provider (DocuSign, HelloSign, etc.)
    // For MVP, we'll create a placeholder signing URL
    // In production, you would:
    // 1. Upload the document to the e-sign provider
    // 2. Create an envelope/signing request
    // 3. Get the signing URL back
    // 4. Set up webhook for completion

    const mockSigningSessionId = `sig_${Date.now()}_${request_id.slice(0, 8)}`;
    const mockSigningUrl = `${supabaseUrl.replace('.supabase.co', '')}/sign/${mockSigningSessionId}`;

    // Update request with signing info
    const { error: updateError } = await supabase
      .from('license_requests')
      .update({
        status: 'sent_for_signature',
        signing_envelope_id: mockSigningSessionId,
        signing_url: mockSigningUrl,
      })
      .eq('id', request_id);

    if (updateError) {
      console.error('Error updating request:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update request' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Add to status history
    await supabase.from('status_history').insert({
      request_id: request_id,
      from_status: request.status,
      to_status: 'sent_for_signature',
      notes: 'Contract sent for signature',
    });

    console.log(`Signing session created: ${mockSigningSessionId}`);

    // TODO: Send email to licensee with signing link
    // You would call your email service here (Resend, SendGrid, etc.)

    return new Response(
      JSON.stringify({
        success: true,
        signing_session_id: mockSigningSessionId,
        signing_url: mockSigningUrl,
        message: 'Contract sent for signature. Licensee will receive an email with the signing link.',
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
