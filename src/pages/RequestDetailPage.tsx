import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { DetailSection, DetailRow, DetailBlock } from "@/components/DetailSection";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { LicenseRequest, GeneratedDocument, STATUS_LABELS, STATUS_DESCRIPTIONS } from "@/types";
import { ArrowLeft, Download, Edit, ExternalLink, FileText } from "lucide-react";
import { format } from "date-fns";

export default function RequestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [request, setRequest] = useState<LicenseRequest | null>(null);
  const [documents, setDocuments] = useState<GeneratedDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-3xl mx-auto space-y-6">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </AppLayout>
    );
  }

  if (!request) return null;

  const shortId = request.id.slice(0, 8).toUpperCase();
  const canEdit = request.status === "needs_info";
  const showSignPayButton = request.status === "awaiting_signature" || request.status === "awaiting_payment";
  const executedDoc = documents.find(d => d.doc_type === "executed");
  
  const requesterName = [request.first_name, request.last_name].filter(Boolean).join(" ") || request.licensee_legal_name || "—";
  const fullAddress = [
    request.address_street,
    request.address_city,
    request.address_state,
    request.address_zip,
    request.address_country,
  ].filter(Boolean).join(", ");

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        {/* Back Link */}
        <button
          onClick={() => navigate("/portal")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          My Requests
        </button>

        {/* Title & Status */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-semibold tracking-tight">License Request</h1>
              <StatusBadge status={request.status} />
            </div>
            <p className="text-sm text-muted-foreground">{STATUS_DESCRIPTIONS[request.status]}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {canEdit && (
              <Link
                to={`/portal/request/${request.id}/edit`}
                className="flex items-center gap-2 h-9 px-4 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Update Information
              </Link>
            )}

            <TooltipProvider>
              {showSignPayButton && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      disabled
                      className="flex items-center gap-2 h-9 px-4 text-sm bg-muted text-muted-foreground rounded-md cursor-not-allowed"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Review, Sign, and Pay
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Coming soon</TooltipContent>
                </Tooltip>
              )}
            </TooltipProvider>

            {request.status === "done" && executedDoc && (
              <a
                href={executedDoc.storage_path}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 h-9 px-4 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download Executed Agreement
              </a>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Your Info */}
          <DetailSection title="Your Info">
            <DetailRow label="First Name" value={request.first_name} />
            <DetailRow label="Last Name" value={request.last_name} />
            <DetailRow label="Organization" value={request.organization} />
            <DetailRow label="Email" value={request.licensee_email} />
            {fullAddress && (
              <div className="pt-1">
                <p className="text-muted-foreground text-sm mb-1">Address</p>
                <DetailBlock>{fullAddress}</DetailBlock>
              </div>
            )}
          </DetailSection>

          <div className="h-px bg-border/30" />

          {/* Product Details */}
          <DetailSection title="Product Details">
            <DetailRow label="Label / Master Owner" value={request.label_master_owner} />
            <DetailRow label="Distributor" value={request.distributor} />
            <DetailRow label="Release Date" value={request.release_date ? format(new Date(request.release_date), "MMM d, yyyy") : null} />
            <DetailRow label="Recording Artist" value={request.recording_artist} />
            <DetailRow label="Release Title" value={request.release_title} />
            <DetailRow label="Product UPC" value={request.product_upc} />
            {request.additional_product_info && (
              <div className="pt-1">
                <p className="text-muted-foreground text-sm mb-1">Additional Info</p>
                <DetailBlock>{request.additional_product_info}</DetailBlock>
              </div>
            )}
          </DetailSection>

          <div className="h-px bg-border/30" />

          {/* Track Details */}
          <DetailSection title="Track Details">
            <DetailRow label="Track / Song Title" value={request.track_title || request.song_title} />
            <DetailRow label="Track Artist" value={request.track_artist} />
            <DetailRow label="Track ISRC" value={request.track_isrc} />
            <DetailRow label="Runtime" value={request.runtime} />
            <DetailRow label="Appears More Than Once" value={request.appears_multiple_times ? "Yes" : "No"} />
            {request.appears_multiple_times && request.times_count && (
              <DetailRow label="How Many Times" value={String(request.times_count)} />
            )}
            {request.additional_track_info && (
              <div className="pt-1">
                <p className="text-muted-foreground text-sm mb-1">Additional Info</p>
                <DetailBlock>{request.additional_track_info}</DetailBlock>
              </div>
            )}
          </DetailSection>

          <div className="h-px bg-border/30" />

          {/* Files */}
          <DetailSection title="Files">
            {documents.length > 0 ? (
              <div className="space-y-2">
                {documents.map(doc => (
                  <a
                    key={doc.id}
                    href={doc.storage_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
                  >
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    {doc.doc_type === "draft" ? "Draft Contract" : "Executed Agreement"}
                    <span className="text-xs text-muted-foreground">
                      ({format(new Date(doc.created_at), "MMM d, yyyy")})
                    </span>
                    <Download className="w-3 h-3 ml-auto" />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No files yet.</p>
            )}
          </DetailSection>

          <div className="h-px bg-border/30" />

          {/* Request Info */}
          <DetailSection title="Request Info">
            <DetailRow label="Request ID" value={`TRL-${shortId}`} />
            <DetailRow label="Submitted" value={request.submitted_at ? format(new Date(request.submitted_at), "MMM d, yyyy 'at' h:mm a") : "—"} />
          </DetailSection>
        </div>
      </div>
    </AppLayout>
  );
}
