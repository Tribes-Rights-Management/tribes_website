import { PublicLayout } from "@/components/PublicLayout";
import { Hero } from "@/components/Hero";
import { CONTENT_CONTAINER_CLASS } from "@/lib/layout";
import { THEME_DARK_BG, THEME_LIGHT_BG } from "@/lib/theme";

/**
 * MARKETING PAGE — TRIBES PREMIUM RHYTHM (LOCKED)
 * 
 * Section order: Hero (dark) → Who It's For (light) → Music as an Asset (dark) 
 *                → How Copyright Clearance Works (light) → Footer (dark)
 * 
 * Spacing uses global CSS tokens from index.css:
 * - Section padding: var(--section-padding-y) — 96px/120px/160px
 * - Eyebrow rhythm: var(--eyebrow-top), var(--eyebrow-bottom), var(--headline-bottom)
 * - Content gaps: var(--card-gap), var(--step-gap)
 */

export default function MarketingPage() {
  return (
    <PublicLayout darkBackground>
      {/* 1) HERO = BLACK */}
      <Hero />

      {/* 2) WHO IT'S FOR = WHITE */}
      <section 
        data-theme="light" 
        className="section-padding"
        style={{ backgroundColor: THEME_LIGHT_BG }}
      >
        <div className={CONTENT_CONTAINER_CLASS}>
          {/* Eyebrow label with premium spacing */}
          <p 
            className="text-xs font-medium uppercase tracking-[0.12em] text-foreground/60"
            style={{ marginBottom: 'var(--eyebrow-bottom)' }}
          >
            Who It's For
          </p>
          
          {/* Headline with spacing to content — refined for institutional restraint */}
          <h2 
            className="text-[24px] md:text-[29px] lg:text-[30px] font-medium leading-[1.2] tracking-[-0.01em] text-foreground max-w-[640px]"
            style={{ marginBottom: '28px' }}
          >
            Built for long-term rights holders.
          </h2>
          
          {/* Supporting lead-in line */}
          <p 
            className="text-[15px] md:text-base leading-[1.7] text-foreground/70 max-w-[560px]"
            style={{ marginBottom: '52px' }}
          >
            Clear music rights through proper authorization, documentation, payment handling, and defensible records.
          </p>
          
          {/* Audience cards with premium gaps */}
          <div 
            className="grid md:grid-cols-3 gap-8 md:gap-12"
            style={{ gap: 'var(--card-gap)' }}
          >
            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">
                Songwriters & Producers
              </h3>
              <p className="text-[15px] text-foreground/70 leading-[1.7]">
                Get your copyrights registered, royalties collected, and records organized—so ownership and income remain clear over time.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">
                Rights Holders
              </h3>
              <p className="text-[15px] text-foreground/70 leading-[1.7]">
                Clear ownership records, structured licensing, reliable income tracking.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-foreground mb-3">
                Commercial & Broadcast
              </h3>
              <p className="text-[15px] text-foreground/70 leading-[1.7]">
                Clear music rights for your projects with proper authorization, documentation, and records that hold up.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3) MUSIC AS AN ASSET = BLACK */}
      <section 
        data-theme="dark" 
        id="asset-management" 
        className="section-padding"
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
            
            {/* Right Column - Feature list with premium gaps */}
            <div className="lg:pt-12" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--card-gap)' }}>
              <div>
                <h3 
                  className="text-lg font-medium mb-3"
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
                  className="text-lg font-medium mb-3"
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
                  className="text-lg font-medium mb-3"
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

      {/* 4) HOW COPYRIGHT CLEARANCE WORKS = WHITE */}
      <section 
        data-theme="light" 
        id="how-it-works" 
        className="section-padding scroll-mt-24"
        style={{ backgroundColor: THEME_LIGHT_BG }}
      >
        <div className={CONTENT_CONTAINER_CLASS}>
          {/* Eyebrow */}
          <p 
            className="text-xs font-medium uppercase tracking-[0.12em] text-foreground/60"
            style={{ marginBottom: '28px' }}
          >
            How Copyright Clearance Works
          </p>
          
          {/* Intro line — policy statement */}
          <p 
            className="text-[15px] md:text-base leading-[1.7] text-foreground/70 max-w-[560px]"
            style={{ marginBottom: '64px' }}
          >
            Every request is reviewed before any agreement is issued.
          </p>
          
          {/* Steps grid with premium spacing */}
          <div 
            className="grid md:grid-cols-2"
            style={{ gap: '56px', paddingTop: '24px' }}
          >
            {/* Left column steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '56px' }}>
              <div>
                <p className="text-xs font-medium text-foreground/50" style={{ marginBottom: '18px' }}>01</p>
                <h3 className="text-lg font-medium text-foreground" style={{ marginBottom: '18px' }}>Submit</h3>
                <p className="text-[15px] leading-[1.7] text-foreground/70">
                  Provide the song, intended use, and required details. This information forms the basis of the agreement.
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-foreground/50" style={{ marginBottom: '18px' }}>02</p>
                <h3 className="text-lg font-medium text-foreground" style={{ marginBottom: '18px' }}>Review</h3>
                <p className="text-[15px] leading-[1.7] text-foreground/70">
                  Ownership, splits, and usage details are verified to ensure the agreement reflects the correct terms from the outset.
                </p>
              </div>
            </div>
            
            {/* Right column steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '56px' }}>
              <div>
                <p className="text-xs font-medium text-foreground/50" style={{ marginBottom: '18px' }}>03</p>
                <h3 className="text-lg font-medium text-foreground" style={{ marginBottom: '18px' }}>Execute</h3>
                <p className="text-[15px] leading-[1.7] text-foreground/70">
                  Agreements are signed and, where applicable, payment is completed in a single step. Once executed, the license becomes a binding reference.
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-foreground/50" style={{ marginBottom: '18px' }}>04</p>
                <h3 className="text-lg font-medium text-foreground" style={{ marginBottom: '18px' }}>Record</h3>
                <p className="text-[15px] leading-[1.7] text-foreground/70">
                  Executed agreements are retained as permanent records and remain accessible from your account.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5) FOOTER = BLACK (handled by PublicLayout) */}
    </PublicLayout>
  );
}