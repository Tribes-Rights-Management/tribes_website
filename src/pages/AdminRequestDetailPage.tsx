import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { ActivityTimeline } from "@/components/ActivityTimeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { LicenseRequest, StatusHistory, GeneratedDocument, RequestStatus, MEDIA_TYPE_LABELS, STATUS_LABELS, REQUIRED_PLACEHOLDERS } from "@/types";
import { ArrowLeft, Download, ExternalLink, Building2, Music2, DollarSign, FileText, Clock, MapPin, AlertCircle, CheckCircle2, Send, FileCheck } from "lucide-react";
import { format } from "date-fns";

const WORKFLOW_TRANSITIONS: Record<RequestStatus, RequestStatus[]> = {
  draft: [],
  submitted: ["in_review", "needs_info", "closed"],
  in_review: ["approved", "needs_info", "closed"],
  needs_info: ["in_review", "closed"],
  approved: ["sent_for_signature", "closed"],
  sent_for_signature: ["executed", "closed"],
  executed: ["closed"],
  closed: [],
};

export default function AdminRequestDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [request, setRequest] = useState<LicenseRequest | null>(null);
  const [history, setHistory] = useState<StatusHistory[]>([]);
  const [documents, setDocuments] = useState<GeneratedDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusNote, setStatusNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

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
      navigate("/admin");
    } finally {
      setIsLoading(false);
    }
  }

  // Check which placeholders are missing
  function getMissingPlaceholders(): string[] {
    if (!request) return REQUIRED_PLACEHOLDERS;
    
    const placeholderMap: Record<string, any> = {
      licensee_name: request.licensee_legal_name,
      song_title: request.song_title,
      writers_publishers: request.writers_publishers,
      project_title: request.project_title,
      media_type: request.media_type,
      territory: request.territory,
      term: request.term,
      start_date: request.usage_start_date,
      fee_amount: request.proposed_fee,
      currency: request.currency,
    };

    return REQUIRED_PLACEHOLDERS.filter(p => !placeholderMap[p]);
  }

  const missingPlaceholders = getMissingPlaceholders();
  const canGenerate = missingPlaceholders.length === 0;

  async function updateStatus(newStatus: RequestStatus) {
    if (!request || !user) return;
    
    setIsUpdating(true);
    try {
      // Update the request status
      const { error: updateError } = await supabase
        .from("license_requests")
        .update({ status: newStatus })
        .eq("id", request.id);

      if (updateError) throw updateError;

      // Add to status history
      const { error: historyError } = await supabase
        .from("status_history")
        .insert({
          request_id: request.id,
          from_status: request.status,
          to_status: newStatus,
          actor_user_id: user.id,
          notes: statusNote || null,
        });

      if (historyError) console.error("Failed to add history:", historyError);

      toast({ title: "Status updated", description: `Changed to ${STATUS_LABELS[newStatus]}` });
      setStatusNote("");
      fetchRequestData(request.id);
    } catch (error) {
      console.error("Error updating status:", error);
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    } finally {
      setIsUpdating(false);
    }
  }

  async function generateContract() {
    if (!request || !canGenerate) return;
    
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-contract", {
        body: { request_id: request.id },
      });

      if (error) throw error;

      toast({ title: "Contract generated", description: "Draft contract is ready." });
      fetchRequestData(request.id);
    } catch (error) {
      console.error("Error generating contract:", error);
      toast({ title: "Error", description: "Failed to generate contract", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  }

  async function sendForSignature() {
    if (!request) return;
    
    setIsUpdating(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-signing-session", {
        body: { request_id: request.id },
      });

      if (error) throw error;

      toast({ title: "Sent for signature", description: "Contract has been sent to the licensee." });
      fetchRequestData(request.id);
    } catch (error) {
      console.error("Error sending for signature:", error);
      toast({ title: "Error", description: "Failed to send for signature", variant: "destructive" });
    } finally {
      setIsUpdating(false);
    }
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-5xl mx-auto space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-48 w-full" />
        </div>
      </AppLayout>
    );
  }

  if (!request) return null;

  const allowedTransitions = WORKFLOW_TRANSITIONS[request.status];
  const hasDraftContract = documents.some(d => d.doc_type === "draft");

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto">
        <Button variant="ghost" size="sm" onClick={() => navigate("/admin")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Queue
        </Button>
        
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                {request.song_title || request.project_title || "Untitled Request"}
              </h1>
              <StatusBadge status={request.status} />
            </div>
            <p className="text-muted-foreground text-sm">
              Request ID: {request.id.slice(0, 8)}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Details */}
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

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Project
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <InfoRow label="Title" value={request.project_title} />
                <InfoRow label="Media Type" value={request.media_type ? MEDIA_TYPE_LABELS[request.media_type] : null} />
                <InfoRow label="Usage" value={request.usage_description} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Music2 className="w-4 h-4" />
                  Music
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <InfoRow label="Song" value={request.song_title} />
                <InfoRow label="Writers" value={request.writers_publishers} />
                {request.reference_link && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Reference</span>
                    <a href={request.reference_link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                      View <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid sm:grid-cols-2 gap-6">
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
                  <InfoRow label="Start" value={request.usage_start_date ? format(new Date(request.usage_start_date), "MMM d, yyyy") : null} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Fee
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <InfoRow label="Proposed" value={request.proposed_fee ? `${request.currency} ${Number(request.proposed_fee).toLocaleString()}` : "Not specified"} />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar - Admin Controls */}
          <div className="space-y-6">
            {/* Contract Generation Checklist */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Contract Checklist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {canGenerate ? (
                  <div className="flex items-center gap-2 text-sm text-success">
                    <CheckCircle2 className="w-4 h-4" />
                    All required fields complete
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-sm text-warning">
                      <AlertCircle className="w-4 h-4" />
                      Missing required fields:
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                      {missingPlaceholders.map(p => (
                        <li key={p} className="list-disc">{p.replace(/_/g, " ")}</li>
                      ))}
                    </ul>
                  </>
                )}

                {request.status === "approved" && !hasDraftContract && (
                  <Button 
                    className="w-full mt-2" 
                    onClick={generateContract} 
                    disabled={!canGenerate || isGenerating}
                  >
                    <FileCheck className="w-4 h-4 mr-2" />
                    {isGenerating ? "Generating..." : "Generate Contract"}
                  </Button>
                )}

                {request.status === "approved" && hasDraftContract && (
                  <Button 
                    className="w-full mt-2" 
                    onClick={sendForSignature}
                    disabled={isUpdating}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send for Signature
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Documents */}
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

            {/* Status Update */}
            {allowedTransitions.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Update Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label>Note (optional)</Label>
                    <Textarea 
                      placeholder="Add a note about this status change..."
                      value={statusNote}
                      onChange={e => setStatusNote(e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {allowedTransitions.map(status => (
                      <Button
                        key={status}
                        variant={status === "closed" ? "outline" : "default"}
                        size="sm"
                        onClick={() => updateStatus(status)}
                        disabled={isUpdating}
                      >
                        {STATUS_LABELS[status]}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Activity */}
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
