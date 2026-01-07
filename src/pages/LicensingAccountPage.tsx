import { useState } from "react";
import { Link } from "react-router-dom";
import { Info } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import { supabase } from "@/integrations/supabase/client";
import { COUNTRIES } from "@/lib/countries";
import { z } from "zod";

const licensingAccountSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(200),
  company: z.string().trim().min(1, "Company or organization is required").max(200),
  email: z.string().trim().email("Please enter a valid email address").max(255),
  country: z.string().min(1, "Country is required"),
  organizationType: z.string().min(1, "Organization type is required"),
  intendedUse: z.string().trim().min(1, "Please describe your intended use").max(2000),
  agreeToTerms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the Privacy Policy and Terms of Use" }),
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
      // Parse full name into first/last for backend compatibility
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
        <section className="pt-32 pb-24 md:pt-40 md:pb-32 lg:pt-48 lg:pb-40">
          <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
            <div className="max-w-[480px]">
              <h1 className="text-[32px] md:text-[40px] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground mb-6">
                Request submitted
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Your request has been submitted for review.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                If approved, you will receive an email with access instructions.
              </p>
              <Link 
                to="/" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
        <section className="pt-32 pb-24 md:pt-40 md:pb-32 lg:pt-48 lg:pb-40">
          <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
            <div className="max-w-[480px]">
              <h1 className="text-[32px] md:text-[40px] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground mb-6">
                Pending review
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-8">
                A request for this email is already under review. You'll receive an email once it's approved.
              </p>
              <Link 
                to="/" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
        <section className="pt-32 pb-24 md:pt-40 md:pb-32 lg:pt-48 lg:pb-40">
          <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
            <div className="max-w-[480px]">
              <h1 className="text-[32px] md:text-[40px] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground mb-6">
                Account exists
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-8">
                An account with this email already exists. You can sign in to access the licensing portal.
              </p>
              <Link 
                to="/auth" 
                className="text-sm font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
              >
                Sign in to your account
              </Link>
            </div>
          </div>
        </section>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="max-w-[640px]">
            <div className="flex items-start gap-3 mb-6">
              <h1 className="text-[32px] md:text-[40px] lg:text-[48px] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground">
                Request an Account
              </h1>
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      type="button"
                      className="mt-3 text-muted-foreground/40 hover:text-muted-foreground/60 transition-colors"
                      aria-label="Why is approval required?"
                    >
                      <Info className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent 
                    side="bottom" 
                    align="start"
                    className="max-w-[280px] text-xs leading-relaxed"
                  >
                    Licensing requests are submitted through approved accounts to ensure authority, accuracy, and permanent records. This protects both rights holders and licensees.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-4">
              Licensing requests at Tribes are submitted through approved accounts to ensure accuracy, authorization, and permanent records.
            </p>
            <p className="text-sm text-muted-foreground/70 leading-relaxed">
              Submitting this form does not initiate a license request or imply approval.
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
        <div className="h-px bg-border" />
      </div>

      {/* Form */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="max-w-[520px]">
            <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground mb-8">
              Account Request
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Input
                  type="text"
                  placeholder="Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={isSubmitting}
                  aria-label="Full name"
                />
              </div>

              <div>
                <Input
                  type="text"
                  placeholder="Company / Organization"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                  disabled={isSubmitting}
                  aria-label="Company or organization"
                />
              </div>

              <div>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  aria-label="Email address"
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  Used for account access.
                </p>
              </div>

              <div>
                <Select value={country} onValueChange={setCountry} disabled={isSubmitting}>
                  <SelectTrigger aria-label="Country">
                    <SelectValue placeholder="Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
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
              </div>

              <div>
                <Textarea
                  placeholder="Example: advertising, broadcast, livestream, film, venue playback."
                  value={intendedUse}
                  onChange={(e) => setIntendedUse(e.target.value)}
                  required
                  disabled={isSubmitting}
                  rows={4}
                  aria-label="Intended use"
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  Describe your intended licensing use.
                </p>
              </div>

              {/* Required consent */}
              <div className="pt-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                    disabled={isSubmitting}
                    aria-label="Agree to terms"
                  />
                  <label 
                    htmlFor="terms" 
                    className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
                  >
                    I agree to the{" "}
                    <Link 
                      to="/privacy" 
                      className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
                      target="_blank"
                    >
                      Privacy Policy
                    </Link>
                    {" "}and{" "}
                    <Link 
                      to="/terms" 
                      className="text-foreground underline underline-offset-4 hover:text-muted-foreground"
                      target="_blank"
                    >
                      Terms of Use
                    </Link>.
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !agreeToTerms}
                  className="h-10 px-6 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting…" : "Request Account Review"}
                </button>
              </div>
            </form>

            <p className="text-sm text-muted-foreground mt-8">
              Already have an account?{" "}
              <Link to="/auth" className="text-foreground hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
