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

      {/* 2) WHO IT'S FOR = WHITE — LOCKED TYPOGRAPHY & COPY SPEC v1.0
          ═══════════════════════════════════════════════════════════════════════════
          Institutional tone. Role affirmation, not explanation.
          Let users self-identify. No persuasion. No justification.
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
          
          {/* Primary Heading — declarative, not invitational */}
          <h2 className="text-[26px] md:text-[30px] lg:text-[36px] font-medium leading-[1.15] tracking-[-0.01em] text-foreground max-w-[14ch] mb-5">
            For long-term rights holders.
          </h2>
          
          {/* Single clarifying sentence — no stack of paragraphs */}
          <p className="text-[17px] leading-[1.6] text-foreground/70 max-w-[48ch] mb-12">
            Authorization, documentation, payment handling, and defensible records.
          </p>
          
          {/* Role affirmations — declarative, no explanation */}
          <div className="space-y-8 max-w-[42ch]">
            <div>
              <h3 className="text-[18px] font-medium text-foreground mb-2">
                Songwriters & Producers
              </h3>
              <p className="text-[15px] leading-[1.65] text-foreground/70">
                Registration, collection, and permanent records.
              </p>
            </div>
            
            <div>
              <h3 className="text-[18px] font-medium text-foreground mb-2">
                Rights Holders
              </h3>
              <p className="text-[15px] leading-[1.65] text-foreground/70">
                Ownership clarity, structured licensing, income tracking.
              </p>
            </div>
            
            <div>
              <h3 className="text-[18px] font-medium text-foreground mb-2">
                Commercial & Broadcast
              </h3>
              <p className="text-[15px] leading-[1.65] text-foreground/70">
                Proper authorization and defensible records.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3) MUSIC AS AN ASSET = BLACK — LOCKED COPY DENSITY REDUCTION
          ═══════════════════════════════════════════════════════════════════════════
          Declarative statements. Remove "which means", "so that", "this allows".
          Max 2 sentences per paragraph. Prefer 1.
          ═══════════════════════════════════════════════════════════════════════════ */}
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
                className="text-xs font-normal uppercase tracking-[0.12em]"
                style={{ color: '#8F8F8F', marginBottom: 'var(--eyebrow-bottom)' }}
              >
                Music as an Asset
              </p>
              <h2 
                className="text-[26px] md:text-[30px] lg:text-[36px] font-medium leading-[1.15] tracking-[-0.01em]"
                style={{ color: '#FFFFFF', marginBottom: 'var(--headline-bottom)' }}
              >
                Your catalog is a long-term asset.
              </h2>
              <p 
                className="text-[17px] leading-[1.6]"
                style={{ color: '#E5E5E5' }}
              >
                Rights, data, income, and documentation—managed with institutional rigor.
              </p>
            </div>
            
            {/* Right Column - Feature list */}
            <div className="lg:pt-12 flex flex-col stack-loose">
              <div>
                <h3 
                  className="text-[18px] font-medium mb-2"
                  style={{ color: '#FFFFFF' }}
                >
                  Clear Ownership
                </h3>
                <p 
                  className="text-[15px] leading-[1.65]"
                  style={{ color: '#E5E5E5' }}
                >
                  Splits, metadata, and agreements maintained as permanent reference.
                </p>
              </div>
              <div>
                <h3 
                  className="text-[18px] font-medium mb-2"
                  style={{ color: '#FFFFFF' }}
                >
                  Reliable Financials
                </h3>
                <p 
                  className="text-[15px] leading-[1.65]"
                  style={{ color: '#E5E5E5' }}
                >
                  Accurate collections and consistent reporting.
                </p>
              </div>
              <div>
                <h3 
                  className="text-[18px] font-medium mb-2"
                  style={{ color: '#FFFFFF' }}
                >
                  Lasting Documentation
                </h3>
                <p 
                  className="text-[15px] leading-[1.65]"
                  style={{ color: '#E5E5E5' }}
                >
                  Agreements and identifiers organized for audits and transactions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4) HOW COPYRIGHT CLEARANCE WORKS = WHITE — LOCKED COPY DENSITY */}
      <section 
        data-theme="light" 
        id="how-it-works" 
        className="section-padding-light scroll-mt-24"
        style={{ backgroundColor: THEME_LIGHT_BG }}
      >
        <div className={CONTENT_CONTAINER_CLASS}>
          {/* Section Label */}
          <p className="text-[12px] font-normal uppercase tracking-[0.12em] text-muted-foreground mb-6">
            How Copyright Clearance Works
          </p>
          
          {/* Single clarifying sentence */}
          <p className="text-[17px] leading-[1.6] text-foreground/70 max-w-[48ch] mb-12">
            Every request is reviewed before any agreement is issued.
          </p>
          
          {/* Steps — declarative, reduced copy */}
          <div className="list-step-stack md:grid md:grid-cols-2 md:gap-x-12 md:gap-y-8">
            <div>
              <p className="text-xs font-medium text-foreground/50 mb-2">01</p>
              <h3 className="text-[18px] font-medium text-foreground mb-2">Submit</h3>
              <p className="text-[15px] leading-[1.65] text-foreground/70">
                Song, intended use, and required details.
              </p>
            </div>
            
            <div>
              <p className="text-xs font-medium text-foreground/50 mb-2">02</p>
              <h3 className="text-[18px] font-medium text-foreground mb-2">Review</h3>
              <p className="text-[15px] leading-[1.65] text-foreground/70">
                Ownership and terms verified before agreement.
              </p>
            </div>
            
            <div>
              <p className="text-xs font-medium text-foreground/50 mb-2">03</p>
              <h3 className="text-[18px] font-medium text-foreground mb-2">Execute</h3>
              <p className="text-[15px] leading-[1.65] text-foreground/70">
                Signed and paid in a single step.
              </p>
            </div>
            
            <div>
              <p className="text-xs font-medium text-foreground/50 mb-2">04</p>
              <h3 className="text-[18px] font-medium text-foreground mb-2">Record</h3>
              <p className="text-[15px] leading-[1.65] text-foreground/70">
                Permanent records accessible from your account.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5) FOOTER = BLACK (handled by PublicLayout) */}
    </PublicLayout>
  );
}
