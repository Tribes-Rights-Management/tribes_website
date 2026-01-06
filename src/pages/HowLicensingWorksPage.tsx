import { Link } from "react-router-dom";

export default function HowLicensingWorksPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <nav className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="text-sm font-medium text-foreground">
              Tribes Rights Licensing
            </Link>
            <div className="flex items-center gap-6">
              <Link 
                to="/auth" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
        </nav>
      </header>

      <main>
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

        {/* The Approach */}
        <section className="py-24 md:py-32">
          <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
            <div className="max-w-[640px]">
              <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground mb-12">
                The Approach
              </h2>
              <div className="space-y-6 text-muted-foreground">
                <p className="leading-relaxed">
                  Licensing is not just permission—it is documentation. At Tribes, every 
                  license is treated as a standalone legal record, structured to remain 
                  clear, defensible, and accessible long after execution.
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

        {/* Request */}
        <section className="py-24 md:py-32">
          <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
            <div className="max-w-[640px]">
              <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground mb-12">
                Request
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
                  No license is generated automatically. Every request is reviewed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="h-px bg-border" />
        </div>

        {/* Review */}
        <section className="py-24 md:py-32">
          <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
            <div className="max-w-[640px]">
              <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground mb-12">
                Review
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

        {/* Structure */}
        <section className="py-24 md:py-32">
          <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
            <div className="max-w-[640px]">
              <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground mb-12">
                Structure
              </h2>
              <div className="space-y-6 text-muted-foreground">
                <p className="leading-relaxed">
                  When a request includes multiple license types for a single song, the 
                  executed agreement is issued as a license package.
                </p>
                <p className="leading-relaxed">
                  Each package includes:
                </p>
                <ul className="space-y-3 ml-6">
                  <li className="leading-relaxed">
                    A cover page identifying the licensee, song details, and approved license types
                  </li>
                  <li className="leading-relaxed">
                    One standalone license document for each approved usage
                  </li>
                </ul>
                <p className="leading-relaxed">
                  Each license within the package receives its own unique License ID, allowing 
                  it to be tracked, referenced, and audited independently.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="h-px bg-border" />
        </div>

        {/* Execution */}
        <section className="py-24 md:py-32">
          <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
            <div className="max-w-[640px]">
              <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground mb-12">
                Execution
              </h2>
              <div className="space-y-6 text-muted-foreground">
                <p className="leading-relaxed">
                  Once approved, licenses are executed electronically. Signature and 
                  payment—if applicable—occur together in a single execution flow.
                </p>
                <p className="leading-relaxed">
                  Each license becomes legally binding upon completion of execution. Status 
                  updates are recorded automatically and reflected in your account.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="h-px bg-border" />
        </div>

        {/* Record */}
        <section className="py-24 md:py-32">
          <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
            <div className="max-w-[640px]">
              <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground mb-12">
                Record
              </h2>
              <div className="space-y-6 text-muted-foreground">
                <p className="leading-relaxed">
                  Executed licenses are stored permanently in your account. Agreements 
                  are never deleted.
                </p>
                <p className="leading-relaxed">
                  You may download your licenses at any time. Each document remains available 
                  for reference years later, with a complete execution history preserved.
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

        {/* Access */}
        <section className="py-24 md:py-32">
          <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
            <div className="max-w-[640px]">
              <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground mb-12">
                Access
              </h2>
              <div className="space-y-6 text-muted-foreground">
                <p className="leading-relaxed">
                  Tribes Rights Licensing is not a public marketplace. Access is granted 
                  by approval only.
                </p>
                <p className="leading-relaxed">
                  This ensures that licenses are issued thoughtfully, catalog usage remains 
                  appropriate, and agreements are created with long-term integrity in mind.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="h-px bg-border" />
        </div>

        {/* Closing Statement */}
        <section className="py-24 md:py-32">
          <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
            <div className="max-w-[640px]">
              <p className="text-muted-foreground leading-relaxed">
                Licensing should be clear, defensible, and durable. Our process exists to 
                ensure that every agreement meets those standards—without unnecessary complexity.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <p className="text-xs text-muted-foreground/60 tracking-[0.02em] mb-4">
            Built for creators. Powered by precision.
          </p>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <p className="text-xs text-muted-foreground">
              © 2026 Tribes Rights Management LLC. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link 
                to="/privacy" 
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Use
              </Link>
            </div>
          </div>
          <div className="pt-6 border-t border-border/50">
            <p className="text-[10px] text-muted-foreground/50 leading-relaxed max-w-[720px]">
              This page is provided for informational purposes only and does not constitute legal advice or a binding offer. All license requests are subject to review, approval, and execution of a formal written agreement. No rights are granted unless and until a license is fully executed by all required parties. In the event of any inconsistency between this description and an executed license agreement, the terms of the executed agreement shall govern.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
