/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║  TRIBES NAVIGATION OVERLAY — MERCURY-GRADE (LOCKED)                        ║
 * ║                                                                            ║
 * ║  Full-screen white overlay. Clean list rows with dividers.                ║
 * ║  Bottom-pinned CTAs. Restrained motion.                                   ║
 * ║                                                                            ║
 * ║  Motion (LOCKED):                                                          ║
 * ║    Fade: opacity 0 → 1 over var(--dur-2) using var(--ease-out)            ║
 * ║    Panel: translateY(8px) → 0 over var(--dur-2) using var(--ease)         ║
 * ║    No bounce. No spring. No overshoot.                                    ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import FocusTrap from "focus-trap-react";
import { BRAND } from "@/lib/brand";
import { CONTENT_CONTAINER_CLASS } from "@/lib/layout";

/**
 * Navigation Links — LOCKED
 * 1. How Administration Works
 * 2. How Licensing Works
 * 3. Contact
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
            backgroundColor: 'var(--bg)',
            display: 'flex',
            flexDirection: 'column',
            opacity: isOpen ? 1 : 0,
            pointerEvents: isOpen ? 'auto' : 'none',
            transform: isOpen ? 'translateY(0)' : 'translateY(8px)',
            transition: `opacity var(--dur-2) var(--ease-out), transform var(--dur-2) var(--ease)`,
          }}
        >
          {/* ═══════════════════════════════════════════════════════════════════
              TOP ROW — Wordmark (left) + Close X (right)
              Height: 64px, same gutters as header
              ═══════════════════════════════════════════════════════════════════ */}
          <header 
            className={CONTENT_CONTAINER_CLASS}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '64px',
              flexShrink: 0,
            }}
          >
            {/* Wordmark — matches header spec */}
            <Link 
              to="/" 
              onClick={onClose}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                height: '64px',
                fontSize: '18px',
                fontWeight: 600,
                letterSpacing: '0.10em',
                lineHeight: 1,
                textTransform: 'uppercase',
                color: 'var(--fg)',
                transition: `opacity var(--dur-1) var(--ease)`,
              }}
            >
              {BRAND.wordmark}
            </Link>

            {/* Close X */}
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
                marginRight: '-8px',
                color: 'var(--fg)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: `opacity var(--dur-1) var(--ease)`,
              }}
            >
              <X size={22} strokeWidth={1.5} />
            </button>
          </header>

          {/* ═══════════════════════════════════════════════════════════════════
              MENU LIST — Clean rows with dividers
              Row height: 56px (touch target), Typography: 16px/500 (MERCURY-GRADE)
              ═══════════════════════════════════════════════════════════════════ */}
          <nav 
            className={CONTENT_CONTAINER_CLASS}
            role="menu"
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              paddingTop: 'var(--s4)',
            }}
          >
            {NAV_LINKS.map((item, index) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                role="menuitem"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  minHeight: '56px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: 1.3,
                  letterSpacing: 0,
                  color: 'var(--fg)',
                  borderBottom: index < NAV_LINKS.length - 1 ? '1px solid var(--line)' : 'none',
                  transition: `opacity var(--dur-1) var(--ease)`,
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* ═══════════════════════════════════════════════════════════════════
              BOTTOM CTAs — Pinned to bottom, above safe area
              Primary: Client Portal (solid dark)
              Secondary: Request Licensing Access (outline)
              Button height: 52px (MERCURY-GRADE), radius: var(--r-lg)
              Gap: 12px
              ═══════════════════════════════════════════════════════════════════ */}
          <div 
            className={CONTENT_CONTAINER_CLASS}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              paddingTop: 'var(--s5)',
              paddingBottom: 'max(var(--s5), env(safe-area-inset-bottom))',
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
                height: '52px',
                minHeight: '52px',
                borderRadius: 'var(--r-lg)',
                backgroundColor: 'var(--fg)',
                color: 'var(--bg)',
                fontSize: '16px',
                fontWeight: 600,
                transition: `opacity var(--dur-1) var(--ease)`,
              }}
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
                height: '52px',
                minHeight: '52px',
                borderRadius: 'var(--r-lg)',
                backgroundColor: 'var(--bg)',
                color: 'var(--fg)',
                fontSize: '16px',
                fontWeight: 600,
                border: '1px solid var(--line)',
                transition: `opacity var(--dur-1) var(--ease)`,
              }}
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
