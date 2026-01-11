/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║  FINTECH NAV — SYSTEM-LEVEL DROPDOWN (ALL DEVICES)                        ║
 * ║                                                                            ║
 * ║  Infrastructure UI, not marketing UI.                                      ║
 * ║  Boring, predictable, calm, and permanent.                                 ║
 * ║                                                                            ║
 * ║  Anchored to header — no floating modal affordances.                       ║
 * ║  Same toggle opens and closes (no explicit close button).                  ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

import { forwardRef } from "react";
import { Link } from "react-router-dom";
import FocusTrap from "focus-trap-react";

/**
 * Navigation Structure — Fintech density
 */
const NAV_SECTIONS = [
  {
    label: "Services",
    items: [
      { label: "Administration", href: "/how-publishing-admin-works" },
      { label: "Licensing", href: "/how-licensing-works" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    label: "Access",
    items: [
      { label: "Client Portal", href: "https://app.tribesrightsmanagement.com", external: true },
      { label: "Request Access", href: "/licensing-account" },
    ],
  },
  {
    label: "Legal",
    items: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

interface NavOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║  MOTION TIMING — LOCKED (Fintech-grade)                                    ║
 * ║                                                                            ║
 * ║  Open: 320ms                                                               ║
 * ║  Close: 260ms                                                              ║
 * ║  Easing: cubic-bezier(0.22, 0.61, 0.36, 1)                                 ║
 * ║  Opacity delayed ~40ms                                                     ║
 * ║  No spring, bounce, snap, or overshoot                                     ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */
const MOTION = {
  openDuration: 320,
  closeDuration: 260,
  backdropDuration: 200,
  easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
  opacityDelay: 40,
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

    const panelDuration = isOpen ? MOTION.openDuration : MOTION.closeDuration;

    return (
      <>
        {/* Backdrop — subtle dim + light blur */}
        <div
          className={`nav-overlay-backdrop ${isOpen ? "nav-overlay-backdrop--open" : ""}`}
          style={{
            transition: `opacity ${MOTION.backdropDuration}ms ${MOTION.easing}`,
          }}
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Navigation Panel — anchored to header, system-level surface */}
        <FocusTrap active={isOpen} focusTrapOptions={{ allowOutsideClick: true, initialFocus: false }}>
          <nav
            ref={ref}
            className={`nav-overlay-panel ${isOpen ? "nav-overlay-panel--open" : ""}`}
            style={{
              transition: `transform ${panelDuration}ms ${MOTION.easing}, opacity ${panelDuration}ms ${MOTION.easing} ${isOpen ? MOTION.opacityDelay : 0}ms`,
            }}
            role="menu"
            aria-label="Navigation"
          >
            <div className="nav-overlay-content">
              {NAV_SECTIONS.map((section, sectionIndex) => (
                <div key={section.label} className="nav-overlay-section">
                  {sectionIndex > 0 && <div className="nav-overlay-divider" />}
                  <p className="nav-overlay-section-header">{section.label}</p>
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
