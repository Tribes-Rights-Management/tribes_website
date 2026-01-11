/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║  TRIBES FINTECH NAVIGATION — FINAL SYSTEM (LOCKED)                        ║
 * ║                                                                            ║
 * ║  Mercury / Apple / Stripe / JPMorgan execution.                            ║
 * ║  Top-down dropdown. Not sidebar. Not drawer. Not full-screen.              ║
 * ║  Links only. No section labels. Quiet and confident.                       ║
 * ║                                                                            ║
 * ║  DO NOT: Add labels, create sidebar, change link order.                   ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import FocusTrap from "focus-trap-react";

/**
 * Navigation Links — LOCKED (Exact Order)
 * 
 * 1. How Administration Works
 * 2. How Licensing Works
 * 3. Contact
 * — divider —
 * 4. Client Portal
 * 5. Request Licensing Access
 * 
 * Nothing else. No legal links.
 */
const PRIMARY_LINKS = [
  { label: "How Administration Works", href: "/how-publishing-admin-works" },
  { label: "How Licensing Works", href: "/how-licensing-works" },
  { label: "Contact", href: "/contact" },
];

const SECONDARY_LINKS = [
  { label: "Client Portal", href: "https://app.tribesrightsmanagement.com", external: true },
  { label: "Request Licensing Access", href: "/licensing-account" },
];

interface NavOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Motion — LOCKED
 * Duration: 320ms
 * Easing: cubic-bezier(0.22, 1, 0.36, 1)
 * Direction: Vertical slide only
 * No bounce, no overshoot, no instant snapping
 */
const MOTION = {
  duration: 320,
  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
} as const;

export const NavOverlay = forwardRef<HTMLDivElement, NavOverlayProps>(
  ({ isOpen, onClose }, ref) => {
    const renderLink = (item: { label: string; href: string; external?: boolean }) => {
      if (item.external) {
        return (
          <a
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="fintech-nav-link"
          >
            {item.label}
          </a>
        );
      }
      
      return (
        <Link
          key={item.href}
          to={item.href}
          onClick={onClose}
          className="fintech-nav-link"
        >
          {item.label}
        </Link>
      );
    };

    return (
      <>
        {/* Backdrop — subtle blur on page content */}
        <div
          className={`fintech-nav-backdrop ${isOpen ? "fintech-nav-backdrop--open" : ""}`}
          style={{
            transition: `opacity ${MOTION.duration}ms ${MOTION.easing}`,
          }}
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Dropdown Panel — top-anchored, content-height only */}
        <FocusTrap active={isOpen} focusTrapOptions={{ allowOutsideClick: true, initialFocus: false }}>
          <nav
            ref={ref}
            className={`fintech-nav-panel ${isOpen ? "fintech-nav-panel--open" : ""}`}
            style={{
              transition: `transform ${MOTION.duration}ms ${MOTION.easing}, opacity ${MOTION.duration}ms ${MOTION.easing}`,
            }}
            role="menu"
            aria-label="Navigation"
          >
            {/* Close button — X icon, right-aligned, 44px tap target */}
            <button
              onClick={onClose}
              className="fintech-nav-close"
              aria-label="Close menu"
            >
              <X size={20} strokeWidth={1.5} />
            </button>

            {/* Links — one column, left-aligned */}
            <div className="fintech-nav-links">
              {PRIMARY_LINKS.map(renderLink)}
              
              {/* Divider */}
              <div className="fintech-nav-divider" />
              
              {SECONDARY_LINKS.map(renderLink)}
            </div>
          </nav>
        </FocusTrap>
      </>
    );
  }
);

NavOverlay.displayName = "NavOverlay";
