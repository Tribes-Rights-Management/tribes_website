import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FormPageLayout, FormSuccessLayout } from "@/components/FormPageLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { z } from "zod";
import { FormFeedback } from "@/components/shared/FormFeedback";
import { ButtonSpinner } from "@/components/shared/ButtonSpinner";
import { useKnowledgeBaseSearch } from "@/hooks/useKnowledgeBaseSearch";
import { KnowledgeBaseSuggestions } from "@/components/contact/KnowledgeBaseSuggestions";

/**
 * CONTACT PAGE — Uses global FormPageLayout standard
 * NO page-specific typography or spacing overrides.
 */

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  email: z.string().trim().email("Please enter a valid email address").max(255),
  location: z.string().min(1, "Location is required"),
  subject: z.string().trim().min(1, "Subject is required").max(500),
  message: z.string().trim().min(1, "Message is required").max(5000),
});

type SubmitStatus = "idle" | "success" | "error";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [dismissedSuggestions, setDismissedSuggestions] = useState(false);
  const { toast } = useToast();

  // Knowledge base search
  const { articles, isSearching, clearResults } = useKnowledgeBaseSearch(subject);

  // Show suggestions only when we have articles and user hasn't dismissed them
  const showSuggestions = articles.length > 0 && !dismissedSuggestions;

  // Reset dismissed state when subject changes significantly
  useEffect(() => {
    if (subject.length < 2) {
      setDismissedSuggestions(false);
    }
  }, [subject]);

  // Auto-dismiss success message after 5 seconds
  useEffect(() => {
    if (submitStatus === "success") {
      const timer = setTimeout(() => {
        setSubmitStatus("idle");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  function handleContinueWithQuestion() {
    setDismissedSuggestions(true);
    clearResults();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitStatus("idle");
    
    const result = contactSchema.safeParse({
      name,
      email,
      location,
      subject,
      message,
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
      const { data, error } = await supabase.functions.invoke("submit-contact", {
        body: {
          full_name: name.trim(),
          email: email.trim().toLowerCase(),
          location: location.trim(),
          subject: subject.trim(),
          message: message.trim(),
          source_page: "contact",
        },
      });

      if (error) {
        throw new Error(error.message || "Failed to submit");
      }

      if (data?.error) {
        setSubmitStatus("error");
        setIsSubmitting(false);
        return;
      }

      setIsSubmitted(true);
    } catch (error: any) {
      console.error("Submit error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  // INSTITUTIONAL SUCCESS STATE (LOCKED)
  if (isSubmitted) {
    return (
      <FormSuccessLayout
        title="Submission received."
        message="Your information has been received and will be reviewed. If additional information is required, you will be contacted."
      >
        <Link 
          to="/" 
          className="text-[14px] text-muted-foreground hover:text-foreground transition-colors duration-150 underline underline-offset-4"
        >
          Return to site
        </Link>
      </FormSuccessLayout>
    );
  }

  return (
    <FormPageLayout
      title="Contact"
      lede="Submit an inquiry below. All messages are reviewed."
    >
      {/* Intent clarification — institutional tone */}
      <p className="text-[14px] text-muted-foreground leading-relaxed mb-8 -mt-4">
        This form is intended for licensing, administration, and general business inquiries.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ============================================
            SECTION 1: IDENTITY FIELDS
            ============================================ */}
        <div className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="contact-name" className="text-[13px] font-medium text-foreground">
              Full name
            </label>
            <Input
              id="contact-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="contact-email" className="text-[13px] font-medium text-foreground">
              Email address
            </label>
            <Input
              id="contact-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="contact-location" className="text-[13px] font-medium text-foreground">
              Country or territory
            </label>
            <Select value={location} onValueChange={setLocation} disabled={isSubmitting}>
              <SelectTrigger id="contact-location">
                <SelectValue placeholder="Select" />
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
        </div>

        {/* ============================================
            SECTION 2: SUBJECT + KNOWLEDGE BASE
            ============================================ */}
        <div className="space-y-2">
          <label htmlFor="contact-subject" className="text-[13px] font-medium text-foreground">
            Subject
          </label>
          <Input
            id="contact-subject"
            type="text"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              setDismissedSuggestions(false);
            }}
            placeholder="What is your inquiry about?"
            required
            disabled={isSubmitting}
          />
          
          {/* Knowledge Base Suggestions */}
          {(showSuggestions || isSearching) && (
            <KnowledgeBaseSuggestions
              articles={articles}
              isSearching={isSearching}
              onContinue={handleContinueWithQuestion}
            />
          )}
        </div>

        {/* ============================================
            SECTION 3: MESSAGE
            ============================================ */}
        <div className="space-y-2">
          <label htmlFor="contact-message" className="text-[13px] font-medium text-foreground">
            Your message
          </label>
          <Textarea
            id="contact-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            disabled={isSubmitting}
            rows={4}
          />
        </div>

        {/* ============================================
            SECTION 4: FEEDBACK + SUBMISSION
            ============================================ */}
        <div className="pt-4 space-y-4">
          {/* Inline Feedback */}
          {submitStatus === "error" && (
            <FormFeedback
              type="error"
              title="Unable to submit"
              message="Something went wrong. Please try again or email us directly at support@mail.tribesassets.com."
              onDismiss={() => setSubmitStatus("idle")}
            />
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="w-full"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <ButtonSpinner size={16} />
                Submitting…
              </span>
            ) : (
              "Submit"
            )}
          </Button>

          <p className="text-[13px] text-muted-foreground text-center">
            Submissions are reviewed in the order received.
          </p>
        </div>
      </form>
    </FormPageLayout>
  );
}
