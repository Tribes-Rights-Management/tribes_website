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
import { COUNTRIES } from "@/lib/countries";
import { CONTENT_CONTAINER_CLASS } from "@/lib/layout";
import { z } from "zod";

/* ═══════════════════════════════════════════════════════════════════════════════════
   SERVICE INQUIRY PAGE
   
   PURPOSE: For companies, rights holders, and creators exploring a potential 
   ongoing relationship with Tribes Rights Management.
   
   THIS PAGE DOES NOT:
   - Create a portal account
   - Grant licensing access
   - Imply acceptance or onboarding
   
   This is a RELATIONSHIP inquiry, not a transactional request.
   ═══════════════════════════════════════════════════════════════════════════════════ */

const inquirySchema = z.object({
  fullName: z.string().trim().min(1, "This field is required.").max(200),
  company: z.string().trim().min(1, "This field is required.").max(200),
  email: z.string().trim().email("Enter a valid email address.").max(255),
  country: z.string().min(1, "This field is required."),
  roleType: z.string().min(1, "This field is required."),
  catalogDescription: z.string().trim().min(1, "This field is required.").max(2000),
  lookingFor: z.string().trim().min(1, "This field is required.").max(2000),
  agreeToTerms: z.literal(true, {
    errorMap: () => ({ message: "This information is required to proceed." }),
  }),
});

export default function ServiceInquiryPage() {
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [roleType, setRoleType] = useState("");
  const [catalogDescription, setCatalogDescription] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = inquirySchema.safeParse({
      fullName,
      company,
      email,
      country,
      roleType,
      catalogDescription,
      lookingFor,
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
    
    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
  }

  // Post-submission confirmation
  if (isSubmitted) {
    return (
      <PublicLayout>
        <section className="pt-16 pb-24 md:pt-20 md:pb-32">
          <div className={CONTENT_CONTAINER_CLASS}>
            <div className="max-w-[480px]">
              <h1 className="text-[26px] md:text-[30px] font-semibold text-foreground mb-2">
                Inquiry received
              </h1>
              <p className="text-[15px] text-muted-foreground leading-relaxed mb-6">
                We'll review your inquiry and follow up if there's a fit.
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

  return (
    <PublicLayout>
      {/* Header */}
      <section className="pt-16 pb-6 md:pt-20 md:pb-8">
        <div className={CONTENT_CONTAINER_CLASS}>
          <div className="max-w-[480px]">
            <h1 className="text-[26px] md:text-[30px] font-semibold text-foreground mb-2">
              Inquire About Services
            </h1>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              For publishing administration, rights management, or catalog support.
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

              <Input
                type="text"
                placeholder="Company / Organization"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
                disabled={isSubmitting}
                aria-label="Company or organization"
              />

              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                aria-label="Email address"
              />

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

              <Select value={roleType} onValueChange={setRoleType} disabled={isSubmitting}>
                <SelectTrigger aria-label="Your role">
                  <SelectValue placeholder="Your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="songwriter_creator">Songwriter / Creator</SelectItem>
                  <SelectItem value="publisher_rights_holder">Publisher / Rights Holder</SelectItem>
                  <SelectItem value="brand_agency">Brand / Agency</SelectItem>
                  <SelectItem value="media_company">Media Company</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              <div className="space-y-1.5">
                <label className="text-[14px] font-medium text-foreground">
                  Catalog or scope
                </label>
                <Textarea
                  placeholder="Size, type of rights, geographic reach, etc."
                  value={catalogDescription}
                  onChange={(e) => setCatalogDescription(e.target.value)}
                  required
                  disabled={isSubmitting}
                  rows={3}
                  aria-label="Catalog or scope description"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[14px] font-medium text-foreground">
                  What you're looking for
                </label>
                <Textarea
                  placeholder="Administration, licensing, catalog oversight, etc."
                  value={lookingFor}
                  onChange={(e) => setLookingFor(e.target.value)}
                  required
                  disabled={isSubmitting}
                  rows={3}
                  aria-label="What you're looking for"
                />
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
                  {isSubmitting ? "Submitting…" : "Submit Inquiry"}
                </Button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-[14px] text-muted-foreground">
                Need licensing access?{" "}
                <Link to="/licensing-account" className="text-foreground font-medium hover:opacity-70 transition-opacity duration-150">
                  Request an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
