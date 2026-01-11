/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║  TRIBES FINTECH NAVIGATION — CENTERED MODAL SYSTEM (LOCKED)               ║
 * ║                                                                            ║
 * ║  Mercury / Apple / Stripe / JPMorgan execution.                            ║
 * ║  Centered dropdown modal. Not sidebar. Not drawer. Not full-screen.       ║
 * ║  Links only. No section labels. No dividers. Quiet and confident.         ║
 * ║                                                                            ║
 * ║  DO NOT: Add labels, create sidebar, change link order, add dividers.     ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

import { forwardRef } from "react";
import { Link } from "react-router-dom";
import FocusTrap from "focus-trap-react";

/**
 * Navigation Links — LOCKED (Exact Order)
 * 
 * 1. How Administration Works
 * 2. How Licensing Works
 * 3. Contact
 * 4. Client Portal
 * 5. Request Licensing Access
 * 
 * Nothing else. No legal links. No labels. No dividers.
 */
const NAV_LINKS = [
  { label: "How Administration Works", href: "/how-publishing-admin-works" },
  { label: "How Licensing Works", href: "/how-licensing-works" },
  { label: "Contact", href: "/contact" },
  { label: "Client Portal", href: "https://app.tribesrightsmanagement.com", external: true },
  { label: "Request Licensing Access", href: "/licensing-account" },
];

interface NavOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Motion — LOCKED (Apple/Mercury Standard)
 * Open: 280ms, cubic-bezier(0.22, 1, 0.36, 1), fade + 8px translate
 * Close: 220ms, reverse motion
 */
const MOTION = {
  openDuration: 280,
  closeDuration: 220,
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
            className="fintech-modal-link"
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
          className="fintech-modal-link"
        >
          {item.label}
        </Link>
      );
    };

    return (
      <>
        {/* Backdrop — subtle blur on page content */}
        <div
          className={`fintech-modal-backdrop ${isOpen ? "fintech-modal-backdrop--open" : ""}`}
          style={{
            transition: `opacity ${MOTION.openDuration}ms ${MOTION.easing}, backdrop-filter ${MOTION.openDuration}ms ${MOTION.easing}`,
          }}
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Centered Modal Panel */}
        <FocusTrap active={isOpen} focusTrapOptions={{ allowOutsideClick: true, initialFocus: false }}>
          <nav
            ref={ref}
            className={`fintech-modal-panel ${isOpen ? "fintech-modal-panel--open" : ""}`}
            style={{
              transition: `transform ${isOpen ? MOTION.openDuration : MOTION.closeDuration}ms ${MOTION.easing}, opacity ${isOpen ? MOTION.openDuration : MOTION.closeDuration}ms ${MOTION.easing}`,
            }}
            role="menu"
            aria-label="Navigation"
          >
            {/* Links — single column, centered alignment */}
            <div className="fintech-modal-links">
              {NAV_LINKS.map(renderLink)}
            </div>
          </nav>
        </FocusTrap>
      </>
    );
  }
);

NavOverlay.displayName = "NavOverlay";
