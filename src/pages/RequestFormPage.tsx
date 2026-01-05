import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { WizardFormData, DEFAULT_WIZARD_FORM } from "@/types";
import { ArrowLeft, ArrowRight, Loader2, Send } from "lucide-react";

import { WizardProgress } from "@/components/wizard/WizardProgress";
import { CoverStep } from "@/components/wizard/steps/CoverStep";
import { AgreementStep } from "@/components/wizard/steps/AgreementStep";
import { YourInfoStep } from "@/components/wizard/steps/YourInfoStep";
import { ProductDetailsStep } from "@/components/wizard/steps/ProductDetailsStep";
import { TrackDetailsStep } from "@/components/wizard/steps/TrackDetailsStep";
import { ReviewStep } from "@/components/wizard/steps/ReviewStep";
import { ThankYouStep } from "@/components/wizard/steps/ThankYouStep";

const TOTAL_STEPS = 7; // 0: Cover, 1: Agreement, 2: Your Info, 3: Product, 4: Track, 5: Review, 6: Thank You

export default function RequestFormPage() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(id ? 1 : 0);
  const [formData, setFormData] = useState<WizardFormData>(DEFAULT_WIZARD_FORM);
  const [requestId, setRequestId] = useState<string | null>(id || null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!id);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) loadRequest(id);
  }, [id]);

  async function loadRequest(requestId: string) {
    try {
      const { data, error } = await supabase
        .from("license_requests")
        .select("*")
        .eq("id", requestId)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        toast({ title: "Request not found", variant: "destructive" });
        navigate("/");
        return;
      }
      
      setFormData({
        agreement_accounting: data.agreement_accounting || false,
        agreement_terms: data.agreement_terms || false,
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        organization: data.organization || "",
        licensee_email: data.licensee_email || "",
        address_street: data.address_street || "",
        address_city: data.address_city || "",
        address_state: data.address_state || "",
        address_zip: data.address_zip || "",
        address_country: data.address_country || "United States",
        label_master_owner: data.label_master_owner || "",
        distributor: data.distributor || "",
        release_date: data.release_date || null,
        recording_artist: data.recording_artist || "",
        release_title: data.release_title || "",
        product_upc: data.product_upc || "",
        additional_product_info: data.additional_product_info || "",
        track_title: data.track_title || "",
        track_artist: data.track_artist || "",
        track_isrc: data.track_isrc || "",
        runtime: data.runtime || "",
        appears_multiple_times: data.appears_multiple_times || false,
        times_count: data.times_count || null,
        additional_track_info: data.additional_track_info || "",
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

  function update(field: string, value: any) {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  const autosave = useCallback(async () => {
    if (!user || !requestId) return;
    
    try {
      const { error } = await supabase
        .from("license_requests")
        .update({ 
          ...formData,
          updated_at: new Date().toISOString()
        })
        .eq("id", requestId);
      
      if (error) console.error("Autosave error:", error);
    } catch (error) {
      console.error("Autosave error:", error);
    }
  }, [user, requestId, formData]);

  // Autosave on form data change (debounced)
  useEffect(() => {
    if (!requestId || currentStep === 0 || currentStep === 6) return;
    
    const timer = setTimeout(() => {
      autosave();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [formData, requestId, currentStep, autosave]);

  async function createDraft() {
    if (!user) return;
    setIsSaving(true);
    
    try {
      const { data, error } = await supabase
        .from("license_requests")
        .insert({
          user_id: user.id,
          status: "draft" as const,
          ...formData
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setRequestId(data.id);
      window.history.replaceState(null, "", `/portal/request/${data.id}/edit`);
      setCurrentStep(1);
    } catch (error) {
      console.error("Error creating draft:", error);
      toast({ title: "Error", description: "Failed to create request", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }

  function validateStep(step: number): boolean {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 1: // Agreement
        if (!formData.agreement_accounting) {
          newErrors.agreement_accounting = "You must agree to provide accounting";
        }
        if (!formData.agreement_terms) {
          newErrors.agreement_terms = "You must agree to the Terms of Use";
        }
        break;
      
      case 2: // Your Info
        if (!formData.first_name.trim()) newErrors.first_name = "First name is required";
        if (!formData.last_name.trim()) newErrors.last_name = "Last name is required";
        if (!formData.licensee_email.trim()) {
          newErrors.licensee_email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.licensee_email)) {
          newErrors.licensee_email = "Please enter a valid email";
        }
        if (!formData.address_country.trim()) newErrors.address_country = "Country is required";
        if (!formData.address_street.trim()) newErrors.address_street = "Street address is required";
        if (!formData.address_city.trim()) newErrors.address_city = "City is required";
        if (!formData.address_state.trim()) newErrors.address_state = "State/Province is required";
        if (!formData.address_zip.trim()) newErrors.address_zip = "ZIP/Postal code is required";
        break;
      
      case 3: // Product Details
        if (!formData.label_master_owner.trim()) newErrors.label_master_owner = "Label / Master Owner is required";
        if (!formData.distributor.trim()) newErrors.distributor = "Distributor is required";
        if (!formData.release_date) newErrors.release_date = "Release date is required";
        if (!formData.recording_artist.trim()) newErrors.recording_artist = "Recording artist is required";
        if (!formData.release_title.trim()) newErrors.release_title = "Release title is required";
        if (!formData.product_upc.trim()) newErrors.product_upc = "Product UPC is required";
        break;
      
      case 4: // Track Details
        if (!formData.track_title.trim()) newErrors.track_title = "Track title is required";
        if (!formData.track_artist.trim()) newErrors.track_artist = "Track artist is required";
        if (!formData.track_isrc.trim()) newErrors.track_isrc = "Track ISRC is required";
        if (!formData.runtime.trim()) {
          newErrors.runtime = "Runtime is required";
        } else if (!/^\d{1,2}:\d{2}$/.test(formData.runtime)) {
          newErrors.runtime = "Please use MM:SS format";
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function goNext() {
    if (currentStep === 0) {
      createDraft();
      return;
    }
    
    if (!validateStep(currentStep)) return;
    
    setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS - 1));
  }

  function goBack() {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }

  function goToStep(step: number) {
    setCurrentStep(step);
  }

  async function submitRequest() {
    if (!requestId) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("license_requests")
        .update({
          ...formData,
          status: "submitted" as const,
          submitted_at: new Date().toISOString(),
          // Combine first + last name into licensee_legal_name for compatibility
          licensee_legal_name: `${formData.first_name} ${formData.last_name}`.trim(),
          // Map track_title to song_title for contract generation
          song_title: formData.track_title,
        })
        .eq("id", requestId);
      
      if (error) throw error;
      
      setCurrentStep(6);
    } catch (error) {
      console.error("Error submitting:", error);
      toast({ title: "Error", description: "Failed to submit request", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold tracking-tight">TRIBES</span>
            <span className="text-sm text-muted-foreground">Rights Licensing</span>
          </div>
          {currentStep > 0 && currentStep < 6 && (
            <Button variant="ghost" size="sm" onClick={() => navigate("/portal")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Exit
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container py-8">
        <div className="max-w-2xl mx-auto">
          <WizardProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />
          
          <Card className="border-0 shadow-none sm:border sm:shadow-sm">
            <CardContent className="p-6 sm:p-8">
              {currentStep === 0 && (
                <CoverStep onStart={goNext} isLoading={isSaving} />
              )}
              
              {currentStep === 1 && (
                <AgreementStep
                  agreementAccounting={formData.agreement_accounting}
                  agreementTerms={formData.agreement_terms}
                  onUpdate={update}
                  errors={errors}
                />
              )}
              
              {currentStep === 2 && (
                <YourInfoStep
                  data={{
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    organization: formData.organization,
                    licensee_email: formData.licensee_email,
                    address_street: formData.address_street,
                    address_city: formData.address_city,
                    address_state: formData.address_state,
                    address_zip: formData.address_zip,
                    address_country: formData.address_country,
                  }}
                  onUpdate={update}
                  errors={errors}
                />
              )}
              
              {currentStep === 3 && (
                <ProductDetailsStep
                  data={{
                    label_master_owner: formData.label_master_owner,
                    distributor: formData.distributor,
                    release_date: formData.release_date,
                    recording_artist: formData.recording_artist,
                    release_title: formData.release_title,
                    product_upc: formData.product_upc,
                    additional_product_info: formData.additional_product_info,
                  }}
                  onUpdate={update}
                  errors={errors}
                />
              )}
              
              {currentStep === 4 && (
                <TrackDetailsStep
                  data={{
                    track_title: formData.track_title,
                    track_artist: formData.track_artist,
                    track_isrc: formData.track_isrc,
                    runtime: formData.runtime,
                    appears_multiple_times: formData.appears_multiple_times,
                    times_count: formData.times_count,
                    additional_track_info: formData.additional_track_info,
                  }}
                  onUpdate={update}
                  errors={errors}
                />
              )}
              
              {currentStep === 5 && (
                <ReviewStep data={formData} onEditStep={goToStep} />
              )}
              
              {currentStep === 6 && <ThankYouStep />}
            </CardContent>
          </Card>

          {/* Navigation */}
          {currentStep >= 1 && currentStep <= 5 && (
            <div className="flex justify-between mt-6">
              <Button 
                variant="ghost" 
                onClick={goBack}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              
              {currentStep < 5 ? (
                <Button onClick={goNext}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={submitRequest} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Request
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-4">
        <div className="container text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Tribes Rights Management LLC. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
