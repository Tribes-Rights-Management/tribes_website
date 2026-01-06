import { PublicLayout } from "@/components/PublicLayout";

export default function TermsPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="max-w-[720px]">
            <h1 className="text-[40px] md:text-[56px] font-semibold leading-[1.05] tracking-[-0.03em] text-foreground mb-6">
              Terms of Use
            </h1>
            <p className="text-sm text-muted-foreground">
              Last Updated: January 6, 2026
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24 md:pb-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="max-w-[640px] space-y-12">
            
            {/* Introduction */}
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                These Terms of Use ("Terms") are a legal agreement between you and Tribes Rights 
                Management LLC ("Company," "we," "us") governing your access to and use of the 
                Company's websites, portals, databases, and related services, including any 
                successor services (collectively, the "Services").
              </p>
              <p>
                The Company provides publishing administration, rights management, and licensing 
                services as part of a structured system for the long-term stewardship, documentation, 
                and financial administration of musical works as durable intellectual property assets.
              </p>
              <p>
                The Services include public informational areas and approval-based non-public 
                portions (the "Portal") used to submit, review, execute, store, and manage legally 
                binding music license agreements and related records.
              </p>
              <p>
                By accessing or using the Services, or by indicating your assent electronically 
                (including by clicking "Agree," "Accept," or similar), you agree to be bound by 
                these Terms. If you do not agree, you must not access or use the Services.
              </p>
            </div>

            {/* 1. Definitions */}
            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">1. Definitions</h2>
              <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                <li>"Company" means Tribes Rights Management LLC.</li>
                <li>"User" or "you" means any individual or entity accessing or using the Services, including any entity on whose behalf you act.</li>
                <li>"General User" means a User accessing only public portions of the Services.</li>
                <li>"Registered User" means a User authorized by Company to access non-public portions of the Services (the Portal).</li>
                <li>"Materials" means all content, data, databases, documents, designs, and functionality made available through the Services.</li>
                <li>"Records" means executed license agreements, transactional documentation, and related audit materials.</li>
              </ul>
            </div>

            {/* 2. Eligibility and Authority */}
            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">2. Eligibility and Authority</h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>The Services are intended for business and professional use only. You represent and warrant that:</p>
                <ul className="space-y-2 ml-4">
                  <li>— You are at least 18 years of age.</li>
                  <li>— If acting on behalf of an entity, you have authority to bind that entity.</li>
                  <li>— All information you provide is accurate and complete.</li>
                </ul>
              </div>
            </div>

            {/* 3. License to Use the Services */}
            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">3. License to Use the Services</h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>
                  Subject to compliance with these Terms, Company grants you a limited, non-exclusive, 
                  non-transferable, revocable license to access and use the Services solely for their 
                  intended purposes.
                </p>
                <p>You acquire no ownership or intellectual property rights in the Services or Materials.</p>
                <p>Company may suspend, restrict, or terminate access at any time, with or without notice.</p>
              </div>
            </div>

            {/* 4. Access to Non-Public Portions */}
            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">4. Access to Non-Public Portions</h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>
                  You may not access non-public portions of the Services (the Portal) unless you are a Registered 
                  User expressly authorized by Company.
                </p>
                <p>
                  Unauthorized access to non-public portions constitutes a material breach of these 
                  Terms and may result in immediate termination and legal action.
                </p>
              </div>
            </div>

            {/* 5. Authentication and Account Security */}
            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">5. Authentication and Account Security</h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>
                  Access to non-public portions may be provided through passwordless authentication, 
                  including secure login links, tokens, or similar mechanisms.
                </p>
                <p>You agree to:</p>
                <ul className="space-y-2 ml-4">
                  <li>— Use access credentials solely for authorized purposes</li>
                  <li>— Not share or transfer access</li>
                  <li>— Promptly notify Company of unauthorized access</li>
                  <li>— Log out at the end of each session</li>
                </ul>
                <p>
                  Company is not responsible for losses resulting from unauthorized access caused 
                  by your failure to secure your account.
                </p>
              </div>
            </div>

            {/* 6. Licensing Workflow and Executed Agreements */}
            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">6. Licensing Workflow and Executed Agreements</h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>The Portal enables Users to submit license requests for review and approval.</p>
                <p>You acknowledge and agree that:</p>
                <ul className="space-y-2 ml-4">
                  <li>— License requests are not automatically approved</li>
                  <li>— No rights are granted unless and until a license is fully executed</li>
                  <li>— Licenses may be executed electronically and are legally binding</li>
                  <li>— Payment, where required, may be completed as part of execution</li>
                </ul>
                <p>
                  Executed licenses and related Records constitute permanent legal documentation and may 
                  be retained indefinitely, even after account termination, as required by law or 
                  legitimate business purposes.
                </p>
              </div>
            </div>

            {/* 7. Electronic Communications and Records */}
            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">7. Electronic Communications and Records</h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>
                  By using the Services, you consent to receive communications electronically and 
                  agree that electronic records, signatures, and documents have the same legal 
                  effect as physical counterparts, in accordance with applicable law.
                </p>
                <p>Records maintained through the Services may be relied upon as authoritative business records.</p>
              </div>
            </div>

            {/* 8. User Submissions */}
            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">8. User Submissions</h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>You are solely responsible for information and materials you submit.</p>
                <p>You represent that submitted materials:</p>
                <ul className="space-y-2 ml-4">
                  <li>— Are accurate and lawful</li>
                  <li>— Do not infringe third-party rights</li>
                  <li>— Do not contain harmful or misleading content</li>
                </ul>
                <p>
                  Company may review, store, disclose, or remove submissions as necessary to 
                  operate the Platform or comply with legal obligations.
                </p>
              </div>
            </div>

            {/* 9. Privacy */}
            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">9. Privacy</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your use of the Platform is subject to the Privacy Policy, which is incorporated 
                by reference and governs data collection, use, and retention.
              </p>
            </div>

            {/* 10. Intellectual Property */}
            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">10. Intellectual Property</h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>
                  The Services and all Materials are owned by Company or its licensors and are 
                  protected by intellectual property laws.
                </p>
                <p>
                  You may not copy, reverse engineer, scrape, reproduce, or distribute the Services 
                  or Materials without express written permission.
                </p>
              </div>
            </div>

            {/* 11. Disclaimers */}
            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">11. Disclaimers</h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p className="uppercase">
                  The Services are provided "as is" and "as available."
                </p>
                <p className="uppercase">
                  Company disclaims all warranties, express or implied, including merchantability, 
                  fitness for a particular purpose, and non-infringement.
                </p>
                <p>Company does not guarantee uninterrupted or error-free operation.</p>
              </div>
            </div>

            {/* 12. Limitation of Liability */}
            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">12. Limitation of Liability</h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p className="uppercase">
                  To the maximum extent permitted by law, Company shall not be liable for indirect, 
                  incidental, consequential, special, or punitive damages.
                </p>
                <p className="uppercase">
                  Company's total aggregate liability shall not exceed ten U.S. dollars ($10.00).
                </p>
                <p>Your sole remedy is to discontinue use of the Services.</p>
              </div>
            </div>

            {/* 13. Indemnification */}
            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">13. Indemnification</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You agree to indemnify and hold harmless Company and its affiliates from claims 
                arising from your breach of these Terms, misuse of the Services, or violation 
                of law or third-party rights.
              </p>
            </div>

            {/* 14. Termination */}
            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">14. Termination</h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>Company may suspend or terminate access at any time. Termination does not affect:</p>
                <ul className="space-y-2 ml-4">
                  <li>— Executed licenses</li>
                  <li>— Payment obligations</li>
                  <li>— Record retention requirements</li>
                  <li>— Provisions that by nature survive termination</li>
                </ul>
              </div>
            </div>

            {/* 15. Governing Law and Dispute Resolution */}
            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">15. Governing Law and Dispute Resolution</h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>
                  These Terms are governed by the laws of the State of Texas, without regard to 
                  conflict-of-laws principles.
                </p>
                <p>
                  Any dispute shall be resolved exclusively in state or federal courts located 
                  in Dallas County, Texas, and you consent to such jurisdiction.
                </p>
              </div>
            </div>

            {/* 16. Miscellaneous */}
            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">16. Miscellaneous</h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>These Terms constitute the entire agreement regarding use of the Services.</p>
                <p>Company may assign these Terms without restriction.</p>
                <p>Headings are for convenience only.</p>
                <p>If any provision is unenforceable, the remainder remains in effect.</p>
              </div>
            </div>

            {/* 17. Contact Information */}
            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">17. Contact Information</h2>
              <div className="text-sm text-muted-foreground leading-relaxed space-y-1">
                <p>Tribes Rights Management LLC</p>
                <p>ATTN: Legal Department</p>
                <p>3839 McKinney Ave, Suite 155 #2374</p>
                <p>Dallas, TX 75204</p>
                <p>
                  Email:{" "}
                  <a 
                    href="mailto:admin@tribesassets.com" 
                    className="text-foreground underline underline-offset-2"
                  >
                    admin@tribesassets.com
                  </a>
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
