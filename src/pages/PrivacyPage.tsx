import { PublicLayout } from "@/components/PublicLayout";

export default function PrivacyPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="max-w-[720px]">
            <h1 className="text-[40px] md:text-[56px] font-semibold leading-[1.05] tracking-[-0.03em] text-foreground mb-6">
              Privacy Policy
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
            
            <div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This Privacy Policy explains how Tribes Rights Management LLC (collectively, 
                the "Company," "we," or "us") collects, uses, and discloses information about 
                you. This Privacy Policy applies when you use our websites, portals, 
                services, and records systems that link to this Privacy Policy (collectively, 
                our "Services"), purchase our products, engage with us on social media, or 
                otherwise interact with us.
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                In addition to providing informational content, the Services include an approval-based 
                licensing portal (the "Portal") used to submit, review, execute, store, and manage 
                legally binding music license agreements and related documentation (collectively, 
                "Records"). Certain features of the Services are accessible only to approved users 
                and are intended for professional and commercial use.
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We may change this Privacy Policy from time to time. If we make changes, we will 
                notify you by revising the date at the top of this policy and, in some cases, we 
                may provide you with additional notice (such as adding a statement to our website 
                or sending you a notification). We encourage you to review this Privacy Policy 
                regularly to stay informed about our information practices and the choices 
                available to you.
              </p>
            </div>

            {/* Collection of Information */}
            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">Collection of Information</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The information we collect from you varies depending on the way you use our 
                Services. When you browse our public website to learn more about us ("Website 
                Visitor"), the information we collect differs from the information collected if 
                you are a business owner, agent, songwriter, creator, music user, or publisher 
                (collectively, "Portal User"). Below, we describe the different ways we 
                collect information.
              </p>
            </div>

            {/* Information You Provide */}
            <div>
              <h3 className="text-base font-medium text-foreground mb-3">Information You Provide to Us</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Website Visitors</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    If you are a Website Visitor, you may share information directly with us when 
                    you sign up for our newsletter, fill out a form, application, or questionnaire, 
                    purchase merchandise, or otherwise communicate with us. The types of personal 
                    information we may collect include your name, business and personal email address, 
                    address, phone number, and any other information you choose to provide.
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Business Owners and Portal Users</h4>
                  <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
                    <p>If you are a Business Owner or Portal User, we may collect:</p>
                    <ul className="space-y-1 ml-4">
                      <li>— Name</li>
                      <li>— Business and personal email</li>
                      <li>— Address</li>
                      <li>— Phone number</li>
                      <li>— Business name</li>
                      <li>— Job title</li>
                      <li>— Information relating to your application for a license</li>
                      <li>— Account access credentials or authentication tokens (including passwordless or magic-link authentication data)</li>
                      <li>— Session metadata, login timestamps, and account activity records for security and audit purposes</li>
                      <li>— Age</li>
                      <li>— Family status</li>
                      <li>— Any other information you submit in connection with our Platform</li>
                    </ul>
                    <p>Where required to make payments, we may collect:</p>
                    <ul className="space-y-1 ml-4">
                      <li>— Social Security Number</li>
                      <li>— Tax Identification Number</li>
                      <li>— Business number</li>
                      <li>— FCC ID number</li>
                    </ul>
                    <p>
                      We may also receive information provided by Business Owners relating to their 
                      clients or served individuals. The Company processes such information on behalf 
                      of Business Owners and does not independently determine its collection.
                    </p>
                    <p>
                      If you make a purchase, payment information is collected and processed by 
                      third-party payment processors.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Information We Collect Automatically */}
            <div>
              <h3 className="text-base font-medium text-foreground mb-3">Information We Collect Automatically</h3>
              <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
                <p>When you access or use the Platform, we automatically collect:</p>
                <p>
                  <strong className="text-foreground">Device and Usage Information:</strong> hardware model, 
                  operating system, browser type, IP address, app version, access times, pages viewed, 
                  and referring URLs.
                </p>
                <p>
                  <strong className="text-foreground">Cookies and Tracking Technologies:</strong> used to 
                  improve platform functionality, performance, and analytics.
                </p>
              </div>
            </div>

            {/* Information From Other Sources */}
            <div>
              <h3 className="text-base font-medium text-foreground mb-3">Information We Collect From Other Sources</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We may obtain information from third-party sources, including music usage databases 
                and performance monitoring services, such as metadata, songwriter information, and 
                interested party details for administrative or analytical purposes.
              </p>
            </div>

            {/* Information We Derive */}
            <div>
              <h3 className="text-base font-medium text-foreground mb-3">Information We Derive</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We may derive information from collected data, such as approximate location based 
                on IP address or inferred service needs based on platform usage.
              </p>
            </div>

            {/* Use of Information */}
            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">Use of Information</h2>
              <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
                <p>We use the information we collect to:</p>
                <ul className="space-y-1 ml-4">
                  <li>— Provide, maintain, and improve the Platform</li>
                  <li>— Process and facilitate transactions and licensing requests</li>
                  <li>— Create, execute, store, maintain, and provide ongoing access to legally binding license agreements, including maintaining immutable historical copies for audit, compliance, and enforcement purposes</li>
                  <li>— Send confirmations, invoices, receipts, and administrative communications</li>
                  <li>— Provide customer support and respond to inquiries</li>
                  <li>— Monitor and analyze platform usage</li>
                  <li>— Detect, prevent, and investigate security incidents and fraud</li>
                  <li>— Comply with legal, regulatory, and financial obligations</li>
                  <li>— Carry out any other purpose described at the time of collection</li>
                </ul>
              </div>
            </div>

            {/* Disclosure of Information */}
            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">Disclosure of Information</h2>
              <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
                <p>We disclose personal information:</p>
                <ul className="space-y-1 ml-4">
                  <li>— At your direction</li>
                  <li>— To service providers performing services on our behalf</li>
                  <li>— To facilitate licensing, administration, and royalty-related business operations</li>
                  <li>— To professional advisors, including legal and financial counsel</li>
                  <li>— To comply with legal obligations or protect rights and safety</li>
                  <li>— In connection with mergers, acquisitions, or financing</li>
                  <li>— Among affiliated and commonly controlled entities</li>
                  <li>— With your consent</li>
                </ul>
                <p>
                  We also process aggregated or de-identified information that cannot reasonably 
                  identify you.
                </p>
              </div>
            </div>

            {/* Analytics */}
            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">Analytics</h2>
              <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
                <p>
                  We use analytics services to understand how our Platform is accessed and used, 
                  to evaluate performance, and to improve the quality, security, and usability 
                  of our services.
                </p>
                <p>
                  These analytics services may include Google Analytics, which uses the Global 
                  Site Tag (gtag.js) and similar technologies to collect information such as 
                  pages visited, time spent on pages, referring URLs, device and browser 
                  information, approximate geographic location, and interaction patterns. This 
                  information is collected in an aggregated and anonymized form where possible 
                  and is used to generate reports about Platform usage and activity.
                </p>
                <p>
                  Google may use this information in accordance with its own privacy policies. 
                  You can learn more about how Google collects and processes data by visiting:{" "}
                  <a 
                    href="https://policies.google.com/privacy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-foreground underline underline-offset-2"
                  >
                    https://policies.google.com/privacy
                  </a>
                </p>
                <p>
                  You may opt out of Google Analytics tracking by installing the Google Analytics 
                  Opt-out Browser Add-on, available at:{" "}
                  <a 
                    href="https://tools.google.com/dlpage/gaoptout" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-foreground underline underline-offset-2"
                  >
                    https://tools.google.com/dlpage/gaoptout
                  </a>
                </p>
                <p>
                  Analytics data is used solely for internal operational, performance, and security 
                  purposes and is not used to make automated legal or licensing decisions.
                </p>
              </div>
            </div>

            {/* International Data Transfers */}
            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">International Data Transfers</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We operate in the United States and may transfer data to jurisdictions that may 
                not offer equivalent data protections. Where required, we rely on approved transfer 
                mechanisms, including Standard Contractual Clauses. Requests for such documentation 
                may be sent to admin@tribesassets.com.
              </p>
            </div>

            {/* Data Privacy Framework */}
            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">Data Privacy Framework</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The Company participates in the EU-U.S., UK, and Swiss Data Privacy Frameworks 
                and complies with their principles. For disputes, mediation may be available 
                through JAMS, with oversight by the U.S. Federal Trade Commission where applicable.
              </p>
            </div>

            {/* Data Retention */}
            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">Data Retention</h2>
              <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
                <p>
                  We retain personal information as long as necessary to fulfill the purposes 
                  described in this Policy and to comply with legal, accounting, and regulatory 
                  obligations.
                </p>
                <p>
                  Executed license agreements and related transactional records are retained 
                  indefinitely or for the duration required by law, as they constitute permanent 
                  legal records. Access to such records may continue after account termination, 
                  subject to applicable legal requirements.
                </p>
              </div>
            </div>

            {/* Your Privacy Rights and Choices */}
            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">Your Privacy Rights and Choices</h2>
              <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
                <p>
                  Depending on your jurisdiction, you may have rights to access, correct, or 
                  delete personal information.
                </p>
                <p>
                  Please note: Certain information, including executed license agreements and 
                  related records, may not be eligible for deletion where retention is required 
                  for legal, regulatory, contractual, or legitimate business purposes.
                </p>
                <p>
                  Requests may be submitted to admin@tribesassets.com. We may verify your identity 
                  before processing requests.
                </p>
              </div>
            </div>

            {/* Marketing Communications */}
            <div>
              <h3 className="text-base font-medium text-foreground mb-3">Marketing Communications</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You may opt out of marketing emails via unsubscribe links or by contacting us. 
                Transactional and administrative communications may continue.
              </p>
            </div>

            {/* Cookies */}
            <div>
              <h3 className="text-base font-medium text-foreground mb-3">Cookies</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You may adjust browser settings to manage cookies; some features may be affected.
              </p>
            </div>

            {/* California Privacy Rights */}
            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">California Privacy Rights</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                California residents are afforded rights under the CCPA/CPRA, including access, 
                deletion, and correction rights. We do not sell personal information or knowingly 
                collect information from individuals under 16.
              </p>
            </div>

            {/* Do Not Track */}
            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">Do Not Track</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The Platform does not respond to Do Not Track signals.
              </p>
            </div>

            {/* Contact Us */}
            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">Contact Us</h2>
              <div className="text-sm text-muted-foreground leading-relaxed space-y-1">
                <p>Tribes Rights Management LLC</p>
                <p>ATTN: Legal Department</p>
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
