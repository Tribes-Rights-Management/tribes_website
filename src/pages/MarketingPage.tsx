import { PublicLayout } from "@/components/PublicLayout";
import { Hero } from "@/components/Hero";
import { CONTENT_CONTAINER_CLASS } from "@/lib/layout";
import { THEME_DARK_BG, THEME_LIGHT_BG } from "@/lib/theme";

/**
 * MARKETING PAGE — TRIBES LOCKED PREMIUM SPACING SYSTEM
 * 
 * Section order: Hero (dark) → Who It's For (light) → Music as an Asset (dark) 
 *                → How Copyright Clearance Works (light) → Footer (dark)
 * 
 * LOCKED MOBILE TOKENS (no ad-hoc margins allowed):
 * - sectionDarkMobile: 96px top/bottom
 * - sectionLightMobile: 88px top/bottom  
 * - stackTight: 12px (heading → body)
 * - stackStandard: 20px (heading → paragraph → paragraph)
 * - stackLoose: 36px (between subsections)
 * - footerMobile: 104px top/bottom
 */

export default function MarketingPage() {
  return (
    <PublicLayout darkBackground>
      {/* 1) HERO = BLACK — Full viewport, locked */}
      <Hero />

      {/* 2) WHO IT'S FOR = WHITE — LOCKED TYPOGRAPHY SPEC v1.0
          ═══════════════════════════════════════════════════════════════════════════
          Calm, linear information section. NOT promotional.
          - Section label (12px, +0.12em, regular weight, muted, mb-24px)
          - Primary heading (36/30/26px, medium weight, 1.15 line-height, mb-20px)
          - Subhead/lead paragraph (17px, 1.6 line-height, mb-48px)
          - Supporting points flow naturally without visual dividers
          ═══════════════════════════════════════════════════════════════════════════ */}
      <section 
        data-theme="light" 
        className="section-padding-light"
        style={{ backgroundColor: THEME_LIGHT_BG }}
      >
        <div className={CONTENT_CONTAINER_CLASS}>
          {/* Section Label — 12px, +0.12em tracking, regular weight, muted */}
          <p className="text-[12px] font-normal uppercase tracking-[0.12em] text-muted-foreground mb-6">
            Who It's For
          </p>
          
          {/* Primary Heading — 36/30/26px responsive, medium weight, 1.15 line-height */}
          <h2 className="text-[26px] md:text-[30px] lg:text-[36px] font-medium leading-[1.15] tracking-[-0.01em] text-foreground max-w-[14ch] mb-5">
            Built for long-term rights holders.
          </h2>
          
          {/* Subhead/Lead Paragraph — 17px, 1.6 line-height, max 48-56ch, mb-48px */}
          <p className="text-[17px] leading-[1.6] text-foreground/70 max-w-[56ch] mb-12">
            Songwriters, producers, publishers, and licensees who need proper authorization, documentation, payment handling, and defensible records—managed with the rigor of long-term asset stewardship.
          </p>
          
          {/* Supporting points — flowing text, no cards or grids, 32px between blocks */}
          <div className="space-y-8 max-w-[42ch]">
            <div>
              <h3 className="text-[18px] font-medium text-foreground mb-2">
                Songwriters & Producers
              </h3>
              <p className="text-[15px] leading-[1.65] text-foreground/70">
                Copyrights registered, royalties collected, records organized.
              </p>
            </div>
            
            <div>
              <h3 className="text-[18px] font-medium text-foreground mb-2">
                Rights Holders
              </h3>
              <p className="text-[15px] leading-[1.65] text-foreground/70">
                Clear ownership, structured licensing, reliable income tracking.
              </p>
            </div>
            
            <div>
              <h3 className="text-[18px] font-medium text-foreground mb-2">
                Commercial & Broadcast
              </h3>
              <p className="text-[15px] leading-[1.65] text-foreground/70">
                Proper authorization and records that hold up.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3) MUSIC AS AN ASSET = BLACK — sectionDarkMobile (96px) */}
      <section 
        data-theme="dark" 
        id="asset-management" 
        className="section-padding-dark"
        style={{ backgroundColor: THEME_DARK_BG }}
      >
        <div className={CONTENT_CONTAINER_CLASS}>
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Left Column */}
            <div>
              <p 
                className="text-xs font-medium uppercase tracking-[0.12em]"
                style={{ color: 'rgba(255,255,255,0.60)', marginBottom: 'var(--eyebrow-bottom)' }}
              >
                Music as an Asset
              </p>
              <h2 
                className="text-[28px] md:text-[36px] font-medium leading-[1.2] tracking-[-0.01em]"
                style={{ color: 'rgba(255,255,255,0.92)', marginBottom: 'var(--headline-bottom)' }}
              >
                Your catalog is a long-term asset. We treat it that way.
              </h2>
              <p 
                className="text-base leading-[1.8]"
                style={{ color: 'rgba(255,255,255,0.72)' }}
              >
                Publishing administration isn't paperwork—it's asset management. We handle rights, data, income, and documentation with the same rigor you'd expect from any serious financial steward.
              </p>
            </div>
            
            {/* Right Column - Feature list with stackLoose between items */}
            <div className="lg:pt-12 flex flex-col stack-loose">
              <div>
                <h3 
                  className="text-lg font-medium mb-stack-tight"
                  style={{ color: 'rgba(255,255,255,0.92)' }}
                >
                  Clear Ownership
                </h3>
                <p 
                  className="text-[15px] leading-[1.7]"
                  style={{ color: 'rgba(255,255,255,0.65)' }}
                >
                  Structured ownership records, including splits, metadata, and agreements, maintained as permanent reference.
                </p>
              </div>
              <div>
                <h3 
                  className="text-lg font-medium mb-stack-tight"
                  style={{ color: 'rgba(255,255,255,0.92)' }}
                >
                  Reliable Financials
                </h3>
                <p 
                  className="text-[15px] leading-[1.7]"
                  style={{ color: 'rgba(255,255,255,0.65)' }}
                >
                  Accurate collections, clear reporting, and records that stay consistent over time.
                </p>
              </div>
              <div>
                <h3 
                  className="text-lg font-medium mb-stack-tight"
                  style={{ color: 'rgba(255,255,255,0.92)' }}
                >
                  Lasting Documentation
                </h3>
                <p 
                  className="text-[15px] leading-[1.7]"
                  style={{ color: 'rgba(255,255,255,0.65)' }}
                >
                  Agreements, licenses, and identifiers organized for audits, transactions, or whenever you need them.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4) HOW COPYRIGHT CLEARANCE WORKS = WHITE — sectionLightMobile (88px) */}
      <section 
        data-theme="light" 
        id="how-it-works" 
        className="section-padding-light scroll-mt-24"
        style={{ backgroundColor: THEME_LIGHT_BG }}
      >
        <div className={CONTENT_CONTAINER_CLASS}>
          {/* Eyebrow */}
          <p 
            className="text-xs font-medium uppercase tracking-[0.12em] text-foreground/60 mb-stack-standard"
          >
            How Copyright Clearance Works
          </p>
          
          {/* Intro line — uses locked lede-to-list bridge spacing */}
          <p className="text-[15px] md:text-base leading-[1.7] text-foreground/70 max-w-[560px] lede-to-list">
            Every request is reviewed before any agreement is issued.
          </p>
          
          {/* Steps — list-step-stack for locked item spacing, grid on desktop */}
          <div className="list-step-stack md:grid md:grid-cols-2 md:gap-x-12 md:gap-y-8">
            {/* Step 01 */}
            <div>
              <p className="text-xs font-medium text-foreground/50 mb-stack-tight">01</p>
              <h3 className="text-lg font-medium text-foreground mb-stack-tight">Submit</h3>
              <p className="text-[15px] leading-[1.7] text-foreground/70">
                Provide the song, intended use, and required details. This information forms the basis of the agreement.
              </p>
            </div>
            
            {/* Step 02 */}
            <div>
              <p className="text-xs font-medium text-foreground/50 mb-stack-tight">02</p>
              <h3 className="text-lg font-medium text-foreground mb-stack-tight">Review</h3>
              <p className="text-[15px] leading-[1.7] text-foreground/70">
                Ownership, splits, and usage details are verified to ensure the agreement reflects the correct terms from the outset.
              </p>
            </div>
            
            {/* Step 03 */}
            <div>
              <p className="text-xs font-medium text-foreground/50 mb-stack-tight">03</p>
              <h3 className="text-lg font-medium text-foreground mb-stack-tight">Execute</h3>
              <p className="text-[15px] leading-[1.7] text-foreground/70">
                Agreements are signed and, where applicable, payment is completed in a single step. Once executed, the license becomes a binding reference.
              </p>
            </div>
            
            {/* Step 04 */}
            <div>
              <p className="text-xs font-medium text-foreground/50 mb-stack-tight">04</p>
              <h3 className="text-lg font-medium text-foreground mb-stack-tight">Record</h3>
              <p className="text-[15px] leading-[1.7] text-foreground/70">
                Executed agreements are retained as permanent records and remain accessible from your account.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5) FOOTER = BLACK (handled by PublicLayout) */}
    </PublicLayout>
  );
}
