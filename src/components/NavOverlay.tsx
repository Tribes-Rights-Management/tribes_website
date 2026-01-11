/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║  TRIBES GLOBAL NAVIGATION SYSTEM (GNS) — FINTECH GRADE (LOCKED)           ║
 * ║                                                                            ║
 * ║  Mercury / Apple / Stripe / JPMorgan execution.                            ║
 * ║  Anchored dropdown panel. Not sidebar. Not drawer. Not full-screen.       ║
 * ║  Links only. No section labels. Single thin divider between groups.       ║
 * ║                                                                            ║
 * ║  Motion (LOCKED):                                                          ║
 * ║    Open:  280ms, cubic-bezier(0.16, 1, 0.3, 1), translateY(-8px→0)        ║
 * ║    Close: 200ms, cubic-bezier(0.4, 0, 1, 1), translateY(0→-6px)           ║
 * ║                                                                            ║
 * ║  DO NOT: Add labels, create sidebar, change link order, add scrolling.   ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

import { forwardRef } from "react";
import { Link } from "react-router-dom";
import FocusTrap from "focus-trap-react";

/**
 * Navigation Links — LOCKED (Exact Order, Two Groups)
 * 
 * Group 1 (Primary):
 *   - Client Portal
 *   - Request Licensing Access
 * 
 * — thin divider —
 * 
 * Group 2 (Secondary):
 *   - How Administration Works
 *   - How Licensing Works
 *   - Contact
 * 
 * NO legal links. NO section labels.
 */
const GROUP_1_LINKS = [
  { label: "Client Portal", href: "https://app.tribesrightsmanagement.com", external: true },
  { label: "Request Licensing Access", href: "/licensing-account" },
];

const GROUP_2_LINKS = [
  { label: "How Administration Works", href: "/how-publishing-admin-works" },
  { label: "How Licensing Works", href: "/how-licensing-works" },
  { label: "Contact", href: "/contact" },
];

interface NavOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Motion — LOCKED (Fintech Standard)
 * Open:  280ms, cubic-bezier(0.16, 1, 0.3, 1), translateY(-8px) to 0, opacity 0 to 1
 * Close: 200ms, cubic-bezier(0.4, 0, 1, 1), translateY(0) to -6px, opacity 1 to 0
 */
const MOTION = {
  openDuration: 280,
  closeDuration: 200,
  openEasing: "cubic-bezier(0.16, 1, 0.3, 1)",
  closeEasing: "cubic-bezier(0.4, 0, 1, 1)",
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
            className="gns-link"
            role="menuitem"
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
          className="gns-link"
          role="menuitem"
        >
          {item.label}
        </Link>
      );
    };

    return (
      <>
        {/* Backdrop — blur + dim on page content */}
        <div
          className={`gns-backdrop ${isOpen ? "gns-backdrop--open" : ""}`}
          style={{
            transition: `opacity ${isOpen ? MOTION.openDuration : MOTION.closeDuration}ms ${isOpen ? MOTION.openEasing : MOTION.closeEasing}, backdrop-filter ${isOpen ? MOTION.openDuration : MOTION.closeDuration}ms ${isOpen ? MOTION.openEasing : MOTION.closeEasing}`,
          }}
          onClick={onClose}
          aria-hidden="true"
        />

        {/* GNS Panel — anchored below header */}
        <FocusTrap active={isOpen} focusTrapOptions={{ allowOutsideClick: true, initialFocus: false }}>
          <nav
            ref={ref}
            className={`gns-panel ${isOpen ? "gns-panel--open" : ""}`}
            style={{
              transition: `transform ${isOpen ? MOTION.openDuration : MOTION.closeDuration}ms ${isOpen ? MOTION.openEasing : MOTION.closeEasing}, opacity ${isOpen ? MOTION.openDuration : MOTION.closeDuration}ms ${isOpen ? MOTION.openEasing : MOTION.closeEasing}`,
            }}
            role="menu"
            aria-label="Navigation"
          >
            {/* Group 1: Primary */}
            <div className="gns-group">
              {GROUP_1_LINKS.map(renderLink)}
            </div>
            
            {/* Divider */}
            <div className="gns-divider" />
            
            {/* Group 2: Secondary */}
            <div className="gns-group">
              {GROUP_2_LINKS.map(renderLink)}
            </div>
          </nav>
        </FocusTrap>
      </>
    );
  }
);

NavOverlay.displayName = "NavOverlay";
