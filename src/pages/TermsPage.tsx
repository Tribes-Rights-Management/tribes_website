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
              <h2 className="text-lg font-medium text-foreground mb-4">Acceptance of Terms</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                By accessing or using the services provided by Tribes Rights Management LLC 
                ("we," "us," or "our"), you agree to be bound by these Terms of Use. If you 
                do not agree to these terms, you may not use our services.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">Access and Accounts</h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>
                  Access to our licensing portal is granted by approval only. We reserve the 
                  right to deny or revoke access at our discretion.
                </p>
                <p>
                  You are responsible for maintaining the confidentiality of your account 
                  credentials and for all activities that occur under your account.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">Use of Services</h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>You agree to use our services only for lawful purposes and in accordance with these terms. You agree not to:</p>
                <ul className="space-y-2 ml-4">
                  <li>— Provide false or misleading information</li>
                  <li>— Attempt to gain unauthorized access to our systems</li>
                  <li>— Use our services in any way that could harm or disrupt our operations</li>
                  <li>— Violate any applicable laws or regulations</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">License Agreements</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                These Terms of Use govern your use of our website and portal services. 
                Any licenses you obtain through our services are governed by the specific 
                terms of the executed license agreement, not these Terms of Use. In the 
                event of any conflict between these terms and an executed license agreement, 
                the license agreement shall govern.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">Intellectual Property</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                All content on our website and portal, excluding licensed musical works, 
                is the property of Tribes Rights Management LLC and is protected by 
                applicable intellectual property laws. You may not reproduce, distribute, 
                or create derivative works from our content without our express written permission.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">Disclaimers</h2>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>
                  Our services are provided "as is" without warranties of any kind, either 
                  express or implied. We do not warrant that our services will be uninterrupted 
                  or error-free.
                </p>
                <p>
                  Information provided on our website is for general informational purposes 
                  only and does not constitute legal advice.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">Limitation of Liability</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                To the fullest extent permitted by law, Tribes Rights Management LLC shall 
                not be liable for any indirect, incidental, special, consequential, or 
                punitive damages arising out of or relating to your use of our services.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">Modifications</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We reserve the right to modify these Terms of Use at any time. We will 
                notify users of material changes by posting the updated terms with a new 
                effective date. Your continued use of our services after such changes 
                constitutes acceptance of the modified terms.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">Governing Law</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                These Terms of Use shall be governed by and construed in accordance with 
                the laws of the State of Tennessee, without regard to its conflict of law principles.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-foreground mb-4">Contact</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                If you have questions about these Terms of Use, please contact us at 
                legal@tribesrightsmanagement.com.
              </p>
            </div>

          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
