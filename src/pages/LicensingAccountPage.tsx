import { useState } from "react";
import { Link } from "react-router-dom";
import { PublicLayout } from "@/components/PublicLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import { CONTENT_CONTAINER_CLASS } from "@/lib/layout";
import { getSignInUrl, isPreviewEnvironment } from "@/lib/domains";
import { z } from "zod";

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
  const { toast } = useToast();

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
        setViewState("exists");
      } else if (status === "pending") {
        setViewState("pending");
      } else if (status === "new_request") {
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
      <PublicLayout>
        <section className="pt-16 pb-24 md:pt-20 md:pb-32">
          <div className={CONTENT_CONTAINER_CLASS}>
            <div className="max-w-[480px]">
              <h1 className="text-[26px] md:text-[30px] font-semibold text-foreground mb-2">
                Request submitted
              </h1>
              <p className="text-[15px] text-muted-foreground leading-relaxed mb-6">
                We'll review your request and send access instructions if approved.
              </p>
              <Link 
                to="/" 
                className="text-[14px] text-muted-foreground hover:text-foreground transition-opacity duration-150 underline underline-offset-4"
              >
                Return to home
              </Link>
            </div>
          </div>
        </section>
      </PublicLayout>
    );
  }

  // Already pending
  if (viewState === "pending") {
    return (
      <PublicLayout>
        <section className="pt-16 pb-24 md:pt-20 md:pb-32">
          <div className={CONTENT_CONTAINER_CLASS}>
            <div className="max-w-[480px]">
              <h1 className="text-[26px] md:text-[30px] font-semibold text-foreground mb-2">
                Already pending
              </h1>
              <p className="text-[15px] text-muted-foreground leading-relaxed mb-6">
                A request for this email is already under review.
              </p>
              <Link 
                to="/" 
                className="text-[14px] text-muted-foreground hover:text-foreground transition-opacity duration-150 underline underline-offset-4"
              >
                Return to home
              </Link>
            </div>
          </div>
        </section>
      </PublicLayout>
    );
  }

  // Account already exists
  if (viewState === "exists") {
    return (
      <PublicLayout>
        <section className="pt-16 pb-24 md:pt-20 md:pb-32">
          <div className={CONTENT_CONTAINER_CLASS}>
            <div className="max-w-[480px]">
              <h1 className="text-[26px] md:text-[30px] font-semibold text-foreground mb-2">
                Account exists
              </h1>
              <p className="text-[15px] text-muted-foreground leading-relaxed mb-6">
                An account with this email already exists.
              </p>
              {isPreviewEnvironment() ? (
                <Link 
                  to="/auth" 
                  className="text-[14px] text-foreground hover:opacity-70 transition-opacity duration-150 underline underline-offset-4"
                >
                  Sign in
                </Link>
              ) : (
                <a 
                  href={getSignInUrl("/portal")} 
                  className="text-[14px] text-foreground hover:opacity-70 transition-opacity duration-150 underline underline-offset-4"
                >
                  Sign in
                </a>
              )}
            </div>
          </div>
        </section>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      {/* Header */}
      <section className="pt-16 pb-6 md:pt-20 md:pb-8">
        <div className={CONTENT_CONTAINER_CLASS}>
          <div className="max-w-[480px]">
            <h1 className="text-[26px] md:text-[30px] font-semibold text-foreground mb-2">
              Request an Account
            </h1>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              Licensing requests require an approved account.
            </p>
          </div>
        </div>
      </section>

      {/* Form - Institutional layout */}
      <section className="pb-16 md:pb-24">
        <div className={CONTENT_CONTAINER_CLASS}>
          <div className="max-w-[480px]">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={isSubmitting}
                aria-label="Full name"
              />

              <div className="space-y-1.5">
                <Input
                  type="text"
                  placeholder="Company / Organization"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                  disabled={isSubmitting}
                  aria-label="Company or organization"
                />
                <p className="text-[13px] text-[#737373] leading-snug">
                  If you're an individual creator, enter your artist or professional name.
                </p>
              </div>

              <div className="space-y-1.5">
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  aria-label="Email address"
                />
                <p className="text-[13px] text-[#737373] leading-snug">
                  Used for account access.
                </p>
              </div>

              <Select value={country} onValueChange={setCountry} disabled={isSubmitting}>
                <SelectTrigger aria-label="Select your location">
                  <SelectValue placeholder="Country or territory" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={organizationType} onValueChange={setOrganizationType} disabled={isSubmitting}>
                <SelectTrigger aria-label="Organization type">
                  <SelectValue placeholder="Organization type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="commercial_brand">Commercial / Brand</SelectItem>
                  <SelectItem value="broadcast_media">Broadcast / Media</SelectItem>
                  <SelectItem value="church_ministry">Church / Ministry</SelectItem>
                  <SelectItem value="agency">Agency</SelectItem>
                  <SelectItem value="independent_creator">Independent Creator</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              <div className="space-y-1.5">
                <label className="text-[14px] font-medium text-foreground">
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
                />
                <p className="text-[13px] text-[#737373] leading-snug">
                  This does not need to be perfect.
                </p>
              </div>

              {/* Consent - checkbox-gated button */}
              <div className="pt-2">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                    disabled={isSubmitting}
                    aria-label="Agree to terms"
                    className="shrink-0 mt-0.5"
                  />
                  <label 
                    htmlFor="terms" 
                    className="text-[14px] text-muted-foreground leading-relaxed cursor-pointer"
                  >
                    I agree to the{" "}
                    <Link 
                      to="/privacy" 
                      className="text-foreground underline underline-offset-2 hover:opacity-70 transition-opacity duration-150"
                      target="_blank"
                    >
                      Privacy Policy
                    </Link>
                    {" "}and{" "}
                    <Link 
                      to="/terms" 
                      className="text-foreground underline underline-offset-2 hover:opacity-70 transition-opacity duration-150"
                      target="_blank"
                    >
                      Terms of Use
                    </Link>.
                  </label>
                </div>
              </div>

              {/* Full-width submit button - disabled until checkbox checked */}
              <div className="pt-3">
                <Button
                  type="submit"
                  disabled={isSubmitting || !agreeToTerms}
                  size="lg"
                  className="w-full"
                >
                  {isSubmitting ? "Submitting…" : "Request Account Review"}
                </Button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-[14px] text-muted-foreground">
                Already have an account?{" "}
                {isPreviewEnvironment() ? (
                  <Link to="/auth" className="text-foreground font-medium hover:opacity-70 transition-opacity duration-150">
                    Sign in
                  </Link>
                ) : (
                  <a href={getSignInUrl("/portal")} className="text-foreground font-medium hover:opacity-70 transition-opacity duration-150">
                    Sign in
                  </a>
                )}
              </p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
