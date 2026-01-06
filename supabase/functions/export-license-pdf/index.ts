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

interface License {
  id: string;
  license_id: string;
  license_type_code: string;
  term: string | null;
  territory: string | null;
  fee: number | null;
  grant_of_rights: string | null;
  restrictions: string | null;
  status: string;
}

interface LicenseType {
  code: string;
  name: string;
  description: string | null;
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

    // Fetch the license request
    let request;
    if (license_id) {
      const { data, error } = await supabase
        .from("license_packages")
        .select("*")
        .eq("license_id", license_id)
        .single();
      if (!error) request = data;
    }
    
    if (!request && requestId) {
      const { data, error } = await supabase
        .from("license_packages")
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

    // Fetch individual licenses for this request
    const { data: licenses } = await supabase
      .from("licenses")
      .select("*")
      .eq("request_id", request.id)
      .order("created_at");

    // Fetch license types for display names
    const { data: licenseTypes } = await supabase
      .from("license_types")
      .select("code, name, description")
      .eq("is_active", true);

    const licenseTypeMap = new Map<string, LicenseType>();
    (licenseTypes || []).forEach((t: LicenseType) => licenseTypeMap.set(t.code, t));

    // Use package_reference or first license ID
    const packageReference = request.package_reference || 
      (licenses && licenses.length > 0 ? licenses[0].license_id : null) ||
      `TRL-${formatDate(new Date(request.submitted_at || request.created_at)).replace(/-/g, "")}-PKG`;
    
    const trackTitle = sanitizeFilename(request.track_title || request.song_title || "Untitled");
    const executionDate = request.executed_at ? new Date(request.executed_at) : 
                          request.signed_at ? new Date(request.signed_at) : new Date();
    const formattedExecutionDate = formatDate(executionDate);

    // Generate filename
    const filename = `Tribes_License_${packageReference}_${trackTitle}_${formattedExecutionDate}.pdf`;

    // Build licensee info
    const licenseeName = [request.first_name, request.last_name].filter(Boolean).join(" ") || 
                         request.licensee_legal_name || 
                         "Unknown";
    
    const licenseeAddress = [
      request.address_street,
      [request.address_city, request.address_state, request.address_zip].filter(Boolean).join(", "),
      request.address_country
    ].filter(Boolean).join("\n");

    // Calculate total fee
    const totalFee = licenses?.reduce((sum: number, l: License) => sum + (l.fee || 0), 0) || request.license_fee || 0;

    // Generate license table rows
    const licenseTableRows = (licenses || []).map((l: License) => {
      const typeName = licenseTypeMap.get(l.license_type_code)?.name || l.license_type_code;
      return `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e5e5e5;">${l.license_id}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e5e5;">${typeName}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e5e5;">${l.term || "Perpetual"}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e5e5;">${l.territory || "Worldwide"}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e5e5; text-align: right;">${l.fee ? `$${l.fee.toFixed(2)}` : "—"}</td>
        </tr>
      `;
    }).join("");

    // Generate individual license pages
    const individualLicensePages = (licenses || []).map((l: License, index: number) => {
      const typeName = licenseTypeMap.get(l.license_type_code)?.name || l.license_type_code;
      const typeDescription = licenseTypeMap.get(l.license_type_code)?.description || "";
      
      return `
        <div class="page-break"></div>
        <div class="license-page">
          <div class="license-header">
            <h2>License Grant — ${typeName}</h2>
            <div class="license-id">License ID: ${l.license_id}</div>
          </div>

          <div class="section">
            <div class="section-title">Grant of Rights</div>
            <p>${l.grant_of_rights || `Licensor hereby grants to Licensee a non-exclusive license to use the Composition as specified in this ${typeName}.`}</p>
            ${typeDescription ? `<p class="type-description">${typeDescription}</p>` : ""}
          </div>

          <div class="section">
            <div class="section-title">Licensed Work</div>
            <div class="field"><span class="field-label">Track Title:</span> ${request.track_title || "—"}</div>
            <div class="field"><span class="field-label">Track Artist:</span> ${request.track_artist || "—"}</div>
            <div class="field"><span class="field-label">ISRC:</span> ${request.track_isrc || "—"}</div>
            <div class="field"><span class="field-label">Runtime:</span> ${request.runtime || "—"}</div>
          </div>

          <div class="section">
            <div class="section-title">Terms</div>
            <div class="field"><span class="field-label">Territory:</span> ${l.territory || "Worldwide"}</div>
            <div class="field"><span class="field-label">Term:</span> ${l.term || "Perpetual"}</div>
            <div class="field"><span class="field-label">License Fee:</span> ${l.fee ? `$${l.fee.toFixed(2)}` : "—"}</div>
          </div>

          ${l.restrictions ? `
          <div class="section">
            <div class="section-title">Restrictions</div>
            <p>${l.restrictions}</p>
          </div>
          ` : ""}

          <div class="license-footer">
            <p>This License Grant is part of License Package executed on ${executionDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}.</p>
          </div>
        </div>
      `;
    }).join("");

    // Generate complete HTML document
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
      line-height: 1.6;
      color: #1a1a1a;
      max-width: 7.5in;
      margin: 0 auto;
    }
    .page-break {
      page-break-before: always;
    }
    .cover-page {
      min-height: 100vh;
    }
    .cover-header {
      text-align: center;
      margin-bottom: 3em;
      padding-bottom: 2em;
      border-bottom: 2px solid #1a1a1a;
    }
    .cover-header h1 {
      font-size: 18pt;
      font-weight: bold;
      margin: 0 0 0.5em 0;
      letter-spacing: 0.1em;
    }
    .cover-header h2 {
      font-size: 14pt;
      font-weight: normal;
      margin: 0 0 1.5em 0;
    }
    .cover-header .package-ref {
      font-size: 11pt;
      color: #666;
      font-family: 'Courier New', monospace;
    }
    .section {
      margin-bottom: 2em;
    }
    .section-title {
      font-weight: bold;
      font-size: 12pt;
      margin-bottom: 0.75em;
      padding-bottom: 0.25em;
      border-bottom: 1px solid #ccc;
    }
    .field {
      margin-bottom: 0.5em;
    }
    .field-label {
      font-weight: bold;
    }
    .parties-grid {
      display: flex;
      gap: 2em;
    }
    .party {
      flex: 1;
    }
    .party-name {
      font-weight: bold;
      margin-bottom: 0.25em;
    }
    .party-address {
      white-space: pre-line;
      font-size: 10pt;
      color: #444;
    }
    .license-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10pt;
      margin-top: 1em;
    }
    .license-table th {
      text-align: left;
      padding: 8px;
      border-bottom: 2px solid #1a1a1a;
      font-weight: bold;
    }
    .license-table th:last-child {
      text-align: right;
    }
    .total-row {
      font-weight: bold;
      border-top: 2px solid #1a1a1a;
    }
    .total-row td {
      padding-top: 12px;
    }
    .legal-notice {
      margin-top: 2em;
      padding: 1.5em;
      background: #f9f9f9;
      border: 1px solid #e5e5e5;
      font-size: 10pt;
      line-height: 1.5;
    }
    .license-page {
      min-height: 90vh;
    }
    .license-header {
      margin-bottom: 2em;
      padding-bottom: 1em;
      border-bottom: 1px solid #ccc;
    }
    .license-header h2 {
      font-size: 14pt;
      margin: 0 0 0.5em 0;
    }
    .license-id {
      font-family: 'Courier New', monospace;
      font-size: 11pt;
      color: #666;
    }
    .type-description {
      font-style: italic;
      color: #666;
      margin-top: 0.5em;
    }
    .license-footer {
      margin-top: 3em;
      padding-top: 1em;
      border-top: 1px solid #ccc;
      font-size: 10pt;
      color: #666;
    }
    .signature-page {
      min-height: 80vh;
    }
    .signature-block {
      margin-top: 3em;
    }
    .signature-line {
      border-bottom: 1px solid #1a1a1a;
      width: 300px;
      margin: 3em 0 0.25em 0;
    }
    .signature-label {
      font-size: 10pt;
      color: #666;
    }
    .execution-date {
      margin-top: 2em;
    }
    .footer {
      margin-top: 4em;
      padding-top: 1em;
      border-top: 1px solid #ccc;
      font-size: 9pt;
      color: #666;
      text-align: center;
    }
  </style>
</head>
<body>
  <!-- COVER PAGE -->
  <div class="cover-page">
    <div class="cover-header">
      <h1>TRIBES RIGHTS MANAGEMENT LLC</h1>
      <h2>Music Synchronization License Agreement</h2>
      <div class="package-ref">Package Reference: ${packageReference}</div>
    </div>

    <div class="section">
      <div class="section-title">Parties</div>
      <div class="parties-grid">
        <div class="party">
          <div class="party-name">Licensor</div>
          <div class="party-address">Tribes Rights Management LLC</div>
        </div>
        <div class="party">
          <div class="party-name">Licensee</div>
          <div class="party-address">${licenseeName}${request.organization ? `\n${request.organization}` : ""}${licenseeAddress ? `\n${licenseeAddress}` : ""}</div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Composition</div>
      <div class="field"><span class="field-label">Title:</span> ${request.track_title || "—"}</div>
      <div class="field"><span class="field-label">Artist:</span> ${request.track_artist || "—"}</div>
      <div class="field"><span class="field-label">Writers/Publishers:</span> ${request.writers_publishers || "As registered with applicable PROs"}</div>
    </div>

    <div class="section">
      <div class="section-title">Execution Date</div>
      <p>${executionDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
    </div>

    <div class="section">
      <div class="section-title">License Grants</div>
      <table class="license-table">
        <thead>
          <tr>
            <th>License ID</th>
            <th>Type</th>
            <th>Term</th>
            <th>Territory</th>
            <th>Fee</th>
          </tr>
        </thead>
        <tbody>
          ${licenseTableRows}
          <tr class="total-row">
            <td colspan="4">Total License Fee</td>
            <td style="text-align: right;">$${totalFee.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="legal-notice">
      <strong>Legal Notice:</strong> This Agreement consists of multiple independent License Grants, each identified by a unique License ID. Each License Grant governs a specific permitted use of the Composition and is independently enforceable, notwithstanding that all License Grants are executed concurrently as part of this License Package.
    </div>
  </div>

  <!-- INDIVIDUAL LICENSE PAGES -->
  ${individualLicensePages}

  <!-- SIGNATURE PAGE -->
  <div class="page-break"></div>
  <div class="signature-page">
    <div class="section">
      <div class="section-title">Execution & Acknowledgment</div>
      <p>By signing below, the undersigned acknowledges and agrees to all terms set forth in this License Agreement, including all License Grants identified on the Cover Page.</p>
      <p>This signature applies to the following License IDs:</p>
      <ul>
        ${(licenses || []).map((l: License) => `<li>${l.license_id}</li>`).join("")}
      </ul>
    </div>

    <div class="signature-block">
      <div class="field"><span class="field-label">Licensee Name:</span> ${licenseeName}</div>
      ${request.organization ? `<div class="field"><span class="field-label">Company:</span> ${request.organization}</div>` : ""}
      
      <div class="signature-line"></div>
      <div class="signature-label">Authorized Signature</div>

      <div class="execution-date">
        <span class="field-label">Date of Execution:</span> ${executionDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
      </div>
    </div>

    <div class="footer">
      <div>© ${new Date().getFullYear()} Tribes Rights Management LLC. All rights reserved.</div>
      <div style="margin-top: 0.5em; font-size: 8pt;">This document was generated on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}.</div>
    </div>
  </div>
</body>
</html>`;

    // Return HTML with metadata for client-side PDF generation
    return new Response(
      JSON.stringify({
        html: htmlContent,
        filename: filename,
        metadata: {
          packageReference: packageReference,
          licenseCount: licenses?.length || 0,
          trackTitle: request.track_title || request.song_title || "Untitled",
          licenseeName: licenseeName,
          executionDate: formattedExecutionDate,
          totalFee: totalFee,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    console.error("Error generating PDF:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
