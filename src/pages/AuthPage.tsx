import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { signInWithMagicLink } = useAuth();
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      toast({
        title: "Invalid email",
        description: result.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const { error } = await signInWithMagicLink(email);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    setIsEmailSent(true);
    setIsSubmitting(false);
  }

  if (isEmailSent) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-md text-center animate-fade-in">
            <h1 className="mb-2">Check your email</h1>
            <p className="text-sm text-muted-foreground mb-6">
              We've sent a sign-in link to <span className="text-foreground">{email}</span>
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Click the link in the email to continue.
            </p>
            <button
              onClick={() => {
                setIsEmailSent(false);
                setEmail("");
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Use a different email
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md animate-fade-in">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="mb-2">Tribes Rights Licensing</h1>
            <p className="text-sm text-muted-foreground">Sign in with your email to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={isSubmitting}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending…
                </>
              ) : (
                "Continue with Email"
              )}
            </Button>
          </form>

          {/* Legal */}
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

function Footer() {
  return (
    <footer className="py-6 text-center">
      <p className="text-xs text-muted-foreground">
        © {new Date().getFullYear()} Tribes Rights Management LLC. All rights reserved.
      </p>
    </footer>
  );
}
