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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { COUNTRIES } from "@/lib/countries";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  email: z.string().trim().email("Please enter a valid email address").max(255),
  location: z.string().min(1, "Location is required"),
  message: z.string().trim().min(1, "Message is required").max(5000),
});

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    const result = contactSchema.safeParse({
      name,
      email,
      location,
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
          message: message.trim(),
          source_page: "contact",
        },
      });

      if (error) {
        throw new Error(error.message || "Failed to submit");
      }

      if (data?.error) {
        toast({
          title: "Unable to submit",
          description: data.error,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      setIsSubmitted(true);
    } catch (error: any) {
      console.error("Submit error:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <PublicLayout footerVariant="minimal">
        <section className="pt-28 pb-24 md:pt-36 md:pb-32">
          <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12">
            <div className="max-w-[480px]">
              <h1 className="text-[28px] md:text-[36px] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground mb-4">
                Message received
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-8">
                We'll review and respond if there's a fit.
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
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="max-w-[520px]">
            <h1 className="text-[28px] md:text-[36px] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground mb-3">
              Contact
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              General inquiries and questions.
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isSubmitting}
                aria-label="Name"
                className="w-full"
              />

              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                aria-label="Email"
                className="w-full"
              />

              <Select value={location} onValueChange={setLocation} disabled={isSubmitting}>
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

              <div className="pt-1">
                <Textarea
                  placeholder="Your message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  disabled={isSubmitting}
                  rows={5}
                  aria-label="Message"
                  className="w-full"
                />
              </div>

              <div className="pt-5 flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full max-w-[280px] h-[44px] bg-foreground text-background text-sm font-medium rounded-md hover:bg-foreground/90 active:bg-foreground/85 transition-all duration-150 disabled:bg-muted-foreground/20 disabled:text-muted-foreground/50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending…" : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
