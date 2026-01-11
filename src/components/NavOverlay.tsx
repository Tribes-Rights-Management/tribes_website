/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║  TRIBES NAVIGATION OVERLAY — MERCURY-GRADE (LOCKED)                        ║
 * ║                                                                            ║
 * ║  Full-height white sheet. No card, no rounded outer container.             ║
 * ║  Close X aligned to same grid as hamburger.                                ║
 * ║                                                                            ║
 * ║  Typography (LOCKED):                                                      ║
 * ║    Menu links: 18px, line-height 24px, weight 500, letter-spacing -0.01em  ║
 * ║    Button labels: 17px, line-height 22px, weight 600                       ║
 * ║                                                                            ║
 * ║  Motion (LOCKED):                                                          ║
 * ║    Duration: 220ms                                                         ║
 * ║    Easing: cubic-bezier(0.2, 0.8, 0.2, 1)                                  ║
 * ║    Transform: opacity + subtle translateY                                  ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import FocusTrap from "focus-trap-react";
import { BRAND } from "@/lib/brand";

/**
 * Layout tokens (LOCKED)
 */
const LAYOUT = {
  gutterMobile: 20,
  gutterDesktop: 28,
  headerHeight: 64,
  topPadding: 22,
  itemSpacing: 18,
  dividerSpacing: 18,
  ctaGap: 12,
  ctaPadding: 20,
} as const;

/**
 * Typography tokens (LOCKED)
 */
const TYPE = {
  link: {
    fontSize: 18,
    lineHeight: '24px',
    fontWeight: 500,
    letterSpacing: '-0.01em',
  },
  button: {
    fontSize: 17,
    lineHeight: '22px',
    fontWeight: 600,
  },
  logo: {
    fontSize: 18,
    fontWeight: 600,
    letterSpacing: '0.14em',
    lineHeight: '18px',
  },
} as const;

/**
 * Motion tokens (LOCKED)
 */
const MOTION = {
  duration: '220ms',
  easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
} as const;

/**
 * Color tokens
 */
const COLOR = {
  text: '#111111',
  background: '#FFFFFF',
  divider: 'rgba(0,0,0,0.10)',
  primaryBg: '#0B0F14',
  primaryText: '#FFFFFF',
  secondaryBorder: 'rgba(0,0,0,0.18)',
} as const;

/**
 * Navigation Links — LOCKED
 */
const NAV_LINKS = [
  { label: "How Administration Works", href: "/how-publishing-admin-works" },
  { label: "How Licensing Works", href: "/how-licensing-works" },
  { label: "Contact", href: "/contact" },
];

interface NavOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NavOverlay = forwardRef<HTMLDivElement, NavOverlayProps>(
  ({ isOpen, onClose }, ref) => {
    return (
      <FocusTrap active={isOpen} focusTrapOptions={{ allowOutsideClick: true, initialFocus: false }}>
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: COLOR.background,
            display: 'flex',
            flexDirection: 'column',
            paddingTop: 'env(safe-area-inset-top)',
            opacity: isOpen ? 1 : 0,
            pointerEvents: isOpen ? 'auto' : 'none',
            transform: isOpen ? 'translateY(0)' : 'translateY(6px)',
            transition: `opacity ${MOTION.duration} ${MOTION.easing}, transform ${MOTION.duration} ${MOTION.easing}`,
          }}
        >
          {/* Reduced motion support */}
          <style>{`
            @media (prefers-reduced-motion: reduce) {
              [role="dialog"] {
                transform: none !important;
                transition: opacity 100ms ease !important;
              }
            }
          `}</style>

          {/* ═══════════════════════════════════════════════════════════════════
              TOP ROW — Logo (left) + Close X (right)
              Height: 64px, aligned to header grid
              ═══════════════════════════════════════════════════════════════════ */}
          <header 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: `${LAYOUT.headerHeight}px`,
              paddingLeft: `${LAYOUT.gutterMobile}px`,
              paddingRight: `${LAYOUT.gutterMobile}px`,
              flexShrink: 0,
            }}
          >
            {/* Logo — matches header exactly */}
            <Link 
              to="/" 
              onClick={onClose}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                height: TYPE.logo.lineHeight,
                fontSize: `${TYPE.logo.fontSize}px`,
                fontWeight: TYPE.logo.fontWeight,
                letterSpacing: TYPE.logo.letterSpacing,
                lineHeight: TYPE.logo.lineHeight,
                textTransform: 'uppercase',
                textRendering: 'geometricPrecision',
                color: COLOR.text,
                textDecoration: 'none',
              }}
            >
              {BRAND.wordmark}
            </Link>

            {/* Close X — 44x44 tap target, 22px glyph, 2px stroke */}
            <button
              onClick={onClose}
              aria-label="Close menu"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                minHeight: '44px',
                marginRight: '-12px', // Align to same edge as hamburger
                padding: 0,
                color: COLOR.text,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                opacity: 0.85,
                transition: `opacity ${MOTION.duration} ${MOTION.easing}`,
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.85'}
            >
              <X size={22} strokeWidth={2} />
            </button>
          </header>

          {/* ═══════════════════════════════════════════════════════════════════
              MENU LIST
              Typography: 18px / 24px, weight 500, letter-spacing -0.01em
              Spacing: 18px between items, dividers with 18px breathing room
              ═══════════════════════════════════════════════════════════════════ */}
          <nav 
            role="menu"
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              paddingTop: `${LAYOUT.topPadding}px`,
              paddingLeft: `${LAYOUT.gutterMobile}px`,
              paddingRight: `${LAYOUT.gutterMobile}px`,
            }}
          >
            {NAV_LINKS.map((item, index) => (
              <div key={item.href}>
                <Link
                  to={item.href}
                  onClick={onClose}
                  role="menuitem"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    minHeight: '44px', // Touch target
                    paddingTop: `${LAYOUT.itemSpacing}px`,
                    paddingBottom: `${LAYOUT.itemSpacing}px`,
                    fontSize: `${TYPE.link.fontSize}px`,
                    fontWeight: TYPE.link.fontWeight,
                    lineHeight: TYPE.link.lineHeight,
                    letterSpacing: TYPE.link.letterSpacing,
                    color: COLOR.text,
                    textDecoration: 'none',
                    transition: `opacity ${MOTION.duration} ${MOTION.easing}`,
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.6'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  {item.label}
                </Link>
                {/* Divider — 18px breathing room */}
                {index < NAV_LINKS.length - 1 && (
                  <div 
                    style={{
                      height: '1px',
                      backgroundColor: COLOR.divider,
                      marginTop: `${LAYOUT.dividerSpacing}px`,
                      marginBottom: `${LAYOUT.dividerSpacing}px`,
                    }}
                  />
                )}
              </div>
            ))}
          </nav>

          {/* ═══════════════════════════════════════════════════════════════════
              BOTTOM CTAs — Fixed to bottom with safe area
              Buttons: 56px height, 16px radius
              Typography: 17px / 22px, weight 600
              ═══════════════════════════════════════════════════════════════════ */}
          <div 
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: `${LAYOUT.ctaGap}px`,
              padding: `${LAYOUT.ctaPadding}px`,
              paddingBottom: `max(${LAYOUT.ctaPadding}px, env(safe-area-inset-bottom))`,
              flexShrink: 0,
            }}
          >
            {/* Primary: Client Portal */}
            <a
              href="https://app.tribesrightsmanagement.com"
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '56px',
                minHeight: '56px',
                borderRadius: '16px',
                backgroundColor: COLOR.primaryBg,
                color: COLOR.primaryText,
                fontSize: `${TYPE.button.fontSize}px`,
                fontWeight: TYPE.button.fontWeight,
                lineHeight: TYPE.button.lineHeight,
                textDecoration: 'none',
                border: 'none',
                transition: `opacity ${MOTION.duration} ${MOTION.easing}`,
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Client Portal
            </a>

            {/* Secondary: Request Licensing Access */}
            <Link
              to="/licensing-account"
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '56px',
                minHeight: '56px',
                borderRadius: '16px',
                backgroundColor: COLOR.background,
                color: COLOR.text,
                fontSize: `${TYPE.button.fontSize}px`,
                fontWeight: TYPE.button.fontWeight,
                lineHeight: TYPE.button.lineHeight,
                textDecoration: 'none',
                border: `1px solid ${COLOR.secondaryBorder}`,
                transition: `opacity ${MOTION.duration} ${MOTION.easing}`,
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
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
