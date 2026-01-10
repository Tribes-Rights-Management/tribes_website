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

      {/* 2) WHO IT'S FOR = WHITE — sectionLightMobile (88px) */}
      <section 
        data-theme="light" 
        className="section-padding-light"
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
          
          {/* Headline — stackStandard to lead-in */}
          <h2 
            className="text-[24px] md:text-[29px] lg:text-[30px] font-medium leading-[1.2] tracking-[-0.01em] text-foreground max-w-[640px] mb-stack-standard"
          >
            Built for long-term rights holders.
          </h2>
          
          {/* Supporting lead-in line — larger gap to content */}
          <p 
            className="text-[15px] md:text-base leading-[1.7] text-foreground/70 max-w-[560px]"
            style={{ marginBottom: '52px' }}
          >
            Clear music rights through proper authorization, documentation, payment handling, and defensible records.
          </p>
          
          {/* Audience cards — stackLoose between each on mobile */}
          <div className="flex flex-col stack-loose md:grid md:grid-cols-3 md:gap-12">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-stack-tight">
                Songwriters & Producers
              </h3>
              <p className="text-[15px] text-foreground/70 leading-[1.7]">
                Get your copyrights registered, royalties collected, and records organized—so ownership and income remain clear over time.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-foreground mb-stack-tight">
                Rights Holders
              </h3>
              <p className="text-[15px] text-foreground/70 leading-[1.7]">
                Clear ownership records, structured licensing, reliable income tracking.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-foreground mb-stack-tight">
                Commercial & Broadcast
              </h3>
              <p className="text-[15px] text-foreground/70 leading-[1.7]">
                Clear music rights for your projects with proper authorization, documentation, and records that hold up.
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
          
          {/* Intro line — policy statement */}
          <p 
            className="text-[15px] md:text-base leading-[1.7] text-foreground/70 max-w-[560px]"
            style={{ marginBottom: '64px' }}
          >
            Every request is reviewed before any agreement is issued.
          </p>
          
          {/* Steps — stackLoose between each step on mobile */}
          <div 
            className="flex flex-col stack-loose md:grid md:grid-cols-2"
            style={{ paddingTop: '24px' }}
          >
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
