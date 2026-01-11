/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║  TRIBES GLOBAL NAVIGATION — MERCURY-GRADE FULL TAKEOVER (LOCKED)          ║
 * ║                                                                            ║
 * ║  Full-height, full-width navigation takeover.                              ║
 * ║  NOT a sidebar. NOT a dropdown. NOT a card. NOT a modal.                  ║
 * ║  This replaces the page. It does not sit on top of it.                    ║
 * ║                                                                            ║
 * ║  Motion (LOCKED):                                                          ║
 * ║    300ms, cubic-bezier(0.22, 0.61, 0.36, 1)                                ║
 * ║    Fade + subtle vertical translate. No bounce. No spring.                ║
 * ║                                                                            ║
 * ║  DO NOT: Add rounded corners, shadows, cards, section labels, dividers.   ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import FocusTrap from "focus-trap-react";
import { BRAND } from "@/lib/brand";

/**
 * Primary Navigation Links — LOCKED (Exact Order)
 * 
 * 1. How Administration Works
 * 2. How Licensing Works
 * 3. Contact
 * 
 * NO section labels. NO dividers. Just links.
 */
const PRIMARY_LINKS = [
  { label: "How Administration Works", href: "/how-publishing-admin-works" },
  { label: "How Licensing Works", href: "/how-licensing-works" },
  { label: "Contact", href: "/contact" },
];

interface NavOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Motion — LOCKED (Mercury Standard)
 * 300ms, cubic-bezier(0.22, 0.61, 0.36, 1)
 * Fade + subtle vertical translate
 * No bounce. No spring. No acceleration tricks.
 */
const MOTION = {
  duration: 300,
  easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
} as const;

export const NavOverlay = forwardRef<HTMLDivElement, NavOverlayProps>(
  ({ isOpen, onClose }, ref) => {
    return (
      <FocusTrap active={isOpen} focusTrapOptions={{ allowOutsideClick: true, initialFocus: false }}>
        <div
          ref={ref}
          className={`mercury-nav ${isOpen ? "mercury-nav--open" : ""}`}
          style={{
            transition: `opacity ${MOTION.duration}ms ${MOTION.easing}, transform ${MOTION.duration}ms ${MOTION.easing}`,
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          {/* Header Bar — Fixed at top */}
          <header className="mercury-nav-header">
            {/* Left: TRIBES wordmark */}
            <Link 
              to="/" 
              onClick={onClose}
              className="mercury-nav-wordmark"
            >
              {BRAND.wordmark}
            </Link>

            {/* Right: Close icon */}
            <button
              onClick={onClose}
              className="mercury-nav-close"
              aria-label="Close menu"
            >
              <X size={22} strokeWidth={1.5} />
            </button>
          </header>

          {/* Primary Navigation — Top section */}
          <nav className="mercury-nav-links" role="menu">
            {PRIMARY_LINKS.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className="mercury-nav-link"
                role="menuitem"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Account Actions — Bottom pinned */}
          <div className="mercury-nav-actions">
            <a
              href="https://app.tribesrightsmanagement.com"
              onClick={onClose}
              className="mercury-nav-btn mercury-nav-btn--primary"
            >
              Client Portal
            </a>
            <Link
              to="/licensing-account"
              onClick={onClose}
              className="mercury-nav-btn mercury-nav-btn--secondary"
            >
              Request Licensing Access
            </Link>
          </div>
        </div>
      </FocusTrap>
    );
  }
);

NavOverlay.displayName = "NavOverlay";
