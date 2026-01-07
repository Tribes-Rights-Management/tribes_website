import { PublicLayout } from "@/components/PublicLayout";

export default function MarketingPage() {
  return (
    <PublicLayout>
      {/* ═══════════════════════════════════════════════════════════════════════════
          1. HERO — What this is
          Mobile: Compressed, no decorative elements, no mid-page CTAs
          ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#111214] pt-28 pb-20 md:pt-44 md:pb-40 lg:pt-52 lg:pb-48">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="max-w-[720px]">
            {/* Logo — Hidden on mobile (already in header) */}
            <p className="hidden md:block text-sm font-medium tracking-[0.08em] text-[#C9C9CC] mb-14">
              TRIBES
            </p>
            
            {/* H1 */}
            <h1 className="text-[32px] md:text-[56px] lg:text-[72px] font-medium leading-[1.08] tracking-[-0.015em] text-white mb-6 md:mb-12">
              Rights management, built to last.
            </h1>
            
            {/* Subhead — Compact on mobile */}
            <p className="text-base md:text-xl text-[#C9C9CC] leading-[1.6] md:leading-[1.7] max-w-[560px]">
              Independent publishing administration focused on accuracy, continuity, and long-term record integrity.
            </p>
            
            {/* Decorative elements — Desktop only */}
            <div className="hidden md:block">
              <div className="w-16 h-px bg-white/10 mb-8 mt-16" />
              <p className="text-xs font-light text-[#C9C9CC]/50 tracking-[0.05em]">
                Publishing administration, built for precision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          2. WHO IT'S FOR — Compressed on mobile
          Mobile: Tighter spacing, single column
          ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground mb-8 md:mb-12">
            Who It's For
          </h2>
          <div className="grid md:grid-cols-3 gap-8 md:gap-16">
            <div>
              <h3 className="text-base md:text-lg font-medium text-foreground mb-2 md:mb-3">
                Songwriters & Producers
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Copyright administration, global collections, defensible records.
              </p>
            </div>
            <div>
              <h3 className="text-base md:text-lg font-medium text-foreground mb-2 md:mb-3">
                Rights Holders
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Catalog and licensing management across rights types and income sources.
              </p>
            </div>
            <div>
              <h3 className="text-base md:text-lg font-medium text-foreground mb-2 md:mb-3">
                Commercial & Broadcast
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Clearance and documentation for recorded music and media.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          3. WHAT IT DOES — Asset management framing (compressed on mobile)
          Mobile: Headline + single paragraph only, no sub-blocks
          ═══════════════════════════════════════════════════════════════════════════ */}
      <section id="asset-management" className="py-16 md:py-32" style={{ backgroundColor: '#111214' }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-24">
            {/* Left Column */}
            <div>
              <p 
                className="text-xs font-medium uppercase tracking-[0.12em] mb-6 md:mb-8"
                style={{ color: 'rgba(255,255,255,0.55)' }}
              >
                Music as an Asset
              </p>
              <h2 
                className="text-[24px] md:text-[36px] font-medium leading-[1.2] tracking-[-0.01em] mb-5 md:mb-8"
                style={{ color: 'rgba(255,255,255,0.88)' }}
              >
                Managing music with the discipline of long-term capital.
              </h2>
              <p 
                className="text-[15px] md:text-base leading-[1.7] md:leading-[1.8]"
                style={{ color: 'rgba(255,255,255,0.64)' }}
              >
                Publishing administration treated with institutional rigor—rights, data, income, and documentation designed to protect value and preserve continuity.
              </p>
            </div>
            
            {/* Right Column - Desktop only sub-blocks */}
            <div className="hidden lg:block space-y-12 lg:pt-12">
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

      {/* ═══════════════════════════════════════════════════════════════════════════
          4. HOW COPYRIGHT CLEARANCE WORKS — Procedural, factual
          Mobile: Compact spacing, no decorative dividers
          ═══════════════════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-16 md:py-32 scroll-mt-24 bg-background">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <h2 className="text-xs font-medium uppercase tracking-[0.12em] mb-5 md:mb-6 text-muted-foreground">
            How Copyright Clearance Works
          </h2>
          <p className="text-base md:text-xl leading-relaxed mb-10 md:mb-16 max-w-[640px] text-foreground">
            Each request follows a four-step review before any agreement is finalized.
          </p>
          <div className="grid md:grid-cols-2 gap-8 md:gap-24">
            <div className="space-y-8 md:space-y-12">
              <div>
                <p className="text-xs font-medium mb-2 text-muted-foreground">
                  01
                </p>
                <h3 className="text-base md:text-lg font-medium mb-2 md:mb-3 text-foreground">
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
                <h3 className="text-base md:text-lg font-medium mb-2 md:mb-3 text-foreground">
                  Verification
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Ownership, splits, metadata, and authority reviewed against records.
                </p>
              </div>
            </div>
            <div className="space-y-8 md:space-y-12">
              <div>
                <p className="text-xs font-medium mb-2 text-muted-foreground">
                  03
                </p>
                <h3 className="text-base md:text-lg font-medium mb-2 md:mb-3 text-foreground">
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
                <h3 className="text-base md:text-lg font-medium mb-2 md:mb-3 text-foreground">
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

      {/* 5. Final CTA is in PublicLayout footer — no duplicate here */}
    </PublicLayout>
  );
}
