import { Link } from "react-router-dom";
import { PublicLayout } from "@/components/PublicLayout";

export default function ServicesPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="max-w-[720px]">
            <h1 className="text-[40px] md:text-[56px] lg:text-[64px] font-semibold leading-[1.05] tracking-[-0.03em] text-foreground mb-6">
              Services
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-[560px]">
              Rights administration with accuracy, continuity, and long-term record integrity.
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
        <div className="h-px bg-border" />
      </div>

      {/* Music as an Asset Class - Thought Leadership */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="max-w-[720px]">
            <h2 className="text-[28px] md:text-[36px] lg:text-[40px] font-semibold leading-[1.15] tracking-[-0.02em] text-foreground mb-10">
              Music as an Asset Class
            </h2>
            <div className="space-y-8 text-muted-foreground">
              <p className="text-lg md:text-xl leading-relaxed">
                Publishing administration is not clerical work.<br />
                It is long-term asset management.
              </p>
              <p className="leading-relaxed">
                At Tribes, we treat music as a durable financial asset—one that requires structured 
                rights administration, disciplined data stewardship, and continuous financial oversight.
              </p>
              <div className="pt-4">
                <p className="text-foreground font-medium mb-6">That means:</p>
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    Rights and ownership are managed with the same rigor as any investable asset
                  </p>
                  <p className="leading-relaxed">
                    Metadata, splits, and agreements are maintained as permanent financial records
                  </p>
                  <p className="leading-relaxed">
                    Income streams are tracked, reconciled, and reported with continuity over time
                  </p>
                  <p className="leading-relaxed">
                    Documentation is preserved to support audits, transactions, and future valuation
                  </p>
                </div>
              </div>
              <p className="leading-relaxed pt-4">
                Records remain accessible. Ownership stays documented. Agreements stay enforceable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
        <div className="h-px bg-border" />
      </div>

      {/* Publishing Administration */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="max-w-[640px]">
            <h2 className="text-[24px] md:text-[28px] font-semibold leading-[1.2] tracking-[-0.02em] text-foreground mb-4">
              Publishing Administration
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Rights registration, ownership tracking, collections, and reporting.
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
        <div className="h-px bg-border" />
      </div>

      {/* Rights Management */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="max-w-[640px]">
            <h2 className="text-[24px] md:text-[28px] font-semibold leading-[1.2] tracking-[-0.02em] text-foreground mb-4">
              Rights Management
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Structured ownership records, metadata integrity, and ongoing maintenance.
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
        <div className="h-px bg-border" />
      </div>

      {/* Licensing */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="max-w-[640px]">
            <h2 className="text-[24px] md:text-[28px] font-semibold leading-[1.2] tracking-[-0.02em] text-foreground mb-4">
              Licensing
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Review, authorization, execution, and permanent recordkeeping.
            </p>
            <Link 
              to="/how-licensing-works" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
            >
              Learn how licensing works at Tribes
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
        <div className="h-px bg-border" />
      </div>

      {/* Financial Oversight */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="max-w-[640px]">
            <h2 className="text-[24px] md:text-[28px] font-semibold leading-[1.2] tracking-[-0.02em] text-foreground mb-4">
              Financial Oversight
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Income reconciliation, reporting continuity, and defensible records.
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
        <div className="h-px bg-border" />
      </div>

      {/* Documentation & Records */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="max-w-[640px]">
            <h2 className="text-[24px] md:text-[28px] font-semibold leading-[1.2] tracking-[-0.02em] text-foreground mb-4">
              Documentation & Records
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Executed agreements, identifiers, and long-term access.
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
        <div className="h-px bg-border" />
      </div>

      {/* CTA — Single primary action */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="max-w-[560px]">
            {/* Primary: Licensing Access */}
            <h2 className="text-[24px] md:text-[28px] font-semibold leading-[1.2] tracking-[-0.02em] text-foreground mb-4">
              License Music We Administer
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              For commercial, broadcast, or ministry use of music we administer.
            </p>
            <p className="text-sm text-muted-foreground/60 mb-8">
              Account approval required before submitting license requests.
            </p>
            
            {/* Primary CTA — Solid black button */}
            <Link 
              to="/licensing" 
              className="inline-flex items-center justify-center px-6 py-3 bg-foreground text-background font-medium text-[15px] rounded transition-all duration-150 hover:bg-foreground/90"
              style={{ minHeight: 48 }}
            >
              Request an Account
            </Link>
            
            {/* Secondary: Service Inquiry — Text link */}
            <div className="mt-10 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">
                Looking for publishing administration or rights management?
              </p>
              <Link 
                to="/inquire" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
              >
                Inquire About Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
