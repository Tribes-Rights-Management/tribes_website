import { PublicLayout } from "@/components/PublicLayout";

export default function PrivacyPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="pt-28 pb-6 md:pt-36 md:pb-8">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="max-w-[560px]">
            <h1 className="mb-2">Privacy Policy</h1>
            <p className="text-[13px] text-muted-foreground">
              Last Updated: January 6, 2026
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-20 md:pb-24">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="max-w-[560px] space-y-8">
            
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                This Privacy Policy explains how Tribes Rights Management LLC ("Company," "we," or "us") 
                collects, uses, and shares information about you when you use our websites, portals, and 
                services (the "Services").
              </p>
              <p>
                The Services include an approval-based licensing portal used to submit, review, execute, 
                and store legally binding license agreements. Some features are only available to approved users.
              </p>
              <p>
                We may update this policy from time to time. If we make changes, we'll revise the date above. 
                We encourage you to review this page periodically.
              </p>
            </div>

            {/* Collection of Information */}
            <div>
              <h2 className="mb-2">Information We Collect</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                What we collect depends on how you use our Services—whether you're browsing the public site 
                or using the portal as an approved user.
              </p>
            </div>

            {/* Information You Provide */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2">Information You Provide</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-medium text-foreground mb-1.5">Website Visitors</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    When you fill out a form, sign up for updates, or contact us, we may collect your name, 
                    email address, phone number, and any other information you choose to share.
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-medium text-foreground mb-1.5">Portal Users</h4>
                  <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
                    <p>If you're an approved portal user, we may also collect:</p>
                    <ul className="space-y-0.5 ml-4">
                      <li>— Business name and contact details</li>
                      <li>— License application information</li>
                      <li>— Login activity and session data</li>
                      <li>— Payment information (processed by third parties)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Information We Collect Automatically */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2">Information We Collect Automatically</h3>
              <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
                <p>When you use our Services, we automatically collect:</p>
                <p>
                  <strong className="text-foreground">Device and Usage Information:</strong> browser type, 
                  operating system, IP address, pages viewed, and referring URLs.
                </p>
                <p>
                  <strong className="text-foreground">Cookies:</strong> used to improve functionality and analytics.
                </p>
              </div>
            </div>

            {/* Use of Information */}
            <div>
              <h2 className="mb-2">How We Use Information</h2>
              <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
                <p>We use the information we collect to:</p>
                <ul className="space-y-0.5 ml-4">
                  <li>— Operate and improve our Services</li>
                  <li>— Process license requests and transactions</li>
                  <li>— Create and store executed agreements</li>
                  <li>— Send confirmations and administrative messages</li>
                  <li>— Respond to inquiries</li>
                  <li>— Detect and prevent fraud</li>
                  <li>— Comply with legal obligations</li>
                </ul>
              </div>
            </div>

            {/* Disclosure of Information */}
            <div>
              <h2 className="mb-2">When We Share Information</h2>
              <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
                <p>We may share your information:</p>
                <ul className="space-y-0.5 ml-4">
                  <li>— With service providers who help us operate</li>
                  <li>— To facilitate licensing and royalty administration</li>
                  <li>— With professional advisors</li>
                  <li>— To comply with legal requirements</li>
                  <li>— In connection with a business transfer</li>
                  <li>— With your consent</li>
                </ul>
              </div>
            </div>

            {/* Analytics */}
            <div>
              <h2 className="mb-2">Analytics</h2>
              <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
                <p>
                  We use analytics services, including Google Analytics, to understand how people use our 
                  Services. This helps us improve performance and usability.
                </p>
                <p>
                  Learn more about Google's data practices:{" "}
                  <a 
                    href="https://policies.google.com/privacy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-foreground underline underline-offset-2 hover:opacity-80 transition-opacity"
                  >
                    policies.google.com/privacy
                  </a>
                </p>
                <p>
                  Opt out of Google Analytics:{" "}
                  <a 
                    href="https://tools.google.com/dlpage/gaoptout" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-foreground underline underline-offset-2 hover:opacity-80 transition-opacity"
                  >
                    tools.google.com/dlpage/gaoptout
                  </a>
                </p>
              </div>
            </div>

            {/* Data Retention */}
            <div>
              <h2 className="mb-2">Data Retention</h2>
              <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
                <p>
                  We keep personal information as long as needed to provide our Services and comply with 
                  legal obligations.
                </p>
                <p>
                  Executed license agreements and related records are kept permanently as legal documentation.
                </p>
              </div>
            </div>

            {/* Your Rights */}
            <div>
              <h2 className="mb-2">Your Rights</h2>
              <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
                <p>
                  Depending on where you live, you may have rights to access, correct, or delete your 
                  personal information.
                </p>
                <p>
                  Note: Executed agreements and related records may not be eligible for deletion where 
                  retention is legally required.
                </p>
                <p>
                  To make a request, contact us at admin@tribesassets.com.
                </p>
              </div>
            </div>

            {/* California */}
            <div>
              <h2 className="mb-2">California Privacy Rights</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                California residents have additional rights under the CCPA/CPRA. We do not sell personal 
                information.
              </p>
            </div>

            {/* Do Not Track */}
            <div>
              <h2 className="mb-2">Do Not Track</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our Services do not respond to Do Not Track signals.
              </p>
            </div>

            {/* Contact Us */}
            <div>
              <h2 className="mb-2">Contact</h2>
              <div className="text-sm text-muted-foreground leading-relaxed space-y-0.5">
                <p>Tribes Rights Management LLC</p>
                <p>3839 McKinney Ave, Suite 155 #2374</p>
                <p>Dallas, TX 75204</p>
                <p>Email: admin@tribesassets.com</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
