import { Link } from "react-router-dom";
import { PublicLayout } from "@/components/PublicLayout";

export default function MarketingPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="pt-32 pb-24 md:pt-40 md:pb-32 lg:pt-48 lg:pb-40">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="max-w-[720px]">
            <h1 className="text-[40px] md:text-[56px] lg:text-[72px] font-semibold leading-[1.05] tracking-[-0.03em] text-foreground mb-6">
              Rights management, handled properly.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-4 max-w-[560px]">
              A private, approval-based team for publishing administration and licensing. 
              Clear process. Clean documentation. Long-term records.
            </p>
            <p className="text-xs font-light text-muted-foreground/70 tracking-[0.05em] mb-10">
              Powered by precision.
            </p>
            <div className="flex items-center gap-6">
              <Link 
                to="/auth" 
                className="text-sm font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/auth?request=true" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Request Access
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
        <div className="h-px bg-border" />
      </div>

      {/* Who It's For */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground mb-12">
            Who It's For
          </h2>
          <div className="grid md:grid-cols-3 gap-12 md:gap-16">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">
                Songwriters & Producers
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Clear administration and defensible records.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">
                Churches & Ministries
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Proper licensing for worship usage and distribution.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">
                Commercial & Broadcast
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Professional clearance and documentation for media.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
        <div className="h-px bg-border" />
      </div>

      {/* What We Do */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground mb-12">
            What We Do
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border border-border rounded-lg">
              <h3 className="text-lg font-medium text-foreground mb-3">
                Publishing Administration
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Register, track, collect, and report—cleanly.
              </p>
            </div>
            <div className="p-6 border border-border rounded-lg">
              <h3 className="text-lg font-medium text-foreground mb-3">
                Rights Management
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Organized ownership, accurate metadata, audit-ready records.
              </p>
            </div>
            <div className="p-6 border border-border rounded-lg">
              <h3 className="text-lg font-medium text-foreground mb-3">
                Licensing
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Requests, review, execution, and permanent storage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
        <div className="h-px bg-border" />
      </div>

      {/* How It Works */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-2 gap-16 md:gap-24">
            <div className="space-y-12">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">01</p>
                <h3 className="text-lg font-medium text-foreground mb-3">Request</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Submit details once, in a structured format.
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">02</p>
                <h3 className="text-lg font-medium text-foreground mb-3">Review</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We confirm scope and terms, and clarify anything missing.
                </p>
              </div>
            </div>
            <div className="space-y-12">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">03</p>
                <h3 className="text-lg font-medium text-foreground mb-3">Execute</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Agreement is signed. Payment is handled if applicable.
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">04</p>
                <h3 className="text-lg font-medium text-foreground mb-3">Record</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Final documents are stored and accessible long-term.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
        <div className="h-px bg-border" />
      </div>

      {/* Features & Benefits */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground mb-12">
            What You Get
          </h2>
          <div className="max-w-[640px] space-y-6">
            <div className="flex items-start gap-4">
              <span className="text-muted-foreground">—</span>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Structured requests (no missing fields)
              </p>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-muted-foreground">—</span>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Clear status at every step
              </p>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-muted-foreground">—</span>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Permanent access to executed documents
              </p>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-muted-foreground">—</span>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Identifiers for reference and audit
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
        <div className="h-px bg-border" />
      </div>

      {/* Trust Section */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="max-w-[640px]">
            <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground mb-12">
              Stewardship
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We prioritize clarity over volume. Every agreement is reviewed. 
              Every record is maintained. This is a long-term system designed to hold up.
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
        <div className="h-px bg-border" />
      </div>

      {/* Final CTA */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="max-w-[480px]">
            <h2 className="text-[24px] md:text-[32px] font-medium leading-[1.3] tracking-[-0.02em] text-foreground mb-6">
              Ready to begin?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              If you already have an account, sign in. Otherwise, request access 
              and we'll review your submission.
            </p>
            <div className="flex items-center gap-6">
              <Link 
                to="/auth" 
                className="text-sm font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/auth?request=true" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Request Access
              </Link>
            </div>
            <div className="mt-8">
              <Link 
                to="/how-licensing-works" 
                className="text-xs text-muted-foreground/70 hover:text-muted-foreground transition-colors"
              >
                Learn how licensing works
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
