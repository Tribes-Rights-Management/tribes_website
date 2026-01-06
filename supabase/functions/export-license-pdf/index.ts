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

    // Use package_reference (Package ID) - always present due to NOT NULL constraint
    const packageId = request.package_reference;
    
    const trackTitle = sanitizeFilename(request.track_title || request.song_title || "Untitled");
    const executionDate = request.executed_at ? new Date(request.executed_at) : 
                          request.signed_at ? new Date(request.signed_at) : new Date();
    const formattedExecutionDate = formatDate(executionDate);

    // Generate filename: Tribes_LicensePackage_[PackageID]_[Track_Title]_[YYYY-MM-DD].pdf
    const filename = `Tribes_LicensePackage_${packageId}_${trackTitle}_${formattedExecutionDate}.pdf`;

    // Build licensee info
    const licenseeName = [request.first_name, request.last_name].filter(Boolean).join(" ") || 
                         request.licensee_legal_name || 
                         "Unknown";
    
    const licenseeCompany = request.organization || "";
    const licenseeStreet = request.address_street || "";
    const licenseeCityStateZip = [request.address_city, request.address_state, request.address_zip].filter(Boolean).join(", ");
    const licenseeCountry = request.address_country || "";
    const licenseeEmail = request.licensee_email || "";

    // Calculate total fee
    const totalFee = licenses?.reduce((sum: number, l: License) => sum + (l.fee || 0), 0) || request.license_fee || 0;

    // Generate included licenses list
    const includedLicensesList = (licenses || []).map((l: License) => {
      const typeName = licenseTypeMap.get(l.license_type_code)?.name || l.license_type_code;
      return `<div class="license-list-item"><span class="license-list-id">License ID: ${l.license_id}</span> — ${typeName}</div>`;
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
      margin-bottom: 2em;
      padding-bottom: 1.5em;
      border-bottom: 2px solid #1a1a1a;
    }
    .cover-title {
      font-size: 13pt;
      font-weight: bold;
      letter-spacing: 0.15em;
      margin: 0 0 1.5em 0;
      color: #333;
    }
    .cover-main-title {
      font-size: 18pt;
      font-weight: bold;
      margin: 0 0 1.5em 0;
    }
    .cover-field {
      margin-bottom: 1.5em;
    }
    .cover-field-label {
      font-weight: bold;
      font-size: 10pt;
      color: #666;
      margin-bottom: 0.25em;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .cover-field-value {
      font-size: 12pt;
      font-family: 'Courier New', monospace;
    }
    .section {
      margin-bottom: 2em;
    }
    .section-title {
      font-weight: bold;
      font-size: 11pt;
      margin-bottom: 0.75em;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid #ccc;
      padding-bottom: 0.25em;
    }
    .party-block {
      margin-bottom: 1.5em;
    }
    .party-label {
      font-weight: bold;
      font-size: 10pt;
      color: #666;
      margin-bottom: 0.25em;
    }
    .party-info {
      font-size: 11pt;
      line-height: 1.5;
    }
    .party-info div {
      margin-bottom: 0.15em;
    }
    .composition-field {
      margin-bottom: 0.75em;
    }
    .composition-label {
      font-weight: bold;
      font-size: 10pt;
      color: #666;
      margin-bottom: 0.15em;
    }
    .composition-value {
      font-size: 11pt;
    }
    .description-text {
      font-size: 10.5pt;
      line-height: 1.7;
      text-align: justify;
    }
    .license-list-item {
      margin-bottom: 0.5em;
      font-size: 11pt;
    }
    .license-list-id {
      font-family: 'Courier New', monospace;
      font-weight: bold;
    }
    .notice-box {
      margin-top: 2em;
      padding: 1.25em;
      background: #f8f8f8;
      border: 1px solid #ddd;
      font-size: 10pt;
      line-height: 1.6;
    }
    .notice-title {
      font-weight: bold;
      font-size: 10pt;
      text-transform: uppercase;
      margin-bottom: 0.5em;
    }
    .end-marker {
      text-align: center;
      font-style: italic;
      color: #666;
      margin-top: 2em;
      font-size: 10pt;
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
    .field {
      margin-bottom: 0.5em;
    }
    .field-label {
      font-weight: bold;
    }
  </style>
</head>
<body>
  <!-- COVER PAGE -->
  <div class="cover-page">
    <div class="cover-header">
      <div class="cover-title">LICENSE PACKAGE COVER PAGE</div>
      <div style="font-size: 9pt; color: #666; margin-bottom: 1em;">(Package-Level Summary and Identification)</div>
      <div class="cover-main-title">MUSIC LICENSE PACKAGE</div>
    </div>

    <div class="cover-field">
      <div class="cover-field-label">License Package ID:</div>
      <div class="cover-field-value">${packageId}</div>
    </div>

    <div class="cover-field">
      <div class="cover-field-label">Effective Date:</div>
      <div class="cover-field-value">${formattedExecutionDate}</div>
    </div>

    <div class="section">
      <div class="section-title">Parties</div>
      
      <div class="party-block">
        <div class="party-label">Licensor:</div>
        <div class="party-info">
          <div>Tribes Rights Management LLC</div>
        </div>
      </div>

      <div class="party-block">
        <div class="party-label">Licensee:</div>
        <div class="party-info">
          <div>${licenseeName}</div>
          ${licenseeCompany ? `<div>${licenseeCompany}</div>` : ""}
          ${licenseeStreet ? `<div>${licenseeStreet}</div>` : ""}
          ${licenseeCityStateZip ? `<div>${licenseeCityStateZip}</div>` : ""}
          ${licenseeCountry ? `<div>${licenseeCountry}</div>` : ""}
          ${licenseeEmail ? `<div>${licenseeEmail}</div>` : ""}
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Musical Composition</div>
      
      <div class="composition-field">
        <div class="composition-label">Title:</div>
        <div class="composition-value">${request.track_title || "—"}</div>
      </div>

      <div class="composition-field">
        <div class="composition-label">Songwriter(s):</div>
        <div class="composition-value">${request.writers_publishers || "As registered with applicable PROs"}</div>
      </div>

      <div class="composition-field">
        <div class="composition-label">Publisher:</div>
        <div class="composition-value">Tribes Rights Management LLC</div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">License Package Description</div>
      <p class="description-text">
        This License Package is issued in response to a single license request for the musical composition identified above.
      </p>
      <p class="description-text">
        This Package consists of one or more individual license agreements, each granting a specific and distinct category of rights for the same musical composition. Each individual license contained herein:
      </p>
      <ul class="description-text">
        <li>Is identified by its own unique License ID</li>
        <li>Contains its own license-specific terms and conditions</li>
        <li>Is independently enforceable</li>
      </ul>
    </div>

    <div class="section">
      <div class="section-title">Included Licenses</div>
      <p class="description-text">The following individual licenses are included in this License Package:</p>
      <div style="margin-top: 1em;">
        ${includedLicensesList}
      </div>
      <p class="description-text" style="margin-top: 1em; font-style: italic; color: #666;">
        (This list reflects all licenses requested and approved under this Package. Where only one license is included, this Package shall consist of a single license.)
      </p>
    </div>

    <div class="section">
      <div class="section-title">Execution and Effectiveness</div>
      <p class="description-text">This License Package is deemed executed only upon:</p>
      <ol class="description-text">
        <li>Electronic execution of all included licenses by the Licensee; and</li>
        <li>Successful payment of all applicable license fees.</li>
      </ol>
      <p class="description-text">
        Execution and payment are completed as part of a single transaction session. No license granted herein becomes effective until both conditions are satisfied.
      </p>
    </div>

    <div class="section">
      <div class="section-title">Governing Law</div>
      <p class="description-text">
        This License Package and all licenses contained herein are governed by and construed in accordance with the laws of the State of Texas, without regard to conflict of law principles.
      </p>
    </div>

    <div class="notice-box">
      <div class="notice-title">Package Scope Notice</div>
      <p>
        This cover page is provided for identification, organization, and administrative clarity only.
        The legally binding rights, obligations, limitations, and conditions applicable to each license are set forth exclusively in the individual license agreements that follow.
      </p>
    </div>

    <div class="end-marker">(End of Cover Page)</div>
  </div>

  <!-- INDIVIDUAL LICENSE PAGES -->
  ${individualLicensePages}

  <!-- SIGNATURE PAGE -->
  <div class="page-break"></div>
  <div class="signature-page">
    <div class="section">
      <div class="section-title">Execution & Acknowledgment</div>
      <p class="description-text">By signing below, the undersigned acknowledges and agrees to all terms set forth in this License Agreement, including all License Grants identified on the Cover Page.</p>
      <p class="description-text" style="margin-top: 1em;">This signature applies to the following License IDs:</p>
      <ul>
        ${(licenses || []).map((l: License) => `<li>${l.license_id}</li>`).join("")}
      </ul>
    </div>

    <div class="signature-block">
      <div class="field"><span class="field-label">Licensee Name:</span> ${licenseeName}</div>
      ${licenseeCompany ? `<div class="field"><span class="field-label">Company:</span> ${licenseeCompany}</div>` : ""}
      
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
          packageId: packageId,
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
