import { Link } from "react-router-dom";
import { PublicLayout } from "@/components/PublicLayout";

export default function ServicesPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="max-w-[560px]">
            <h1 className="text-[32px] md:text-[40px] font-medium leading-tight text-foreground mb-3">
              Services
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
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
      <section className="py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="max-w-[560px]">
            <h2 className="text-xl font-medium text-foreground mb-6">
              Music as an Asset Class
            </h2>
            <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
              <p>
                Publishing administration is not clerical work. It is long-term asset management.
              </p>
              <p>
                At Tribes, we treat music as a durable financial asset—one that requires structured 
                rights administration, disciplined data stewardship, and continuous financial oversight.
              </p>
              <div className="pt-2">
                <p className="text-foreground font-medium mb-4">That means:</p>
                <div className="space-y-3">
                  <p>Rights and ownership are managed with the same rigor as any investable asset</p>
                  <p>Metadata, splits, and agreements are maintained as permanent financial records</p>
                  <p>Income streams are tracked, reconciled, and reported with continuity over time</p>
                  <p>Documentation is preserved to support audits, transactions, and future valuation</p>
                </div>
              </div>
              <p className="pt-2">
                Records remain accessible. Ownership stays documented. Agreements stay enforceable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="h-px bg-border" />
      </div>

      {/* Publishing Administration */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="max-w-[560px]">
            <h2 className="text-xl font-medium text-foreground mb-3">
              Publishing Administration
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Rights registration, ownership tracking, collections, and reporting.
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="h-px bg-border" />
      </div>

      {/* Rights Management */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="max-w-[560px]">
            <h2 className="text-xl font-medium text-foreground mb-3">
              Rights Management
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Structured ownership records, metadata integrity, and ongoing maintenance.
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="h-px bg-border" />
      </div>

      {/* Licensing */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="max-w-[560px]">
            <h2 className="text-xl font-medium text-foreground mb-3">
              Licensing
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-4">
              Review, authorization, execution, and permanent recordkeeping.
            </p>
            <Link 
              to="/how-licensing-works" 
              className="text-[13px] text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
            >
              Learn how licensing works at Tribes
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="h-px bg-border" />
      </div>

      {/* Financial Oversight */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="max-w-[560px]">
            <h2 className="text-xl font-medium text-foreground mb-3">
              Financial Oversight
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Income reconciliation, reporting continuity, and defensible records.
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="h-px bg-border" />
      </div>

      {/* Documentation & Records */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="max-w-[560px]">
            <h2 className="text-xl font-medium text-foreground mb-3">
              Documentation & Records
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Executed agreements, identifiers, and long-term access.
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="h-px bg-border" />
      </div>

      {/* CTA — Single primary action */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="max-w-[560px]">
            {/* Primary: Licensing Access */}
            <h2 className="text-xl font-medium text-foreground mb-3">
              License Music We Administer
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-2">
              For commercial, broadcast, or ministry use of music we administer.
            </p>
            <p className="text-[13px] text-muted-foreground/60 mb-6">
              Account approval required before submitting license requests.
            </p>
            
            {/* Primary CTA — Solid black button */}
            <Link 
              to="/licensing" 
              className="inline-flex items-center justify-center px-6 py-3 bg-foreground text-background font-medium text-[14px] rounded transition-all duration-150 hover:bg-foreground/90"
              style={{ minHeight: 48 }}
            >
              Request an Account
            </Link>
            
            {/* Secondary: Service Inquiry — Text link */}
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-[13px] text-muted-foreground mb-2">
                Looking for publishing administration or rights management?
              </p>
              <Link 
                to="/inquire" 
                className="text-[13px] text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
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
