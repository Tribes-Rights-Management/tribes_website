import { Link } from "react-router-dom";
import { PublicLayout } from "@/components/PublicLayout";

export default function HowLicensingWorksPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="max-w-[720px]">
            <h1 className="text-[40px] md:text-[56px] lg:text-[64px] font-semibold leading-[1.05] tracking-[-0.03em] text-foreground mb-6">
              How licensing works at Tribes
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-[560px]">
              A clear, deliberate process designed to produce enforceable agreements 
              and permanent records.
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
        <div className="h-px bg-border" />
      </div>

      {/* Overview */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="max-w-[640px]">
            <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground mb-12">
              Overview
            </h2>
            <div className="space-y-6 text-muted-foreground">
              <p className="leading-relaxed">
                Licensing at Tribes is not automated. Every request is reviewed by our team 
                before any agreement is issued. This ensures that licenses are accurate, 
                appropriate, and enforceable.
              </p>
              <p className="leading-relaxed">
                We prioritize precision over speed, clarity over automation, and 
                long-term stewardship over transaction volume.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
        <div className="h-px bg-border" />
      </div>

      {/* What We Ask For */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="max-w-[640px]">
            <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground mb-12">
              What We Ask For
            </h2>
            <div className="space-y-6 text-muted-foreground">
              <p className="leading-relaxed">
                Each license request begins with a structured form. You identify the song, 
                intended use, territory, term, and the specific license types required.
              </p>
              <p className="leading-relaxed">
                Requests are limited to one composition per submission to ensure accuracy 
                and avoid ambiguity. Multiple license types may be requested for the same 
                song within a single submission.
              </p>
              <p className="leading-relaxed">
                You don't need to be a legal expert to submit a request—only clear about 
                how the music will be used.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
        <div className="h-px bg-border" />
      </div>

      {/* Review Process */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="max-w-[640px]">
            <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground mb-12">
              Review Process
            </h2>
            <div className="space-y-6 text-muted-foreground">
              <p className="leading-relaxed">
                Every request is reviewed by our team to confirm that the requested use 
                is appropriate and that the terms are clearly defined.
              </p>
              <p className="leading-relaxed">
                If additional clarification is required, we will request it before proceeding. 
                Licenses are not approved until all material details are confirmed.
              </p>
              <p className="leading-relaxed">
                This review step exists to protect both the licensee and the rights holder.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
        <div className="h-px bg-border" />
      </div>

      {/* Execution & Records */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="max-w-[640px]">
            <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground mb-12">
              Execution & Records
            </h2>
            <div className="space-y-6 text-muted-foreground">
              <p className="leading-relaxed">
                Once approved, licenses are executed electronically. Signature and 
                payment—if applicable—occur together in a single execution flow.
              </p>
              <p className="leading-relaxed">
                Each license receives its own unique identifier, allowing it to be 
                tracked, referenced, and audited independently.
              </p>
              <p className="leading-relaxed">
                Executed licenses are stored permanently in your account. You may download 
                your licenses at any time. Each document remains available for reference 
                years later, with a complete execution history preserved.
              </p>
              <p className="leading-relaxed">
                This is intentional. Licensing records should outlast projects, platforms, 
                and personnel changes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
        <div className="h-px bg-border" />
      </div>

      {/* FAQ */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="max-w-[640px]">
            <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-10">
              <div>
                <h3 className="text-base font-medium text-foreground mb-3">
                  How long does the review process take?
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Most requests are reviewed within a few business days. Complex requests 
                  or those requiring additional information may take longer.
                </p>
              </div>
              <div>
                <h3 className="text-base font-medium text-foreground mb-3">
                  Can I request multiple license types at once?
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Yes. You can select multiple license types for a single song in one request. 
                  Each will be reviewed and issued as a separate license with its own identifier.
                </p>
              </div>
              <div>
                <h3 className="text-base font-medium text-foreground mb-3">
                  What happens after I submit a request?
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You'll see the status in your portal. If we need clarification, we'll 
                  reach out. Once approved, you'll receive instructions to complete execution.
                </p>
              </div>
              <div>
                <h3 className="text-base font-medium text-foreground mb-3">
                  How are executed licenses stored?
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Executed licenses are stored permanently in your account. You can download 
                  them at any time. We maintain records indefinitely.
                </p>
              </div>
              <div>
                <h3 className="text-base font-medium text-foreground mb-3">
                  Is access to the portal open to everyone?
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  No. Access is granted by approval only. This ensures that licenses are 
                  issued thoughtfully and that our catalog is appropriate for each user's needs.
                </p>
              </div>
              <div>
                <h3 className="text-base font-medium text-foreground mb-3">
                  What if I make a mistake on my request?
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Requests are reviewed before approval. If something is unclear or incorrect, 
                  we'll follow up to clarify before issuing any license.
                </p>
              </div>
              <div>
                <h3 className="text-base font-medium text-foreground mb-3">
                  Can I modify a license after it's executed?
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Executed licenses are permanent legal records. If you need different terms, 
                  a new license would need to be issued to supersede the original.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
        <div className="h-px bg-border" />
      </div>

      {/* Closing + Disclaimer */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="max-w-[640px]">
            <p className="text-muted-foreground leading-relaxed mb-12">
              Licensing should be clear, defensible, and durable. Our process exists to 
              ensure that every agreement meets those standards—without unnecessary complexity.
            </p>
            <div className="pt-8 border-t border-border">
              <p className="text-xs text-muted-foreground/60 leading-relaxed">
                This page is provided for informational purposes only and does not constitute 
                legal advice or a binding offer. All license requests are subject to review, 
                approval, and execution of a formal written agreement. No rights are granted 
                unless and until a license is fully executed by all required parties. In the 
                event of any inconsistency between this description and an executed license 
                agreement, the terms of the executed agreement shall govern.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="max-w-[480px]">
            <h2 className="text-[24px] md:text-[32px] font-medium leading-[1.3] tracking-[-0.02em] text-foreground mb-6">
              Ready to begin?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              If you already have an account, sign in. Otherwise, request access 
              and we'll review your submission.
            </p>
            <div className="flex items-center gap-6">
              <Link 
                to="/auth" 
                className="text-sm font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/auth?request=true" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Request Access
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
