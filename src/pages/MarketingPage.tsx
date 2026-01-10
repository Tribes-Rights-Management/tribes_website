import { PublicLayout } from "@/components/PublicLayout";
import { Hero } from "@/components/Hero";
import { CONTENT_CONTAINER_CLASS } from "@/lib/layout";
import { THEME_DARK_BG, THEME_LIGHT_BG } from "@/lib/theme";

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MARKETING PAGE — LOCKED DESIGN TOKEN SYSTEM (DO NOT TOUCH)
 * 
 * Section order: Hero (dark) → Who It's For (light) → Music as an Asset (dark) 
 *                → How Copyright Clearance Works (light) → Footer (dark)
 * 
 * LOCKED SPACING TOKENS (no ad-hoc margins allowed):
 * - sectionDarkMobileY: 64px (var(--space-10))
 * - sectionLightMobileY: 72px (4.5rem)
 * - stackLargeMobile: 32px (var(--space-7))
 * - stackMediumMobile: 20px (var(--space-5))
 * - stackSmallMobile: 12px (var(--space-3))
 * - stackTightMobile: 8px (var(--space-2))
 * 
 * LOCKED TYPOGRAPHY:
 * - labelCaps: 12px, 500, 0.12em tracking
 * - h2: 28px mobile / 36px desktop
 * - h3: 18px mobile / 20px desktop
 * - body: 16px mobile / 18px desktop
 * ═══════════════════════════════════════════════════════════════════════════════
 */

export default function MarketingPage() {
  return (
    <PublicLayout darkBackground>
      {/* 1) HERO = BLACK */}
      <Hero />

      {/* 2) WHO IT'S FOR = LIGHT */}
      <section 
        data-theme="light" 
        className="section--light"
        style={{ backgroundColor: THEME_LIGHT_BG }}
      >
        <div className={CONTENT_CONTAINER_CLASS}>
          {/* Eyebrow label */}
          <p className="labelCaps text-foreground/60 mb-stack-standard">
            Who It's For
          </p>
          
          {/* Headline */}
          <h2 className="text-foreground max-w-[640px] mb-stack-standard">
            Built for long-term rights holders.
          </h2>
          
          {/* Supporting lead-in */}
          <p className="body text-foreground/70 max-w-[560px] lede-to-list">
            Clear music rights through proper authorization, documentation, payment handling, and defensible records.
          </p>
          
          {/* Audience cards */}
          <div className="list-step-stack md:grid md:grid-cols-3 md:gap-12">
            <div className="stack--sm">
              <h3 className="text-foreground">Songwriters & Producers</h3>
              <p className="body text-foreground/70">
                Get your copyrights registered, royalties collected, and records organized—so ownership and income remain clear over time.
              </p>
            </div>
            <div className="stack--sm">
              <h3 className="text-foreground">Rights Holders</h3>
              <p className="body text-foreground/70">
                Clear ownership records, structured licensing, reliable income tracking.
              </p>
            </div>
            <div className="stack--sm">
              <h3 className="text-foreground">Commercial & Broadcast</h3>
              <p className="body text-foreground/70">
                Clear music rights for your projects with proper authorization, documentation, and records that hold up.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3) MUSIC AS AN ASSET = DARK */}
      <section 
        data-theme="dark" 
        id="asset-management" 
        className="section--dark"
        style={{ backgroundColor: THEME_DARK_BG }}
      >
        <div className={CONTENT_CONTAINER_CLASS}>
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Left Column */}
            <div className="stack">
              <p className="labelCaps" style={{ color: 'rgba(255,255,255,0.60)' }}>
                Music as an Asset
              </p>
              <h2 style={{ color: 'rgba(255,255,255,0.92)' }}>
                Your catalog is a long-term asset. We treat it that way.
              </h2>
              <p className="body" style={{ color: 'rgba(255,255,255,0.72)' }}>
                Publishing administration isn't paperwork—it's asset management. We handle rights, data, income, and documentation with the same rigor you'd expect from any serious financial steward.
              </p>
            </div>
            
            {/* Right Column - Feature list */}
            <div className="lg:pt-12 stack--lg">
              <div className="stack--sm">
                <h3 style={{ color: 'rgba(255,255,255,0.92)' }}>Clear Ownership</h3>
                <p className="body" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  Structured ownership records, including splits, metadata, and agreements, maintained as permanent reference.
                </p>
              </div>
              <div className="stack--sm">
                <h3 style={{ color: 'rgba(255,255,255,0.92)' }}>Reliable Financials</h3>
                <p className="body" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  Accurate collections, clear reporting, and records that stay consistent over time.
                </p>
              </div>
              <div className="stack--sm">
                <h3 style={{ color: 'rgba(255,255,255,0.92)' }}>Lasting Documentation</h3>
                <p className="body" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  Agreements, licenses, and identifiers organized for audits, transactions, or whenever you need them.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4) HOW COPYRIGHT CLEARANCE WORKS = LIGHT */}
      <section 
        data-theme="light" 
        id="how-it-works" 
        className="section--light scroll-mt-24"
        style={{ backgroundColor: THEME_LIGHT_BG }}
      >
        <div className={CONTENT_CONTAINER_CLASS}>
          {/* Eyebrow */}
          <p className="labelCaps text-foreground/60 mb-stack-standard">
            How Copyright Clearance Works
          </p>
          
          {/* Intro line */}
          <p className="body text-foreground/70 max-w-[560px] lede-to-list">
            Every request is reviewed before any agreement is issued.
          </p>
          
          {/* Steps */}
          <div className="list-step-stack md:grid md:grid-cols-2 md:gap-x-12 md:gap-y-8">
            <div className="stack--sm">
              <p className="small text-foreground/50">01</p>
              <h3 className="text-foreground">Submit</h3>
              <p className="body text-foreground/70">
                Provide the song, intended use, and required details. This information forms the basis of the agreement.
              </p>
            </div>
            
            <div className="stack--sm">
              <p className="small text-foreground/50">01</p>
              <h3 className="text-foreground">Review</h3>
              <p className="body text-foreground/70">
                Ownership, splits, and usage details are verified to ensure the agreement reflects the correct terms from the outset.
              </p>
            </div>
            
            <div className="stack--sm">
              <p className="small text-foreground/50">03</p>
              <h3 className="text-foreground">Execute</h3>
              <p className="body text-foreground/70">
                Agreements are signed and, where applicable, payment is completed in a single step. Once executed, the license becomes a binding reference.
              </p>
            </div>
            
            <div className="stack--sm">
              <p className="small text-foreground/50">04</p>
              <h3 className="text-foreground">Record</h3>
              <p className="body text-foreground/70">
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
