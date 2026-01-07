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
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
  }

  // Post-submission confirmation
  if (isSubmitted) {
    return (
      <PublicLayout footerVariant="minimal">
        <section className="pt-28 pb-24 md:pt-36 md:pb-32 lg:pt-44 lg:pb-40">
          <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
            <div className="max-w-[480px]">
              <h1 className="text-[28px] md:text-[36px] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground mb-4">
                Inquiry received
              </h1>
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
    <PublicLayout footerVariant="minimal">
      {/* Header */}
      <section className="pt-28 pb-10 md:pt-36 md:pb-12">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="max-w-[600px]">
            <h1 className="text-[28px] md:text-[36px] lg:text-[42px] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground mb-3">
              Inquire About Services
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              For representation, administration, or strategic engagement.
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="pb-24 md:pb-32">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="max-w-[520px]">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={isSubmitting}
                aria-label="Full name"
                className="w-full"
              />

              <Input
                type="text"
                placeholder="Company / Organization"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
                disabled={isSubmitting}
                aria-label="Company or organization"
                className="w-full"
              />

              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                aria-label="Email address"
                className="w-full"
              />

              <Select value={country} onValueChange={setCountry} disabled={isSubmitting}>
                <SelectTrigger aria-label="Select your location" className="w-full">
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
                <SelectTrigger aria-label="Role or relationship to rights" className="w-full">
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

              <div className="pt-1">
                <label className="text-[13px] text-muted-foreground/70 mb-2 block">
                  Describe your catalog or scope
                </label>
                <Textarea
                  placeholder="Example: size of catalog, type of rights, geographic scope."
                  value={catalogDescription}
                  onChange={(e) => setCatalogDescription(e.target.value)}
                  required
                  disabled={isSubmitting}
                  rows={4}
                  aria-label="Catalog or scope description"
                  className="w-full"
                />
              </div>

              <div className="pt-1">
                <label className="text-[13px] text-muted-foreground/70 mb-2 block">
                  What are you looking for from Tribes?
                </label>
                <Textarea
                  placeholder="Example: administration, licensing support, catalog oversight."
                  value={lookingFor}
                  onChange={(e) => setLookingFor(e.target.value)}
                  required
                  disabled={isSubmitting}
                  rows={4}
                  aria-label="What are you looking for from Tribes"
                  className="w-full"
                />
              </div>

              {/* Consent */}
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
                    className="text-[13px] text-muted-foreground/60 leading-relaxed cursor-pointer"
                  >
                    I agree to the{" "}
                    <Link 
                      to="/privacy" 
                      className="text-muted-foreground/50 underline underline-offset-4 hover:text-foreground transition-colors"
                      target="_blank"
                    >
                      Privacy Policy
                    </Link>
                    {" "}and{" "}
                    <Link 
                      to="/terms" 
                      className="text-muted-foreground/50 underline underline-offset-4 hover:text-foreground transition-colors"
                      target="_blank"
                    >
                      Terms of Use
                    </Link>.
                  </label>
                </div>
              </div>

              <div className="pt-5 flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full max-w-[280px] h-[44px] text-sm font-medium rounded-md transition-all duration-150 ${
                    agreeToTerms && !isSubmitting
                      ? "bg-foreground text-background hover:bg-foreground/90 active:bg-foreground/85"
                      : "bg-muted-foreground/20 text-muted-foreground/50 cursor-not-allowed"
                  }`}
                >
                  {isSubmitting ? "Submitting…" : "Submit Inquiry"}
                </button>
              </div>
            </form>

            <p className="text-sm text-muted-foreground/60 mt-8 text-center">
              Need to license music we administer?{" "}
              <Link to="/licensing" className="text-muted-foreground hover:text-foreground transition-colors">
                Request Licensing Access
              </Link>
            </p>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
