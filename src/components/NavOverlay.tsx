/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║  TRIBES NAVIGATION OVERLAY — MERCURY-GRADE (LOCKED)                        ║
 * ║                                                                            ║
 * ║  Full-height white sheet. No card, no rounded outer container.             ║
 * ║  Close X aligned to same grid as hamburger.                                ║
 * ║                                                                            ║
 * ║  Typography (LOCKED via CSS .mobile-menu-root + inline !important):        ║
 * ║    Menu links: 16px / 24px, weight 450 (institutional)                     ║
 * ║    Button labels: 16px / 16px, weight 500                                  ║
 * ║                                                                            ║
 * ║  iOS Safari Fix:                                                           ║
 * ║    Hard-locked via CSS + inline styles with -webkit-text-size-adjust       ║
 * ║                                                                            ║
 * ║  Motion (LOCKED):                                                          ║
 * ║    Duration: 220ms                                                         ║
 * ║    Easing: cubic-bezier(0.2, 0.8, 0.2, 1)                                  ║
 * ║    Transform: opacity + subtle translateY (NO scale!)                      ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import FocusTrap from "focus-trap-react";
import { BRAND } from "@/lib/brand";

/**
 * Layout tokens (LOCKED — PART A/B spec)
 */
const LAYOUT = {
  gutterMobile: 24,
  headerHeight: 72,
  topPadding: 24,
  ctaGap: 10,
  ctaPadding: 24,
  ctaSafeAreaBottom: 18,
} as const;

/**
 * Logo typography tokens (LOCKED — matches header exactly)
 */
const LOGO = {
  fontSize: 16,
  fontWeight: 600,
  letterSpacing: '0.18em',
  lineHeight: 1,
} as const;

/**
 * Motion tokens (LOCKED)
 */
const MOTION = {
  duration: '220ms',
  easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
} as const;

/**
 * Nav typography — explicit values for inline styles (iOS Safari fix)
 * These MUST match CSS tokens in index.css (PART A spec)
 */
const NAV_TYPE = {
  fontFamily: 'ui-sans-serif, system-ui, -apple-system, "SF Pro Text", "SF Pro Display", Inter, Arial, sans-serif',
  fontSize: '16px',
  lineHeight: '24px',
  fontWeight: 500,
  letterSpacing: 'normal',
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
          className="mobile-menu-root"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            paddingTop: 'env(safe-area-inset-top)',
            opacity: isOpen ? 1 : 0,
            pointerEvents: isOpen ? 'auto' : 'none',
            // ONLY translateY — NO scale() allowed
            transform: isOpen ? 'translateY(0)' : 'translateY(6px)',
            transition: `opacity ${MOTION.duration} ${MOTION.easing}, transform ${MOTION.duration} ${MOTION.easing}`,
            // HARD-LOCK typography — prevents iOS Safari inflation (PART A spec)
            fontFamily: NAV_TYPE.fontFamily,
            fontSize: NAV_TYPE.fontSize,
            lineHeight: NAV_TYPE.lineHeight,
            fontWeight: NAV_TYPE.fontWeight,
            letterSpacing: NAV_TYPE.letterSpacing,
            WebkitTextSizeAdjust: '100%',
            textRendering: 'geometricPrecision',
          }}
        >
          {/* Reduced motion support */}
          <style>{`
            @media (prefers-reduced-motion: reduce) {
              .mobile-menu-root[role="dialog"] {
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
                height: `${LAYOUT.headerHeight}px`,
                fontSize: `${LOGO.fontSize}px`,
                fontWeight: LOGO.fontWeight,
                letterSpacing: LOGO.letterSpacing,
                lineHeight: LOGO.lineHeight,
                textTransform: 'uppercase',
                textRendering: 'geometricPrecision',
                color: '#111111',
                textDecoration: 'none',
                transform: 'translateZ(0)', // Prevent iOS subpixel re-rasterization
              }}
            >
              {BRAND.wordmark}
            </Link>

            {/* Close X — 44x44 tap target, 24px glyph, 1.75 stroke */}
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
                marginRight: '-10px', // Align to same edge as hamburger
                padding: 0,
                color: '#111111',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                opacity: 0.85,
                transition: `opacity ${MOTION.duration} ${MOTION.easing}`,
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.85'}
            >
              <X size={24} strokeWidth={1.75} />
            </button>
          </header>

          {/* ═══════════════════════════════════════════════════════════════════
              MENU LIST
              Uses CSS class .mobile-menu-link for locked typography
              Row height: 56px (via min-height + padding)
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
                  className="mobile-menu-link"
                >
                  {item.label}
                </Link>
                {/* Divider — consistent vertical rhythm */}
                {index < NAV_LINKS.length - 1 && (
                  <div className="mobile-menu-divider" />
                )}
              </div>
            ))}
          </nav>

          {/* ═══════════════════════════════════════════════════════════════════
              BOTTOM CTAs — Fixed to bottom with safe area
              Uses CSS classes .mobile-menu-btn, .mobile-menu-btn-primary/secondary
              ═══════════════════════════════════════════════════════════════════ */}
          <div 
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: `${LAYOUT.ctaGap}px`,
              padding: `${LAYOUT.ctaPadding}px`,
              paddingBottom: `calc(${LAYOUT.ctaSafeAreaBottom}px + env(safe-area-inset-bottom))`,
              flexShrink: 0,
            }}
          >
            {/* Primary: Client Portal */}
            <a
              href="https://app.tribesrightsmanagement.com"
              onClick={onClose}
              className="mobile-menu-btn mobile-menu-btn-primary"
            >
              Client Portal
            </a>

            {/* Secondary: Request Licensing Access */}
            <Link
              to="/licensing-account"
              onClick={onClose}
              className="mobile-menu-btn mobile-menu-btn-secondary"
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
