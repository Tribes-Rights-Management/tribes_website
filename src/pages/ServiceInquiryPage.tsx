import { useState } from "react";
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

export default function ServiceInquiryPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [catalogSize, setCatalogSize] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!firstName.trim() || !lastName.trim() || !company.trim() || !country || !email.trim() || !description.trim()) {
      toast({
        title: "Please complete all required fields",
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
      <PublicLayout>
        <section className="pt-32 pb-24 md:pt-40 md:pb-32 lg:pt-48 lg:pb-40">
          <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
            <div className="max-w-[480px]">
              <h1 className="text-[32px] md:text-[40px] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground mb-6">
                Inquiry received
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Thank you for your interest in working with Tribes.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We review all service inquiries and will follow up if there's a potential fit.
              </p>
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
              Work with Tribes
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Publishing administration, rights management, and long-term catalog support.
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
                    placeholder="Company or artist name"
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
                  <Select value={catalogSize} onValueChange={setCatalogSize} disabled={isSubmitting}>
                    <SelectTrigger aria-label="Catalog size">
                      <SelectValue placeholder="Catalog size (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-50">1–50 songs</SelectItem>
                      <SelectItem value="51-200">51–200 songs</SelectItem>
                      <SelectItem value="201-500">201–500 songs</SelectItem>
                      <SelectItem value="500+">500+ songs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Textarea
                    placeholder="Tell us about your catalog, current administration situation, and what you're looking for."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    disabled={isSubmitting}
                    rows={5}
                    aria-label="Description"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-10 px-6 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Sending…" : "Submit Inquiry"}
                </button>
              </form>
            </div>

            <div>
              <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground mb-8">
                What to Expect
              </h2>
              <div className="space-y-8 text-muted-foreground">
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Review</p>
                  <p className="text-sm leading-relaxed">
                    We review each inquiry to understand your catalog, goals, and whether our services are the right fit.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Response</p>
                  <p className="text-sm leading-relaxed">
                    If there's a potential fit, we'll follow up to discuss scope, terms, and next steps.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">No obligation</p>
                  <p className="text-sm leading-relaxed">
                    Submitting an inquiry does not create a client relationship or platform access.
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
