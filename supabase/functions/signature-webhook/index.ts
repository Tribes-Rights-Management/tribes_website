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

    // Parse webhook payload
    // Different e-sign providers have different payload formats
    // This is a generic example that you'd adapt to your provider
    const payload = await req.json();
    
    console.log('Received signature webhook:', JSON.stringify(payload));

    const { 
      envelope_id, 
      event_type, 
      signed_document_url,
      request_id 
    } = payload;

    // Handle different event types
    if (event_type === 'completed' || event_type === 'signed') {
      // Find the request by envelope ID
      let requestData;
      
      if (request_id) {
        const { data } = await supabase
          .from('license_requests')
          .select('*')
          .eq('id', request_id)
          .single();
        requestData = data;
      } else if (envelope_id) {
        const { data } = await supabase
          .from('license_requests')
          .select('*')
          .eq('signing_envelope_id', envelope_id)
          .single();
        requestData = data;
      }

      if (!requestData) {
        console.error('Request not found for envelope:', envelope_id);
        return new Response(
          JSON.stringify({ error: 'Request not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`Processing signed document for request: ${requestData.id}`);

      // If a signed document URL is provided, download and store it
      let executedDocPath = signed_document_url;
      
      if (signed_document_url && signed_document_url.startsWith('http')) {
        try {
          // Fetch the signed document from the e-sign provider
          const docResponse = await fetch(signed_document_url);
          const docBlob = await docResponse.blob();
          
          // Store in Supabase Storage
          const fileName = `${requestData.user_id}/${requestData.id}/contract-executed-${Date.now()}.pdf`;
          
          const { error: uploadError } = await supabase.storage
            .from('generated-documents')
            .upload(fileName, docBlob, {
              contentType: 'application/pdf',
              upsert: true,
            });

          if (uploadError) {
            console.error('Error uploading executed document:', uploadError);
          } else {
            const { data: urlData } = supabase.storage
              .from('generated-documents')
              .getPublicUrl(fileName);
            executedDocPath = urlData.publicUrl;
          }
        } catch (docError) {
          console.error('Error fetching signed document:', docError);
        }
      }

      // Create executed document record
      if (executedDocPath) {
        await supabase.from('generated_documents').insert({
          request_id: requestData.id,
          doc_type: 'executed',
          storage_path: executedDocPath,
        });
      }

      // Update request status to executed
      const { error: updateError } = await supabase
        .from('license_requests')
        .update({
          status: 'executed',
          signed_at: new Date().toISOString(),
        })
        .eq('id', requestData.id);

      if (updateError) {
        console.error('Error updating request status:', updateError);
      }

      // Add to status history
      await supabase.from('status_history').insert({
        request_id: requestData.id,
        from_status: 'sent_for_signature',
        to_status: 'executed',
        notes: 'Contract signed and executed',
      });

      console.log(`Request ${requestData.id} marked as executed`);

      // TODO: Send confirmation email to user
      // You would call your email service here

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Signature processed successfully',
          request_id: requestData.id,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle other event types (declined, expired, etc.)
    if (event_type === 'declined' || event_type === 'voided') {
      console.log(`Signature ${event_type} for envelope: ${envelope_id}`);
      // You might want to update status or notify admin
    }

    return new Response(
      JSON.stringify({ received: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in signature-webhook:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
