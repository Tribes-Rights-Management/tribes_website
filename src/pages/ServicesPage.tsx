import { Link } from "react-router-dom";
import { PublicLayout } from "@/components/PublicLayout";

export default function ServicesPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="pt-28 pb-12 md:pt-36 md:pb-14">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="max-w-[560px]">
            <h1 className="text-foreground mb-3">
              Services
            </h1>
            <p className="text-muted-foreground leading-relaxed">
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
      <section className="py-12 md:py-14">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="max-w-[560px]">
            <h2 className="text-foreground mb-4">
              Music as an Asset Class
            </h2>
            <div className="text-muted-foreground leading-relaxed space-y-4">
              <p>
                Publishing administration is not clerical work. It is long-term asset management.
              </p>
              <p>
                At Tribes, we treat music as a durable financial asset—one that requires structured 
                rights administration, disciplined data stewardship, and continuous financial oversight.
              </p>
              <div>
                <p className="text-foreground font-medium mb-3">That means:</p>
                <ul className="space-y-2 text-[15px]">
                  <li>Rights and ownership are managed with the same rigor as any investable asset</li>
                  <li>Metadata, splits, and agreements are maintained as permanent financial records</li>
                  <li>Income streams are tracked, reconciled, and reported with continuity over time</li>
                  <li>Documentation is preserved to support audits, transactions, and future valuation</li>
                </ul>
              </div>
              <p>
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
      <section className="py-12 md:py-14">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="max-w-[560px]">
            <h2 className="text-foreground mb-2">
              Publishing Administration
            </h2>
            <p className="text-muted-foreground leading-relaxed">
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
      <section className="py-12 md:py-14">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="max-w-[560px]">
            <h2 className="text-foreground mb-2">
              Rights Management
            </h2>
            <p className="text-muted-foreground leading-relaxed">
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
      <section className="py-12 md:py-14">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="max-w-[560px]">
            <h2 className="text-foreground mb-2">
              Licensing
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Review, authorization, execution, and permanent recordkeeping.
            </p>
            <Link 
              to="/how-licensing-works" 
              className="text-[14px] text-muted-foreground hover:text-foreground transition-colors duration-150 underline underline-offset-4"
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
      <section className="py-12 md:py-14">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="max-w-[560px]">
            <h2 className="text-foreground mb-2">
              Financial Oversight
            </h2>
            <p className="text-muted-foreground leading-relaxed">
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
      <section className="py-12 md:py-14">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="max-w-[560px]">
            <h2 className="text-foreground mb-2">
              Documentation & Records
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Executed agreements, identifiers, and long-term access.
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="h-px bg-border" />
      </div>

      {/* Access — Two equal text-based pathways (no buttons) */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="max-w-[560px]">
            {/* Licensing Access */}
            <div className="mb-8">
              <h2 className="text-xl font-medium text-foreground mb-2">
                Request Licensing Access
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-3">
                For commercial, broadcast, or ministry use of music we administer.
              </p>
              <Link 
                to="/licensing" 
                className="text-[14px] text-muted-foreground hover:text-foreground transition-colors duration-150 underline underline-offset-4"
              >
                Request Licensing Access
              </Link>
            </div>
            
            {/* Service Inquiry */}
            <div className="pt-6 border-t border-border">
              <h2 className="text-xl font-medium text-foreground mb-2">
                Inquire About Services
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-3">
                For publishing administration, rights management, or long-term catalog support.
              </p>
              <Link 
                to="/inquire" 
                className="text-[14px] text-muted-foreground hover:text-foreground transition-colors duration-150 underline underline-offset-4"
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
