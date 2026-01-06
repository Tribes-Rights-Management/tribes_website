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
    const pandadocApiKey = Deno.env.get('PANDADOC_API_KEY');
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload = await req.json();
    console.log('Received PandaDoc webhook:', JSON.stringify(payload));

    const eventType = payload.event || payload[0]?.event;
    const docData = payload.data || payload[0]?.data || {};
    const documentId = docData.id;
    const metadata = docData.metadata || {};

    if (!documentId) {
      console.error('No document ID in webhook payload');
      return new Response(
        JSON.stringify({ error: 'No document ID' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing PandaDoc event: ${eventType} for document: ${documentId}`);

    // Find the license by pandadoc_document_id or metadata.license_id
    let request;
    
    if (metadata.license_id) {
      const { data } = await supabase
        .from('license_packages')
        .select('*')
        .eq('license_id', metadata.license_id)
        .single();
      request = data;
    }
    
    if (!request) {
      const { data } = await supabase
        .from('license_packages')
        .select('*')
        .eq('pandadoc_document_id', documentId)
        .single();
      request = data;
    }

    if (!request) {
      console.error('License not found for document:', documentId);
      return new Response(
        JSON.stringify({ error: 'License not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle document.completed (signed)
    if (eventType === 'document_state_changed' && docData.status === 'document.completed') {
      console.log(`Document completed for license: ${request.license_id}`);

      const executedAt = new Date().toISOString();

      // Update signature status
      const updateData: Record<string, unknown> = {
        signature_status: 'completed',
        executed_at: executedAt,
        signed_at: executedAt,
      };

      // Check if payment is also complete to advance to 'done'
      if (request.payment_status === 'paid') {
        updateData.status = 'done';
      } else {
        updateData.status = 'awaiting_payment';
      }

      await supabase
        .from('license_packages')
        .update(updateData)
        .eq('id', request.id);

      // Audit log
      await supabase.from('status_history').insert({
        request_id: request.id,
        from_status: request.status,
        to_status: updateData.status as string,
        notes: `Signature completed. License ID: ${request.license_id}`,
      });

      console.log(`Signature processed for license ${request.license_id}. Status: ${updateData.status}`);
    }

    // Handle document.paid (if using PandaDoc payments)
    if (eventType === 'document_state_changed' && docData.status === 'document.paid') {
      console.log(`Document paid for license: ${request.license_id}`);

      const updateData: Record<string, unknown> = {
        payment_status: 'paid',
        paid_at: new Date().toISOString(),
      };

      // Check if signature is also complete
      if (request.signature_status === 'completed') {
        updateData.status = 'done';
      }

      await supabase
        .from('license_packages')
        .update(updateData)
        .eq('id', request.id);

      await supabase.from('status_history').insert({
        request_id: request.id,
        from_status: request.status,
        to_status: updateData.status as string || request.status,
        notes: `Payment completed via PandaDoc. License ID: ${request.license_id}`,
      });
    }

    // Handle PDF ready - download and store
    if (eventType === 'document_state_changed' && (docData.status === 'document.completed' || payload.event === 'recipient_completed')) {
      // Wait a moment for PDF to be generated
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (pandadocApiKey) {
        try {
          // Download the executed PDF
          const pdfResponse = await fetch(
            `https://api.pandadoc.com/public/v1/documents/${documentId}/download`,
            {
              headers: {
                'Authorization': `API-Key ${pandadocApiKey}`,
              },
            }
          );

          if (pdfResponse.ok) {
            const pdfBlob = await pdfResponse.blob();
            const executionDate = formatDate(new Date());
            const trackTitle = sanitizeFilename(request.track_title || request.song_title || 'Unknown');
            
            // Filename format (locked per spec)
            const filename = `Tribes_License_${request.license_id}_${trackTitle}_${executionDate}.pdf`;
            const storagePath = `licenses/${request.license_id}/${filename}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
              .from('generated-documents')
              .upload(storagePath, pdfBlob, {
                contentType: 'application/pdf',
                upsert: true,
              });

            if (uploadError) {
              console.error('Error uploading PDF:', uploadError);
            } else {
              console.log(`Executed PDF stored: ${storagePath}`);

              // Create document record
              await supabase.from('generated_documents').insert({
                request_id: request.id,
                doc_type: 'executed',
                storage_path: storagePath,
              });
            }
          }
        } catch (pdfError) {
          console.error('Error downloading PDF:', pdfError);
        }
      }
    }

    // Handle declined/voided
    if (eventType === 'document_state_changed' && 
        (docData.status === 'document.declined' || docData.status === 'document.voided')) {
      
      const newStatus = docData.status === 'document.declined' ? 'declined' : 'voided';
      
      await supabase
        .from('license_packages')
        .update({
          signature_status: newStatus,
        })
        .eq('id', request.id);

      await supabase.from('status_history').insert({
        request_id: request.id,
        from_status: request.status,
        to_status: request.status,
        notes: `Document ${newStatus}. License ID: ${request.license_id}`,
      });

      console.log(`Document ${newStatus} for license ${request.license_id}`);
    }

    return new Response(
      JSON.stringify({ received: true, license_id: request.license_id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in pandadoc-webhook:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
