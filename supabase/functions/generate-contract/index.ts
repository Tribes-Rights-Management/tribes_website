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

    let contractHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Tribes Rights Licensing - Music Synchronization License Agreement</title>
  <style>
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 12pt;
      line-height: 1.6;
      max-width: 8.5in;
      margin: 0 auto;
      padding: 0.75in;
    }
    .header {
      text-align: center;
      margin-bottom: 24pt;
      padding-bottom: 12pt;
      border-bottom: 1px solid #ccc;
    }
    .header h1 {
      font-size: 14pt;
      font-weight: bold;
      margin: 0 0 6pt 0;
      letter-spacing: 1px;
    }
    .header p {
      font-size: 10pt;
      color: #666;
      margin: 0;
    }
    h2.doc-title {
      text-align: center;
      font-size: 16pt;
      margin: 24pt 0;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    h3 {
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
    .footer {
      text-align: center;
      font-size: 9pt;
      color: #666;
      margin-top: 48pt;
      padding-top: 12pt;
      border-top: 1px solid #ccc;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>TRIBES RIGHTS LICENSING</h1>
    <p>Music Synchronization Rights Management</p>
  </div>
  <h2 class="doc-title">Music Synchronization License Agreement</h2>
`;

    for (const clause of clauses as Clause[]) {
      let bodyText = clause.body_text;
      
      for (const [key, value] of Object.entries(placeholderValues)) {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        bodyText = bodyText.replace(regex, value);
      }

      contractHtml += `
  <h3>${clause.sort_order}. ${clause.title}</h3>
  <p>${bodyText.replace(/\n/g, '</p><p>')}</p>
`;
    }

    contractHtml += `
  <div class="footer">
    <p>This agreement is administered by Tribes Rights Licensing</p>
    <p>Document generated on ${new Date().toLocaleDateString()}</p>
  </div>
</body>
</html>`;

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

    const { data: urlData } = supabase.storage
      .from('generated-documents')
      .getPublicUrl(fileName);

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
