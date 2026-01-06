import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusBadge } from "@/components/StatusBadge";
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
import { ArrowLeft, Download, Copy, Check } from "lucide-react";
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
  const [newNote, setNewNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

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
      await supabase.from("license_requests").update({ status: newStatus }).eq("id", request.id);
      await supabase.from("status_history").insert({
        request_id: request.id,
        from_status: request.status,
        to_status: newStatus,
        actor_user_id: user.id,
      });
      toast({ title: "Status updated" });
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
      await supabase.from("internal_notes").insert({
        request_id: request.id,
        user_id: user.id,
        note: newNote.trim(),
      });
      setNewNote("");
      fetchRequestData(request.id);
    } catch (error) {
      console.error("Error adding note:", error);
      toast({ title: "Error", description: "Failed to add note", variant: "destructive" });
    } finally {
      setIsAddingNote(false);
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

  const allowedTransitions = request ? WORKFLOW_TRANSITIONS[request.status] : [];
  const executedDoc = documents.find(d => d.doc_type === "executed");

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-5xl opacity-0" />
      </DashboardLayout>
    );
  }

  if (!request) return null;

  const requesterName = [request.first_name, request.last_name].filter(Boolean).join(" ") || request.licensee_legal_name || "—";
  const fullAddress = [request.address_street, request.address_city, request.address_state, request.address_zip, request.address_country].filter(Boolean).join(", ");

  return (
    <DashboardLayout>
      <div className="max-w-5xl animate-content-fade">
        {/* Back */}
        <button
          onClick={() => navigate("/admin")}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Dashboard
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-8">
          <h1>{request.license_id || "License Request"}</h1>
          {request.license_id && (
            <button
              onClick={copyLicenseId}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Copy License ID"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Two Column */}
        <div className="grid lg:grid-cols-[1fr_260px] gap-12">
          {/* Main */}
          <div className="space-y-8">
            <Section title="Summary">
              <Grid>
                <Field label="Requester" value={requesterName} />
                <Field label="Organization" value={request.organization} />
                <Field label="Email" value={request.licensee_email} />
                <Field label="Submitted" value={request.submitted_at ? format(new Date(request.submitted_at), "MMM d, yyyy") : "—"} />
              </Grid>
            </Section>

            <Section title="Agreements">
              <div className="flex gap-6 text-sm">
                <span className={request.agreement_terms ? "" : "text-muted-foreground"}>
                  {request.agreement_terms ? "✓" : "○"} Terms
                </span>
                <span className={request.agreement_accounting ? "" : "text-muted-foreground"}>
                  {request.agreement_accounting ? "✓" : "○"} Accounting
                </span>
              </div>
            </Section>

            <Section title="Contact">
              <Grid>
                <Field label="First Name" value={request.first_name} />
                <Field label="Last Name" value={request.last_name} />
                <Field label="Email" value={request.licensee_email} />
                <Field label="Organization" value={request.organization} />
              </Grid>
              {fullAddress && <p className="text-sm mt-3">{fullAddress}</p>}
            </Section>

            <Section title="Product">
              <Grid>
                <Field label="Label / Master Owner" value={request.label_master_owner} />
                <Field label="Distributor" value={request.distributor} />
                <Field label="Recording Artist" value={request.recording_artist} />
                <Field label="Release Title" value={request.release_title} />
                <Field label="Release Date" value={request.release_date ? format(new Date(request.release_date), "MMM d, yyyy") : null} />
                <Field label="UPC" value={request.product_upc} />
              </Grid>
              {request.additional_product_info && <p className="text-sm text-muted-foreground mt-3">{request.additional_product_info}</p>}
            </Section>

            <Section title="Track">
              <Grid>
                <Field label="Title" value={request.track_title || request.song_title} />
                <Field label="Artist" value={request.track_artist} />
                <Field label="ISRC" value={request.track_isrc} />
                <Field label="Runtime" value={request.runtime} />
                <Field label="Multiple Uses" value={request.appears_multiple_times ? `Yes (${request.times_count || "?"})` : "No"} />
              </Grid>
              {request.additional_track_info && <p className="text-sm text-muted-foreground mt-3">{request.additional_track_info}</p>}
            </Section>

            {documents.length > 0 && (
              <Section title="Documents">
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
                      {doc.doc_type === "draft" ? "Draft" : "Executed"} — {format(new Date(doc.created_at), "MMM d")}
                    </a>
                  ))}
                </div>
              </Section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Status */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-3">Status</p>
              <StatusBadge status={request.status} />

              {isSuperAdmin && allowedTransitions.length > 0 && (
                <Select onValueChange={(v) => updateStatus(v as RequestStatus)} disabled={isUpdating}>
                  <SelectTrigger className="mt-3 h-9">
                    <SelectValue placeholder="Change…" />
                  </SelectTrigger>
                  <SelectContent>
                    {allowedTransitions.map(s => (
                      <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {isAdminView && <p className="text-xs text-muted-foreground mt-2">View only</p>}

              {/* Actions */}
              <TooltipProvider>
                {isSuperAdmin && request.status === "approved" && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button disabled className="mt-4 w-full h-10 text-sm bg-primary text-primary-foreground rounded-md opacity-40 cursor-not-allowed">
                        Send Sign + Pay Link
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Coming soon</TooltipContent>
                  </Tooltip>
                )}

                {isSuperAdmin && (request.status === "awaiting_signature" || request.status === "awaiting_payment") && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button disabled className="mt-4 w-full h-10 text-sm border border-input rounded-md opacity-40 cursor-not-allowed">
                        Resend link
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Coming soon</TooltipContent>
                  </Tooltip>
                )}

                {isSuperAdmin && request.status === "done" && (
                  <button
                    onClick={handleExport}
                    disabled={isExporting}
                    className="mt-4 w-full h-10 flex items-center justify-center gap-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 active:opacity-80 active:duration-75"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {isExporting ? "…" : "Download Agreement"}
                  </button>
                )}
              </TooltipProvider>
            </div>

            {/* Notes */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-3">Notes</p>

              {isSuperAdmin && (
                <div className="mb-4">
                  <Textarea
                    placeholder="Add note…"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={2}
                    className="mb-1.5"
                  />
                  <div className="text-right">
                    <button
                      onClick={addNote}
                      disabled={!newNote.trim() || isAddingNote}
                      className="text-xs text-primary hover:underline disabled:opacity-40 disabled:no-underline"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              {notes.length > 0 ? (
                <div className="space-y-3">
                  {notes.map(n => (
                    <div key={n.id} className="text-sm">
                      <p>{n.note}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {format(new Date(n.created_at), "MMM d, h:mm a")}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No notes yet.</p>
              )}

              {/* Events */}
              {history.length > 0 && (
                <div className="mt-6 pt-4 space-y-1.5">
                  {history.slice(0, 8).map(h => (
                    <p key={h.id} className="text-xs text-muted-foreground">
                      {format(new Date(h.created_at), "MMM d")} — {h.from_status ? `${STATUS_LABELS[h.from_status]} → ` : ""}{STATUS_LABELS[h.to_status]}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
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
