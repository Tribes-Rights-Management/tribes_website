import { ReactNode, useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { CONTENT_CONTAINER_CLASS } from "@/lib/layout";
import { THEME_DARK_BG, THEME_LIGHT_BG, OVERLAY_BACKDROP, MOTION_TIMING } from "@/lib/theme";
import { Footer } from "@/components/Footer";
import { DesktopSidebar } from "@/components/DesktopSidebar";
import { useScrollLock } from "@/hooks/useScrollLock";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const location = useLocation();

  // Root landing page exception - no desktop sidebar, dark header integrated with hero
  const isRootPage = location.pathname === "/";
  const isMarketingPage = location.pathname === "/marketing";

  // GLOBAL HEADER RULE (LOCKED - INSTITUTIONAL GRADE)
  // Root (/) AND /marketing: Black header, white logo, integrated with hero
  // All other pages: White header, black logo, black hamburger, subtle divider
  // NO scroll-based color switching. NO exceptions.
  const headerDark = isRootPage || isMarketingPage;

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDesktopSidebarOpen(false);
  }, [location.pathname]);

  // Lock body scroll when menu is open — uses proper scroll preservation
  useScrollLock(mobileMenuOpen);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setDesktopSidebarOpen(false);
      }
    };
    if (mobileMenuOpen || desktopSidebarOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [mobileMenuOpen, desktopSidebarOpen]);

  // Header styling - institutional grade, uses theme constants
  const headerBgStyle = headerDark ? { backgroundColor: THEME_DARK_BG } : { backgroundColor: THEME_LIGHT_BG };
  const textColor = headerDark ? "text-white" : "text-foreground";
  // Subtle institutional divider: very light gray for white header, subtle white for dark
  const borderStyle = headerDark 
    ? "border-b border-white/[0.06]" 
    : "border-b border-[#e5e5e5]";

  // Theme zone background - uses authoritative colors from theme.ts
  // Dark pages keep the global dark baseline; light pages explicitly paint white
  const pageBackgroundStyle = darkBackground 
    ? { backgroundColor: THEME_DARK_BG } 
    : { backgroundColor: THEME_LIGHT_BG };

  return (
    <div 
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: "hsl(var(--site-black))" }}
    >
      {/* Header - 64px desktop, 56px mobile - Institutional grade lock */}
      {/* NON-STICKY: scrolls away for institutional calm (LOCKED) */}
      {/* Header content container MUST match hero container for perfect left-rail alignment */}
      <header className={`relative z-50 ${borderStyle}`} style={headerBgStyle}>
        <div className={`${CONTENT_CONTAINER_CLASS} flex items-center justify-between h-14 md:h-16`}>
          {/* Left-aligned wordmark - institutional weight + tracking */}
          <Link 
            to="/" 
            className={`flex items-center transition-opacity duration-150 ease-out hover:opacity-100 ${headerDark ? 'opacity-90' : 'opacity-90'}`}
          >
            <span 
              className={`text-[15px] md:text-[17px] font-bold uppercase ${textColor}`}
              style={{ fontWeight: 700, letterSpacing: '0.04em' }}
            >
              {BRAND.wordmark}
            </span>
          </Link>
          
          {/* Root page ONLY: Contact link on right (simplified landing) */}
          {!logoOnly && isRootPage && (
            <Link 
              to="/contact" 
              className={`hidden md:block text-[13px] transition-opacity duration-150 ease-out opacity-60 hover:opacity-100 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 ${headerDark ? 'text-white focus-visible:outline-white/20' : 'text-foreground focus-visible:outline-foreground/15'}`}
            >
              Contact
            </Link>
          )}

          {/* ALL pages except root: Hamburger menu trigger on right (desktop) */}
          {!logoOnly && !isRootPage && (
            <button
              onClick={() => setDesktopSidebarOpen(true)}
              className={`hidden md:flex p-2 -mr-2 transition-opacity duration-150 ease-out opacity-70 hover:opacity-100 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 ${headerDark ? 'text-white focus-visible:outline-white/20' : 'text-foreground focus-visible:outline-foreground/15'}`}
              aria-label="Open menu"
            >
              <Menu size={20} strokeWidth={1.75} />
            </button>
          )}

          {/* Mobile Menu Button - hamburger icon only (LOCKED) */}
          {!logoOnly && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 -mr-2 transition-opacity duration-150 ease-out opacity-80 hover:opacity-100 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 ${headerDark ? 'text-white focus-visible:outline-white/20' : 'text-foreground focus-visible:outline-foreground/15'}`}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <Menu size={20} strokeWidth={1.75} />
            </button>
          )}

          {/* Contact Link (logoOnly mode with anchor - visible on all screen sizes) */}
          {logoOnly && mobileContactAnchor && (
            <button
              onClick={() => {
                document.getElementById(mobileContactAnchor)?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`text-[13px] leading-none transition-opacity duration-150 ease-out opacity-60 hover:opacity-100 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 ${headerDark ? 'text-white focus-visible:outline-white/20' : 'text-foreground focus-visible:outline-foreground/15'}`}
            >
              Contact
            </button>
          )}
        </div>

        {/* Mobile Menu - Full-screen slide-in drawer */}
        {!logoOnly && (
          <>
            {/* Backdrop - Institutional: dim-first approach, subtle blur */}
            {/* will-change hints for smooth GPU-accelerated transitions */}
            <div
              className={`fixed inset-0 z-40 md:hidden ${
                mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              style={{
                backgroundColor: OVERLAY_BACKDROP.color,
                backdropFilter: `blur(${OVERLAY_BACKDROP.blur})`,
                WebkitBackdropFilter: `blur(${OVERLAY_BACKDROP.blur})`,
                transition: `opacity ${mobileMenuOpen ? MOTION_TIMING.enter : MOTION_TIMING.exit}ms ${MOTION_TIMING.easing}`,
                willChange: "opacity",
              }}
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            
            {/* ═══════════════════════════════════════════════════════════════════
                MOBILE NAVIGATION — DO NOT TOUCH
                
                This mobile navigation structure, IA, typography tokens, and spacing
                are locked. Do not alter without explicit instruction.
                
                Structure:
                  Primary (top): Services, How Administration Works, How Licensing Works, Contact
                  ─────────────────────────────────────────────────────────────────────
                  Actions (bottom): Sign in, Request Licensing Access
                ═══════════════════════════════════════════════════════════════════ */}
            <nav 
              className={`mobile-nav-overlay fixed inset-0 w-screen h-screen z-50 md:hidden flex flex-col ${
                mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
              }`}
              style={{
                backgroundColor: THEME_LIGHT_BG,
                paddingTop: 'env(safe-area-inset-top)',
                paddingBottom: 'env(safe-area-inset-bottom)',
                transition: `transform ${mobileMenuOpen ? MOTION_TIMING.enter : MOTION_TIMING.exit}ms ${MOTION_TIMING.easing}`,
                willChange: "transform",
              }}
              aria-label="Mobile navigation"
              aria-modal="true"
              role="dialog"
            >
              {/* Close button — top-right */}
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
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[13px] text-foreground/50 transition-opacity duration-150 ease-out hover:opacity-100 focus-visible:outline focus-visible:outline-1 focus-visible:outline-foreground/15 focus-visible:outline-offset-2"
                  aria-label="Close menu"
                >
                  Close
                </button>
              </div>
              
              {/* Primary Navigation — Top stack */}
              <div 
                className="flex flex-col"
                style={{ 
                  paddingLeft: 'var(--nav-padding-x-mobile)',
                  paddingRight: 'var(--nav-padding-x-mobile)',
                  paddingTop: 'var(--nav-content-pt-mobile)',
                  gap: 'var(--nav-item-spacing-mobile)',
                }}
              >
                <Link 
                  to="/services" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="nav-primary-mobile"
                >
                  Services
                </Link>
                <Link 
                  to="/how-publishing-admin-works" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="nav-primary-mobile"
                >
                  How Administration Works
                </Link>
                <Link 
                  to="/how-licensing-works" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="nav-primary-mobile"
                >
                  How Licensing Works
                </Link>
                <Link 
                  to="/contact" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="nav-primary-mobile"
                >
                  Contact
                </Link>
              </div>

              {/* Single Divider — Separates primary nav from actions */}
              <div 
                className="w-full"
                style={{ 
                  marginTop: 'var(--nav-section-spacing-mobile)',
                  marginBottom: 'var(--nav-section-spacing-mobile)',
                  borderTop: '1px solid hsl(var(--nav-divider-color-mobile))',
                }}
              />

              {/* Action Items — Bottom stack */}
              <div 
                className="flex flex-col"
                style={{ 
                  paddingLeft: 'var(--nav-padding-x-mobile)',
                  paddingRight: 'var(--nav-padding-x-mobile)',
                  gap: 'var(--nav-item-spacing-mobile)',
                }}
              >
                <a 
                  href="https://app.tribesrightsmanagement.com" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="nav-action-mobile"
                >
                  Sign in
                </a>
                <Link 
                  to="/licensing-account" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="nav-action-mobile"
                >
                  Request Licensing Access
                </Link>
              </div>
            </nav>
          </>
        )}

        {/* Desktop Sidebar - all pages except root */}
        {!logoOnly && !isRootPage && (
          <DesktopSidebar
            isOpen={desktopSidebarOpen}
            onClose={() => setDesktopSidebarOpen(false)}
          />
        )}
      </header>

      {/* Main - flex-1 ensures content expands to fill viewport */}
      <main ref={mainRef} className="flex-1 flex flex-col" style={pageBackgroundStyle}>
        {children}
      </main>

      {/* Footer — root page uses compact variant to preserve original layout */}
      <Footer 
        disableLinks={disableFooterLinks} 
        hideLinks={hideFooterLinks} 
        variant={isRootPage ? "compact" : "standard"}
      />
    </div>
  );
}
