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

      {/* Music as an Asset - Full-width dark section */}
      <section id="asset-management" className="py-24 md:py-32" style={{ backgroundColor: '#111214' }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Left Column */}
            <div>
              <p 
                className="text-xs font-medium uppercase tracking-[0.12em] mb-8"
                style={{ color: 'rgba(255,255,255,0.55)' }}
              >
                Music as an Asset
              </p>
              <h2 
                className="text-[28px] md:text-[36px] font-medium leading-[1.2] tracking-[-0.01em] mb-8"
                style={{ color: 'rgba(255,255,255,0.88)' }}
              >
                Managing music with the discipline of long-term capital.
              </h2>
              <p 
                className="text-base leading-[1.8]"
                style={{ color: 'rgba(255,255,255,0.64)' }}
              >
                At Tribes, publishing administration is not clerical work. It is asset management—rights, data, income, and documentation treated with institutional rigor. Our systems are designed to protect value, preserve continuity, and support long-term financial clarity across the life of a catalog.
              </p>
            </div>
            
            {/* Right Column - Three stacked blocks */}
            <div className="space-y-12 lg:pt-12">
              <div>
                <h3 
                  className="text-lg font-medium mb-3"
                  style={{ color: 'rgba(255,255,255,0.88)' }}
                >
                  Rights & Ownership
                </h3>
                <p 
                  className="text-sm leading-[1.7]"
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                >
                  Structured ownership records, verified splits, and authoritative metadata maintained as permanent reference.
                </p>
              </div>
              <div>
                <h3 
                  className="text-lg font-medium mb-3"
                  style={{ color: 'rgba(255,255,255,0.88)' }}
                >
                  Financial Integrity
                </h3>
                <p 
                  className="text-sm leading-[1.7]"
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                >
                  Accurate collections, defensible reporting, and continuity across accounting periods, partners, and platforms.
                </p>
              </div>
              <div>
                <h3 
                  className="text-lg font-medium mb-3"
                  style={{ color: 'rgba(255,255,255,0.88)' }}
                >
                  Data & Documentation
                </h3>
                <p 
                  className="text-sm leading-[1.7]"
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                >
                  Clear lineage of agreements, licenses, and identifiers organized for audit, diligence, and long-term access.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transition: Dark to Light */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* How Copyright Clearance Works - Light operational section */}
      <section id="how-it-works" className="py-24 md:py-32 scroll-mt-24 bg-background">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <h2 className="text-xs font-medium uppercase tracking-[0.12em] mb-6 text-muted-foreground">
            How Copyright Clearance Works
          </h2>
          <p className="text-lg md:text-xl leading-relaxed mb-16 max-w-[640px] text-foreground">
            Each request follows a four-step review before any agreement is finalized.
          </p>
          <div className="grid md:grid-cols-2 gap-16 md:gap-24">
            <div className="space-y-12">
              <div>
                <p className="text-xs font-medium mb-2 text-muted-foreground">
                  01
                </p>
                <h3 className="text-lg font-medium mb-3 text-foreground">
                  Intake
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Rights, usage, scope, and context submitted once.
                </p>
              </div>
              <div>
                <p className="text-xs font-medium mb-2 text-muted-foreground">
                  02
                </p>
                <h3 className="text-lg font-medium mb-3 text-foreground">
                  Verification
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Ownership, splits, metadata, and authority reviewed against records.
                </p>
              </div>
            </div>
            <div className="space-y-12">
              <div>
                <p className="text-xs font-medium mb-2 text-muted-foreground">
                  03
                </p>
                <h3 className="text-lg font-medium mb-3 text-foreground">
                  Authorization
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Terms confirmed, documented, and executed.
                </p>
              </div>
              <div>
                <p className="text-xs font-medium mb-2 text-muted-foreground">
                  04
                </p>
                <h3 className="text-lg font-medium mb-3 text-foreground">
                  Record
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Agreements and identifiers stored for long-term reference.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subtle boundary before footer CTA */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </PublicLayout>
  );
}
