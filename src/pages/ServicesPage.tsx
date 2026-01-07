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
              Publishing administration built for accuracy, continuity, and long-term clarity.
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
              Music as an Asset
            </h2>
            <div className="text-muted-foreground leading-relaxed space-y-4">
              <p>
                Publishing administration isn't clerical work. It's long-term asset management.
              </p>
              <p>
                At Tribes, we treat music as a durable financial asset—one that requires clear ownership, 
                structured rights administration, and continuity over time.
              </p>
              <div>
                <p className="text-foreground font-medium mb-3">That means:</p>
                <ul className="space-y-2 text-[15px]">
                  <li>Clear ownership records that hold up over time</li>
                  <li>Permanent agreements and splits you can always reference</li>
                  <li>Consistent income tracking and reporting</li>
                  <li>Documentation preserved for audits, transactions, or valuation</li>
                </ul>
              </div>
              <p>
                Your records stay accessible. Your ownership stays documented. Your agreements stay enforceable.
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
              We register your works, track ownership, collect royalties, and report earnings—so you know where your money comes from.
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
              We maintain structured ownership records and metadata so your rights are always documented and defensible.
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
              We review, authorize, and issue licenses—with every agreement recorded for long-term reference.
            </p>
            <Link 
              to="/how-licensing-works" 
              className="text-[14px] text-muted-foreground hover:text-foreground transition-colors duration-150 underline underline-offset-4"
            >
              Learn how licensing works
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
              We reconcile income, produce clear reports, and keep records you can rely on.
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
              Executed agreements, identifiers, and audit trails—accessible when you need them.
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
                For licensing music we administer. Requires account approval.
              </p>
              <Link 
                to="/licensing" 
                className="text-[14px] text-muted-foreground hover:text-foreground transition-colors duration-150 underline underline-offset-4"
              >
                Request access
              </Link>
            </div>
            
            {/* Service Inquiry */}
            <div className="pt-6 border-t border-border">
              <h2 className="text-xl font-medium text-foreground mb-2">
                Inquire About Services
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-3">
                For publishing administration, rights management, or catalog support.
              </p>
              <Link 
                to="/inquire" 
                className="text-[14px] text-muted-foreground hover:text-foreground transition-colors duration-150 underline underline-offset-4"
              >
                Inquire
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
