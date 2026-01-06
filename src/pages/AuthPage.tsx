import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const emailSchema = z.string().trim().email("Please enter a valid email address");

type ViewState = "form" | "check_email" | "pending" | "new_request" | "rejected";

export default function AuthPage() {
  const [viewState, setViewState] = useState<ViewState>("form");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [isResending, setIsResending] = useState(false);

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
      } else if (status === "new_request") {
        setViewState("new_request");
      } else if (status === "rejected") {
        setViewState("rejected");
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
      toast({ title: "Email sent" });
      setShowResend(false);
      setTimeout(() => setShowResend(true), 45000);
    }
    setIsResending(false);
  }

  function handleDone() {
    setViewState("form");
    setEmail("");
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
              Your access request has been submitted. You'll receive an email once it's approved.
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

  // Main form
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="mb-2">Tribes Rights Licensing</h1>
            <p className="text-sm text-muted-foreground">Continue with your email</p>
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