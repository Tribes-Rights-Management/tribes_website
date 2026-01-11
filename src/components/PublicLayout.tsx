/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║  PUBLIC LAYOUT — UNIFIED NAVIGATION SYSTEM                                 ║
 * ║                                                                            ║
 * ║  Header: TRIBES wordmark (left) + hamburger icon (right) ONLY              ║
 * ║  No inline nav items on any breakpoint. Everything in hamburger menu.     ║
 * ║                                                                            ║
 * ║  Navigation: Single NavOverlay component for all breakpoints.              ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

import { ReactNode, useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { CONTENT_CONTAINER_CLASS } from "@/lib/layout";
import { THEME_DARK_BG, THEME_LIGHT_BG } from "@/lib/theme";
import { Footer } from "@/components/Footer";
import { useScrollLock } from "@/hooks/useScrollLock";
import { NavOverlay } from "@/components/NavOverlay";


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

  // Lock body scroll when menu is open (all breakpoints)
  // This prevents scroll bleed and maintains scroll position
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
          HEADER — LOCKED (No wordmark jump on scroll)
          
          Height: 64px (all breakpoints)
          Wordmark: 18px, font-weight 600, letter-spacing 0.10em
          Only background/border/shadow may change on scroll (not implemented yet)
          ═══════════════════════════════════════════════════════════════════════ */}
      <header 
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          height: '64px',
          backgroundColor: headerDark ? '#111214' : '#FFFFFF',
          borderBottom: headerDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid var(--line)',
          transition: 'box-shadow var(--dur-2) var(--ease-out), border-color var(--dur-2) var(--ease-out), background-color var(--dur-2) var(--ease-out)',
        }}
      >
        <div 
          className={`${CONTENT_CONTAINER_CLASS} h-full flex items-center justify-between`}
        >
          {/* TRIBES Wordmark — LOCKED: Same DOM element, same styles, never changes */}
          <Link 
            to="/" 
            className="inline-flex items-center"
            style={{
              height: '64px',
              transition: `opacity var(--dur-1) var(--ease)`,
            }}
          >
            <span 
              style={{ 
                fontSize: '18px',
                fontWeight: 600,
                letterSpacing: '0.10em',
                lineHeight: 1,
                textTransform: 'uppercase',
                color: headerDark ? '#FFFFFF' : 'var(--fg)',
              }}
            >
              {BRAND.wordmark}
            </span>
          </Link>

          {/* Hamburger Toggle — visible on ALL breakpoints (only shows when nav closed) */}
          {!logoOnly && !menuOpen && (
            <button
              ref={menuButtonRef}
              onClick={() => setMenuOpen(true)}
              className="p-2 -mr-2"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                minHeight: '44px',
                color: headerDark ? '#FFFFFF' : 'var(--fg)',
                opacity: 0.8,
                transition: `opacity var(--dur-1) var(--ease)`,
              }}
              aria-label="Open menu"
              aria-expanded={false}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
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
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--w-medium)',
                color: headerDark ? '#FFFFFF' : 'var(--fg)',
                opacity: 0.6,
                transition: `opacity var(--dur-1) var(--ease)`,
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
            >
              Contact
            </button>
          )}
        </div>
      </header>

      {/* Spacer for fixed header — LOCKED at 64px */}
      <div style={{ height: '64px' }} />

      {/* ═══════════════════════════════════════════════════════════════════════
          NAV OVERLAY — Single component for ALL breakpoints
          
          Desktop/iPad (≥768px): Apple-style dropdown panel
          Mobile (<768px): Premium top sheet
          ═══════════════════════════════════════════════════════════════════════ */}
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
