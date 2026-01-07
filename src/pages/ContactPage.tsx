import { useState } from "react";
import { Link } from "react-router-dom";
import { PublicLayout } from "@/components/PublicLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast({
        title: "Please complete all fields",
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
    <PublicLayout>
      {/* Hero */}
      <section className="pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="max-w-[720px]">
            <h1 className="text-[40px] md:text-[56px] lg:text-[64px] font-semibold leading-[1.05] tracking-[-0.03em] text-foreground mb-6">
              Contact
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-[560px]">
              General inquiries and questions.
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
        <div className="h-px bg-border" />
      </div>

      {/* Contact Form & Info */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24">
            <div>
              <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground mb-8">
                Send a Message
              </h2>
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
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-10 px-6 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Sending…" : "Send Message"}
                </button>
              </form>
            </div>

            <div>
              <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground mb-8">
                Other Ways to Reach Us
              </h2>
              <div className="space-y-8">
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Email</p>
                  <a 
                    href="mailto:info@tribesrightsmanagement.com" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    info@tribesrightsmanagement.com
                  </a>
                </div>
                <div className="pt-8 border-t border-border">
                  <p className="text-sm font-medium text-foreground mb-4">Looking for something specific?</p>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                        Need to license music we administer?
                      </p>
                      <Link 
                        to="/licensing" 
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
                      >
                        Request Licensing Access
                      </Link>
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        Account approval required.
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                        Exploring representation or administration?
                      </p>
                      <Link 
                        to="/inquire" 
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
                      >
                        Inquire About Services
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
