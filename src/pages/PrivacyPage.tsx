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
              Effective Date: January 1, 2026
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24 md:pb-32">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="max-w-[640px] space-y-12">
            
            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">Introduction</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Tribes Rights Management LLC ("we," "us," or "our") respects your privacy 
                and is committed to protecting the personal information you share with us. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard 
                your information when you use our services.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">Information We Collect</h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>We may collect the following types of information:</p>
                <p>
                  <strong className="text-foreground">Personal Information:</strong> Name, email address, 
                  company name, country, and other information you provide when requesting access 
                  or submitting license requests.
                </p>
                <p>
                  <strong className="text-foreground">Usage Information:</strong> Information about how you 
                  interact with our services, including access times, pages viewed, and actions taken.
                </p>
                <p>
                  <strong className="text-foreground">Transaction Information:</strong> Details about license 
                  requests, executed agreements, and payment information (processed by third-party 
                  payment processors).
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">How We Use Your Information</h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>We use the information we collect to:</p>
                <ul className="space-y-2 ml-4">
                  <li>— Process and manage your license requests</li>
                  <li>— Communicate with you about your account and requests</li>
                  <li>— Maintain records of executed agreements</li>
                  <li>— Improve our services and user experience</li>
                  <li>— Comply with legal obligations</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">Information Sharing</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We do not sell your personal information. We may share information with 
                service providers who assist us in operating our services, with rights holders 
                as necessary to process license requests, and as required by law.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">Data Retention</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We retain license records and executed agreements permanently as part of our 
                commitment to long-term record-keeping. Other personal information is retained 
                as long as necessary to provide our services or as required by law.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">Security</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational measures to protect 
                your personal information against unauthorized access, alteration, disclosure, 
                or destruction.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">Your Rights</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Depending on your location, you may have certain rights regarding your personal 
                information, including the right to access, correct, or delete your data. 
                To exercise these rights, please contact us.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">Changes to This Policy</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of 
                any material changes by posting the new policy on this page with an updated 
                effective date.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">Contact Us</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                If you have questions about this Privacy Policy, please contact us at 
                privacy@tribesrightsmanagement.com.
              </p>
            </div>

          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
