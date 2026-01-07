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

export default function LicenseRequestPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [usageType, setUsageType] = useState("");
  const [songTitle, setSongTitle] = useState("");
  const [artistWriter, setArtistWriter] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !usageType || !songTitle.trim() || !description.trim()) {
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
                Request received
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We've received your license request.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Our team will review the details and follow up regarding availability, terms, and next steps.
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
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="max-w-[640px]">
            <h1 className="text-[32px] md:text-[40px] lg:text-[48px] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground mb-6">
              Request a License
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              For commercial, broadcast, or ministry use of music administered by Tribes.
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
                License Request
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
                    placeholder="Company or organization (optional)"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    disabled={isSubmitting}
                    aria-label="Company"
                  />
                </div>

                <div>
                  <Select value={country} onValueChange={setCountry} disabled={isSubmitting}>
                    <SelectTrigger aria-label="Country">
                      <SelectValue placeholder="Country (optional)" />
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

                <div className="pt-4 border-t border-border">
                  <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground mb-4">
                    Song Details
                  </p>
                </div>

                <div>
                  <Input
                    type="text"
                    placeholder="Song title"
                    value={songTitle}
                    onChange={(e) => setSongTitle(e.target.value)}
                    required
                    disabled={isSubmitting}
                    aria-label="Song title"
                  />
                </div>

                <div>
                  <Input
                    type="text"
                    placeholder="Artist or writer (if known)"
                    value={artistWriter}
                    onChange={(e) => setArtistWriter(e.target.value)}
                    disabled={isSubmitting}
                    aria-label="Artist or writer"
                  />
                </div>

                <div>
                  <Select value={usageType} onValueChange={setUsageType} disabled={isSubmitting}>
                    <SelectTrigger aria-label="Usage type">
                      <SelectValue placeholder="Usage type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="film_tv">Film / TV</SelectItem>
                      <SelectItem value="advertising">Advertising</SelectItem>
                      <SelectItem value="trailer">Trailer / Promo</SelectItem>
                      <SelectItem value="social_media">Social Media</SelectItem>
                      <SelectItem value="podcast">Podcast</SelectItem>
                      <SelectItem value="game">Video Game</SelectItem>
                      <SelectItem value="church_ministry">Church / Ministry</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Textarea
                    placeholder="Describe how and where the music will be used. Include project name, distribution, territory, and timing if known."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    disabled={isSubmitting}
                    rows={5}
                    aria-label="Usage description"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-10 px-6 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Sending…" : "Submit Request"}
                </button>
              </form>
            </div>

            <div>
              <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground mb-8">
                How It Works
              </h2>
              <div className="space-y-8 text-muted-foreground">
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Submit your request</p>
                  <p className="text-sm leading-relaxed">
                    Provide details about the song and how you plan to use it. No account required.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">We review and respond</p>
                  <p className="text-sm leading-relaxed">
                    Our team verifies rights, confirms availability, and prepares terms if applicable.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Receive your license</p>
                  <p className="text-sm leading-relaxed">
                    If approved, you'll receive documentation for execution and recordkeeping.
                  </p>
                </div>
                <div className="pt-8 border-t border-border">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    This form is for licensing requests only. If you're interested in becoming a client for publishing administration, 
                    <Link to="/inquire" className="text-foreground hover:underline ml-1">
                      submit a service inquiry
                    </Link>.
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
