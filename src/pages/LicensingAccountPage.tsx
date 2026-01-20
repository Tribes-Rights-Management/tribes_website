import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FormPageLayout, FormSuccessLayout } from "@/components/FormPageLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ConsentRow } from "@/components/ConsentRow";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { COUNTRIES } from "@/lib/countries";
import { z } from "zod";
import { FormFeedback } from "@/components/shared/FormFeedback";
import { ButtonSpinner } from "@/components/shared/ButtonSpinner";

/**
 * LICENSING ACCOUNT PAGE — Uses global FormPageLayout standard
 * NO page-specific typography or spacing overrides.
 * 
 * FORM PERSISTENCE: Uses sessionStorage to preserve form state
 * when users navigate to legal pages and return via browser Back.
 */

const STORAGE_KEY = "licensing-account-draft";

interface FormDraft {
  fullName: string;
  company: string;
  email: string;
  country: string;
  organizationType: string;
  intendedUse: string;
}

const licensingAccountSchema = z.object({
  fullName: z.string().trim().min(1, "This field is required.").max(200),
  company: z.string().trim().min(1, "This field is required.").max(200),
  email: z.string().trim().email("Enter a valid email address.").max(255),
  country: z.string().min(1, "This field is required."),
  organizationType: z.string().min(1, "This field is required."),
  intendedUse: z.string().trim().min(1, "This field is required.").max(2000),
  agreeToTerms: z.literal(true, {
    errorMap: () => ({ message: "This information is required to proceed." }),
  }),
});

type ViewState = "form" | "pending" | "submitted" | "exists";

export default function LicensingAccountPage() {
  const [viewState, setViewState] = useState<ViewState>("form");
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [organizationType, setOrganizationType] = useState("");
  const [intendedUse, setIntendedUse] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRestored, setIsRestored] = useState(false);
  const { toast } = useToast();

  // Restore form draft from sessionStorage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const draft: FormDraft = JSON.parse(saved);
        setFullName(draft.fullName || "");
        setCompany(draft.company || "");
        setEmail(draft.email || "");
        setCountry(draft.country || "");
        setOrganizationType(draft.organizationType || "");
        setIntendedUse(draft.intendedUse || "");
      }
    } catch (e) {
      // Ignore parse errors
    }
    setIsRestored(true);
  }, []);

  // Save form draft to sessionStorage on change (after initial restore)
  const saveDraft = useCallback(() => {
    if (!isRestored) return;
    const draft: FormDraft = {
      fullName,
      company,
      email,
      country,
      organizationType,
      intendedUse,
    };
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch (e) {
      // Ignore storage errors
    }
  }, [isRestored, fullName, company, email, country, organizationType, intendedUse]);

  useEffect(() => {
    saveDraft();
  }, [saveDraft]);

  // Clear draft on successful submission
  const clearDraft = useCallback(() => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // Ignore errors
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = licensingAccountSchema.safeParse({
      fullName,
      company,
      email,
      country,
      organizationType,
      intendedUse,
      agreeToTerms,
    });

    if (!result.success) {
      toast({
        title: "Please complete all required fields",
        description: result.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const nameParts = fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const { data, error } = await supabase.functions.invoke("auth-check", {
        body: {
          email: email.trim().toLowerCase(),
          firstName: firstName,
          lastName: lastName,
          company: company.trim(),
          country,
          companyType: `licensing_${organizationType}`,
          companyDescription: intendedUse.trim(),
          isRequestAccess: true,
        },
      });

      if (error) {
        throw new Error(error.message || "Failed to process request");
      }

      const status = data?.status;

      if (status === "active") {
        clearDraft();
        setViewState("exists");
      } else if (status === "pending") {
        clearDraft();
        setViewState("pending");
      } else if (status === "new_request") {
        clearDraft();
        setViewState("submitted");
      } else {
        throw new Error("Unexpected response");
      }
    } catch (error: any) {
      console.error("Request error:", error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Submitted successfully
  if (viewState === "submitted") {
    return (
      <FormSuccessLayout
        title="Request submitted"
        message="We'll review your request and send access instructions if approved."
        dark
      >
        <Link 
          to="/" 
          className="text-[14px] text-[#8F8F8F] hover:text-[#FFFFFF] transition-colors duration-150 underline underline-offset-4"
        >
          Return to site
        </Link>
      </FormSuccessLayout>
    );
  }

  // Already pending
  if (viewState === "pending") {
    return (
      <FormSuccessLayout
        title="Already pending"
        message="A request for this email is already under review."
        dark
      >
        <Link 
          to="/" 
          className="text-[14px] text-[#8F8F8F] hover:text-[#FFFFFF] transition-colors duration-150 underline underline-offset-4"
        >
          Return to site
        </Link>
      </FormSuccessLayout>
    );
  }

  // Account already exists
  if (viewState === "exists") {
    return (
      <FormSuccessLayout
        title="Account exists"
        message="An account with this email already exists."
        dark
      >
        <a 
          href="https://app.tribesrightsmanagement.com" 
          className="text-[14px] text-[#FFFFFF] hover:opacity-70 transition-opacity duration-150 underline underline-offset-4"
        >
          Sign in
        </a>
      </FormSuccessLayout>
    );
  }

  // Dark theme input styles
  const darkInputClass = "bg-[#1A1A1A] border-[#303030] text-[#FFFFFF] placeholder:text-[#6B6B6B] focus:border-[#FFFFFF] focus:ring-0";
  const darkLabelClass = "text-[13px] font-medium text-[#E5E5E5]";
  const darkHintClass = "text-[13px] text-[#8F8F8F] leading-snug";

  return (
    <FormPageLayout
      title="Request an Account"
      lede="Licensing requests require an approved account."
      dark
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ============================================
            SECTION 1: IDENTITY FIELDS
            ============================================ */}
        <div className="space-y-5">
          <div className="space-y-1.5">
            <label className={darkLabelClass}>
              Full name
            </label>
            <Input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={isSubmitting}
              aria-label="Full name"
              className={darkInputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label className={darkLabelClass}>
              Company / Organization
            </label>
            <Input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              disabled={isSubmitting}
              aria-label="Company or organization"
              className={darkInputClass}
            />
            <p className={darkHintClass}>
              If you're an individual creator, enter your artist or professional name.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className={darkLabelClass}>
              Email address
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
              aria-label="Email address"
              className={darkInputClass}
            />
            <p className={darkHintClass}>
              Used for account access.
            </p>
          </div>
        </div>

        {/* ============================================
            SECTION 2: CONTEXT FIELDS
            ============================================ */}
        <div className="pt-2 space-y-5">
          <div className="space-y-1.5">
            <label className={darkLabelClass}>
              Country or territory
            </label>
            <Select value={country} onValueChange={setCountry} disabled={isSubmitting}>
              <SelectTrigger aria-label="Select your location" className={darkInputClass}>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1A] border-[#303030]">
                {COUNTRIES.map((c) => (
                  <SelectItem key={c} value={c} className="text-[#E5E5E5] focus:bg-[#303030] focus:text-[#FFFFFF]">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className={darkLabelClass}>
              Organization type
            </label>
            <Select value={organizationType} onValueChange={setOrganizationType} disabled={isSubmitting}>
              <SelectTrigger aria-label="Organization type" className={darkInputClass}>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A1A] border-[#303030]">
                <SelectItem value="commercial_brand" className="text-[#E5E5E5] focus:bg-[#303030] focus:text-[#FFFFFF]">Commercial / Brand</SelectItem>
                <SelectItem value="broadcast_media" className="text-[#E5E5E5] focus:bg-[#303030] focus:text-[#FFFFFF]">Broadcast / Media</SelectItem>
                <SelectItem value="church_ministry" className="text-[#E5E5E5] focus:bg-[#303030] focus:text-[#FFFFFF]">Church / Ministry</SelectItem>
                <SelectItem value="agency" className="text-[#E5E5E5] focus:bg-[#303030] focus:text-[#FFFFFF]">Agency</SelectItem>
                <SelectItem value="independent_creator" className="text-[#E5E5E5] focus:bg-[#303030] focus:text-[#FFFFFF]">Independent Creator</SelectItem>
                <SelectItem value="other" className="text-[#E5E5E5] focus:bg-[#303030] focus:text-[#FFFFFF]">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ============================================
            SECTION 3: INTENT FIELD
            ============================================ */}
        <div className="pt-2">
          <div className="space-y-1.5">
            <label className={darkLabelClass}>
              Describe your intended licensing use
            </label>
            <Textarea
              placeholder="Example: advertising, broadcast, livestream, film, venue playback."
              value={intendedUse}
              onChange={(e) => setIntendedUse(e.target.value)}
              required
              disabled={isSubmitting}
              rows={4}
              aria-label="Intended use"
              className={darkInputClass}
            />
            <p className={darkHintClass}>
              This does not need to be perfect.
            </p>
          </div>
        </div>

        {/* ============================================
            SECTION 4: CONSENT + SUBMISSION
            Spacing: 20px above/below consent (via ConsentRow)
            ============================================ */}
        {/* Consent + CTA: explicit 20px spacing, not inherited from space-y-6 */}
        <div>
          <ConsentRow
            id="terms"
            checked={agreeToTerms}
            onCheckedChange={setAgreeToTerms}
            disabled={isSubmitting}
            dark
          />
          <div className="mt-5">
            <Button
              type="submit"
              disabled={isSubmitting || !agreeToTerms}
              size="lg"
              className="w-full bg-[#FFFFFF] text-[#000000] hover:bg-[#E5E5E5] disabled:bg-[#303030] disabled:text-[#6B6B6B]"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <ButtonSpinner size={16} />
                  Submitting…
                </span>
              ) : (
                "Request Account Review"
              )}
            </Button>
          </div>
        </div>
      </form>

      <div className="mt-8 text-center">
        <p className="text-[14px] text-[#8F8F8F]">
          Already have an account?{" "}
          <a href="https://app.tribesrightsmanagement.com" className="text-[#FFFFFF] font-medium hover:opacity-70 transition-opacity duration-150">
            Sign in
          </a>
        </p>
      </div>
    </FormPageLayout>
  );
}
