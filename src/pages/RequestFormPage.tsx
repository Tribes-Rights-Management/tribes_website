import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/AppLayout";
import { FormStepper } from "@/components/form/FormStepper";
import { StepLicensee } from "@/components/form/StepLicensee";
import { StepProject } from "@/components/form/StepProject";
import { StepUsage } from "@/components/form/StepUsage";
import { StepMusic } from "@/components/form/StepMusic";
import { StepBudget } from "@/components/form/StepBudget";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LicenseRequestFormData, DEFAULT_LICENSE_REQUEST, LicenseRequest } from "@/types";
import { ArrowLeft, ArrowRight, Save, Send, Loader2 } from "lucide-react";

const STEPS = ["Licensee", "Project", "Usage", "Music", "Budget"];

export default function RequestFormPage() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<LicenseRequestFormData>(DEFAULT_LICENSE_REQUEST);
  const [requestId, setRequestId] = useState<string | null>(id || null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!id);

  // Load existing request if editing
  useEffect(() => {
    if (id) {
      loadRequest(id);
    }
  }, [id]);

  async function loadRequest(requestId: string) {
    try {
      const { data, error } = await supabase
        .from("license_requests")
        .select("*")
        .eq("id", requestId)
        .single();

      if (error) throw error;
      
      // Map database fields to form data
      setFormData({
        licensee_legal_name: data.licensee_legal_name || "",
        licensee_entity_type: data.licensee_entity_type,
        licensee_address: data.licensee_address || "",
        licensee_email: data.licensee_email || "",
        licensee_phone: data.licensee_phone || "",
        project_title: data.project_title || "",
        production_company: data.production_company || "",
        distributor_network_platform: data.distributor_network_platform || "",
        release_date: data.release_date,
        media_type: data.media_type,
        placement: data.placement || "",
        usage_duration: data.usage_duration || "",
        usage_start_date: data.usage_start_date,
        usage_end_date: data.usage_end_date,
        term: data.term || "",
        territory: data.territory || "",
        is_exclusive: data.is_exclusive || false,
        has_paid_media: data.has_paid_media || false,
        song_title: data.song_title || "",
        writers_publishers: data.writers_publishers || "",
        isrc: data.isrc || "",
        iswc: data.iswc || "",
        reference_link: data.reference_link || "",
        proposed_fee: data.proposed_fee ? parseFloat(data.proposed_fee.toString()) : null,
        currency: data.currency || "USD",
        is_mfn: data.is_mfn || false,
        is_most_favored_terms: data.is_most_favored_terms || false,
        additional_notes: data.additional_notes || "",
      });
      setRequestId(requestId);
    } catch (error) {
      console.error("Error loading request:", error);
      toast({
        title: "Error",
        description: "Failed to load request",
        variant: "destructive",
      });
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  }

  function updateFormData(updates: Partial<LicenseRequestFormData>) {
    setFormData((prev) => ({ ...prev, ...updates }));
  }

  async function saveDraft() {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const data = {
        user_id: user.id,
        status: "draft" as const,
        ...formData,
      };

      if (requestId) {
        const { error } = await supabase
          .from("license_requests")
          .update(data)
          .eq("id", requestId);
        
        if (error) throw error;
      } else {
        const { data: newRequest, error } = await supabase
          .from("license_requests")
          .insert(data)
          .select()
          .single();
        
        if (error) throw error;
        setRequestId(newRequest.id);
        // Update URL without navigation
        window.history.replaceState(null, "", `/request/${newRequest.id}/edit`);
      }

      toast({
        title: "Draft saved",
        description: "Your progress has been saved.",
      });
    } catch (error) {
      console.error("Error saving draft:", error);
      toast({
        title: "Error",
        description: "Failed to save draft",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function submitRequest() {
    // Validate required fields
    if (!formData.licensee_legal_name || !formData.licensee_email) {
      toast({
        title: "Missing information",
        description: "Please fill in the required licensee information.",
        variant: "destructive",
      });
      setCurrentStep(0);
      return;
    }

    if (!formData.project_title) {
      toast({
        title: "Missing information",
        description: "Please provide a project title.",
        variant: "destructive",
      });
      setCurrentStep(1);
      return;
    }

    if (!formData.song_title) {
      toast({
        title: "Missing information",
        description: "Please provide a song title.",
        variant: "destructive",
      });
      setCurrentStep(3);
      return;
    }

    setIsSubmitting(true);
    try {
      const data = {
        user_id: user!.id,
        status: "submitted" as const,
        submitted_at: new Date().toISOString(),
        ...formData,
      };

      if (requestId) {
        const { error } = await supabase
          .from("license_requests")
          .update(data)
          .eq("id", requestId);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("license_requests")
          .insert(data);
        
        if (error) throw error;
      }

      toast({
        title: "Request submitted",
        description: "Your license request has been submitted for review.",
      });
      
      navigate("/");
    } catch (error) {
      console.error("Error submitting request:", error);
      toast({
        title: "Error",
        description: "Failed to submit request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function nextStep() {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }

  function prevStep() {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
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
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Requests
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">
            {requestId ? "Edit Request" : "New License Request"}
          </h1>
          <p className="text-muted-foreground text-sm">
            Complete all steps to submit your request for review.
          </p>
        </div>

        {/* Stepper */}
        <FormStepper
          steps={STEPS}
          currentStep={currentStep}
          onStepClick={setCurrentStep}
        />

        {/* Form Content */}
        <Card>
          <CardContent className="p-6">
            {currentStep === 0 && (
              <StepLicensee data={formData} onChange={updateFormData} />
            )}
            {currentStep === 1 && (
              <StepProject data={formData} onChange={updateFormData} />
            )}
            {currentStep === 2 && (
              <StepUsage data={formData} onChange={updateFormData} />
            )}
            {currentStep === 3 && (
              <StepMusic data={formData} onChange={updateFormData} />
            )}
            {currentStep === 4 && (
              <StepBudget data={formData} onChange={updateFormData} />
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={saveDraft} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Draft
            </Button>

            {currentStep < STEPS.length - 1 ? (
              <Button onClick={nextStep}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={submitRequest} disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Submit Request
              </Button>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
