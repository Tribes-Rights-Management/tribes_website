/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║  DO NOT TOUCH NAVIGATION SYSTEM WITHOUT EXPLICIT INSTRUCTION               ║
 * ║                                                                            ║
 * ║  Source of truth: /docs/NAVIGATION_SPEC.md                                 ║
 * ║                                                                            ║
 * ║  Any change must be validated against spec and regression-tested on        ║
 * ║  mobile/tablet/desktop.                                                    ║
 * ║                                                                            ║
 * ║  Navigation data is centralized in: src/lib/navigation.ts                  ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

import { ReactNode, useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { CONTENT_CONTAINER_CLASS } from "@/lib/layout";
import { THEME_DARK_BG, THEME_LIGHT_BG, OVERLAY_BACKDROP, MOTION_TIMING } from "@/lib/theme";
import { Footer } from "@/components/Footer";
import { useScrollLock } from "@/hooks/useScrollLock";
import { NAV_CONFIG, NAV_TIMING, NAV_EASING, NAV_TRANSFORM, NAV_BLUR_INTENSITY } from "@/lib/navigation";


interface PublicLayoutProps {
  children: ReactNode;
  logoOnly?: boolean;
  disableFooterLinks?: boolean;
  hideFooterLinks?: boolean;
  mobileContactAnchor?: string;
  /** Use dark theme background (bg-[#111214]) for the entire page to prevent white fall-through */
  darkBackground?: boolean;
}

export function PublicLayout({ children, logoOnly = false, disableFooterLinks = false, hideFooterLinks = false, mobileContactAnchor, darkBackground = false }: PublicLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const location = useLocation();

  // Root landing page exception
  const isRootPage = location.pathname === "/";
  const isMarketingPage = location.pathname === "/marketing";

  // GLOBAL HEADER RULE (LOCKED - INSTITUTIONAL GRADE)
  // Root (/) AND /marketing: Black header, white logo, integrated with hero
  // All other pages: White header with backdrop blur
  const headerDark = isRootPage || isMarketingPage;

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when menu is open (mobile only)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  useScrollLock(menuOpen && isMobile);

  // Close on click outside (desktop dropdown)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(e.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [menuOpen]);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [menuOpen]);

  // Close menu handler for nav items
  const closeMenu = () => setMenuOpen(false);

  // Theme zone background
  const pageBackgroundStyle = darkBackground 
    ? { backgroundColor: THEME_DARK_BG } 
    : { backgroundColor: THEME_LIGHT_BG };

  return (
    <div 
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: "hsl(var(--site-black))" }}
    >
      {/* Skip to content link - accessibility */}
      <a 
        href="#main-content" 
        className="skip-to-content sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-foreground focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:text-sm focus:font-medium"
      >
        Skip to content
      </a>
      
      {/* ═══════════════════════════════════════════════════════════════════════
          HEADER - Logo + Hamburger Only (All Breakpoints)
          Per spec: No inline nav items on any breakpoint
          ═══════════════════════════════════════════════════════════════════════ */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          headerDark 
            ? 'border-b border-white/[0.06]' 
            : 'bg-white border-b border-black/[0.08]'
        }`}
        style={headerDark ? { backgroundColor: THEME_DARK_BG } : { backgroundColor: '#FFFFFF' }}
      >
        <div className={`${CONTENT_CONTAINER_CLASS} flex items-center justify-between h-16 md:h-[72px]`}>
          {/* Left-aligned wordmark */}
          <Link 
            to="/" 
            className={`flex items-center transition-opacity duration-200 hover:opacity-100 ${headerDark ? 'opacity-90' : 'opacity-90'}`}
          >
            <span 
              className={`text-[15px] md:text-[17px] font-bold uppercase ${headerDark ? 'text-white' : 'text-foreground'}`}
              style={{ fontWeight: 700, letterSpacing: '0.04em' }}
            >
              {BRAND.wordmark}
            </span>
          </Link>

          {/* Hamburger Menu Button - visible on ALL breakpoints (locked design decision) */}
          {!logoOnly && (
            <button
              ref={menuButtonRef}
              onClick={() => setMenuOpen(!menuOpen)}
              className={`p-2 -mr-2 transition-opacity duration-200 opacity-80 hover:opacity-100 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 ${headerDark ? 'text-white focus-visible:outline-white/20' : 'text-foreground focus-visible:outline-foreground/15'}`}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              <Menu size={20} strokeWidth={1.75} />
            </button>
          )}

          {/* Contact Link (logoOnly mode with anchor) */}
          {logoOnly && mobileContactAnchor && (
            <button
              onClick={() => {
                document.getElementById(mobileContactAnchor)?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`text-sm font-medium transition-opacity duration-200 opacity-60 hover:opacity-100 ${headerDark ? 'text-white' : 'text-foreground'}`}
            >
              Contact
            </button>
          )}
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16 md:h-[72px]" />

      {/* ═══════════════════════════════════════════════════════════════════════
          NAVIGATION MENU SYSTEM
          - Mobile (< 768px): Full-screen overlay, no blur
          - Tablet/Desktop (≥ 768px): Dropdown panel with background blur
          
          Data source: NAV_CONFIG from src/lib/navigation.ts
          ═══════════════════════════════════════════════════════════════════════ */}
      {!logoOnly && (
        <>
          {/* ─────────────────────────────────────────────────────────────────────
              MOBILE: Full-screen overlay menu (< 768px)
              Per spec: No blur on mobile
              ───────────────────────────────────────────────────────────────────── */}
          
          {/* Mobile Backdrop */}
          <div
            className={`fixed inset-0 z-40 md:hidden ${
              menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            style={{
              backgroundColor: OVERLAY_BACKDROP.color,
              backdropFilter: `blur(${OVERLAY_BACKDROP.blur})`,
              WebkitBackdropFilter: `blur(${OVERLAY_BACKDROP.blur})`,
              transition: `opacity ${menuOpen ? MOTION_TIMING.enter : MOTION_TIMING.exit}ms ${MOTION_TIMING.easing}`,
              willChange: "opacity",
            }}
            onClick={closeMenu}
            aria-hidden="true"
          />
          
          {/* Mobile Navigation Panel */}
          <nav 
            className={`mobile-nav-overlay fixed inset-0 w-screen h-screen z-50 md:hidden flex flex-col ${
              menuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            style={{
              backgroundColor: THEME_LIGHT_BG,
              paddingTop: 'env(safe-area-inset-top)',
              paddingBottom: 'env(safe-area-inset-bottom)',
              transition: `transform ${menuOpen ? MOTION_TIMING.enter : MOTION_TIMING.exit}ms ${MOTION_TIMING.easing}`,
              willChange: "transform",
            }}
            aria-label="Mobile navigation"
            aria-modal="true"
            role="dialog"
          >
            {/* Close button */}
            <div 
              className="flex justify-end"
              style={{ 
                paddingLeft: 'var(--nav-padding-x-mobile)',
                paddingRight: 'var(--nav-padding-x-mobile)',
                paddingTop: 'var(--nav-header-pt-mobile)',
                paddingBottom: 'var(--nav-header-pb-mobile)',
              }}
            >
              <button
                onClick={closeMenu}
                className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-0 border-0"
                aria-label="Close menu"
              >
                Close
              </button>
            </div>
            
            {/* Primary Navigation - Rendered from NAV_CONFIG */}
            <div 
              className="flex flex-col"
              style={{ 
                paddingLeft: 'var(--nav-padding-x-mobile)',
                paddingRight: 'var(--nav-padding-x-mobile)',
                paddingTop: 'var(--nav-content-pt-mobile)',
                gap: 'var(--nav-item-spacing-mobile)',
              }}
            >
              {NAV_CONFIG.primary.map((item) => (
                <Link 
                  key={item.href}
                  to={item.href} 
                  onClick={closeMenu}
                  className="nav-primary-mobile"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Divider */}
            <div 
              className="w-full"
              style={{ 
                marginTop: 'var(--nav-section-spacing-mobile)',
                marginBottom: 'var(--nav-section-spacing-mobile)',
                borderTop: '1px solid hsl(var(--nav-divider-color-mobile))',
              }}
            />

            {/* Action Items - Rendered from NAV_CONFIG */}
            <div 
              className="flex flex-col"
              style={{ 
                paddingLeft: 'var(--nav-padding-x-mobile)',
                paddingRight: 'var(--nav-padding-x-mobile)',
                gap: 'var(--nav-item-spacing-mobile)',
              }}
            >
              {NAV_CONFIG.actions.map((item) => (
                item.external ? (
                  <a 
                    key={item.href}
                    href={item.href} 
                    onClick={closeMenu}
                    className="nav-action-mobile"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link 
                    key={item.href}
                    to={item.href} 
                    onClick={closeMenu}
                    className="nav-action-mobile"
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </div>
          </nav>

          {/* ─────────────────────────────────────────────────────────────────────
              TABLET/DESKTOP: Dropdown panel with blur (≥ 768px)
              Per spec: 6px blur on background content, 100ms transition
              ───────────────────────────────────────────────────────────────────── */}
          
          {/* Background Blur Overlay */}
          <div
            className={`hidden md:block fixed inset-0 z-40 ${
              menuOpen ? '' : 'pointer-events-none'
            }`}
            style={{
              top: '72px',
              backdropFilter: menuOpen ? `blur(${NAV_BLUR_INTENSITY}px)` : 'blur(0px)',
              WebkitBackdropFilter: menuOpen ? `blur(${NAV_BLUR_INTENSITY}px)` : 'blur(0px)',
              opacity: menuOpen ? 1 : 0,
              transition: `backdrop-filter ${NAV_TIMING.blurTransition}ms ease-out, opacity ${NAV_TIMING.blurTransition}ms ease-out`,
              willChange: 'backdrop-filter, opacity',
            }}
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Dropdown Panel
              ═══════════════════════════════════════════════════════════════════════
              ANIMATION VALUES ARE FINAL - Do not modify easing, duration, or
              transform behavior unless explicitly instructed.
              
              Open:  opacity 0→1, translateY(-8px)→0, 220ms, cubic-bezier(0.22, 0.61, 0.36, 1)
              Close: opacity 1→0, translateY(0)→-6px, 180ms, cubic-bezier(0.4, 0.0, 0.2, 1)
              ═══════════════════════════════════════════════════════════════════════ */}
          <div
            ref={menuRef}
            className={`hidden md:block fixed left-0 right-0 z-50 motion-safe:transition-[opacity,transform] ${
              menuOpen ? '' : 'pointer-events-none'
            }`}
            style={{
              top: '72px',
              transformOrigin: 'top center',
              backgroundColor: THEME_LIGHT_BG,
              borderBottom: menuOpen ? '1px solid rgba(0, 0, 0, 0.08)' : 'none',
              boxShadow: menuOpen ? '0 2px 16px rgba(0, 0, 0, 0.06)' : 'none',
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? NAV_TRANSFORM.openTo : NAV_TRANSFORM.closeTo,
              transition: menuOpen 
                ? `opacity ${NAV_TIMING.dropdownOpen}ms ${NAV_EASING.open}, transform ${NAV_TIMING.dropdownOpen}ms ${NAV_EASING.open}`
                : `opacity ${NAV_TIMING.dropdownClose}ms ${NAV_EASING.close}, transform ${NAV_TIMING.dropdownClose}ms ${NAV_EASING.close}`,
              willChange: 'opacity, transform',
            }}
            role="menu"
            aria-label="Navigation menu"
          >
            <div className={CONTENT_CONTAINER_CLASS}>
              <div className="flex">
                {/* Navigation - Rendered from NAV_CONFIG */}
                <div 
                  className="flex flex-col py-8"
                  style={{ gap: '6px', minWidth: '280px' }}
                >
                  {/* Primary Navigation */}
                  {NAV_CONFIG.primary.map((item) => (
                    <Link 
                      key={item.href}
                      to={item.href} 
                      onClick={closeMenu}
                      className="desktop-dropdown-item"
                    >
                      {item.label}
                    </Link>
                  ))}
                  
                  {/* Divider */}
                  <div 
                    className="w-full my-4"
                    style={{ borderTop: '1px solid rgba(0, 0, 0, 0.06)', maxWidth: '200px' }}
                  />
                  
                  {/* Action Items */}
                  {NAV_CONFIG.actions.map((item) => (
                    item.external ? (
                      <a 
                        key={item.href}
                        href={item.href} 
                        onClick={closeMenu}
                        className="desktop-dropdown-item"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link 
                        key={item.href}
                        to={item.href} 
                        onClick={closeMenu}
                        className="desktop-dropdown-item"
                      >
                        {item.label}
                      </Link>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main content */}
      <main id="main-content" ref={mainRef} className="flex-1 flex flex-col" style={pageBackgroundStyle}>
        {children}
      </main>

      {/* Footer */}
      <Footer 
        disableLinks={disableFooterLinks} 
        hideLinks={hideFooterLinks} 
        variant={isRootPage ? "compact" : "standard"}
      />
    </div>
  );
}
