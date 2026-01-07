import { useState } from "react";
import { Link } from "react-router-dom";
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
import { useToast } from "@/hooks/use-toast";
import { COUNTRIES } from "@/lib/countries";
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
  fullName: z.string().trim().min(1, "Full name is required").max(200),
  company: z.string().trim().min(1, "Company or organization is required").max(200),
  email: z.string().trim().email("Please enter a valid email address").max(255),
  country: z.string().min(1, "Country is required"),
  roleType: z.string().min(1, "Please select your role"),
  catalogDescription: z.string().trim().min(1, "Please describe your catalog or scope").max(2000),
  lookingFor: z.string().trim().min(1, "Please describe what you're looking for").max(2000),
  agreeToTerms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the Privacy Policy and Terms of Use" }),
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
    // NOTE: This does NOT create any user account or grant access
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
  }

  // Post-submission confirmation
  if (isSubmitted) {
    return (
      <PublicLayout>
        <section className="pt-32 pb-24 md:pt-40 md:pb-32 lg:pt-48 lg:pb-40">
          <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
            <div className="max-w-[520px]">
              <h1 className="text-[32px] md:text-[40px] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground mb-6">
                Inquiry received
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Thank you for reaching out.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Our team reviews all inquiries and will follow up if there's a potential fit.
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

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="max-w-[640px]">
            <h1 className="text-[32px] md:text-[40px] lg:text-[48px] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground mb-6">
              Inquire About Services
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-4">
              Tribes works with a limited number of clients where long-term stewardship, precision, and accountability matter.
            </p>
            <p className="text-sm text-muted-foreground/70 leading-relaxed">
              This inquiry is for representation, administration, or strategic engagement. Licensing requests are handled separately.
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
          <div className="grid md:grid-cols-2 gap-16 md:gap-24">
            <div>
              <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground mb-8">
                Service Inquiry
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
                  <Select value={roleType} onValueChange={setRoleType} disabled={isSubmitting}>
                    <SelectTrigger aria-label="Role or relationship to rights">
                      <SelectValue placeholder="Role / Relationship to Rights" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="songwriter_creator">Songwriter / Creator</SelectItem>
                      <SelectItem value="publisher_rights_holder">Publisher / Rights Holder</SelectItem>
                      <SelectItem value="brand_agency">Brand / Agency</SelectItem>
                      <SelectItem value="media_company">Media Company</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Textarea
                    placeholder="Example: size of catalog, type of rights, geographic scope, or nature of use."
                    value={catalogDescription}
                    onChange={(e) => setCatalogDescription(e.target.value)}
                    required
                    disabled={isSubmitting}
                    rows={4}
                    aria-label="Catalog or scope description"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Describe your catalog or scope.
                  </p>
                </div>

                <div>
                  <Textarea
                    placeholder="Example: administration, licensing support, catalog oversight, or long-term representation."
                    value={lookingFor}
                    onChange={(e) => setLookingFor(e.target.value)}
                    required
                    disabled={isSubmitting}
                    rows={4}
                    aria-label="What are you looking for from Tribes"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    What are you looking for from Tribes?
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
                    {isSubmitting ? "Submitting…" : "Submit Inquiry"}
                  </button>
                </div>
              </form>
            </div>

            <div>
              <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground mb-8">
                What This Is For
              </h2>
              <div className="space-y-8 text-muted-foreground">
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Long-term relationships</p>
                  <p className="text-sm leading-relaxed">
                    We work with clients who value accuracy, continuity, and structured rights management over time.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Catalog stewardship</p>
                  <p className="text-sm leading-relaxed">
                    Publishing administration, rights oversight, and defensible documentation for those who take their catalogs seriously.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Not a license request</p>
                  <p className="text-sm leading-relaxed">
                    This inquiry is about representation and administration—not transactional licensing. License requests are handled through approved accounts.
                  </p>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-border">
                <p className="text-sm text-muted-foreground/70 leading-relaxed">
                  Need to license music we administer?
                </p>
                <Link 
                  to="/licensing" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 mt-2 inline-block"
                >
                  Request Licensing Access
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
