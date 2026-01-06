import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { StatusBadge } from "@/components/StatusBadge";
import { DetailSection, DetailRow, DetailBlock } from "@/components/DetailSection";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { LicenseRequest, StatusHistory, GeneratedDocument, RequestStatus, STATUS_LABELS } from "@/types";
import { ArrowLeft, Download, Eye, FileText, Plus, ExternalLink } from "lucide-react";
import { format } from "date-fns";

interface InternalNote {
  id: string;
  note: string;
  user_id: string;
  created_at: string;
}

const WORKFLOW_TRANSITIONS: Record<RequestStatus, RequestStatus[]> = {
  draft: [],
  submitted: ["in_review", "needs_info"],
  in_review: ["approved", "needs_info"],
  needs_info: ["in_review"],
  approved: ["awaiting_signature"],
  sent_for_signature: ["awaiting_payment", "done"],
  awaiting_signature: ["awaiting_payment", "done"],
  awaiting_payment: ["done"],
  executed: ["done"],
  closed: [],
  done: [],
};

export default function AdminRequestDetailPage() {
  const { id } = useParams();
  const { user, isSuperAdmin, isAdminView } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [request, setRequest] = useState<LicenseRequest | null>(null);
  const [history, setHistory] = useState<StatusHistory[]>([]);
  const [documents, setDocuments] = useState<GeneratedDocument[]>([]);
  const [notes, setNotes] = useState<InternalNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusNote, setStatusNote] = useState("");
  const [newNote, setNewNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);

  useEffect(() => {
    if (id) fetchRequestData(id);
  }, [id]);

  async function fetchRequestData(requestId: string) {
    try {
      const [requestRes, historyRes, docsRes, notesRes] = await Promise.all([
        supabase.from("license_requests").select("*").eq("id", requestId).single(),
        supabase.from("status_history").select("*").eq("request_id", requestId).order("created_at", { ascending: false }),
        supabase.from("generated_documents").select("*").eq("request_id", requestId).order("created_at", { ascending: false }),
        supabase.from("internal_notes").select("*").eq("request_id", requestId).order("created_at", { ascending: false }),
      ]);

      if (requestRes.error) throw requestRes.error;
      setRequest(requestRes.data);
      setHistory(historyRes.data || []);
      setDocuments(docsRes.data || []);
      setNotes(notesRes.data || []);
    } catch (error) {
      console.error("Error fetching request:", error);
      toast({ title: "Error", description: "Failed to load request", variant: "destructive" });
      navigate("/admin");
    } finally {
      setIsLoading(false);
    }
  }

  async function updateStatus(newStatus: RequestStatus) {
    if (!request || !user || !isSuperAdmin) return;
    
    setIsUpdating(true);
    try {
      const { error: updateError } = await supabase
        .from("license_requests")
        .update({ status: newStatus })
        .eq("id", request.id);

      if (updateError) throw updateError;

      await supabase.from("status_history").insert({
        request_id: request.id,
        from_status: request.status,
        to_status: newStatus,
        actor_user_id: user.id,
        notes: statusNote || null,
      });

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

  async function addNote() {
    if (!request || !user || !isSuperAdmin || !newNote.trim()) return;
    
    setIsAddingNote(true);
    try {
      const { error } = await supabase.from("internal_notes").insert({
        request_id: request.id,
        user_id: user.id,
        note: newNote.trim(),
      });

      if (error) throw error;
      toast({ title: "Note added" });
      setNewNote("");
      fetchRequestData(request.id);
    } catch (error) {
      console.error("Error adding note:", error);
      toast({ title: "Error", description: "Failed to add note", variant: "destructive" });
    } finally {
      setIsAddingNote(false);
    }
  }

  const shortId = request?.id.slice(0, 8).toUpperCase();
  const allowedTransitions = request ? WORKFLOW_TRANSITIONS[request.status] : [];
  const executedDoc = documents.find(d => d.doc_type === "executed");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header isAdminView={isAdminView} onExit={() => navigate("/portal")} />
        <main className="container flex-1 pt-5 pb-8">
          <div className="max-w-5xl mx-auto space-y-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
      </div>
    );
  }

  if (!request) return null;

  const requesterName = [request.first_name, request.last_name].filter(Boolean).join(" ") || request.licensee_legal_name || "—";
  const fullAddress = [
    request.address_street,
    request.address_city,
    request.address_state,
    request.address_zip,
    request.address_country,
  ].filter(Boolean).join(", ");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header isAdminView={isAdminView} onExit={() => navigate("/portal")} />

      <main className="container flex-1 pt-5 pb-8">
        <div className="max-w-5xl mx-auto">
          {/* Back Link */}
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            License Queue
          </button>

          {/* Title */}
          <div className="flex items-center gap-3 mb-6">
            <h1 className="text-xl font-semibold tracking-tight">
              Request TRL-{shortId}
            </h1>
            <StatusBadge status={request.status} />
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-[1fr_320px] gap-8">
            {/* Main Column */}
            <div className="space-y-8">
              {/* Request Summary */}
              <DetailSection title="Request Summary">
                <DetailRow label="Requester" value={requesterName} />
                {request.organization && <DetailRow label="Organization" value={request.organization} />}
                <DetailRow label="Email" value={request.licensee_email} />
                <DetailRow label="Submitted" value={request.submitted_at ? format(new Date(request.submitted_at), "MMM d, yyyy 'at' h:mm a") : "—"} />
                <DetailRow label="Status" value={STATUS_LABELS[request.status]} />
              </DetailSection>

              <div className="h-px bg-border/30" />

              {/* Agreement Acknowledgements */}
              <DetailSection title="Agreement Acknowledgements">
                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center gap-2">
                    <span className={request.agreement_terms ? "text-emerald-600" : "text-muted-foreground"}>
                      {request.agreement_terms ? "✓" : "○"}
                    </span>
                    <span className={request.agreement_terms ? "" : "text-muted-foreground"}>
                      Agreed to Terms of Use
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={request.agreement_accounting ? "text-emerald-600" : "text-muted-foreground"}>
                      {request.agreement_accounting ? "✓" : "○"}
                    </span>
                    <span className={request.agreement_accounting ? "" : "text-muted-foreground"}>
                      Acknowledged Accounting Requirements
                    </span>
                  </div>
                </div>
              </DetailSection>

              <div className="h-px bg-border/30" />

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
                  <p className="text-sm text-muted-foreground">No files uploaded.</p>
                )}
              </DetailSection>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status */}
              <div className="space-y-3">
                <h3 className="text-[11px] uppercase tracking-wider text-muted-foreground/70 font-medium">
                  Status
                </h3>
                <StatusBadge status={request.status} className="text-sm" />
                
                {isSuperAdmin && allowedTransitions.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <Select onValueChange={(v) => updateStatus(v as RequestStatus)} disabled={isUpdating}>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Change status…" />
                      </SelectTrigger>
                      <SelectContent>
                        {allowedTransitions.map(status => (
                          <SelectItem key={status} value={status}>
                            {STATUS_LABELS[status]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Textarea
                      placeholder="Note (optional)…"
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      rows={2}
                      className="text-sm"
                    />
                  </div>
                )}

                {isAdminView && (
                  <p className="text-xs text-muted-foreground">View-only access</p>
                )}
              </div>

              <div className="h-px bg-border/30" />

              {/* Actions */}
              {isSuperAdmin && (
                <div className="space-y-3">
                  <h3 className="text-[11px] uppercase tracking-wider text-muted-foreground/70 font-medium">
                    Actions
                  </h3>
                  
                  <TooltipProvider>
                    {(request.status === "approved") && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            disabled
                            className="w-full flex items-center justify-center gap-2 h-9 px-3 text-sm bg-muted text-muted-foreground rounded-md cursor-not-allowed"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Send Sign + Pay Link
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Coming soon</TooltipContent>
                      </Tooltip>
                    )}

                    {(request.status === "awaiting_signature" || request.status === "awaiting_payment") && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            disabled
                            className="w-full flex items-center justify-center gap-2 h-9 px-3 text-sm bg-muted text-muted-foreground rounded-md cursor-not-allowed"
                          >
                            Resend Link
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Coming soon</TooltipContent>
                      </Tooltip>
                    )}

                    {request.status === "done" && executedDoc && (
                      <a
                        href={executedDoc.storage_path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 h-9 px-3 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download Executed Agreement
                      </a>
                    )}
                  </TooltipProvider>
                </div>
              )}

              {isSuperAdmin && <div className="h-px bg-border/30" />}

              {/* Internal Notes */}
              <div className="space-y-3">
                <h3 className="text-[11px] uppercase tracking-wider text-muted-foreground/70 font-medium">
                  Internal Notes
                </h3>
                
                {isSuperAdmin && (
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Add a note…"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      rows={2}
                      className="text-sm"
                    />
                    <button
                      onClick={addNote}
                      disabled={!newNote.trim() || isAddingNote}
                      className="flex items-center gap-1.5 text-sm text-primary hover:underline disabled:opacity-50 disabled:no-underline"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Note
                    </button>
                  </div>
                )}

                {notes.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {notes.map(note => (
                      <div key={note.id} className="text-sm">
                        <p className="text-foreground">{note.note}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(note.created_at), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No internal notes.</p>
                )}
              </div>

              <div className="h-px bg-border/30" />

              {/* Activity Timeline */}
              <div className="space-y-3">
                <h3 className="text-[11px] uppercase tracking-wider text-muted-foreground/70 font-medium">
                  Activity
                </h3>
                
                <div className="space-y-2.5 max-h-72 overflow-y-auto">
                  {history.length > 0 ? (
                    history.map((item, i) => (
                      <div key={item.id} className="flex gap-2.5">
                        <div className="flex flex-col items-center pt-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-primary' : 'bg-border'}`} />
                          {i < history.length - 1 && <div className="w-px flex-1 bg-border/50 mt-1" />}
                        </div>
                        <div className="flex-1 pb-2">
                          <p className="text-sm">
                            {item.from_status 
                              ? `${STATUS_LABELS[item.from_status]} → ${STATUS_LABELS[item.to_status]}`
                              : STATUS_LABELS[item.to_status]
                            }
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(item.created_at), "MMM d, yyyy 'at' h:mm a")}
                          </p>
                          {item.notes && (
                            <p className="text-xs text-muted-foreground mt-0.5 italic">"{item.notes}"</p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Created {format(new Date(request.created_at), "MMM d, yyyy")}</p>
                      {request.submitted_at && (
                        <p>Submitted {format(new Date(request.submitted_at), "MMM d, yyyy")}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-4 mt-auto">
        <div className="container text-center text-xs text-muted-foreground/70">
          © {new Date().getFullYear()} Tribes Rights Management LLC. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function Header({ isAdminView, onExit }: { isAdminView: boolean; onExit: () => void }) {
  return (
    <header className="border-b border-border/40">
      <div className="container flex items-center justify-between h-12">
        <div className="flex items-center gap-2.5">
          <span className="text-base font-semibold tracking-tight">TRIBES</span>
          <span className="text-muted-foreground/50">|</span>
          <span className="text-sm text-muted-foreground">Admin</span>
          {isAdminView && (
            <span className="flex items-center gap-1 ml-1.5 text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
              <Eye className="w-3 h-3" />
              View Only
            </span>
          )}
        </div>
        <button 
          onClick={onExit}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Exit Admin
        </button>
      </div>
    </header>
  );
}
