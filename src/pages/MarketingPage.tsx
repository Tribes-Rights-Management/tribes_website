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
              Independent publishing administration focused on accuracy, continuity, and long-term record integrity.
            </p>
            
            {/* Divider */}
            <div className="w-16 h-px bg-white/10 mb-8" />
            
            {/* Micro-line */}
            <p className="text-xs font-light text-[#C9C9CC]/50 tracking-[0.05em] mb-20">
              Publishing administration, built for precision.
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
                Copyright administration, global collections, defensible records.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">
                Rights Holders
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Catalog and licensing management across rights types and income sources.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">
                Commercial & Broadcast
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Clearance and documentation for recorded music and media.
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
                Registration, tracking, collection, protection, reporting.
              </p>
            </div>
            <div className="p-8 bg-white rounded-lg" style={{ border: '1px solid #E6E7E9' }}>
              <h3 className="text-lg font-medium mb-3" style={{ color: '#111214' }}>
                Rights Management
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#5F6368' }}>
                Ownership records, metadata integrity, audit-ready documentation.
              </p>
            </div>
            <div className="p-8 bg-white rounded-lg" style={{ border: '1px solid #E6E7E9' }}>
              <h3 className="text-lg font-medium mb-3" style={{ color: '#111214' }}>
                Licensing
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#5F6368' }}>
                Request, review, execution, permanent storage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How Copyright Clearance Works - Full-width dark block */}
      <section id="how-it-works" className="py-24 md:py-32 scroll-mt-24" style={{ backgroundColor: '#111214' }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <h2 
            className="text-xs font-medium uppercase tracking-[0.12em] mb-6"
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            How Copyright Clearance Works
          </h2>
          <p 
            className="text-lg md:text-xl leading-relaxed mb-16 max-w-[640px]"
            style={{ color: 'rgba(255,255,255,0.82)' }}
          >
            A review-driven process for accuracy, continuity, and long-term defensibility.
          </p>
          <div className="grid md:grid-cols-2 gap-16 md:gap-24">
            <div className="space-y-12">
              <div>
                <p 
                  className="text-xs font-medium mb-2"
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                >
                  01
                </p>
                <h3 
                  className="text-lg font-medium mb-3"
                  style={{ color: 'rgba(255,255,255,0.82)' }}
                >
                  Intake
                </h3>
                <p 
                  className="text-sm leading-relaxed"
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                >
                  Rights, usage, scope, and context submitted once.
                </p>
              </div>
              <div>
                <p 
                  className="text-xs font-medium mb-2"
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                >
                  02
                </p>
                <h3 
                  className="text-lg font-medium mb-3"
                  style={{ color: 'rgba(255,255,255,0.82)' }}
                >
                  Verification
                </h3>
                <p 
                  className="text-sm leading-relaxed"
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                >
                  Ownership, splits, metadata, and authority reviewed against records.
                </p>
              </div>
            </div>
            <div className="space-y-12">
              <div>
                <p 
                  className="text-xs font-medium mb-2"
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                >
                  03
                </p>
                <h3 
                  className="text-lg font-medium mb-3"
                  style={{ color: 'rgba(255,255,255,0.82)' }}
                >
                  Authorization
                </h3>
                <p 
                  className="text-sm leading-relaxed"
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                >
                  Terms confirmed, documented, and executed.
                </p>
              </div>
              <div>
                <p 
                  className="text-xs font-medium mb-2"
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                >
                  04
                </p>
                <h3 
                  className="text-lg font-medium mb-3"
                  style={{ color: 'rgba(255,255,255,0.82)' }}
                >
                  Record
                </h3>
                <p 
                  className="text-sm leading-relaxed"
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                >
                  Agreements and identifiers stored for long-term reference.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Music as an Asset Class */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <h2 className="text-xs font-medium uppercase tracking-[0.12em] mb-12" style={{ color: '#6A6D70' }}>
            Music as an Asset Class
          </h2>
          
          <div className="max-w-[720px]">
            <p className="text-lg md:text-xl font-medium leading-[1.5] text-foreground mb-2">
              Publishing administration is not clerical work.
            </p>
            <p className="text-lg md:text-xl font-medium leading-[1.5] text-foreground mb-10">
              It is long-term asset management.
            </p>
            
            <p className="text-base leading-[1.8] text-muted-foreground mb-12 max-w-[640px]">
              At Tribes, we treat music as a durable financial asset—one that requires rights administration, data stewardship, and financial oversight.
            </p>
            
            <p className="text-sm font-medium text-foreground mb-6">
              That means:
            </p>
            
            <div className="space-y-5 mb-12">
              <p className="text-sm leading-[1.7] text-muted-foreground pl-4 border-l border-border">
                Rights and ownership managed with the same rigor as any investable asset
              </p>
              <p className="text-sm leading-[1.7] text-muted-foreground pl-4 border-l border-border">
                Metadata, splits, and agreements maintained as permanent financial records
              </p>
              <p className="text-sm leading-[1.7] text-muted-foreground pl-4 border-l border-border">
                Income tracked, reconciled, and reported with continuity
              </p>
              <p className="text-sm leading-[1.7] text-muted-foreground pl-4 border-l border-border">
                Documentation preserved for audits, transactions, and valuation
              </p>
            </div>
            
            <p className="text-base leading-[1.8] text-muted-foreground max-w-[640px]">
              Records remain accessible. Ownership stays documented. Agreements stay enforceable.
            </p>
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
              Sign in if you have an account. Otherwise, request access and we'll review your submission.
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
