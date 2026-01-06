import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { useToast } from "@/hooks/use-toast";
import { LicenseRequest, GeneratedDocument, STATUS_DESCRIPTIONS } from "@/types";
import { ArrowLeft, Download, Edit, Copy, Check } from "lucide-react";
import { format } from "date-fns";

export default function RequestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [request, setRequest] = useState<LicenseRequest | null>(null);
  const [documents, setDocuments] = useState<GeneratedDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

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

  async function handleExport() {
    if (!request) return;
    setIsExporting(true);
    try {
      const { data, error } = await supabase.functions.invoke("export-license-pdf", {
        body: { requestId: request.id },
      });

      if (error) throw error;

      // Create and download HTML as printable document
      const blob = new Blob([data.html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = data.filename.replace(".pdf", ".html");
      a.click();
      URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error("Export error:", error);
      toast({ title: "Error", description: error.message || "Failed to export", variant: "destructive" });
    } finally {
      setIsExporting(false);
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl opacity-0" />
      </DashboardLayout>
    );
  }

  if (!request) return null;

  const canEdit = request.status === "needs_info";
  const showSignPayButton = request.status === "awaiting_signature" || request.status === "awaiting_payment";
  const executedDoc = documents.find(d => d.doc_type === "executed");
  
  const fullAddress = [
    request.address_street,
    request.address_city,
    request.address_state,
    request.address_zip,
    request.address_country,
  ].filter(Boolean).join(", ");

  return (
    <DashboardLayout>
      <div className="max-w-3xl animate-content-fade">
        {/* Back */}
        <button
          onClick={() => navigate("/portal")}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Dashboard
        </button>

        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1>License Request</h1>
              <StatusBadge status={request.status} />
            </div>
            <p className="text-sm text-muted-foreground">{STATUS_DESCRIPTIONS[request.status]}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {canEdit && (
              <Link
                to={`/portal/request/${request.id}/edit`}
                className="inline-flex items-center gap-2 h-10 px-4 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors active:opacity-80 active:duration-75"
              >
                <Edit className="w-4 h-4" />
                Update Information
              </Link>
            )}

            {showSignPayButton && (
              <Link
                to={`/portal/request/${request.id}/sign`}
                className="h-10 px-4 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors inline-flex items-center active:opacity-80 active:duration-75"
              >
                Review, Sign, and Pay
              </Link>
            )}

            {request.status === "done" && (
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="inline-flex items-center gap-2 h-10 px-4 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 active:opacity-80 active:duration-75"
              >
                <Download className="w-4 h-4" />
                {isExporting ? "…" : "Download Agreement"}
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* License ID */}
          {request.license_id && (
            <Section title="License ID">
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono">{request.license_id}</span>
                <button
                  onClick={copyLicenseId}
                  className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Copy License ID"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </Section>
          )}

          <Section title="Your Info">
            <Grid>
              <Field label="First Name" value={request.first_name} />
              <Field label="Last Name" value={request.last_name} />
              <Field label="Organization" value={request.organization} />
              <Field label="Email" value={request.licensee_email} />
            </Grid>
            {fullAddress && <p className="text-sm mt-3">{fullAddress}</p>}
          </Section>

          <Section title="Product Details">
            <Grid>
              <Field label="Label / Master Owner" value={request.label_master_owner} />
              <Field label="Distributor" value={request.distributor} />
              <Field label="Release Date" value={request.release_date ? format(new Date(request.release_date), "MMM d, yyyy") : null} />
              <Field label="Recording Artist" value={request.recording_artist} />
              <Field label="Release Title" value={request.release_title} />
              <Field label="Product UPC" value={request.product_upc} />
            </Grid>
            {request.additional_product_info && <p className="text-sm text-muted-foreground mt-3">{request.additional_product_info}</p>}
          </Section>

          <Section title="Track Details">
            <Grid>
              <Field label="Track Title" value={request.track_title || request.song_title} />
              <Field label="Track Artist" value={request.track_artist} />
              <Field label="Track ISRC" value={request.track_isrc} />
              <Field label="Runtime" value={request.runtime} />
              <Field label="Multiple Uses" value={request.appears_multiple_times ? `Yes (${request.times_count || "?"})` : "No"} />
            </Grid>
            {request.additional_track_info && <p className="text-sm text-muted-foreground mt-3">{request.additional_track_info}</p>}
          </Section>

          {documents.length > 0 && (
            <Section title="Files">
              <div className="space-y-2">
                {documents.map(doc => (
                  <a
                    key={doc.id}
                    href={doc.storage_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-muted-foreground" />
                    {doc.doc_type === "draft" ? "Draft Contract" : "Executed Agreement"}
                    <span className="text-xs text-muted-foreground">({format(new Date(doc.created_at), "MMM d, yyyy")})</span>
                  </a>
                ))}
              </div>
            </Section>
          )}

          {request.status !== "done" && (
            <Section title="Executed Agreement">
              <p className="text-sm text-muted-foreground">Your executed agreement will appear here once complete.</p>
            </Section>
          )}

          <Section title="Request Info">
            <Grid>
              <Field label="Submitted" value={request.submitted_at ? format(new Date(request.submitted_at), "MMM d, yyyy 'at' h:mm a") : "—"} />
            </Grid>
          </Section>
        </div>
      </div>
    </DashboardLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-muted-foreground mb-3">{title}</h2>
      {children}
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">{children}</div>;
}

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="text-sm">
      <span className="text-muted-foreground">{label}</span>
      <p className="mt-0.5">{value}</p>
    </div>
  );
}
