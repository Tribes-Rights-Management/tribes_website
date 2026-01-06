import { Link } from "react-router-dom";
import { PublicLayout } from "@/components/PublicLayout";

export default function MarketingPage() {
  return (
    <PublicLayout>
      {/* Hero - Near-black (#111214) */}
      <section className="bg-[#111214] pt-36 pb-32 md:pt-44 md:pb-40 lg:pt-52 lg:pb-48">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="max-w-[720px]">
            {/* Logo */}
            <p className="text-sm font-medium tracking-[0.08em] text-[#C9C9CC] mb-14">
              TRIBES
            </p>
            
            {/* H1 - Institutional weight, refined letter-spacing */}
            <h1 className="text-[40px] md:text-[56px] lg:text-[72px] font-medium leading-[1.08] tracking-[-0.015em] text-white mb-12">
              Rights management, built to last.
            </h1>
            
            {/* Subhead - Generous spacing, soft gray */}
            <p className="text-lg md:text-xl text-[#C9C9CC] leading-[1.7] mb-16 max-w-[560px]">
              An independent publishing administration firm focused on accuracy, continuity, and long-term record integrity.
            </p>
            
            {/* Divider */}
            <div className="w-16 h-px bg-white/10 mb-8" />
            
            {/* Micro-line */}
            <p className="text-xs font-light text-[#C9C9CC]/50 tracking-[0.05em] mb-20">
              Built for creators. Powered by precision.
            </p>
            
            {/* Understated link */}
            <a 
              href="#how-it-works" 
              className="text-xs text-[#C9C9CC]/40 hover:text-[#C9C9CC]/70 transition-colors"
            >
              How it works
            </a>
          </div>
        </div>
      </section>

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
                Clear copyright administration, global collections, and defensible records.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">
                Rights Holders
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Structured catalog and licensing management across all rights types and income sources.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">
                Commercial & Broadcast
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Professional clearance and documentation for recorded music and media.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
        <div className="h-px" style={{ backgroundColor: 'rgba(17,18,20,0.08)' }} />
      </div>

      {/* What We Do */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <h2 className="text-xs font-medium uppercase tracking-[0.12em] mb-12" style={{ color: '#6A6D70' }}>
            What We Do
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-lg" style={{ border: '1px solid #E6E7E9' }}>
              <h3 className="text-lg font-medium mb-3" style={{ color: '#111214' }}>
                Publishing Administration
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#5F6368' }}>
                Register, track, collect, protect, and report—cleanly.
              </p>
            </div>
            <div className="p-8 bg-white rounded-lg" style={{ border: '1px solid #E6E7E9' }}>
              <h3 className="text-lg font-medium mb-3" style={{ color: '#111214' }}>
                Rights Management
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#5F6368' }}>
                Organized ownership, accurate metadata, audit-ready records.
              </p>
            </div>
            <div className="p-8 bg-white rounded-lg" style={{ border: '1px solid #E6E7E9' }}>
              <h3 className="text-lg font-medium mb-3" style={{ color: '#111214' }}>
                Licensing
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#5F6368' }}>
                Requests, review, execution, and permanent storage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
        <div className="h-px" style={{ backgroundColor: 'rgba(17,18,20,0.08)' }} />
      </div>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 md:py-32 scroll-mt-24">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-2 gap-16 md:gap-24">
            <div className="space-y-12">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">01</p>
                <h3 className="text-lg font-medium text-foreground mb-3">Submit</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Rights usage details are submitted once, in a structured and complete format to ensure clarity from the outset.
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">02</p>
                <h3 className="text-lg font-medium text-foreground mb-3">Verify</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We confirm ownership, scope, and applicable rights, resolving any gaps before proceeding.
                </p>
              </div>
            </div>
            <div className="space-y-12">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">03</p>
                <h3 className="text-lg font-medium text-foreground mb-3">Authorize</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Clearances are formally executed, with agreements signed and payments handled where applicable.
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">04</p>
                <h3 className="text-lg font-medium text-foreground mb-3">Preserve</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  All finalized documents and records are securely stored and remain accessible long-term.
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
