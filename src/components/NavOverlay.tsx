/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║  FINTECH NAVIGATION — FINAL SYSTEM (LOCKED)                               ║
 * ║                                                                            ║
 * ║  Apple-style top dropdown. Single unified component. No sidebar.          ║
 * ║  No section labels. Links only. Hierarchy through order and spacing.       ║
 * ║                                                                            ║
 * ║  DO NOT: Add labels, convert to sidebar, change link order.               ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

import { forwardRef } from "react";
import { Link } from "react-router-dom";
import FocusTrap from "focus-trap-react";

/**
 * Navigation Links — LOCKED
 * 
 * Primary: How Administration Works, How Licensing Works, Contact
 * Secondary: Client Portal, Request Licensing Access
 * 
 * Privacy/Terms: Footer only — NOT in header navigation
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
 * Duration: 280-320ms
 * Easing: cubic-bezier(0.22, 1, 0.36, 1)
 */
const MOTION = {
  duration: 300,
  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
} as const;

export const NavOverlay = forwardRef<HTMLDivElement, NavOverlayProps>(
  ({ isOpen, onClose }, ref) => {
    const renderLink = (item: { label: string; href: string; external?: boolean }, isPrimary: boolean) => {
      const className = isPrimary ? "nav-link nav-link--primary" : "nav-link nav-link--secondary";
      
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
        {/* Backdrop — subtle blur */}
        <div
          className={`nav-backdrop ${isOpen ? "nav-backdrop--open" : ""}`}
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Navigation Panel — top-anchored dropdown */}
        <FocusTrap active={isOpen} focusTrapOptions={{ allowOutsideClick: true, initialFocus: false }}>
          <nav
            ref={ref}
            className={`nav-panel ${isOpen ? "nav-panel--open" : ""}`}
            style={{
              transition: `opacity ${MOTION.duration}ms ${MOTION.easing}, transform ${MOTION.duration}ms ${MOTION.easing}`,
            }}
            role="menu"
            aria-label="Navigation"
          >
            {/* Primary Links */}
            <div className="nav-group nav-group--primary">
              {PRIMARY_LINKS.map(link => renderLink(link, true))}
            </div>

            {/* Divider */}
            <div className="nav-divider" />

            {/* Secondary Links */}
            <div className="nav-group nav-group--secondary">
              {SECONDARY_LINKS.map(link => renderLink(link, false))}
            </div>
          </nav>
        </FocusTrap>
      </>
    );
  }
);

NavOverlay.displayName = "NavOverlay";
