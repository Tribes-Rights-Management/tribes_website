import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { useToast } from "@/hooks/use-toast";
import { LicenseRequest, GeneratedDocument, STATUS_DESCRIPTIONS } from "@/types";
import { format } from "date-fns";
import { LicensePreviewModal } from "@/components/LicensePreviewModal";

export default function RequestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [request, setRequest] = useState<LicenseRequest | null>(null);
  const [documents, setDocuments] = useState<GeneratedDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (id) fetchRequestData(id);
  }, [id]);

  async function fetchRequestData(requestId: string) {
    try {
      const [requestRes, docsRes] = await Promise.all([
        supabase.from("license_requests").select("*").eq("id", requestId).single(),
        supabase.from("generated_documents").select("*").eq("request_id", requestId).order("created_at", { ascending: false }),
      ]);

      if (requestRes.error) throw requestRes.error;
      setRequest(requestRes.data);
      setDocuments(docsRes.data || []);
    } catch (error) {
      console.error("Error fetching request:", error);
      toast({ title: "Error", description: "Failed to load request", variant: "destructive" });
      navigate("/portal");
    } finally {
      setIsLoading(false);
    }
  }

  async function copyLicenseId() {
    if (!request?.license_id) return;
    await navigator.clipboard.writeText(request.license_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl opacity-0" />
      </DashboardLayout>
    );
  }

  if (!request) return null;

  const canEdit = request.status === "needs_info";
  const showSignPayButton = request.status === "awaiting_signature" || request.status === "awaiting_payment";
  
  const fullAddress = [
    request.address_street,
    request.address_city,
    request.address_state,
    request.address_zip,
    request.address_country,
  ].filter(Boolean).join(", ");

  const requesterName = [request.first_name, request.last_name].filter(Boolean).join(" ") || request.licensee_legal_name || "—";

  return (
    <DashboardLayout>
      <div className="max-w-2xl animate-content-fade">
        {/* Back */}
        <button
          onClick={() => navigate("/portal")}
          className="text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          ← Dashboard
        </button>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-2">
            <StatusBadge status={request.status} />
          </div>
          <p className="text-[13px] text-muted-foreground mb-4">{STATUS_DESCRIPTIONS[request.status]}</p>
          
          {request.license_id && (
            <p 
              className="text-[13px] text-muted-foreground font-mono cursor-pointer hover:text-foreground transition-colors"
              onClick={copyLicenseId}
              title="Click to copy"
            >
              {request.license_id} {copied && "· Copied"}
            </p>
          )}
        </div>

        {/* Actions */}
        {(canEdit || showSignPayButton || request.status === "done") && (
          <div className="mb-12 space-y-3">
            {canEdit && (
              <Link
                to={`/portal/request/${request.id}/edit`}
                className="inline-block text-[13px] text-muted-foreground hover:text-foreground transition-colors"
              >
                Update information →
              </Link>
            )}

            {showSignPayButton && (
              <Link
                to={`/portal/request/${request.id}/sign`}
                className="inline-block h-10 px-5 text-[13px] bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors leading-10"
              >
                Review, sign, and pay
              </Link>
            )}

            {request.status === "done" && (
              <button
                onClick={() => setShowPreview(true)}
                className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
              >
                View agreement
              </button>
            )}
          </div>
        )}

        {/* Single-column reading layout */}
        <div className="space-y-12">
          
          {/* Your Info */}
          <section className="space-y-4">
            <h3 className="text-[12px] font-medium text-muted-foreground uppercase tracking-wide">Your Info</h3>
            <div className="space-y-3">
              <Field label="Name" value={requesterName} />
              <Field label="Organization" value={request.organization} />
              <Field label="Email" value={request.licensee_email} />
              {fullAddress && <Field label="Address" value={fullAddress} />}
            </div>
          </section>

          {/* Product Details */}
          <section className="space-y-4">
            <h3 className="text-[12px] font-medium text-muted-foreground uppercase tracking-wide">Product Details</h3>
            <div className="space-y-3">
              <Field label="Label / Master Owner" value={request.label_master_owner} />
              <Field label="Distributor" value={request.distributor} />
              <Field label="Recording Artist" value={request.recording_artist} />
              <Field label="Release Title" value={request.release_title} />
              <Field label="Release Date" value={request.release_date ? format(new Date(request.release_date), "MMMM d, yyyy") : null} />
              <Field label="UPC" value={request.product_upc} />
            </div>
            {request.additional_product_info && (
              <p className="text-[13px] text-muted-foreground pt-2">{request.additional_product_info}</p>
            )}
          </section>

          {/* Track Details */}
          <section className="space-y-4">
            <h3 className="text-[12px] font-medium text-muted-foreground uppercase tracking-wide">Track Details</h3>
            <div className="space-y-3">
              <Field label="Track Title" value={request.track_title || request.song_title} />
              <Field label="Track Artist" value={request.track_artist} />
              <Field label="ISRC" value={request.track_isrc} />
              <Field label="Runtime" value={request.runtime} />
              <Field label="Multiple Uses" value={request.appears_multiple_times ? `Yes (${request.times_count || "?"})` : "No"} />
            </div>
            {request.additional_track_info && (
              <p className="text-[13px] text-muted-foreground pt-2">{request.additional_track_info}</p>
            )}
          </section>

          {/* Documents */}
          {documents.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-[12px] font-medium text-muted-foreground uppercase tracking-wide">Documents</h3>
              <div className="space-y-2">
                {documents.map(doc => (
                  <a
                    key={doc.id}
                    href={doc.storage_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-[14px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {doc.doc_type === "draft" ? "Draft Contract" : "Executed Agreement"} — {format(new Date(doc.created_at), "MMM d, yyyy")}
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Executed Agreement placeholder */}
          {request.status !== "done" && (
            <section className="space-y-4">
              <h3 className="text-[12px] font-medium text-muted-foreground uppercase tracking-wide">Executed Agreement</h3>
              <p className="text-[13px] text-muted-foreground">Your executed agreement will appear here once complete.</p>
            </section>
          )}

          {/* Request Info */}
          <section className="space-y-4">
            <h3 className="text-[12px] font-medium text-muted-foreground uppercase tracking-wide">Request Info</h3>
            <div className="space-y-3">
              <Field label="Submitted" value={request.submitted_at ? format(new Date(request.submitted_at), "MMMM d, yyyy 'at' h:mm a") : null} />
            </div>
          </section>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && request && (
        <LicensePreviewModal
          request={request}
          onClose={() => setShowPreview(false)}
        />
      )}
    </DashboardLayout>
  );
}

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-[12px] text-muted-foreground">{label}</p>
      <p className="text-[14px] mt-0.5">{value}</p>
    </div>
  );
}
