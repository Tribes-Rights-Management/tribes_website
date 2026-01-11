/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║  PUBLIC LAYOUT — INSTITUTIONAL HEADER + NAV SYSTEM (LOCKED)                ║
 * ║                                                                            ║
 * ║  Header: Single TRIBES wordmark (left) + hamburger icon (right)            ║
 * ║  NO logo changes on scroll. Only background/border/shadow may change.      ║
 * ║                                                                            ║
 * ║  Geometry (LOCKED):                                                        ║
 * ║    Mobile: 64px height, 20px gutters                                       ║
 * ║    Desktop: 72px height, 28px gutters                                      ║
 * ║                                                                            ║
 * ║  Logo (LOCKED — NEVER CHANGES):                                            ║
 * ║    font-size: 18px, font-weight: 600, letter-spacing: 0.14em               ║
 * ║    line-height: 18px, text-rendering: geometricPrecision                   ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

import { ReactNode, useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { THEME_DARK_BG, THEME_LIGHT_BG } from "@/lib/theme";
import { Footer } from "@/components/Footer";
import { useScrollLock } from "@/hooks/useScrollLock";
import { NavOverlay } from "@/components/NavOverlay";

/**
 * Header geometry tokens (LOCKED)
 */
const HEADER = {
  height: 72, // LOCKED — 72px on mobile per spec
  gutterMobile: 24,
  gutterDesktop: 28,
} as const;

/**
 * Logo typography tokens (LOCKED — NEVER CHANGES ON SCROLL)
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
  duration: '180ms',
  easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
} as const;

interface PublicLayoutProps {
  children: ReactNode;
  logoOnly?: boolean;
  disableFooterLinks?: boolean;
  hideFooterLinks?: boolean;
  mobileContactAnchor?: string;
  darkBackground?: boolean;
}

export function PublicLayout({ 
  children, 
  logoOnly = false, 
  disableFooterLinks = false, 
  hideFooterLinks = false, 
  mobileContactAnchor, 
  darkBackground = false 
}: PublicLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const location = useLocation();

  // Route-based header theme
  const isRootPage = location.pathname === "/";
  const isMarketingPage = location.pathname === "/marketing";
  const headerDark = isRootPage || isMarketingPage;

  // Scroll detection for header styling (NOT for logo changes)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when menu is open
  useScrollLock(menuOpen);

  // Close on click outside
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

  const closeMenu = () => setMenuOpen(false);

  // Theme zone background
  const pageBackgroundStyle = darkBackground 
    ? { backgroundColor: THEME_DARK_BG } 
    : { backgroundColor: THEME_LIGHT_BG };

  // Header background styles (only these change on scroll)
  const getHeaderBackground = () => {
    if (headerDark) {
      return {
        backgroundColor: '#111214',
        borderBottom: isScrolled 
          ? '1px solid rgba(255,255,255,0.12)' 
          : '1px solid rgba(255,255,255,0.06)',
        boxShadow: isScrolled ? '0 1px 12px rgba(0,0,0,0.15)' : 'none',
      };
    }
    return {
      backgroundColor: '#FFFFFF',
      borderBottom: isScrolled 
        ? '1px solid rgba(0,0,0,0.12)' 
        : '1px solid rgba(0,0,0,0.08)',
      boxShadow: isScrolled ? '0 1px 12px rgba(0,0,0,0.06)' : 'none',
    };
  };

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
          HEADER — SINGLE SOURCE OF TRUTH (LOCKED)
          
          Logo NEVER changes between states. Only background/border/shadow.
          Height: 64px mobile, 72px desktop
          Gutters: 20px mobile, 28px desktop
          ═══════════════════════════════════════════════════════════════════════ */}
      <header 
        data-scrolled={isScrolled ? 'true' : 'false'}
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          height: `${HEADER.height}px`,
          padding: 0,
          ...getHeaderBackground(),
          transition: `background-color ${MOTION.duration} ${MOTION.easing}, border-color ${MOTION.duration} ${MOTION.easing}, box-shadow ${MOTION.duration} ${MOTION.easing}`,
        }}
      >
        <div 
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: `${HEADER.gutterMobile}px`,
            paddingRight: `${HEADER.gutterMobile}px`,
            paddingTop: 0,
            paddingBottom: 0,
          }}
        >
          {/* TRIBES Logo — SINGLE ELEMENT, NEVER CHANGES (LOCKED) */}
          <Link 
            to="/" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              height: `${HEADER.height}px`,
              textDecoration: 'none',
              transform: 'translateZ(0)', // Prevent iOS subpixel re-rasterization
            }}
          >
            <span 
              style={{ 
                fontSize: `${LOGO.fontSize}px`,
                fontWeight: LOGO.fontWeight,
                letterSpacing: LOGO.letterSpacing,
                lineHeight: LOGO.lineHeight,
                textTransform: 'uppercase',
                textRendering: 'geometricPrecision',
                color: headerDark ? '#FFFFFF' : '#0B0F14',
              }}
            >
              {BRAND.wordmark}
            </span>
          </Link>

          {/* Hamburger Icon — 44x44 tap target, 22px glyph, 2px stroke */}
          {!logoOnly && !menuOpen && (
            <button
              ref={menuButtonRef}
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={false}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                minHeight: '44px',
                marginRight: '-10px', // Align visual icon to edge (symmetric with logo left inset)
                padding: 0,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: headerDark ? '#FFFFFF' : '#0B0F14',
                opacity: 0.85,
                transition: `opacity ${MOTION.duration} ${MOTION.easing}`,
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.85'}
            >
              <Menu size={22} strokeWidth={2} />
            </button>
          )}

          {/* Contact Link (logoOnly mode) */}
          {logoOnly && mobileContactAnchor && (
            <button
              onClick={() => {
                document.getElementById(mobileContactAnchor)?.scrollIntoView({ behavior: "smooth" });
              }}
              style={{
                fontSize: '14px',
                fontWeight: 500,
                color: headerDark ? '#FFFFFF' : '#0B0F14',
                opacity: 0.6,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: `opacity ${MOTION.duration} ${MOTION.easing}`,
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
            >
              Contact
            </button>
          )}
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div style={{ height: `${HEADER.height}px` }} />

      {/* Desktop gutter adjustment */}
      <style>{`
        @media (min-width: 768px) {
          header[data-scrolled] > div {
            padding-left: ${HEADER.gutterDesktop}px !important;
            padding-right: ${HEADER.gutterDesktop}px !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          header[data-scrolled] {
            transition: none !important;
          }
        }
      `}</style>

      {/* NAV OVERLAY */}
      {!logoOnly && (
        <NavOverlay
          ref={menuRef}
          isOpen={menuOpen}
          onClose={closeMenu}
        />
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
