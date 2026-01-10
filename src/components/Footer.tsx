/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * FOOTER — LOCKED SYSTEM COMPONENT
 * 
 * This component is part of the global navigation system and must not be modified
 * without updating the corresponding tokens in index.css.
 * 
 * IA Structure:
 *   Access
 *     └─ Client Portal
 *     └─ Licensing Access
 *   Company
 *     └─ How Administration Works
 *     └─ How Licensing Works
 *     └─ Services
 *     └─ Contact
 *   Legal
 *     └─ Privacy Policy
 *     └─ Terms of Use
 * 
 * NO page-level overrides. NO conditional variants. Token-driven only.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { Link } from "react-router-dom";
import { BRAND } from "@/lib/brand";
import { getCopyrightLine } from "@/lib/copyright";
import { CONTENT_CONTAINER_CLASS } from "@/lib/layout";
import { THEME_DARK_BG } from "@/lib/theme";
import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
  disableLinks?: boolean;
  hideLinks?: boolean;
  /** Use "compact" for root temp page to preserve original spacing */
  variant?: "standard" | "compact";
}

export function Footer({ 
  className, 
  disableLinks = false, 
  hideLinks = false,
  variant = "standard" 
}: FooterProps) {
  const isStandard = variant === "standard";

  return (
    <footer 
      className={cn("footer-system footer", className)} 
      style={{ 
        backgroundColor: THEME_DARK_BG,
      }}
    >
      <div className={CONTENT_CONTAINER_CLASS}>
        {/* Navigation Links */}
        {!hideLinks && (
          <nav className="footer-nav">
            <div className="footer-nav-grid">
              {/* Access Column */}
              <div className="footer-column">
                <p className="footer-label">Access</p>
                <div className="footer-links">
                  {disableLinks ? (
                    <span className="footer-link-disabled">Client Portal</span>
                  ) : (
                    <a 
                      href="https://app.tribesrightsmanagement.com"
                      className="footer-link"
                    >
                      Client Portal
                    </a>
                  )}
                  {disableLinks ? (
                    <span className="footer-link-disabled">Licensing Access</span>
                  ) : (
                    <Link to="/licensing-account" className="footer-link">
                      Licensing Access
                    </Link>
                  )}
                </div>
              </div>

              {/* Company Column */}
              <div className="footer-column">
                <p className="footer-label">Company</p>
                <div className="footer-links">
                  {disableLinks ? (
                    <span className="footer-link-disabled">How Administration Works</span>
                  ) : (
                    <Link to="/how-publishing-admin-works" className="footer-link">
                      How Administration Works
                    </Link>
                  )}
                  {disableLinks ? (
                    <span className="footer-link-disabled">How Licensing Works</span>
                  ) : (
                    <Link to="/how-licensing-works" className="footer-link">
                      How Licensing Works
                    </Link>
                  )}
                  {disableLinks ? (
                    <span className="footer-link-disabled">Services</span>
                  ) : (
                    <Link to="/services" className="footer-link">
                      Services
                    </Link>
                  )}
                  {disableLinks ? (
                    <span className="footer-link-disabled">Contact</span>
                  ) : (
                    <Link to="/contact" className="footer-link">
                      Contact
                    </Link>
                  )}
                </div>
              </div>

              {/* Legal Column */}
              <div className="footer-column">
                <p className="footer-label">Legal</p>
                <div className="footer-links">
                  {disableLinks ? (
                    <span className="footer-link-disabled">Privacy Policy</span>
                  ) : (
                    <Link to="/privacy" className="footer-link">
                      Privacy Policy
                    </Link>
                  )}
                  {disableLinks ? (
                    <span className="footer-link-disabled">Terms of Use</span>
                  ) : (
                    <Link to="/terms" className="footer-link">
                      Terms of Use
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </nav>
        )}

        {/* Brand + Copyright — Zone B */}
        <div className="footer-signature">
          <span className="footer-wordmark">
            {BRAND.wordmark}
          </span>
          <p className="footer-copyright">
            {getCopyrightLine()}
          </p>
        </div>
      </div>
    </footer>
  );
}
