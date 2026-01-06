import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ExportRequest {
  requestId?: string;
  license_id?: string;
}

function sanitizeFilename(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .replace(/\s+/g, "_")
    .substring(0, 50);
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { requestId, license_id }: ExportRequest = await req.json();

    if (!requestId && !license_id) {
      return new Response(JSON.stringify({ error: "Request ID or License ID required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Fetch the license request - prefer license_id lookup
    let request;
    if (license_id) {
      const { data, error } = await supabase
        .from("license_requests")
        .select("*")
        .eq("license_id", license_id)
        .single();
      if (!error) request = data;
    }
    
    if (!request && requestId) {
      const { data, error } = await supabase
        .from("license_requests")
        .select("*")
        .eq("id", requestId)
        .single();
      if (!error) request = data;
    }

    if (!request) {
      return new Response(JSON.stringify({ error: "License request not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Only allow export for done status
    if (request.status !== "done") {
      return new Response(JSON.stringify({ error: "License must be complete to export" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const licenseId = request.license_id || `TRL-${formatDate(new Date(request.submitted_at || request.created_at)).replace(/-/g, "")}-0000`;
    const trackTitle = sanitizeFilename(request.track_title || request.song_title || "Untitled");
    const executionDate = request.signed_at ? new Date(request.signed_at) : new Date();
    const formattedExecutionDate = formatDate(executionDate);

    // Generate filename
    const filename = `Tribes_License_${licenseId}_${trackTitle}_${formattedExecutionDate}.pdf`;

    // Build licensee name
    const licenseeName = [request.first_name, request.last_name].filter(Boolean).join(" ") || 
                         request.licensee_legal_name || 
                         "Unknown";

    // Generate HTML for PDF
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      margin: 1in;
      @bottom-center {
        content: counter(page);
        font-family: Georgia, serif;
        font-size: 10pt;
      }
    }
    body {
      font-family: Georgia, serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #1a1a1a;
      max-width: 7.5in;
      margin: 0 auto;
    }
    .header {
      text-align: center;
      margin-bottom: 2em;
      padding-bottom: 1em;
      border-bottom: 1px solid #ccc;
    }
    .header h1 {
      font-size: 14pt;
      font-weight: bold;
      margin: 0 0 0.5em 0;
      letter-spacing: 0.05em;
    }
    .header h2 {
      font-size: 12pt;
      font-weight: normal;
      margin: 0 0 1em 0;
    }
    .header-meta {
      font-size: 10pt;
      color: #666;
    }
    .section {
      margin-bottom: 1.5em;
    }
    .section-title {
      font-weight: bold;
      margin-bottom: 0.5em;
    }
    .field {
      margin-bottom: 0.75em;
    }
    .field-label {
      font-weight: bold;
      display: inline;
    }
    .field-value {
      display: inline;
    }
    .signature-block {
      margin-top: 3em;
      padding-top: 1em;
      border-top: 1px solid #ccc;
    }
    .signature-line {
      border-bottom: 1px solid #1a1a1a;
      width: 250px;
      margin: 2em 0 0.25em 0;
    }
    .signature-label {
      font-size: 10pt;
      color: #666;
    }
    .footer {
      margin-top: 3em;
      padding-top: 1em;
      border-top: 1px solid #ccc;
      font-size: 9pt;
      color: #666;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>TRIBES RIGHTS MANAGEMENT LLC</h1>
    <h2>Mechanical &amp; DPD License Agreement</h2>
    <div class="header-meta">
      <div>License ID: ${licenseId}</div>
      <div>Execution Date: ${executionDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">1. Parties</div>
    <div class="field">
      <span class="field-label">Licensor:</span>
      <span class="field-value">Tribes Rights Management LLC</span>
    </div>
    <div class="field">
      <span class="field-label">Licensee:</span>
      <span class="field-value">${licenseeName}${request.organization ? ` (${request.organization})` : ""}</span>
    </div>
  </div>

  <div class="section">
    <div class="section-title">2. Licensed Work</div>
    <div class="field">
      <span class="field-label">Track Title:</span>
      <span class="field-value">${request.track_title || "—"}</span>
    </div>
    <div class="field">
      <span class="field-label">Track Artist:</span>
      <span class="field-value">${request.track_artist || "—"}</span>
    </div>
    <div class="field">
      <span class="field-label">ISRC:</span>
      <span class="field-value">${request.track_isrc || "—"}</span>
    </div>
    <div class="field">
      <span class="field-label">Runtime:</span>
      <span class="field-value">${request.runtime || "—"}</span>
    </div>
  </div>

  <div class="section">
    <div class="section-title">3. Product Details</div>
    <div class="field">
      <span class="field-label">Recording Artist:</span>
      <span class="field-value">${request.recording_artist || "—"}</span>
    </div>
    <div class="field">
      <span class="field-label">Release Title:</span>
      <span class="field-value">${request.release_title || "—"}</span>
    </div>
    <div class="field">
      <span class="field-label">Label / Master Owner:</span>
      <span class="field-value">${request.label_master_owner || "—"}</span>
    </div>
    <div class="field">
      <span class="field-label">Distributor:</span>
      <span class="field-value">${request.distributor || "—"}</span>
    </div>
    <div class="field">
      <span class="field-label">Release Date:</span>
      <span class="field-value">${request.release_date ? new Date(request.release_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—"}</span>
    </div>
    <div class="field">
      <span class="field-label">UPC:</span>
      <span class="field-value">${request.product_upc || "—"}</span>
    </div>
  </div>

  <div class="section">
    <div class="section-title">4. License Terms</div>
    <div class="field">
      <span class="field-label">Territory:</span>
      <span class="field-value">${request.territory || "Worldwide"}</span>
    </div>
    <div class="field">
      <span class="field-label">Term:</span>
      <span class="field-value">${request.term || "Perpetual"}</span>
    </div>
    <div class="field">
      <span class="field-label">License Fee:</span>
      <span class="field-value">${request.proposed_fee ? `${request.currency || "USD"} ${request.proposed_fee.toLocaleString()}` : "—"}</span>
    </div>
  </div>

  <div class="signature-block">
    <div class="section-title">5. Execution</div>
    <div class="field">
      <span class="field-label">Licensee Name:</span>
      <span class="field-value">${licenseeName}</span>
    </div>
    ${request.organization ? `<div class="field"><span class="field-label">Company:</span><span class="field-value">${request.organization}</span></div>` : ""}
    <div class="signature-line"></div>
    <div class="signature-label">Signature</div>
    <div class="field" style="margin-top: 1em;">
      <span class="field-label">Date:</span>
      <span class="field-value">${executionDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
    </div>
  </div>

  <div class="footer">
    <div>© 2026 Tribes Rights Management LLC. All rights reserved.</div>
  </div>
</body>
</html>`;

    // Return HTML with metadata for client-side PDF generation
    // In production, integrate with a PDF generation service
    return new Response(
      JSON.stringify({
        html: htmlContent,
        filename: filename,
        metadata: {
          licenseId: licenseId,
          trackTitle: request.track_title || request.song_title || "Untitled",
          licenseeName: licenseeName,
          executionDate: formattedExecutionDate,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error generating PDF:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
