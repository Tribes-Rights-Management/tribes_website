import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Sanitize filename: replace spaces with underscores, remove special characters
function sanitizeFilename(str: string): string {
  return str
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .substring(0, 100);
}

// Format date as YYYY-MM-DD
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload = await req.json();
    console.log('Received signature webhook:', JSON.stringify(payload));

    const { 
      envelope_id, 
      event_type, 
      signed_document_url,
      request_id,
      license_id: payloadLicenseId,
      metadata
    } = payload;

    // Extract license_id from various possible locations
    const licenseId = payloadLicenseId || metadata?.license_id;

    // Handle completed/signed events
    if (event_type === 'completed' || event_type === 'signed') {
      let request;
      
      // Priority: license_id > request_id > envelope_id
      if (licenseId) {
        const { data } = await supabase
          .from('license_packages')
          .select('*')
          .eq('license_id', licenseId)
          .single();
        request = data;
      } else if (request_id) {
        const { data } = await supabase
          .from('license_packages')
          .select('*')
          .eq('id', request_id)
          .single();
        request = data;
      } else if (envelope_id) {
        const { data } = await supabase
          .from('license_packages')
          .select('*')
          .eq('signing_envelope_id', envelope_id)
          .single();
        request = data;
      }

      if (!request) {
        console.error('Request not found for:', { licenseId, request_id, envelope_id });
        return new Response(
          JSON.stringify({ error: 'Request not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`Processing signed document for license: ${request.license_id}`);

      const executedAt = new Date().toISOString();
      const trackTitle = sanitizeFilename(request.track_title || request.song_title || 'Unknown');
      const executionDate = formatDate(new Date());

      // Download and store signed document if URL provided
      let storagePath = null;
      
      if (signed_document_url && signed_document_url.startsWith('http')) {
        try {
          const docResponse = await fetch(signed_document_url);
          const docBlob = await docResponse.blob();
          
          // Filename format (locked per spec)
          const filename = `Tribes_License_${request.license_id}_${trackTitle}_${executionDate}.pdf`;
          storagePath = `licenses/${request.license_id}/${filename}`;
          
          const { error: uploadError } = await supabase.storage
            .from('generated-documents')
            .upload(storagePath, docBlob, {
              contentType: 'application/pdf',
              upsert: true,
            });

          if (uploadError) {
            console.error('Error uploading executed document:', uploadError);
            storagePath = null;
          } else {
            console.log(`Executed PDF stored: ${storagePath}`);
          }
        } catch (docError) {
          console.error('Error fetching signed document:', docError);
        }
      }

      // Create executed document record
      if (storagePath) {
        await supabase.from('generated_documents').insert({
          request_id: request.id,
          doc_type: 'executed',
          storage_path: storagePath,
        });
      }

      // Update request
      const updateData: Record<string, unknown> = {
        signature_status: 'completed',
        executed_at: executedAt,
        signed_at: executedAt,
      };

      // Advance to 'done' only if payment is also complete
      if (request.payment_status === 'paid') {
        updateData.status = 'done';
      } else {
        updateData.status = 'awaiting_payment';
      }

      const { error: updateError } = await supabase
        .from('license_packages')
        .update(updateData)
        .eq('id', request.id);

      if (updateError) {
        console.error('Error updating request status:', updateError);
      }

      // Audit log entry with license_id
      await supabase.from('status_history').insert({
        request_id: request.id,
        from_status: request.status,
        to_status: updateData.status as string,
        notes: `Signature completed. License ID: ${request.license_id}`,
      });

      console.log(`License ${request.license_id} signature completed. Status: ${updateData.status}`);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Signature processed successfully',
          license_id: request.license_id,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle declined/voided events
    if (event_type === 'declined' || event_type === 'voided') {
      let request;
      
      if (licenseId) {
        const { data } = await supabase
          .from('license_packages')
          .select('id, status, license_id')
          .eq('license_id', licenseId)
          .single();
        request = data;
      } else if (envelope_id) {
        const { data } = await supabase
          .from('license_packages')
          .select('id, status, license_id')
          .eq('signing_envelope_id', envelope_id)
          .single();
        request = data;
      }

      if (request) {
        await supabase
          .from('license_packages')
          .update({ signature_status: event_type })
          .eq('id', request.id);

        await supabase.from('status_history').insert({
          request_id: request.id,
          from_status: request.status,
          to_status: request.status,
          notes: `Signature ${event_type}. License ID: ${request.license_id}`,
        });

        console.log(`Signature ${event_type} for license: ${request.license_id}`);
      }
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
