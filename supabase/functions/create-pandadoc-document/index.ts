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
    const pandadocApiKey = Deno.env.get('PANDADOC_API_KEY');
    const defaultTemplateId = Deno.env.get('PANDADOC_TEMPLATE_ID');
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { license_id } = await req.json();

    if (!license_id) {
      return new Response(
        JSON.stringify({ error: 'license_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Creating PandaDoc document for license: ${license_id}`);

    // Fetch the license request by license_id
    const { data: request, error: requestError } = await supabase
      .from('license_packages')
      .select('*')
      .eq('license_id', license_id)
      .single();

    if (requestError || !request) {
      console.error('License not found:', license_id);
      return new Response(
        JSON.stringify({ error: 'License not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify license is approved
    if (request.status !== 'approved' && request.status !== 'awaiting_signature') {
      return new Response(
        JSON.stringify({ error: 'License must be approved before creating document' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare common data
    const licenseeName = request.first_name && request.last_name 
      ? `${request.first_name} ${request.last_name}`
      : request.licensee_legal_name || 'Unknown';
    
    const trackTitle = request.track_title || request.song_title || 'Unknown Track';
    const licenseFee = request.license_fee || request.proposed_fee || 0;

    // Get license type configuration for PandaDoc template selection
    let templateId = defaultTemplateId;
    let licenseTypeName = 'Standard';
    
    if (request.license_type) {
      const { data: licenseType } = await supabase
        .from('license_types')
        .select('pandadoc_template_id, name')
        .eq('code', request.license_type)
        .eq('is_active', true)
        .single();
      
      if (licenseType) {
        // Use license-type-specific template if configured
        if (licenseType.pandadoc_template_id) {
          templateId = licenseType.pandadoc_template_id;
        }
        licenseTypeName = licenseType.name;
      }
    }

    // Check if PandaDoc is configured
    if (!pandadocApiKey || !templateId) {
      console.log('PandaDoc not configured - returning mock document');
      
      const mockDocId = `mock_doc_${Date.now()}`;
      
      await supabase
        .from('license_packages')
        .update({
          pandadoc_document_id: mockDocId,
          signature_status: 'sent',
          status: 'awaiting_signature',
        })
        .eq('id', request.id);

      await supabase.from('status_history').insert({
        request_id: request.id,
        from_status: request.status,
        to_status: 'awaiting_signature',
        notes: `Agreement sent (mock). License ID: ${license_id}. Type: ${request.license_type || 'default'}`,
      });

      return new Response(
        JSON.stringify({
          success: true,
          document_id: mockDocId,
          message: 'PandaDoc not configured. Using mock document.',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Document name format (locked per spec)
    const documentName = `Tribes License — ${request.license_id} — ${trackTitle}`;

    // Prepare template variables (minimum required per spec + license_type for internal reference)
    const tokens = [
      { name: 'license_id', value: request.license_id },
      { name: 'execution_date', value: '' }, // Populated at completion
      { name: 'track_title', value: trackTitle },
      { name: 'licensee_legal_name', value: licenseeName },
      { name: 'licensee_email', value: request.licensee_email || '' },
      { name: 'license_fee', value: `$${licenseFee.toLocaleString()}` },
      { name: 'license_type', value: licenseTypeName }, // Internal reference
    ];

    // Create PandaDoc document from template
    const createResponse = await fetch('https://api.pandadoc.com/public/v1/documents', {
      method: 'POST',
      headers: {
        'Authorization': `API-Key ${pandadocApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: documentName,
        template_uuid: templateId,
        recipients: [
          {
            email: request.licensee_email,
            first_name: request.first_name || '',
            last_name: request.last_name || '',
            role: 'Licensee',
          },
        ],
        tokens,
        metadata: {
          license_id: request.license_id,
          request_id: request.id,
          license_type: request.license_type || 'default',
        },
        parse_form_fields: false,
      }),
    });

    if (!createResponse.ok) {
      const error = await createResponse.text();
      console.error('PandaDoc API error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to create PandaDoc document' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const docData = await createResponse.json();
    console.log(`PandaDoc document created: ${docData.id} for license: ${request.license_id} (type: ${request.license_type || 'default'})`);

    // Update license request
    await supabase
      .from('license_packages')
      .update({
        pandadoc_document_id: docData.id,
        signature_status: 'sent',
        status: 'awaiting_signature',
      })
      .eq('id', request.id);

    // Audit log entry
    await supabase.from('status_history').insert({
      request_id: request.id,
      from_status: request.status,
      to_status: 'awaiting_signature',
      notes: `Agreement sent. License ID: ${request.license_id}. Type: ${request.license_type || 'default'}. PandaDoc: ${docData.id}`,
    });

    return new Response(
      JSON.stringify({
        success: true,
        document_id: docData.id,
        document_name: documentName,
        license_id: request.license_id,
        license_type: request.license_type || 'default',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in create-pandadoc-document:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
