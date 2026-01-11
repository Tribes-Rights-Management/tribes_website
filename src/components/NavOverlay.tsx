/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║  UNIFIED NAV OVERLAY — APPLE-STYLE TOP DROPDOWN (ALL DEVICES)             ║
 * ║                                                                            ║
 * ║  ONE component for ALL breakpoints. Same items, same groups, same order.   ║
 * ║  Always opens as a TOP DROPDOWN — never slides from side.                  ║
 * ║                                                                            ║
 * ║  Mobile: Full-width, edge-to-edge                                          ║
 * ║  Tablet/Desktop: Centered, max-width 720px                                 ║
 * ║                                                                            ║
 * ║  Close control lives in header (hamburger toggles to X), not in panel.    ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

import { forwardRef } from "react";
import { Link } from "react-router-dom";
import FocusTrap from "focus-trap-react";

/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║  NAVIGATION STRUCTURE — LOCKED                                             ║
 * ║                                                                            ║
 * ║  SERVICES: How Administration Works, How Licensing Works, Contact          ║
 * ║  ACCESS: Client Portal, Request Licensing Access                           ║
 * ║  LEGAL: Privacy Policy, Terms of Use                                       ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */
const NAV_SECTIONS = [
  {
    label: "Services",
    items: [
      { label: "How Administration Works", href: "/how-publishing-admin-works" },
      { label: "How Licensing Works", href: "/how-licensing-works" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    label: "Access",
    items: [
      { label: "Client Portal", href: "https://app.tribesrightsmanagement.com", external: true },
      { label: "Request Licensing Access", href: "/licensing-account" },
    ],
  },
  {
    label: "Legal",
    items: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use", href: "/terms" },
    ],
  },
];

interface NavOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║  MOTION TIMING — LOCKED (Apple-style)                                      ║
 * ║                                                                            ║
 * ║  Panel: 320ms, cubic-bezier(0.16, 1, 0.3, 1) — weighted ease-out           ║
 * ║  Backdrop: 220ms                                                           ║
 * ║  Transform: translateY 10-14px only (no side motion)                       ║
 * ║  No bounce, no overshoot, no snap                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */
const MOTION = {
  panelDuration: 320,
  backdropDuration: 220,
  easing: "cubic-bezier(0.16, 1, 0.3, 1)",
} as const;

export const NavOverlay = forwardRef<HTMLDivElement, NavOverlayProps>(
  ({ isOpen, onClose }, ref) => {
    // Render nav item
    const renderNavItem = (item: { label: string; href: string; external?: boolean }) => {
      const className = "nav-overlay-link";
      
      if (item.external) {
        return (
          <a
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={className}
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
          className={className}
        >
          {item.label}
        </Link>
      );
    };

    return (
      <>
        {/* ═══════════════════════════════════════════════════════════════════════
            BACKDROP — Blur + dim behind panel
            
            backdrop-filter blur: 12px
            overlay dim: rgba(0,0,0,0.12)
            ═══════════════════════════════════════════════════════════════════════ */}
        <div
          className={`nav-overlay-backdrop ${isOpen ? "nav-overlay-backdrop--open" : ""}`}
          style={{
            transition: `opacity ${MOTION.backdropDuration}ms ${MOTION.easing}`,
          }}
          onClick={onClose}
          aria-hidden="true"
        />

        {/* ═══════════════════════════════════════════════════════════════════════
            NAVIGATION PANEL — Apple-style top dropdown (ALL breakpoints)
            
            Mobile: Full-width, edge-to-edge with internal padding
            Tablet/Desktop: Centered, max-width 720px
            
            Always animates down from header (translateY), never from side.
            Close control is in header (hamburger → X), not inside panel.
            ═══════════════════════════════════════════════════════════════════════ */}
        <FocusTrap active={isOpen} focusTrapOptions={{ allowOutsideClick: true, initialFocus: false }}>
          <nav
            ref={ref}
            className={`nav-overlay-panel ${isOpen ? "nav-overlay-panel--open" : ""}`}
            style={{
              transition: `opacity ${MOTION.panelDuration}ms ${MOTION.easing}, transform ${MOTION.panelDuration}ms ${MOTION.easing}`,
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >

            {/* Navigation content with sections */}
            <div className="nav-overlay-content">
              {NAV_SECTIONS.map((section, sectionIndex) => (
                <div key={section.label}>
                  {/* Section divider (between groups, not before first) */}
                  {sectionIndex > 0 && <div className="nav-overlay-divider" />}
                  
                  {/* Section header */}
                  <p className="nav-overlay-section-header">
                    {section.label}
                  </p>
                  
                  {/* Section links */}
                  <div className="nav-overlay-section-links">
                    {section.items.map(renderNavItem)}
                  </div>
                </div>
              ))}
            </div>
          </nav>
        </FocusTrap>
      </>
    );
  }
);

NavOverlay.displayName = "NavOverlay";
