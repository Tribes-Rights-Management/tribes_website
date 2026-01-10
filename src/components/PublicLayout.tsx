import { ReactNode, useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { CONTENT_CONTAINER_CLASS } from "@/lib/layout";
import { THEME_DARK_BG, THEME_LIGHT_BG, OVERLAY_BACKDROP, MOTION_TIMING } from "@/lib/theme";
import { Footer } from "@/components/Footer";
import { useScrollLock } from "@/hooks/useScrollLock";
import { Button } from "@/components/ui/button";

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
  const mainRef = useRef<HTMLElement>(null);
  const location = useLocation();

  // Root landing page exception
  const isRootPage = location.pathname === "/";
  const isMarketingPage = location.pathname === "/marketing";

  // GLOBAL HEADER RULE (LOCKED - INSTITUTIONAL GRADE)
  // Root (/) AND /marketing: Black header, white logo, integrated with hero
  // All other pages: White header with backdrop blur
  const headerDark = isRootPage || isMarketingPage;

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when menu is open
  useScrollLock(mobileMenuOpen);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [mobileMenuOpen]);

  // Helper to check active route
  const isActiveRoute = (path: string) => location.pathname === path;

  // Desktop navigation links
  const navLinks = [
    { to: "/services", label: "Services" },
    { to: "/how-publishing-admin-works", label: "How It Works" },
    { to: "/contact", label: "Contact" },
  ];

  // Theme zone background
  const pageBackgroundStyle = darkBackground 
    ? { backgroundColor: THEME_DARK_BG } 
    : { backgroundColor: THEME_LIGHT_BG };

  return (
    <div 
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: "hsl(var(--site-black))" }}
    >
      {/* Header - Premium Apple/Stripe style */}
      {/* Fixed position with backdrop blur on light pages, integrated on dark pages */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          headerDark 
            ? 'border-b border-white/[0.06]' 
            : 'backdrop-blur-md bg-background/80 border-b border-border/40'
        }`}
        style={headerDark ? { backgroundColor: THEME_DARK_BG } : undefined}
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
          
          {/* Desktop Navigation - Hidden on mobile, visible on md+ */}
          {!logoOnly && (
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    headerDark
                      ? isActiveRoute(link.to)
                        ? 'text-white'
                        : 'text-white/60 hover:text-white'
                      : isActiveRoute(link.to)
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* CTA Button */}
              <Button
                asChild
                variant={headerDark ? "outline" : "default"}
                size="sm"
                className={headerDark 
                  ? "border-white/20 bg-transparent text-white hover:bg-white/10" 
                  : ""
                }
              >
                <a href="https://app.tribesrightsmanagement.com">
                  Sign In
                </a>
              </Button>
            </nav>
          )}

          {/* Mobile Menu Button - visible only on mobile (<768px) */}
          {!logoOnly && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 -mr-2 transition-opacity duration-200 opacity-80 hover:opacity-100 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 ${headerDark ? 'text-white focus-visible:outline-white/20' : 'text-foreground focus-visible:outline-foreground/15'}`}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
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

      {/* Mobile Menu - Full-screen slide-in drawer (unchanged) */}
      {!logoOnly && (
        <>
          {/* Backdrop */}
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
          
          {/* Mobile Navigation Panel */}
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
                onClick={() => setMobileMenuOpen(false)}
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

      {/* Main content */}
      <main ref={mainRef} className="flex-1 flex flex-col" style={pageBackgroundStyle}>
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
