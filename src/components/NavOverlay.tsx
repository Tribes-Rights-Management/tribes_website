/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║  UNIFIED NAV OVERLAY — PREMIUM NAVIGATION SYSTEM                           ║
 * ║                                                                            ║
 * ║  ONE component for ALL breakpoints. Same items, same groups, same order.   ║
 * ║  Responsive presentation only (dropdown panel vs top sheet).               ║
 * ║                                                                            ║
 * ║  Desktop/iPad (≥768px): Apple-style dropdown panel, top-right anchored     ║
 * ║  Mobile (<768px): Premium top sheet that slides down from header           ║
 * ║                                                                            ║
 * ║  DO NOT create separate mobile/desktop nav components.                     ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

import { forwardRef, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import FocusTrap from "focus-trap-react";

/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║  NAVIGATION STRUCTURE — LOCKED                                             ║
 * ║                                                                            ║
 * ║  SERVICES: Services, How Administration Works, How Licensing Works, Contact║
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
 * ║  MOTION TIMING — LOCKED                                                    ║
 * ║                                                                            ║
 * ║  Panel open/close: 320ms, cubic-bezier(0.22, 1, 0.36, 1)                   ║
 * ║  Backdrop fade: 220ms                                                      ║
 * ║  Same timing opening AND closing (no snapping)                             ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */
const MOTION = {
  panelDuration: 320,
  backdropDuration: 220,
  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
} as const;

export const NavOverlay = forwardRef<HTMLDivElement, NavOverlayProps>(
  ({ isOpen, onClose }, ref) => {
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    // Focus close button on open
    useEffect(() => {
      if (isOpen && closeButtonRef.current) {
        // Small delay to ensure panel is rendered
        const timer = setTimeout(() => {
          closeButtonRef.current?.focus();
        }, 50);
        return () => clearTimeout(timer);
      }
    }, [isOpen]);

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
            
            backdrop-filter blur: 14px
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
            NAVIGATION PANEL
            
            Desktop/iPad (≥768px): 
              - Dropdown anchored top-right
              - Width: min(420px, 90vw)
              - Max-height: 70vh, scroll if exceeds
              - Radius 14px, subtle shadow, 1px border
              - Background: white at 96-98% opacity
            
            Mobile (<768px):
              - Top sheet slides down from header
              - Max-height: 75vh
              - Close button (X) top-right inside panel
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
            {/* Close button - 18px icon, top-right, 16px inset */}
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="nav-overlay-close"
              aria-label="Close menu"
            >
              <X size={18} strokeWidth={2} />
            </button>

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
