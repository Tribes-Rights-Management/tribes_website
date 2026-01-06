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
              A focused set of capabilities for managing music rights with clarity and precision.
            </p>
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
            <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground mb-12">
              Publishing Administration
            </h2>
            <p className="text-[24px] md:text-[32px] font-medium leading-[1.3] tracking-[-0.02em] text-foreground mb-8">
              Clear ownership. Accurate records.
            </p>
            <div className="space-y-6 text-muted-foreground">
              <p className="leading-relaxed">
                We handle the administrative work of music publishing: registration with 
                collection societies, metadata management, royalty tracking, and reporting.
              </p>
              <p className="leading-relaxed">
                Every song is documented. Every payment is tracked. Records are maintained 
                for the long term.
              </p>
            </div>
            <div className="mt-12 space-y-4">
              <div className="flex items-start gap-4">
                <span className="text-muted-foreground">—</span>
                <p className="text-sm text-muted-foreground">Song registration and metadata management</p>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-muted-foreground">—</span>
                <p className="text-sm text-muted-foreground">Collection society relations</p>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-muted-foreground">—</span>
                <p className="text-sm text-muted-foreground">Royalty tracking and reporting</p>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-muted-foreground">—</span>
                <p className="text-sm text-muted-foreground">Audit-ready documentation</p>
              </div>
            </div>
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
            <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground mb-12">
              Rights Management
            </h2>
            <p className="text-[24px] md:text-[32px] font-medium leading-[1.3] tracking-[-0.02em] text-foreground mb-8">
              Know what you own. Know who owns what.
            </p>
            <div className="space-y-6 text-muted-foreground">
              <p className="leading-relaxed">
                We organize and maintain the ownership information for your catalog. 
                Splits, territories, term dates, and chain of title—all documented and accessible.
              </p>
              <p className="leading-relaxed">
                When questions arise years later, the records are there.
              </p>
            </div>
            <div className="mt-12 space-y-4">
              <div className="flex items-start gap-4">
                <span className="text-muted-foreground">—</span>
                <p className="text-sm text-muted-foreground">Ownership documentation and split tracking</p>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-muted-foreground">—</span>
                <p className="text-sm text-muted-foreground">Territory and term management</p>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-muted-foreground">—</span>
                <p className="text-sm text-muted-foreground">Chain of title records</p>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-muted-foreground">—</span>
                <p className="text-sm text-muted-foreground">Conflict resolution support</p>
              </div>
            </div>
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
            <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground mb-12">
              Licensing
            </h2>
            <p className="text-[24px] md:text-[32px] font-medium leading-[1.3] tracking-[-0.02em] text-foreground mb-8">
              Structured requests. Defensible agreements.
            </p>
            <div className="space-y-6 text-muted-foreground">
              <p className="leading-relaxed">
                License requests are submitted through a structured process. Each request 
                is reviewed, clarified if needed, and executed with proper documentation.
              </p>
              <p className="leading-relaxed">
                Executed licenses are stored permanently and remain accessible to all parties.
              </p>
            </div>
            <div className="mt-12 space-y-4">
              <div className="flex items-start gap-4">
                <span className="text-muted-foreground">—</span>
                <p className="text-sm text-muted-foreground">Mechanical and synchronization licenses</p>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-muted-foreground">—</span>
                <p className="text-sm text-muted-foreground">Digital distribution permissions</p>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-muted-foreground">—</span>
                <p className="text-sm text-muted-foreground">Electronic signature and payment</p>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-muted-foreground">—</span>
                <p className="text-sm text-muted-foreground">Permanent document storage</p>
              </div>
            </div>
            <div className="mt-12">
              <Link 
                to="/how-licensing-works" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
              >
                Learn how licensing works at Tribes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
        <div className="h-px bg-border" />
      </div>

      {/* CTA */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="max-w-[480px]">
            <h2 className="text-[24px] md:text-[32px] font-medium leading-[1.3] tracking-[-0.02em] text-foreground mb-6">
              Ready to work together?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Request access to learn more about how we can support your catalog.
            </p>
            <div className="flex items-center gap-6">
              <Link 
                to="/auth?request=true" 
                className="text-sm font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
              >
                Request Access
              </Link>
              <Link 
                to="/contact" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
