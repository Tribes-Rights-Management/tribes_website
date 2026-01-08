import { useState } from "react";
import { Link } from "react-router-dom";
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
import { BRAND } from "@/lib/brand";
import { getCopyrightLine } from "@/lib/copyright";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  email: z.string().trim().email("Please enter a valid email address").max(255),
  location: z.string().min(1, "Location is required"),
  message: z.string().trim().min(1, "Message is required").max(5000),
});

export default function PreLaunchPage() {
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
          source_page: "pre-launch",
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

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* ═══════════════════════════════════════════════════════════════════════════
          HEADER — Minimal, no auth
          ═══════════════════════════════════════════════════════════════════════════ */}
      <header 
        className="fixed top-0 left-0 right-0 z-50 bg-[#111214] border-b border-white/[0.08]"
        style={{ 
          paddingTop: "env(safe-area-inset-top)",
          height: 64,
        }}
      >
        <nav className="max-w-[1400px] mx-auto h-full flex items-center justify-between px-6 md:px-10 lg:px-20">
          <Link 
            to="/" 
            className="text-white hover:text-white/80 font-medium tracking-tight transition-colors duration-150"
            style={{
              fontSize: 15,
              letterSpacing: "-0.005em",
              lineHeight: 1.4,
            }}
          >
            <span className="lg:hidden">{BRAND.wordmark}</span>
            <span className="hidden lg:inline">{BRAND.legalName}</span>
          </Link>
          
          <button 
            onClick={scrollToContact}
            className="text-white/65 hover:text-white/85 transition-colors duration-150"
            style={{
              fontSize: 14,
              fontWeight: 450,
              letterSpacing: "0.005em",
              lineHeight: 1.5,
            }}
          >
            Contact
          </button>
        </nav>
      </header>

      <main className="flex-1">
        {/* ═══════════════════════════════════════════════════════════════════════════
            HERO — Institutional, calm, precise
            ═══════════════════════════════════════════════════════════════════════════ */}
        <section className="bg-[#111214] pt-36 pb-32 md:pt-44 md:pb-40 lg:pt-52 lg:pb-48">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-20">
            <div className="max-w-[640px]">
              {/* Logo */}
              <p className="text-sm font-medium tracking-[0.08em] text-[#C9C9CC] mb-14">
                TRIBES
              </p>
              
              {/* H1 */}
              <h1 className="text-[40px] md:text-[56px] lg:text-[72px] font-medium leading-[1.08] tracking-[-0.015em] text-white mb-8">
                Rights management, built to last.
              </h1>
              
              {/* Secondary supporting line */}
              <p className="text-base md:text-lg font-light text-white/45 leading-[1.5] tracking-[0.01em] mb-16">
                Publishing administration, built for precision.
              </p>
              
              {/* Divider */}
              <div className="w-16 h-px bg-white/10 mb-10" />
              
              {/* Primary CTA */}
              <button
                onClick={scrollToContact}
                className="text-sm text-white/75 hover:text-white transition-colors duration-150 underline underline-offset-4 decoration-white/30"
              >
                Contact us
              </button>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════════
            CONTACT SECTION
            ═══════════════════════════════════════════════════════════════════════════ */}
        <section id="contact" className="py-24 md:py-32 scroll-mt-24">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-20">
            <div className="max-w-[560px]">
              {isSubmitted ? (
                <>
                  <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-3">
                    Message received
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We'll review and respond if there's a fit.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-3">
                    Get in touch
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-10">
                    For inquiries regarding publishing administration or rights management, contact us below.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <Input
                      type="text"
                      placeholder="Full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={isSubmitting}
                      aria-label="Name"
                    />

                    <Input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isSubmitting}
                      aria-label="Email"
                    />

                    <Select value={location} onValueChange={setLocation} disabled={isSubmitting}>
                      <SelectTrigger aria-label="Select your location">
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

                    <div className="pt-2">
                      <Textarea
                        placeholder="Your message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        disabled={isSubmitting}
                        rows={4}
                        aria-label="Message"
                      />
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-12 bg-foreground text-background text-[14px] font-medium rounded-md hover:bg-foreground/90 transition-all duration-150 disabled:bg-muted disabled:text-muted-foreground/60 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Sending…" : "Send"}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* ═══════════════════════════════════════════════════════════════════════════
          FOOTER — Minimal
          ═══════════════════════════════════════════════════════════════════════════ */}
      <footer className="bg-[#111214] py-10 md:py-12 border-t border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-20">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            {/* Left: Brand + Copyright */}
            <div className="flex flex-col gap-1.5">
              <p 
                className="text-[#8C8C8C] tracking-tight"
                style={{ fontSize: 12 }}
              >
                {BRAND.wordmark}
              </p>
              <p 
                className="text-[#8C8C8C] leading-relaxed"
                style={{ fontSize: 11 }}
              >
                {getCopyrightLine()}
              </p>
            </div>
            
            {/* Right: Legal links */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
              <Link 
                to="/privacy" 
                className="text-[#B5B5B5] transition-colors duration-150 hover:text-white py-1"
                style={{ fontSize: 12 }}
              >
                Privacy
              </Link>
              <Link 
                to="/terms" 
                className="text-[#B5B5B5] transition-colors duration-150 hover:text-white py-1"
                style={{ fontSize: 12 }}
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
