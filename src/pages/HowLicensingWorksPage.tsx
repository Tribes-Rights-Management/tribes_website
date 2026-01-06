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
              How Licensing Works at Tribes
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-[560px]">
              A clear, review-based process designed to produce enforceable agreements 
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
              <p className="text-lg font-medium text-foreground leading-relaxed">
                Licensing is not just permission—it is documentation.
              </p>
              <p className="leading-relaxed">
                At Tribes, licensing is handled deliberately. Every request is reviewed, 
                every agreement is issued with clarity, and every executed license is 
                preserved for long-term reference.
              </p>
              <p className="leading-relaxed">
                This page explains how the process works, step by step.
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
              What We Ask For—and Why
            </h2>
            <div className="space-y-6 text-muted-foreground">
              <p className="leading-relaxed">
                Every license request begins with a structured form. We ask for information 
                about the song, the intended use, the term, and the territory.
              </p>
              <p className="leading-relaxed">
                This is not to create friction. It is to ensure accuracy.
              </p>
              <p className="leading-relaxed">
                Clear information at the beginning allows us to:
              </p>
              <ul className="space-y-2 pl-6 list-disc">
                <li className="leading-relaxed">Confirm the correct rights are being licensed</li>
                <li className="leading-relaxed">Issue agreements that reflect actual usage</li>
                <li className="leading-relaxed">Avoid revisions or disputes later</li>
              </ul>
              <p className="leading-relaxed">
                You do not need to be a legal expert to submit a request—only clear about 
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

      {/* One Song per Request */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="max-w-[640px]">
            <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground mb-12">
              One Song per Request
            </h2>
            <div className="space-y-6 text-muted-foreground">
              <p className="leading-relaxed">
                Each request is limited to a single composition.
              </p>
              <p className="leading-relaxed">
                This keeps licensing precise and avoids ambiguity about ownership, scope, 
                or permitted use. If multiple license types are required for the same song, 
                they can be requested together within a single submission.
              </p>
              <p className="leading-relaxed">
                Each approved use is then licensed independently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
        <div className="h-px bg-border" />
      </div>

      {/* Review and Clarification */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="max-w-[640px]">
            <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground mb-12">
              Review and Clarification
            </h2>
            <div className="space-y-6 text-muted-foreground">
              <p className="leading-relaxed">
                Every request submitted through Tribes is reviewed by our team.
              </p>
              <p className="leading-relaxed">
                If any details need clarification, we will reach out before proceeding. 
                No license is approved or issued until the intended use and terms are 
                clearly defined.
              </p>
              <p className="leading-relaxed">
                Review occurs before anything becomes binding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
        <div className="h-px bg-border" />
      </div>

      {/* License Structure */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="max-w-[640px]">
            <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground mb-12">
              License Structure
            </h2>
            <div className="space-y-6 text-muted-foreground">
              <p className="leading-relaxed">
                When a request is approved, licenses are issued in a structured format.
              </p>
              <p className="leading-relaxed">
                If a request includes multiple approved uses for a single song, the result 
                is a license package. Each package includes:
              </p>
              <ul className="space-y-2 pl-6 list-disc">
                <li className="leading-relaxed">A cover page identifying the licensee, song details, and approved uses</li>
                <li className="leading-relaxed">One standalone license document for each approved usage</li>
              </ul>
              <p className="leading-relaxed">
                Each license receives its own unique License ID. This allows every agreement 
                to be tracked, referenced, and audited independently.
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
                Approved licenses are executed electronically.
              </p>
              <p className="leading-relaxed">
                Signature and payment—when applicable—occur together in a single execution 
                flow. A license becomes legally binding only after execution is complete.
              </p>
              <p className="leading-relaxed">
                License status is updated automatically and reflected in your account.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
        <div className="h-px bg-border" />
      </div>

      {/* Records and Access */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="max-w-[640px]">
            <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground mb-12">
              Records and Access
            </h2>
            <div className="space-y-6 text-muted-foreground">
              <p className="leading-relaxed">
                Executed licenses are stored permanently.
              </p>
              <p className="leading-relaxed">
                They are not deleted, overwritten, or replaced. You may download your 
                agreements at any time—months or years later—with the full execution 
                history preserved.
              </p>
              <p className="leading-relaxed">
                Licensing records are designed to outlast projects, platforms, and 
                personnel changes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
        <div className="h-px bg-border" />
      </div>

      {/* Access and Oversight */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="max-w-[640px]">
            <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground mb-12">
              Access and Oversight
            </h2>
            <div className="space-y-6 text-muted-foreground">
              <p className="leading-relaxed">
                Tribes Rights Licensing is a private system.
              </p>
              <p className="leading-relaxed">
                Access is granted by review to ensure licensing requests are handled 
                accurately and appropriately. Licenses are issued deliberately, with 
                oversight, and with long-term integrity in mind.
              </p>
              <p className="leading-relaxed">
                This is not a public marketplace. It is a governed process.
              </p>
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
            <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground mb-12">
              Closing
            </h2>
            <p className="text-lg font-medium text-foreground leading-relaxed mb-6">
              Every license is reviewed, executed, and recorded.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-12">
              Agreements are preserved with their full execution history.
            </p>
            <div className="pt-8 border-t border-border">
              <h3 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground mb-4">
                Legal Notice
              </h3>
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
    </PublicLayout>
  );
}
