import { useState } from "react";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
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
import { z } from "zod";
import { COUNTRIES } from "@/lib/countries";
import { Info } from "lucide-react";

const emailSchema = z.string().trim().email("Please enter a valid email address");

const requestSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  company: z.string().trim().min(1, "Company is required"),
  country: z.string().min(1, "Country is required"),
  email: z.string().trim().email("Please enter a valid email address"),
  companyType: z.string().min(1, "Company type is required"),
  companyDescription: z.string().trim().min(1, "Please tell us about your company"),
});

type ViewState = "form" | "request_form" | "check_email" | "pending" | "new_request" | "rejected";

export default function AuthPage() {
  const [viewState, setViewState] = useState<ViewState>("form");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendConfirmed, setResendConfirmed] = useState(false);

  // Request form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [country, setCountry] = useState("");
  const [requestEmail, setRequestEmail] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");

  const { signInWithMagicLink } = useAuth();
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      toast({ title: "Invalid email", description: result.error.errors[0].message, variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      // Call edge function to check/create account
      const { data, error } = await supabase.functions.invoke("auth-check", {
        body: { email: email.trim().toLowerCase() },
      });

      if (error) {
        throw new Error(error.message || "Failed to process request");
      }

      const status = data?.status;

      if (status === "active") {
        // Send magic link for active users
        const { error: magicLinkError } = await signInWithMagicLink(email);
        if (magicLinkError) {
          throw magicLinkError;
        }
        setViewState("check_email");
        setShowResend(false);
        setTimeout(() => setShowResend(true), 45000);
      } else if (status === "pending") {
        setViewState("pending");
      } else if (status === "rejected") {
        setViewState("rejected");
      } else if (status === "no_account") {
        toast({
          title: "No account found",
          description: "Please request access to get started.",
        });
        setViewState("request_form");
        setRequestEmail(email);
      } else {
        throw new Error("Unexpected response");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({ 
        title: "Error", 
        description: error.message || "Something went wrong. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResend() {
    setIsResending(true);
    const { error } = await signInWithMagicLink(email);
    
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setResendConfirmed(true);
      setShowResend(false);
      setTimeout(() => setShowResend(true), 45000);
    }
    setIsResending(false);
  }

  function resetRequestForm() {
    setFirstName("");
    setLastName("");
    setCompany("");
    setCountry("");
    setRequestEmail("");
    setCompanyType("");
    setCompanyDescription("");
  }

  async function handleRequestSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = requestSchema.safeParse({
      firstName,
      lastName,
      company,
      country,
      email: requestEmail,
      companyType,
      companyDescription,
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
          email: requestEmail.trim().toLowerCase(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          company: company.trim(),
          country,
          companyType,
          companyDescription: companyDescription.trim(),
          isRequestAccess: true,
        },
      });

      if (error) {
        throw new Error(error.message || "Failed to process request");
      }

      const status = data?.status;

      if (status === "active") {
        toast({
          title: "Account exists",
          description: "An account with this email already exists. Please log in.",
        });
        setEmail(requestEmail);
        setViewState("form");
      } else if (status === "pending") {
        setViewState("pending");
      } else if (status === "new_request") {
        setViewState("new_request");
        resetRequestForm();
      } else if (status === "rejected") {
        setViewState("rejected");
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

  function handleDone() {
    setViewState("form");
    setEmail("");
    resetRequestForm();
  }

  // Check email screen (magic link sent)
  if (viewState === "check_email") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-md text-center">
            <h1 className="mb-2">Check your email</h1>
            <p className="text-sm text-muted-foreground mb-2">
              We've sent a sign-in link to your email address.
            </p>
            <p className="text-xs text-muted-foreground mb-8">
              If it doesn't appear within a minute, check your spam folder.
            </p>
            {resendConfirmed && (
              <p className="text-sm text-muted-foreground mb-4">
                A new link has been sent.
              </p>
            )}
            {showResend && (
              <button
                onClick={handleResend}
                disabled={isResending}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
              >
                {isResending ? "…" : "Resend link"}
              </button>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Pending approval screen
  if (viewState === "pending") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-md text-center">
            <h1 className="mb-2">Pending approval</h1>
            <p className="text-sm text-muted-foreground mb-8">
              Your access request is under review. You'll receive an email once it's approved.
            </p>
            <button
              onClick={handleDone}
              className="h-10 px-6 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Done
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // New request submitted screen
  if (viewState === "new_request") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-md text-center">
            <h1 className="mb-2">Request received</h1>
            <p className="text-sm text-muted-foreground mb-8">
              We'll update you once review is complete.
            </p>
            <button
              onClick={handleDone}
              className="h-10 px-6 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Done
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Rejected screen
  if (viewState === "rejected") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-md text-center">
            <h1 className="mb-2">Access unavailable</h1>
            <p className="text-sm text-muted-foreground mb-8">
              Your access request was not approved.
            </p>
            <button
              onClick={handleDone}
              className="h-10 px-6 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Done
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Request portal access form
  if (viewState === "request_form") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="mb-2">Request Client Portal Access</h1>
              <p className="text-sm text-muted-foreground">
                For existing or approved relationships only.
              </p>
            </div>

            <form onSubmit={handleRequestSubmit} className="space-y-5">
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
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Your legal first name.
                  </p>
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
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Your legal last name.
                  </p>
                </div>
              </div>

              <div>
                <Input
                  type="text"
                  placeholder="Company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                  disabled={isSubmitting}
                  aria-label="Company"
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  If you are an individual creator, enter your artist name or personal name.
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
                <p className="text-xs text-muted-foreground mt-1.5">
                  Used to ensure licenses are issued correctly by territory.
                </p>
              </div>

              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={requestEmail}
                  onChange={(e) => setRequestEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  aria-label="Email"
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  This will be used as your login email.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Select value={companyType} onValueChange={setCompanyType} disabled={isSubmitting}>
                    <SelectTrigger aria-label="Company type" className="flex-1">
                      <SelectValue placeholder="Company type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="indie_church">Indie / Church</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="broadcast">Broadcast</SelectItem>
                    </SelectContent>
                  </Select>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button 
                        type="button"
                        className="text-muted-foreground hover:text-foreground transition-colors p-1"
                        aria-label="Company type definitions"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-72 text-xs" align="end">
                      <div className="space-y-2">
                        <p><strong className="text-foreground">Indie / Church</strong> — Church ministry, independent artist, nonprofit, social media</p>
                        <p><strong className="text-foreground">Commercial</strong> — Label, publisher, large-scale commercial use</p>
                        <p><strong className="text-foreground">Broadcast</strong> — Film/TV, games, advertising</p>
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
                  placeholder="Briefly describe who you are, how you work with music, and the type of usage you expect."
                  value={companyDescription}
                  onChange={(e) => setCompanyDescription(e.target.value)}
                  required
                  disabled={isSubmitting}
                  rows={3}
                  aria-label="Tell us about your company"
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  This does not need to be perfect. Clear context helps us review your request accurately.
                </p>
              </div>

              <p className="text-sm text-muted-foreground">
                You don't need to be a legal expert to submit a request—only clear about how the music will be used.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "…" : "Request Portal Access"}
              </button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have access?{" "}
              <button
                type="button"
                onClick={() => setViewState("form")}
                className="text-foreground hover:underline"
              >
                Log in.
              </button>
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Main login form
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="mb-2">Client Sign In</h1>
            <p className="text-sm text-muted-foreground">Access your client portal.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={isSubmitting}
              aria-label="Email address"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "…" : "Continue"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Need portal access?{" "}
            <button
              type="button"
              onClick={() => setViewState("request_form")}
              className="text-foreground hover:underline"
            >
              Request access
            </button>
          </p>
          
          <p className="text-center text-xs text-muted-foreground/60 mt-4">
            For existing or approved relationships only.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Footer is now imported from canonical component