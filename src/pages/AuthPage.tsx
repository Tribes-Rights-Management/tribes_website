import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const emailSchema = z.string().trim().email("Please enter a valid email address");
const nameSchema = z.string().trim().min(1, "Required").max(100);

type AuthMode = "signin" | "request";
type ViewState = "form" | "email_sent" | "request_received" | "pending";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [viewState, setViewState] = useState<ViewState>("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Sign in fields
  const [email, setEmail] = useState("");
  
  // Request access fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [requestEmail, setRequestEmail] = useState("");
  const [organization, setOrganization] = useState("");
  
  // Resend state
  const [showResend, setShowResend] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const { signInWithMagicLink, requestAccess, checkEmailStatus } = useAuth();
  const { toast } = useToast();

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      toast({ title: "Invalid email", description: result.error.errors[0].message, variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    
    // Check if email exists and get status
    const { exists, status } = await checkEmailStatus(email);
    
    if (!exists) {
      toast({ 
        title: "Account not found", 
        description: "No account exists with this email. Please request access first.",
        variant: "destructive" 
      });
      setIsSubmitting(false);
      return;
    }
    
    if (status === "pending") {
      setViewState("pending");
      setIsSubmitting(false);
      return;
    }
    
    if (status === "rejected") {
      toast({ 
        title: "Access denied", 
        description: "Your access request was not approved.",
        variant: "destructive" 
      });
      setIsSubmitting(false);
      return;
    }
    
    // Status is active, proceed with sign in
    const { error } = await signInWithMagicLink(email);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setIsSubmitting(false);
      return;
    }

    setViewState("email_sent");
    setIsSubmitting(false);
    setShowResend(false);
    setTimeout(() => setShowResend(true), 45000);
  }

  async function handleRequestAccess(e: React.FormEvent) {
    e.preventDefault();
    
    // Validate fields
    const firstNameResult = nameSchema.safeParse(firstName);
    const lastNameResult = nameSchema.safeParse(lastName);
    const emailResult = emailSchema.safeParse(requestEmail);
    
    if (!firstNameResult.success) {
      toast({ title: "Invalid first name", description: "Please enter your first name.", variant: "destructive" });
      return;
    }
    if (!lastNameResult.success) {
      toast({ title: "Invalid last name", description: "Please enter your last name.", variant: "destructive" });
      return;
    }
    if (!emailResult.success) {
      toast({ title: "Invalid email", description: emailResult.error.errors[0].message, variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    
    // Check if email already exists
    const { exists, status } = await checkEmailStatus(requestEmail);
    
    if (exists) {
      if (status === "pending") {
        setViewState("pending");
        setIsSubmitting(false);
        return;
      }
      if (status === "active") {
        toast({ 
          title: "Account exists", 
          description: "An active account already exists with this email. Please sign in.",
          variant: "destructive" 
        });
        setMode("signin");
        setEmail(requestEmail);
        setIsSubmitting(false);
        return;
      }
      if (status === "rejected") {
        toast({ 
          title: "Access denied", 
          description: "A previous request with this email was not approved.",
          variant: "destructive" 
        });
        setIsSubmitting(false);
        return;
      }
    }
    
    const { error } = await requestAccess({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: requestEmail.trim(),
      organization: organization.trim() || undefined,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      setIsSubmitting(false);
      return;
    }

    setViewState("request_received");
    setIsSubmitting(false);
  }

  async function handleResend() {
    setIsResending(true);
    const { error } = await signInWithMagicLink(email);
    
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Email sent" });
      setShowResend(false);
      setTimeout(() => setShowResend(true), 45000);
    }
    setIsResending(false);
  }

  function resetToForm() {
    setViewState("form");
    setEmail("");
    setFirstName("");
    setLastName("");
    setRequestEmail("");
    setOrganization("");
  }

  // Pending approval state
  if (viewState === "pending") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-md text-center">
            <h1 className="mb-2">Pending approval</h1>
            <p className="text-sm text-muted-foreground mb-8">
              Your account is pending approval. You'll receive an email when it's ready.
            </p>
            <button
              onClick={resetToForm}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Back
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Email sent state (sign in)
  if (viewState === "email_sent") {
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
            
            {showResend && (
              <button
                onClick={handleResend}
                disabled={isResending}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
              >
                {isResending ? "Sending…" : "Resend email"}
              </button>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Request received state
  if (viewState === "request_received") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-md text-center">
            <h1 className="mb-2">Request received</h1>
            <p className="text-sm text-muted-foreground mb-8">
              Your account is pending approval. We'll email you once it's approved.
            </p>
            <button
              onClick={resetToForm}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Back
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Sign in form
  if (mode === "signin") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="mb-2">Tribes Rights Licensing</h1>
              <p className="text-sm text-muted-foreground">Sign in with your email to continue</p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
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
                {isSubmitting ? "Checking…" : "Continue"}
              </button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Need access?{" "}
              <button
                onClick={() => setMode("request")}
                className="text-foreground hover:underline transition-colors"
              >
                Request access
              </button>
            </p>

            <p className="text-center text-xs text-muted-foreground mt-6">
              By continuing, you agree to our{" "}
              <a 
                href="https://www.tribesrightsmanagement.com/terms-of-use" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-foreground hover:underline transition-colors"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a 
                href="https://www.tribesrightsmanagement.com/privacy-policy" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-foreground hover:underline transition-colors"
              >
                Privacy Policy
              </a>.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Request access form
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="mb-2">Request access</h1>
            <p className="text-sm text-muted-foreground">Submit your details for approval.</p>
          </div>

          <form onSubmit={handleRequestAccess} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                autoComplete="given-name"
                disabled={isSubmitting}
                aria-label="First name"
              />
              <Input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                autoComplete="family-name"
                disabled={isSubmitting}
                aria-label="Last name"
              />
            </div>
            
            <Input
              type="email"
              placeholder="you@company.com"
              value={requestEmail}
              onChange={(e) => setRequestEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={isSubmitting}
              aria-label="Email address"
            />
            
            <Input
              type="text"
              placeholder="Organization (optional)"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              autoComplete="organization"
              disabled={isSubmitting}
              aria-label="Organization"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Submitting…" : "Request access"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have access?{" "}
            <button
              onClick={() => setMode("signin")}
              className="text-foreground hover:underline transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="py-6 text-center">
      <p className="text-xs text-muted-foreground">
        © 2026 Tribes Rights Management LLC. All rights reserved.
      </p>
    </footer>
  );
}