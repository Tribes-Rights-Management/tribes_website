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
import { useToast } from "@/hooks/use-toast";
import { LicenseRequest, StatusHistory, GeneratedDocument, RequestStatus, STATUS_LABELS } from "@/types";
import { format } from "date-fns";
import { LicensePreviewModal } from "@/components/LicensePreviewModal";

interface InternalNote {
  id: string;
  note: string;
  user_id: string;
  created_at: string;
}

interface LicenseType {
  id: string;
  code: string;
  name: string;
  description: string | null;
  is_active: boolean;
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
  const [licenseTypes, setLicenseTypes] = useState<LicenseType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isUpdatingType, setIsUpdatingType] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (id) fetchRequestData(id);
  }, [id]);

  async function fetchRequestData(requestId: string) {
    try {
      const [requestRes, historyRes, docsRes, notesRes, typesRes] = await Promise.all([
        supabase.from("license_requests").select("*").eq("id", requestId).single(),
        supabase.from("status_history").select("*").eq("request_id", requestId).order("created_at", { ascending: false }),
        supabase.from("generated_documents").select("*").eq("request_id", requestId).order("created_at", { ascending: false }),
        supabase.from("internal_notes").select("*").eq("request_id", requestId).order("created_at", { ascending: false }),
        supabase.from("license_types").select("*").eq("is_active", true).order("sort_order"),
      ]);

      if (requestRes.error) throw requestRes.error;
      setRequest(requestRes.data);
      setHistory(historyRes.data || []);
      setDocuments(docsRes.data || []);
      setNotes(notesRes.data || []);
      setLicenseTypes(typesRes.data || []);
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

  async function updateLicenseType(typeCode: string) {
    if (!request || !user || !isSuperAdmin) return;
    
    const editableStatuses: RequestStatus[] = ["submitted", "in_review", "needs_info", "approved"];
    if (!editableStatuses.includes(request.status)) {
      toast({ title: "Cannot change", description: "License type cannot be changed after agreement is sent", variant: "destructive" });
      return;
    }
    
    setIsUpdatingType(true);
    try {
      await supabase.from("license_requests").update({ license_type: typeCode }).eq("id", request.id);
      await supabase.from("status_history").insert({
        request_id: request.id,
        from_status: request.status,
        to_status: request.status,
        actor_user_id: user.id,
        notes: `License type set to: ${typeCode}`,
      });
      toast({ title: "License type updated" });
      fetchRequestData(request.id);
    } catch (error) {
      console.error("Error updating license type:", error);
      toast({ title: "Error", description: "Failed to update license type", variant: "destructive" });
    } finally {
      setIsUpdatingType(false);
    }
  }

  const allowedTransitions = request ? WORKFLOW_TRANSITIONS[request.status] : [];
  const currentLicenseType = licenseTypes.find(t => t.code === (request as any)?.license_type);
  const canEditLicenseType = request && isSuperAdmin && ["submitted", "in_review", "needs_info", "approved"].includes(request.status);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl opacity-0" />
      </DashboardLayout>
    );
  }

  if (!request) return null;

  const requesterName = [request.first_name, request.last_name].filter(Boolean).join(" ") || request.licensee_legal_name || "—";
  const fullAddress = [request.address_street, request.address_city, request.address_state, request.address_zip, request.address_country].filter(Boolean).join(", ");

  return (
    <DashboardLayout>
      <div className="max-w-2xl animate-content-fade">
        {/* Back */}
        <button
          onClick={() => navigate("/admin")}
          className="text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          ← Dashboard
        </button>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-2">
            <StatusBadge status={request.status} />
            {isAdminView && <span className="text-[12px] text-muted-foreground">View only</span>}
          </div>
          
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

        {/* Single-column reading layout */}
        <div className="space-y-12">
          
          {/* Admin Controls */}
          {(isSuperAdmin || isAdminView) && (
            <section className="space-y-6">
              <h3 className="text-[12px] font-medium text-muted-foreground uppercase tracking-wide">Admin</h3>
              
              <div className="space-y-4">
                {isSuperAdmin && allowedTransitions.length > 0 && (
                  <div>
                    <p className="text-[12px] text-muted-foreground mb-1.5">Status</p>
                    <Select onValueChange={(v) => updateStatus(v as RequestStatus)} disabled={isUpdating}>
                      <SelectTrigger className="w-48 h-9">
                        <SelectValue placeholder="Change status…" />
                      </SelectTrigger>
                      <SelectContent>
                        {allowedTransitions.map(s => (
                          <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <p className="text-[12px] text-muted-foreground mb-1.5">License Type</p>
                  {canEditLicenseType ? (
                    <Select 
                      value={(request as any)?.license_type || ""} 
                      onValueChange={updateLicenseType} 
                      disabled={isUpdatingType}
                    >
                      <SelectTrigger className="w-48 h-9">
                        <SelectValue placeholder="Select type…" />
                      </SelectTrigger>
                      <SelectContent>
                        {licenseTypes.map(t => (
                          <SelectItem key={t.code} value={t.code}>{t.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-[14px]">
                      {currentLicenseType?.name || <span className="text-muted-foreground">Not set</span>}
                    </p>
                  )}
                </div>

                {isSuperAdmin && request.status === "done" && (
                  <div className="pt-2">
                    <button
                      onClick={() => setShowPreview(true)}
                      className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Preview agreement
                    </button>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Summary */}
          <section className="space-y-4">
            <h3 className="text-[12px] font-medium text-muted-foreground uppercase tracking-wide">Summary</h3>
            <div className="space-y-3">
              <Field label="Requester" value={requesterName} />
              <Field label="Organization" value={request.organization} />
              <Field label="Email" value={request.licensee_email} />
              <Field label="Submitted" value={request.submitted_at ? format(new Date(request.submitted_at), "MMMM d, yyyy") : null} />
            </div>
          </section>

          {/* Agreements */}
          <section className="space-y-4">
            <h3 className="text-[12px] font-medium text-muted-foreground uppercase tracking-wide">Agreements</h3>
            <div className="space-y-2 text-[14px]">
              <p className={request.agreement_terms ? "text-foreground" : "text-muted-foreground"}>
                {request.agreement_terms ? "✓" : "○"} Terms accepted
              </p>
              <p className={request.agreement_accounting ? "text-foreground" : "text-muted-foreground"}>
                {request.agreement_accounting ? "✓" : "○"} Accounting accepted
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="space-y-4">
            <h3 className="text-[12px] font-medium text-muted-foreground uppercase tracking-wide">Contact</h3>
            <div className="space-y-3">
              <Field label="Name" value={requesterName} />
              <Field label="Email" value={request.licensee_email} />
              <Field label="Organization" value={request.organization} />
              {fullAddress && <Field label="Address" value={fullAddress} />}
            </div>
          </section>

          {/* Product */}
          <section className="space-y-4">
            <h3 className="text-[12px] font-medium text-muted-foreground uppercase tracking-wide">Product</h3>
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

          {/* Track */}
          <section className="space-y-4">
            <h3 className="text-[12px] font-medium text-muted-foreground uppercase tracking-wide">Track</h3>
            <div className="space-y-3">
              <Field label="Title" value={request.track_title || request.song_title} />
              <Field label="Artist" value={request.track_artist} />
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
                    {doc.doc_type === "draft" ? "Draft" : "Executed"} — {format(new Date(doc.created_at), "MMM d, yyyy")}
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Notes (Admin only) */}
          {(isSuperAdmin || isAdminView) && (
            <section className="space-y-4">
              <h3 className="text-[12px] font-medium text-muted-foreground uppercase tracking-wide">Notes</h3>
              
              {isSuperAdmin && (
                <div className="space-y-2">
                  <Textarea
                    placeholder="Add a note…"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={2}
                  />
                  <div className="text-right">
                    <button
                      onClick={addNote}
                      disabled={!newNote.trim() || isAddingNote}
                      className="text-[13px] text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
                    >
                      Add note
                    </button>
                  </div>
                </div>
              )}

              {notes.length > 0 ? (
                <div className="space-y-4 pt-2">
                  {notes.map(n => (
                    <div key={n.id}>
                      <p className="text-[14px]">{n.note}</p>
                      <p className="text-[12px] text-muted-foreground mt-1">
                        {format(new Date(n.created_at), "MMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-muted-foreground">No notes yet.</p>
              )}
            </section>
          )}

          {/* History */}
          {history.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-[12px] font-medium text-muted-foreground uppercase tracking-wide">History</h3>
              <div className="space-y-2">
                {history.slice(0, 10).map(h => (
                  <p key={h.id} className="text-[13px] text-muted-foreground">
                    {format(new Date(h.created_at), "MMM d, yyyy")} — {h.from_status ? `${STATUS_LABELS[h.from_status]} → ` : ""}{STATUS_LABELS[h.to_status]}
                  </p>
                ))}
              </div>
            </section>
          )}
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
