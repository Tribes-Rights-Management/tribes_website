import { useState } from "react";
import { Link } from "react-router-dom";
import { PublicLayout } from "@/components/PublicLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { COUNTRIES } from "@/lib/countries";
import { Info } from "lucide-react";
import { z } from "zod";

const licensingAccountSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().min(1, "Last name is required").max(100),
  company: z.string().trim().min(1, "Company or organization is required").max(200),
  country: z.string().min(1, "Country is required"),
  email: z.string().trim().email("Please enter a valid email address").max(255),
  companyType: z.string().min(1, "Usage type is required"),
  licensingNeeds: z.string().trim().min(1, "Please describe your licensing needs").max(2000),
});

type ViewState = "form" | "pending" | "submitted" | "exists";

export default function LicensingAccountPage() {
  const [viewState, setViewState] = useState<ViewState>("form");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [licensingNeeds, setLicensingNeeds] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = licensingAccountSchema.safeParse({
      firstName,
      lastName,
      company,
      country,
      email,
      companyType,
      licensingNeeds,
    });

    if (!result.success) {
      toast({
        title: "Please complete all fields",
        description: result.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke("auth-check", {
        body: {
          email: email.trim().toLowerCase(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          company: company.trim(),
          country,
          companyType: `licensing_${companyType}`, // Prefix to distinguish licensing accounts
          companyDescription: licensingNeeds.trim(),
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
                Request received
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Your licensing account request has been submitted for review.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Once approved, you'll receive an email with instructions to sign in and begin submitting license requests.
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
                Pending approval
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
            <h1 className="text-[32px] md:text-[40px] lg:text-[48px] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground mb-6">
              Create a Licensing Account
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              For commercial, broadcast, or ministry use of music administered by Tribes.
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
                Account Request
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input
                      type="text"
                      placeholder="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      disabled={isSubmitting}
                      aria-label="First name"
                    />
                  </div>
                  <div>
                    <Input
                      type="text"
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      disabled={isSubmitting}
                      aria-label="Last name"
                    />
                  </div>
                </div>

                <div>
                  <Input
                    type="text"
                    placeholder="Company or organization"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required
                    disabled={isSubmitting}
                    aria-label="Company"
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
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Used to ensure licenses are issued correctly by territory.
                  </p>
                </div>

                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                    aria-label="Email"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    This will be your login email once approved.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Select value={companyType} onValueChange={setCompanyType} disabled={isSubmitting}>
                      <SelectTrigger aria-label="Usage type" className="flex-1">
                        <SelectValue placeholder="Primary usage type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="broadcast">Broadcast (Film / TV / Ads)</SelectItem>
                        <SelectItem value="ministry">Church / Ministry</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button 
                          type="button"
                          className="text-muted-foreground hover:text-foreground transition-colors p-1"
                          aria-label="Usage type definitions"
                        >
                          <Info className="w-4 h-4" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-72 text-xs" align="end">
                        <div className="space-y-2">
                          <p><strong className="text-foreground">Commercial</strong> — Labels, publishers, brands, agencies</p>
                          <p><strong className="text-foreground">Broadcast</strong> — Film, TV, games, advertising, trailers</p>
                          <p><strong className="text-foreground">Church / Ministry</strong> — Religious organizations, worship services</p>
                          <p><strong className="text-foreground">Other</strong> — Podcasts, social media, personal projects</p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This helps us apply the correct licensing structure.
                  </p>
                </div>

                <div>
                  <Textarea
                    placeholder="Briefly describe the types of projects and licensing needs you anticipate."
                    value={licensingNeeds}
                    onChange={(e) => setLicensingNeeds(e.target.value)}
                    required
                    disabled={isSubmitting}
                    rows={4}
                    aria-label="Licensing needs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-10 px-6 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting…" : "Request Account"}
                </button>
              </form>

              <p className="text-sm text-muted-foreground mt-6">
                Already have an account?{" "}
                <Link to="/auth" className="text-foreground hover:underline">
                  Sign in
                </Link>
              </p>
            </div>

            <div>
              <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground mb-8">
                Why Approval Is Required
              </h2>
              <div className="space-y-8 text-muted-foreground">
                <p className="text-sm leading-relaxed">
                  Licensing requests are submitted through approved accounts to ensure accurate documentation and proper authorization.
                </p>
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Identity verification</p>
                  <p className="text-sm leading-relaxed">
                    We verify the legitimacy of each account before granting access to licensing requests.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Proper documentation</p>
                  <p className="text-sm leading-relaxed">
                    Approved accounts ensure licenses are issued with accurate legal and contact information.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">What happens next</p>
                  <p className="text-sm leading-relaxed">
                    Once approved, you'll receive an email with sign-in instructions. You can then submit license requests through your portal.
                  </p>
                </div>
                <div className="pt-8 border-t border-border">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    This account is for licensing music we administer. If you're interested in publishing administration services, 
                    <Link to="/inquire" className="text-foreground hover:underline ml-1">
                      submit a service inquiry
                    </Link>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
