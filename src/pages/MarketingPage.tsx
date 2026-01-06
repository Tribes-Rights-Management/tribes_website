import { Link } from "react-router-dom";

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <nav className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="text-sm font-medium text-foreground">
              Tribes Rights Licensing
            </Link>
            <div className="flex items-center gap-6">
              <Link 
                to="/auth" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="pt-32 pb-24 md:pt-40 md:pb-32 lg:pt-48 lg:pb-40">
          <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
            <div className="max-w-[720px]">
            <h1 className="text-[40px] md:text-[56px] lg:text-[72px] font-semibold leading-[1.05] tracking-[-0.03em] text-foreground mb-6">
                Licensing, handled properly.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-4 max-w-[560px]">
                A private portal for requesting, executing, and managing music licenses. 
                Structured for clarity. Built for long-term record-keeping.
              </p>
              <p className="text-xs font-light text-muted-foreground/70 tracking-[0.05em] mb-10">
                Powered by precision. Built for creators.
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
                  Creators & Rights Holders
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Artists, writers, and publishers seeking a clear, documented 
                  licensing process with permanent records of every agreement.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground mb-3">
                  Churches & Ministries
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Religious organizations requiring proper licensing for 
                  recordings, streaming, and distribution of worship music.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground mb-3">
                  Commercial & Broadcast Users
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Film, television, advertising, and media companies needing 
                  sync licenses with defensible legal documentation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="h-px bg-border" />
        </div>

        {/* Why It Exists */}
        <section className="py-24 md:py-32">
          <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
            <div className="max-w-[640px]">
              <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground mb-12">
                Why It Exists
              </h2>
              <p className="text-[24px] md:text-[32px] font-medium leading-[1.3] tracking-[-0.02em] text-foreground mb-8">
                Music licensing should be precise—not complicated.
              </p>
              <div className="space-y-6 text-muted-foreground">
                <p className="leading-relaxed">
                  Most licensing systems are either informal or overbuilt. Tribes Rights 
                  Licensing exists to sit in the middle: structured enough to be enforceable, 
                  simple enough to move quickly, and designed for long-term clarity across 
                  every agreement.
                </p>
                <p className="leading-relaxed mt-8 text-foreground/80">
                  Built for creators. Powered by precision.
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
                    Submit a license request through a structured form. Identify the track, 
                    intended use, territory, and term. Select the license types you need.
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">02</p>
                  <h3 className="text-lg font-medium text-foreground mb-3">Review</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Your request is reviewed by our team. We may request additional 
                    information. Once terms are confirmed, the license is approved.
                  </p>
                </div>
              </div>
              <div className="space-y-12">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">03</p>
                  <h3 className="text-lg font-medium text-foreground mb-3">Execute</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Sign the agreement electronically. Complete payment if applicable. 
                    The license becomes legally binding upon execution.
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">04</p>
                  <h3 className="text-lg font-medium text-foreground mb-3">Record</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The executed license is stored permanently. Download your agreement 
                    at any time. The complete history remains available for reference.
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
            <div className="max-w-[640px] space-y-8">
              <div className="pb-8 border-b border-border">
                <h3 className="text-base font-medium text-foreground mb-2">
                  Structured license requests
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Every request follows a consistent format. No missing information. 
                  No ambiguity about terms.
                </p>
              </div>
              <div className="pb-8 border-b border-border">
                <h3 className="text-base font-medium text-foreground mb-2">
                  Independent license records
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Each license receives its own unique identifier and can be 
                  tracked, referenced, and audited independently.
                </p>
              </div>
              <div className="pb-8 border-b border-border">
                <h3 className="text-base font-medium text-foreground mb-2">
                  Single execution flow
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Signature and payment happen in one place. Status is always clear. 
                  Nothing falls through the cracks.
                </p>
              </div>
              <div className="pb-8 border-b border-border">
                <h3 className="text-base font-medium text-foreground mb-2">
                  Permanent access
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Executed licenses are never deleted. Download your agreements 
                  whenever you need them, years from now.
                </p>
              </div>
              <div>
                <h3 className="text-base font-medium text-foreground mb-2">
                  Administrative oversight
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Every request is reviewed before approval. No automated licensing. 
                  Human judgment at every step.
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
                A Considered Approach
              </h2>
              <p className="text-[24px] md:text-[32px] font-medium leading-[1.3] tracking-[-0.02em] text-foreground mb-8">
                Access is by approval only.
              </p>
              <div className="space-y-6 text-muted-foreground">
                <p className="leading-relaxed">
                  This is not a public marketplace. Access to the portal requires 
                  approval. We review each request to ensure we can serve you properly 
                  and that our catalog is appropriate for your needs.
                </p>
                <p className="leading-relaxed">
                  Once approved, you have a private account for managing your license 
                  requests. Your data remains confidential. Your executed agreements 
                  are stored securely and remain accessible for as long as you need them.
                </p>
                <p className="leading-relaxed">
                  Our role is stewardship, not transaction volume. We aim to build 
                  long-term relationships with organizations and individuals who 
                  value clarity and proper documentation.
                </p>
              </div>
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
                If you already have an account, sign in to access your portal. 
                Otherwise, request access to get started.
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
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <p className="text-xs text-muted-foreground/60 tracking-[0.02em] mb-4">
            Built for creators. Powered by precision.
          </p>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              © 2026 Tribes Rights Management LLC. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link 
                to="/privacy" 
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Use
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
