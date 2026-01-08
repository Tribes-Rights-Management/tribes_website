import { ContentPageLayout } from "@/components/ContentPageLayout";

/**
 * HOW LICENSING WORKS PAGE — Uses global ContentPageLayout standard
 * NO page-specific typography or spacing overrides.
 */
export default function HowLicensingWorksPage() {
  return (
    <ContentPageLayout
      title="How Licensing Works"
      lede="A step-by-step look at how we handle license requests—from intake to permanent record."
    >
      {/* Overview */}
      <section>
        <h2 className="text-foreground mb-4">Overview</h2>
        <div className="space-y-4 text-[15px] text-muted-foreground leading-relaxed">
          <p className="text-foreground font-medium">
            Licensing is documentation, not just permission.
          </p>
          <p>
            Every request is reviewed. Every agreement is issued with clarity. Every executed license is stored permanently. This page explains how the process works.
          </p>
        </div>
      </section>

      {/* What We Ask For */}
      <section>
        <h2 className="text-foreground mb-4">What We Ask For</h2>
        <div className="space-y-4 text-[15px] text-muted-foreground leading-relaxed">
          <p>
            Every license request starts with a short form. We ask about the song, how you plan to use it, for how long, and where.
          </p>
          <p>
            This isn't red tape—it's how we make sure the right rights get licensed and your agreement reflects actual usage.
          </p>
          <p>
            You don't need to be a legal expert. Just be clear about how the music will be used.
          </p>
        </div>
      </section>

      {/* One Song per Request */}
      <section>
        <h2 className="text-foreground mb-4">One Song per Request</h2>
        <div className="space-y-4 text-[15px] text-muted-foreground leading-relaxed">
          <p>
            Each request covers one song. This keeps things precise and avoids confusion about ownership or scope.
          </p>
          <p>
            If you need multiple license types for the same song (say, sync and mechanical), you can request them together. Each approved use gets its own license.
          </p>
        </div>
      </section>

      {/* Review */}
      <section>
        <h2 className="text-foreground mb-4">Review</h2>
        <div className="space-y-4 text-[15px] text-muted-foreground leading-relaxed">
          <p>
            Every request is reviewed by our team before anything moves forward.
          </p>
          <p>
            If we need more information, we'll reach out. No license is approved until the terms are clear.
          </p>
        </div>
      </section>

      {/* License Structure */}
      <section>
        <h2 className="text-foreground mb-4">License Structure</h2>
        <div className="space-y-4 text-[15px] text-muted-foreground leading-relaxed">
          <p>
            When a request is approved, we issue a license package that includes:
          </p>
          <ul className="space-y-2 pl-6 list-disc">
            <li>A cover page with your details, the song, and what's approved</li>
            <li>A standalone license document for each approved use</li>
          </ul>
          <p>
            Each license gets a unique ID so it can be tracked, referenced, and audited on its own.
          </p>
        </div>
      </section>

      {/* Execution */}
      <section>
        <h2 className="text-foreground mb-4">Execution</h2>
        <div className="space-y-4 text-[15px] text-muted-foreground leading-relaxed">
          <p>
            Approved licenses are signed electronically. Signature and payment (when applicable) happen together.
          </p>
          <p>
            A license becomes legally binding only after execution is complete. Your account shows the current status at all times.
          </p>
        </div>
      </section>

      {/* Records */}
      <section>
        <h2 className="text-foreground mb-4">Records</h2>
        <div className="space-y-4 text-[15px] text-muted-foreground leading-relaxed">
          <p>
            Executed licenses are stored permanently. They're never deleted or overwritten.
          </p>
          <p>
            You can download your agreements anytime—months or years later—with the full execution history intact.
          </p>
        </div>
      </section>

      {/* Account Approval */}
      <section>
        <h2 className="text-foreground mb-4">Account Approval</h2>
        <div className="space-y-4 text-[15px] text-muted-foreground leading-relaxed">
          <p>
            Licensing requests require an approved account. This keeps requests accurate and on record.
          </p>
          <p>
            This isn't a public marketplace—it's a reviewed process designed for accuracy and long-term integrity.
          </p>
        </div>
      </section>

      {/* Closing */}
      <section>
        <p className="text-base text-foreground font-medium leading-relaxed mb-4">
          Every license is reviewed, executed, and recorded.
        </p>
        <p className="text-[15px] text-muted-foreground leading-relaxed mb-10">
          Your agreements are preserved with full execution history.
        </p>
        <div className="pt-6 border-t border-border">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground/60 mb-3">
            Legal Notice
          </p>
          <p className="text-[13px] text-muted-foreground/60 leading-relaxed">
            This page is for informational purposes only and doesn't constitute legal advice or a binding offer. All license requests are subject to review and execution of a formal agreement. No rights are granted until a license is fully executed. If there's any conflict between this description and an executed agreement, the executed agreement governs.
          </p>
        </div>
      </section>
    </ContentPageLayout>
  );
}
