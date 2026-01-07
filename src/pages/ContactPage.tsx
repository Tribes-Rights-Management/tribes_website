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
    
    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
  }

  if (isSubmitted) {
    return (
      <PublicLayout footerVariant="minimal">
        <section className="pt-24 pb-24 md:pt-32 md:pb-32">
          <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12">
            <div className="max-w-[480px]">
              <h1 className="text-[28px] md:text-[36px] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground mb-6">
                Message received
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Thank you for reaching out. We'll respond as soon as possible.
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
      <section className="pt-20 pb-6 md:pt-24 md:pb-8">
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

      {/* Contact Form */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="max-w-[520px]">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isSubmitting}
                  aria-label="Name"
                />
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
              </div>

              <div>
                <Select value={location} onValueChange={setLocation} disabled={isSubmitting}>
                  <SelectTrigger aria-label="Location">
                    <SelectValue placeholder="Select country or territory" />
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
                <Textarea
                  placeholder="Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  disabled={isSubmitting}
                  rows={5}
                  aria-label="Message"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-[42px] px-8 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
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
