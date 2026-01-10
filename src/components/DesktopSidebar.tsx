/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * DESKTOP SIDEBAR — LOCKED SYSTEM COMPONENT
 * 
 * This component is part of the global navigation system and must not be modified
 * without updating the corresponding tokens in index.css.
 * 
 * IA Structure (matches mobile):
 *   Client Portal (primary destination)
 *   └─ Licensing Access (secondary, nested)
 *   ───────────────────────────────────
 *   Services
 *   How Administration Works
 *   How Licensing Works
 *   ───────────────────────────────────
 *   Contact
 * 
 * NO page-level overrides. NO conditional variants. Token-driven only.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import FocusTrap from "focus-trap-react";
import { THEME_LIGHT_BG, OVERLAY_BACKDROP, MOTION_TIMING } from "@/lib/theme";
import { useScrollLock } from "@/hooks/useScrollLock";

interface DesktopSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DesktopSidebar({ isOpen, onClose }: DesktopSidebarProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useScrollLock(isOpen);

  // Focus close button on open
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 hidden md:block ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{
          backgroundColor: OVERLAY_BACKDROP.color,
          backdropFilter: `blur(${OVERLAY_BACKDROP.blur})`,
          WebkitBackdropFilter: `blur(${OVERLAY_BACKDROP.blur})`,
          transition: `opacity ${isOpen ? MOTION_TIMING.enter : MOTION_TIMING.exit}ms ${MOTION_TIMING.easing}`,
          willChange: "opacity",
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar Panel — Token-driven layout */}
      <FocusTrap active={isOpen} focusTrapOptions={{ allowOutsideClick: true }}>
        <aside
          className={`desktop-nav-sidebar fixed top-0 right-0 h-screen z-50 hidden md:flex flex-col ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{
            width: 'var(--desktop-nav-sidebar-width)',
            backgroundColor: THEME_LIGHT_BG,
            paddingTop: 'env(safe-area-inset-top)',
            paddingBottom: 'env(safe-area-inset-bottom)',
            paddingRight: 'env(safe-area-inset-right)',
            transition: `transform ${isOpen ? MOTION_TIMING.enter : MOTION_TIMING.exit}ms ${MOTION_TIMING.easing}`,
            willChange: "transform",
          }}
          aria-label="Desktop navigation"
          aria-modal="true"
          role="dialog"
        >
          {/* Header with Close button */}
          <div 
            className="flex justify-end"
            style={{
              paddingLeft: 'var(--desktop-nav-padding-x)',
              paddingRight: 'var(--desktop-nav-padding-x)',
              paddingTop: 'var(--desktop-nav-header-pt)',
              paddingBottom: 'var(--desktop-nav-header-pb)',
            }}
          >
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="text-[13px] text-foreground/50 transition-opacity duration-150 ease-out hover:opacity-100 focus-visible:outline focus-visible:outline-1 focus-visible:outline-foreground/15 focus-visible:outline-offset-2"
            >
              Close
            </button>
          </div>

          {/* Navigation — Token-driven, IA-locked */}
          <nav 
            className="flex flex-col flex-1"
            style={{ paddingTop: 'var(--desktop-nav-content-pt)' }}
          >
            {/* Primary Section: Client Portal + Licensing Access */}
            <div 
              className="flex flex-col"
              style={{
                paddingLeft: 'var(--desktop-nav-padding-x)',
                paddingRight: 'var(--desktop-nav-padding-x)',
                gap: 'var(--desktop-nav-item-gap)',
              }}
            >
              <a
                href="https://app.tribesrightsmanagement.com"
                onClick={onClose}
                className="desktop-nav-primary py-2"
              >
                Client Portal
              </a>
              <Link
                to="/licensing-account"
                onClick={onClose}
                className="desktop-nav-secondary py-2"
              >
                Licensing Access
              </Link>
            </div>

            {/* Divider */}
            <div 
              className="border-t border-foreground/[0.06] w-full"
              style={{
                marginTop: 'var(--desktop-nav-divider-gap)',
                marginBottom: 'var(--desktop-nav-divider-gap)',
              }}
            />

            {/* Main Navigation Section */}
            <div 
              className="flex flex-col"
              style={{
                paddingLeft: 'var(--desktop-nav-padding-x)',
                paddingRight: 'var(--desktop-nav-padding-x)',
                gap: 'var(--desktop-nav-item-gap)',
              }}
            >
              <Link
                to="/services"
                onClick={onClose}
                className="desktop-nav-primary py-2"
              >
                Services
              </Link>
              <Link
                to="/how-publishing-admin-works"
                onClick={onClose}
                className="desktop-nav-primary py-2"
              >
                How Administration Works
              </Link>
              <Link
                to="/how-licensing-works"
                onClick={onClose}
                className="desktop-nav-primary py-2"
              >
                How Licensing Works
              </Link>
            </div>

            {/* Divider */}
            <div 
              className="border-t border-foreground/[0.06] w-full"
              style={{
                marginTop: 'var(--desktop-nav-divider-gap)',
                marginBottom: 'var(--desktop-nav-divider-gap)',
              }}
            />

            {/* Contact Section */}
            <div 
              className="flex flex-col"
              style={{
                paddingLeft: 'var(--desktop-nav-padding-x)',
                paddingRight: 'var(--desktop-nav-padding-x)',
              }}
            >
              <Link
                to="/contact"
                onClick={onClose}
                className="desktop-nav-primary py-2"
              >
                Contact
              </Link>
            </div>
          </nav>
        </aside>
      </FocusTrap>
    </>
  );
}
