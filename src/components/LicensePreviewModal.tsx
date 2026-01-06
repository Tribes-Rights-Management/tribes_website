import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LicenseRequest } from "@/types";
import { format } from "date-fns";
import { getCopyrightLine } from "@/lib/copyright";

interface LicensePreviewModalProps {
  request: LicenseRequest;
  onClose: () => void;
}

export function LicensePreviewModal({ request, onClose }: LicensePreviewModalProps) {
  const [isExporting, setIsExporting] = useState(false);

  const licenseeName = [request.first_name, request.last_name].filter(Boolean).join(" ") || 
                       request.licensee_legal_name || "Unknown";
  const executionDate = request.signed_at ? new Date(request.signed_at) : new Date();
  const licenseFee = request.proposed_fee || 0;

  async function handleExport() {
    setIsExporting(true);
    try {
      const { data, error } = await supabase.functions.invoke("export-license-pdf", {
        body: { requestId: request.id },
      });

      if (error) throw error;

      const blob = new Blob([data.html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = data.filename.replace(".pdf", ".html");
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
    }
  }

  const canExport = request.status === "done";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white overflow-hidden flex flex-col shadow-lg">
        {/* Controls - text only, no styling */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-neutral-200">
          <button
            onClick={onClose}
            className="text-[13px] text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            Close
          </button>
          {canExport && (
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="text-[13px] text-neutral-500 hover:text-neutral-900 transition-colors disabled:opacity-40"
            >
              {isExporting ? "Exporting…" : "Export PDF"}
            </button>
          )}
        </div>

        {/* Document Preview - matches PDF exactly */}
        <div className="flex-1 overflow-auto bg-white">
          <div className="max-w-[7.5in] mx-auto px-[1in] py-[1in] text-neutral-900" style={{ fontFamily: 'Georgia, serif' }}>
            {/* Header */}
            <div className="text-center mb-8 pb-4 border-b border-neutral-300">
              <h1 className="text-[14pt] font-bold tracking-wide mb-1">TRIBES RIGHTS MANAGEMENT LLC</h1>
              <h2 className="text-[12pt] font-normal mb-4">Mechanical & DPD License Agreement</h2>
              <div className="text-[10pt] text-neutral-600">
                <p>License ID: {request.license_id || "—"}</p>
                <p>Execution Date: {format(executionDate, "MMMM d, yyyy")}</p>
              </div>
            </div>

            {/* Section 1: Parties */}
            <div className="mb-6">
              <p className="font-bold text-[11pt] mb-2">1. Parties</p>
              <div className="text-[11pt] leading-relaxed space-y-1">
                <p><span className="font-bold">Licensor:</span> Tribes Rights Management LLC</p>
                <p><span className="font-bold">Licensee:</span> {licenseeName}{request.organization ? ` (${request.organization})` : ""}</p>
              </div>
            </div>

            {/* Section 2: Licensed Work */}
            <div className="mb-6">
              <p className="font-bold text-[11pt] mb-2">2. Licensed Work</p>
              <div className="text-[11pt] leading-relaxed space-y-1">
                <p><span className="font-bold">Track Title:</span> {request.track_title || "—"}</p>
                <p><span className="font-bold">Track Artist:</span> {request.track_artist || "—"}</p>
                <p><span className="font-bold">ISRC:</span> {request.track_isrc || "—"}</p>
                <p><span className="font-bold">Runtime:</span> {request.runtime || "—"}</p>
              </div>
            </div>

            {/* Section 3: Product Details */}
            <div className="mb-6">
              <p className="font-bold text-[11pt] mb-2">3. Product Details</p>
              <div className="text-[11pt] leading-relaxed space-y-1">
                <p><span className="font-bold">Recording Artist:</span> {request.recording_artist || "—"}</p>
                <p><span className="font-bold">Release Title:</span> {request.release_title || "—"}</p>
                <p><span className="font-bold">Label / Master Owner:</span> {request.label_master_owner || "—"}</p>
                <p><span className="font-bold">Distributor:</span> {request.distributor || "—"}</p>
                <p><span className="font-bold">Release Date:</span> {request.release_date ? format(new Date(request.release_date), "MMMM d, yyyy") : "—"}</p>
                <p><span className="font-bold">UPC:</span> {request.product_upc || "—"}</p>
              </div>
            </div>

            {/* Section 4: License Terms */}
            <div className="mb-6">
              <p className="font-bold text-[11pt] mb-2">4. License Terms</p>
              <div className="text-[11pt] leading-relaxed space-y-1">
                <p><span className="font-bold">Territory:</span> {request.territory || "Worldwide"}</p>
                <p><span className="font-bold">Term:</span> {request.term || "Perpetual"}</p>
                <p><span className="font-bold">License Fee:</span> {licenseFee ? `${request.currency || "USD"} ${licenseFee.toLocaleString()}` : "—"}</p>
              </div>
            </div>

            {/* Section 5: Execution */}
            <div className="mt-12 pt-4 border-t border-neutral-300">
              <p className="font-bold text-[11pt] mb-4">5. Execution</p>
              <div className="text-[11pt] leading-relaxed space-y-1">
                <p><span className="font-bold">Licensee Name:</span> {licenseeName}</p>
                {request.organization && <p><span className="font-bold">Company:</span> {request.organization}</p>}
              </div>
              <div className="w-[250px] border-b border-neutral-900 mt-8 mb-1" />
              <p className="text-[10pt] text-neutral-600">Signature</p>
              <p className="text-[11pt] mt-4">
                <span className="font-bold">Date:</span> {format(executionDate, "MMMM d, yyyy")}
              </p>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-4 border-t border-neutral-300 text-center">
              <p className="text-[9pt] text-neutral-600">{getCopyrightLine()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
