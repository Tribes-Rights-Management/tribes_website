import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { LicenseRequestFormData, DEFAULT_LICENSE_REQUEST, MediaType, MEDIA_TYPE_LABELS } from "@/types";
import { ArrowLeft, Save, Send, Loader2 } from "lucide-react";

const mediaTypes: MediaType[] = ["film", "tv", "ad", "trailer", "social", "ugc", "podcast", "game", "other"];
const currencies = ["USD", "EUR", "GBP", "CAD"];

export default function RequestFormPage() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<LicenseRequestFormData>(DEFAULT_LICENSE_REQUEST);
  const [requestId, setRequestId] = useState<string | null>(id || null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!id);

  useEffect(() => {
    if (id) loadRequest(id);
  }, [id]);

  async function loadRequest(requestId: string) {
    try {
      const { data, error } = await supabase
        .from("license_requests")
        .select("*")
        .eq("id", requestId)
        .single();

      if (error) throw error;
      
      setFormData({
        licensee_legal_name: data.licensee_legal_name || "",
        licensee_email: data.licensee_email || "",
        project_title: data.project_title || "",
        media_type: data.media_type,
        territory: data.territory || "",
        term: data.term || "",
        usage_start_date: data.usage_start_date,
        song_title: data.song_title || "",
        writers_publishers: data.writers_publishers || "",
        proposed_fee: data.proposed_fee ? parseFloat(data.proposed_fee.toString()) : null,
        currency: data.currency || "USD",
        usage_description: data.usage_description || "",
        reference_link: data.reference_link || "",
      });
      setRequestId(requestId);
    } catch (error) {
      console.error("Error loading request:", error);
      toast({ title: "Error", description: "Failed to load request", variant: "destructive" });
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  }

  function update(field: keyof LicenseRequestFormData, value: any) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  async function saveDraft() {
    if (!user) return;
    setIsSaving(true);
    try {
      const payload = { user_id: user.id, status: "draft" as const, ...formData };

      if (requestId) {
        const { error } = await supabase.from("license_requests").update(payload).eq("id", requestId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("license_requests").insert(payload).select().single();
        if (error) throw error;
        setRequestId(data.id);
        window.history.replaceState(null, "", `/request/${data.id}/edit`);
      }
      toast({ title: "Draft saved" });
    } catch (error) {
      console.error("Error saving draft:", error);
      toast({ title: "Error", description: "Failed to save draft", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }

  async function submitRequest() {
    // Validate required fields
    const missing = [];
    if (!formData.licensee_legal_name) missing.push("Licensee Name");
    if (!formData.licensee_email) missing.push("Licensee Email");
    if (!formData.project_title) missing.push("Project Title");
    if (!formData.song_title) missing.push("Song Title");
    if (!formData.media_type) missing.push("Media Type");
    if (!formData.territory) missing.push("Territory");
    if (!formData.term) missing.push("Term");

    if (missing.length > 0) {
      toast({ 
        title: "Missing required fields", 
        description: missing.join(", "), 
        variant: "destructive" 
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { 
        user_id: user!.id, 
        status: "submitted" as const, 
        submitted_at: new Date().toISOString(),
        ...formData 
      };

      if (requestId) {
        const { error } = await supabase.from("license_requests").update(payload).eq("id", requestId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("license_requests").insert(payload);
        if (error) throw error;
      }

      toast({ title: "Request submitted", description: "We'll review your request shortly." });
      navigate("/");
    } catch (error) {
      console.error("Error submitting:", error);
      toast({ title: "Error", description: "Failed to submit request", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <h1 className="text-2xl font-semibold tracking-tight mb-1">
          {requestId ? "Edit Request" : "New License Request"}
        </h1>
        <p className="text-muted-foreground text-sm mb-6">
          Complete all required fields to submit your request.
        </p>

        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Licensee Info */}
            <section className="space-y-4">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Licensee</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name / Company *</Label>
                  <Input id="name" placeholder="Acme Productions" value={formData.licensee_legal_name} onChange={e => update("licensee_legal_name", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" placeholder="contact@acme.com" value={formData.licensee_email} onChange={e => update("licensee_email", e.target.value)} />
                </div>
              </div>
            </section>

            <div className="subtle-divider" />

            {/* Project Info */}
            <section className="space-y-4">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Project</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project">Project Title *</Label>
                  <Input id="project" placeholder="The Documentary" value={formData.project_title} onChange={e => update("project_title", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="media">Media Type *</Label>
                  <Select value={formData.media_type || ""} onValueChange={v => update("media_type", v as MediaType)}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      {mediaTypes.map(t => <SelectItem key={t} value={t}>{MEDIA_TYPE_LABELS[t]}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="usage">Usage Description</Label>
                <Textarea id="usage" placeholder="Describe how the music will be used..." value={formData.usage_description} onChange={e => update("usage_description", e.target.value)} rows={3} />
              </div>
            </section>

            <div className="subtle-divider" />

            {/* Music Info */}
            <section className="space-y-4">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Music</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="song">Song Title *</Label>
                  <Input id="song" placeholder="Song name" value={formData.song_title} onChange={e => update("song_title", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="writers">Writers / Publishers</Label>
                  <Input id="writers" placeholder="John Doe (ASCAP)" value={formData.writers_publishers} onChange={e => update("writers_publishers", e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ref">Reference Link</Label>
                <Input id="ref" type="url" placeholder="https://..." value={formData.reference_link} onChange={e => update("reference_link", e.target.value)} />
              </div>
            </section>

            <div className="subtle-divider" />

            {/* Terms & Budget */}
            <section className="space-y-4">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Terms</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="territory">Territory *</Label>
                  <Input id="territory" placeholder="Worldwide" value={formData.territory} onChange={e => update("territory", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="term">Term *</Label>
                  <Input id="term" placeholder="In perpetuity" value={formData.term} onChange={e => update("term", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start">Start Date</Label>
                  <Input id="start" type="date" value={formData.usage_start_date || ""} onChange={e => update("usage_start_date", e.target.value || null)} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fee">Proposed Fee</Label>
                  <Input id="fee" type="number" min="0" placeholder="5000" value={formData.proposed_fee || ""} onChange={e => update("proposed_fee", e.target.value ? parseFloat(e.target.value) : null)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={formData.currency} onValueChange={v => update("currency", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {currencies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={saveDraft} disabled={isSaving}>
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Draft
          </Button>
          <Button onClick={submitRequest} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
            Submit
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
