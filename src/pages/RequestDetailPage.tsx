import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { ActivityTimeline } from "@/components/ActivityTimeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { LicenseRequest, StatusHistory, GeneratedDocument, MEDIA_TYPE_LABELS, STATUS_DESCRIPTIONS } from "@/types";
import { ArrowLeft, Edit, Download, ExternalLink, Building2, Music2, DollarSign, FileText, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";

export default function RequestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [request, setRequest] = useState<LicenseRequest | null>(null);
  const [history, setHistory] = useState<StatusHistory[]>([]);
  const [documents, setDocuments] = useState<GeneratedDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) fetchRequestData(id);
  }, [id]);

  async function fetchRequestData(requestId: string) {
    try {
      const { data: requestData, error: requestError } = await supabase
        .from("license_requests")
        .select("*")
        .eq("id", requestId)
        .single();

      if (requestError) throw requestError;
      setRequest(requestData);

      const { data: historyData } = await supabase
        .from("status_history")
        .select("*")
        .eq("request_id", requestId)
        .order("created_at", { ascending: false });

      setHistory(historyData || []);

      const { data: docsData } = await supabase
        .from("generated_documents")
        .select("*")
        .eq("request_id", requestId)
        .order("created_at", { ascending: false });

      setDocuments(docsData || []);
    } catch (error) {
      console.error("Error fetching request:", error);
      toast({ title: "Error", description: "Failed to load request", variant: "destructive" });
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-48 w-full" />
        </div>
      </AppLayout>
    );
  }

  if (!request) return null;

  const canEdit = request.status === "draft" || request.status === "needs_info";
  const hasSigningUrl = request.signing_url && request.status === "sent_for_signature";

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                {request.song_title || request.project_title || "Untitled Request"}
              </h1>
              <StatusBadge status={request.status} />
            </div>
            <p className="text-muted-foreground text-sm">{STATUS_DESCRIPTIONS[request.status]}</p>
          </div>

          <div className="flex items-center gap-2">
            {hasSigningUrl && (
              <Button asChild>
                <a href={request.signing_url!} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Sign Agreement
                </a>
              </Button>
            )}
            {canEdit && (
              <Button variant="outline" asChild>
                <Link to={`/request/${request.id}/edit`}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Licensee */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Licensee
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <InfoRow label="Name" value={request.licensee_legal_name} />
                <InfoRow label="Email" value={request.licensee_email} />
              </CardContent>
            </Card>

            {/* Project & Usage */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Project
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <InfoRow label="Project Title" value={request.project_title} />
                <InfoRow label="Media Type" value={request.media_type ? MEDIA_TYPE_LABELS[request.media_type] : null} />
                <InfoRow label="Usage" value={request.usage_description} />
              </CardContent>
            </Card>

            {/* Music */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Music2 className="w-4 h-4" />
                  Music
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <InfoRow label="Song Title" value={request.song_title} />
                <InfoRow label="Writers / Publishers" value={request.writers_publishers} />
                {request.reference_link && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Reference</span>
                    <a href={request.reference_link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                      View Link <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Terms */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <InfoRow label="Territory" value={request.territory} />
                <InfoRow label="Term" value={request.term} />
                <InfoRow label="Start Date" value={request.usage_start_date ? format(new Date(request.usage_start_date), "MMM d, yyyy") : null} />
              </CardContent>
            </Card>

            {/* Budget */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Fee
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <InfoRow label="Proposed Fee" value={request.proposed_fee ? `${request.currency} ${Number(request.proposed_fee).toLocaleString()}` : null} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {documents.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {documents.map(doc => (
                      <Button key={doc.id} variant="outline" size="sm" className="w-full justify-start" asChild>
                        <a href={doc.storage_path} target="_blank" rel="noopener noreferrer">
                          <Download className="w-4 h-4 mr-2" />
                          {doc.doc_type === "draft" ? "Draft Contract" : "Executed Contract"}
                        </a>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {history.length > 0 ? (
                  <ActivityTimeline history={history} />
                ) : (
                  <div className="text-sm text-muted-foreground space-y-2">
                    <div className="flex justify-between">
                      <span>Created</span>
                      <span>{format(new Date(request.created_at), "MMM d, yyyy")}</span>
                    </div>
                    {request.submitted_at && (
                      <div className="flex justify-between">
                        <span>Submitted</span>
                        <span>{format(new Date(request.submitted_at), "MMM d, yyyy")}</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right max-w-[60%]">{value}</span>
    </div>
  );
}
