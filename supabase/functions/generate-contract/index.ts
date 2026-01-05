import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Clause {
  id: string;
  sort_order: number;
  title: string;
  body_text: string;
  placeholders: string[];
}

serve(async (req) => {
  // Handle CORS preflight
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

    console.log(`Generating contract for request: ${request_id}`);

    // Fetch the license request
    const { data: request, error: requestError } = await supabase
      .from('license_requests')
      .select('*')
      .eq('id', request_id)
      .single();

    if (requestError || !request) {
      console.error('Error fetching request:', requestError);
      return new Response(
        JSON.stringify({ error: 'Request not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch all clauses ordered
    const { data: clauses, error: clausesError } = await supabase
      .from('clauses')
      .select('*')
      .order('sort_order', { ascending: true });

    if (clausesError || !clauses) {
      console.error('Error fetching clauses:', clausesError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch clauses' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build placeholder values from request data
    const today = new Date().toISOString().split('T')[0];
    const placeholderValues: Record<string, string> = {
      effective_date: today,
      licensee_name: request.licensee_legal_name || '',
      song_title: request.song_title || '',
      writers_publishers: request.writers_publishers || 'TBD',
      project_title: request.project_title || '',
      media_type: request.media_type || '',
      usage_description: request.usage_description || '',
      territory: request.territory || '',
      term: request.term || '',
      start_date: request.usage_start_date || today,
      fee_amount: request.proposed_fee ? Number(request.proposed_fee).toLocaleString() : 'TBD',
      currency: request.currency || 'USD',
    };

    // Generate contract HTML by merging placeholders
    let contractHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Music Synchronization License Agreement</title>
  <style>
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 12pt;
      line-height: 1.6;
      max-width: 8.5in;
      margin: 1in auto;
      padding: 0 0.5in;
    }
    h1 {
      text-align: center;
      font-size: 16pt;
      margin-bottom: 24pt;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    h2 {
      font-size: 12pt;
      margin-top: 18pt;
      margin-bottom: 6pt;
      text-transform: uppercase;
    }
    p {
      text-align: justify;
      margin-bottom: 12pt;
    }
    .signature-block {
      margin-top: 48pt;
      page-break-inside: avoid;
    }
  </style>
</head>
<body>
  <h1>Music Synchronization License Agreement</h1>
`;

    // Process each clause
    for (const clause of clauses as Clause[]) {
      let bodyText = clause.body_text;
      
      // Replace all placeholders
      for (const [key, value] of Object.entries(placeholderValues)) {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        bodyText = bodyText.replace(regex, value);
      }

      contractHtml += `
  <h2>${clause.sort_order}. ${clause.title}</h2>
  <p>${bodyText.replace(/\n/g, '</p><p>')}</p>
`;
    }

    contractHtml += `
</body>
</html>`;

    // Store the contract in Supabase Storage
    const fileName = `${request.user_id}/${request_id}/contract-draft-${Date.now()}.html`;
    
    const { error: uploadError } = await supabase.storage
      .from('generated-documents')
      .upload(fileName, contractHtml, {
        contentType: 'text/html',
        upsert: true,
      });

    if (uploadError) {
      console.error('Error uploading contract:', uploadError);
      return new Response(
        JSON.stringify({ error: 'Failed to store contract' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get public URL for the document
    const { data: urlData } = supabase.storage
      .from('generated-documents')
      .getPublicUrl(fileName);

    // Insert record into generated_documents
    const { data: doc, error: docError } = await supabase
      .from('generated_documents')
      .insert({
        request_id: request_id,
        doc_type: 'draft',
        storage_path: urlData.publicUrl,
      })
      .select()
      .single();

    if (docError) {
      console.error('Error creating document record:', docError);
    }

    console.log(`Contract generated successfully: ${fileName}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        document_id: doc?.id,
        storage_path: urlData.publicUrl 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in generate-contract:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
