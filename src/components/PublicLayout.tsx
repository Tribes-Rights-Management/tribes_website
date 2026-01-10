import { ReactNode, useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { CONTENT_CONTAINER_CLASS } from "@/lib/layout";
import { THEME_DARK_BG, THEME_LIGHT_BG, OVERLAY_BACKDROP, MOTION_TIMING } from "@/lib/theme";
import { Footer } from "@/components/Footer";
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

  // Helper to check active route
  const isActiveRoute = (path: string) => location.pathname === path;

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
      {/* Header - Premium Apple/Stripe style */}
      {/* Fixed position with backdrop blur on light pages, integrated on dark pages */}
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

      {/* Navigation Menu */}
      {!logoOnly && (
        <>
          {/* Mobile Backdrop - Only visible on mobile */}
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
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          
          {/* Mobile Navigation Panel - Full screen overlay on mobile only */}
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
                onClick={() => setMenuOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-0 border-0"
                aria-label="Close menu"
              >
                Close
              </button>
            </div>
            
            {/* Primary Navigation */}
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
                onClick={() => setMenuOpen(false)}
                className="nav-primary-mobile"
              >
                Services
              </Link>
              <Link 
                to="/how-publishing-admin-works" 
                onClick={() => setMenuOpen(false)}
                className="nav-primary-mobile"
              >
                How Administration Works
              </Link>
              <Link 
                to="/how-licensing-works" 
                onClick={() => setMenuOpen(false)}
                className="nav-primary-mobile"
              >
                How Licensing Works
              </Link>
              <Link 
                to="/contact" 
                onClick={() => setMenuOpen(false)}
                className="nav-primary-mobile"
              >
                Contact
              </Link>
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

            {/* Action Items */}
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
                onClick={() => setMenuOpen(false)}
                className="nav-action-mobile"
              >
                Sign in
              </a>
              <Link 
                to="/licensing-account" 
                onClick={() => setMenuOpen(false)}
                className="nav-action-mobile"
              >
                Request Licensing Access
              </Link>
            </div>
          </nav>

          {/* Desktop/iPad Dropdown Panel - Full-width Apple-style */}
          <div
            ref={menuRef}
            className={`hidden md:block fixed left-0 right-0 z-50 overflow-hidden ${
              menuOpen ? '' : 'pointer-events-none'
            }`}
            style={{
              top: '72px',
              backgroundColor: THEME_LIGHT_BG,
              borderBottom: menuOpen ? '1px solid rgba(0, 0, 0, 0.08)' : 'none',
              boxShadow: menuOpen ? '0 2px 16px rgba(0, 0, 0, 0.06)' : 'none',
              maxHeight: menuOpen ? '500px' : '0',
              opacity: menuOpen ? 1 : 0,
              transition: 'max-height 280ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms ease-out',
              willChange: 'max-height, opacity',
            }}
            role="menu"
            aria-label="Navigation menu"
          >
            <div 
              className={CONTENT_CONTAINER_CLASS}
              style={{
                transform: menuOpen ? 'translateY(0)' : 'translateY(-8px)',
                opacity: menuOpen ? 1 : 0,
                transition: 'transform 280ms cubic-bezier(0.4, 0, 0.2, 1), opacity 220ms ease-out',
                transitionDelay: menuOpen ? '40ms' : '0ms',
              }}
            >
              <div className="flex">
                {/* Primary Navigation - Left column */}
                <div 
                  className="flex flex-col py-8"
                  style={{ gap: '6px', minWidth: '280px' }}
                >
                  <Link 
                    to="/services" 
                    onClick={() => setMenuOpen(false)}
                    className="desktop-dropdown-item"
                  >
                    Services
                  </Link>
                  <Link 
                    to="/how-publishing-admin-works" 
                    onClick={() => setMenuOpen(false)}
                    className="desktop-dropdown-item"
                  >
                    How Administration Works
                  </Link>
                  <Link 
                    to="/how-licensing-works" 
                    onClick={() => setMenuOpen(false)}
                    className="desktop-dropdown-item"
                  >
                    How Licensing Works
                  </Link>
                  <Link 
                    to="/contact" 
                    onClick={() => setMenuOpen(false)}
                    className="desktop-dropdown-item"
                  >
                    Contact
                  </Link>
                  
                  {/* Divider */}
                  <div 
                    className="w-full my-4"
                    style={{ borderTop: '1px solid rgba(0, 0, 0, 0.06)', maxWidth: '200px' }}
                  />
                  
                  {/* Action Items */}
                  <a 
                    href="https://app.tribesrightsmanagement.com" 
                    onClick={() => setMenuOpen(false)}
                    className="desktop-dropdown-item"
                  >
                    Sign in
                  </a>
                  <Link 
                    to="/licensing-account" 
                    onClick={() => setMenuOpen(false)}
                    className="desktop-dropdown-item"
                  >
                    Request Licensing Access
                  </Link>
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
