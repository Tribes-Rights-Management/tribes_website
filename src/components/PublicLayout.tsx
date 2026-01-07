import { Link, useLocation } from "react-router-dom";
import { ReactNode, useState, useEffect } from "react";
import { getCopyrightLine } from "@/lib/copyright";
import { Menu } from "lucide-react";
import { BRAND, LOGO_SIZES, NAV_SIZES } from "@/lib/brand";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const location = useLocation();
  const copyrightText = getCopyrightLine();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOverDarkSection, setIsOverDarkSection] = useState(false);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* ═══════════════════════════════════════════════════════════════════════════
     CONTEXTUAL SURFACE SWITCHING
     Light and dark surfaces are determined by content sections, not user toggles.
     Header and footer automatically adapt to the active section's surface.
     Portal UI is excluded from this rule and remains unchanged.
     ═══════════════════════════════════════════════════════════════════════════ */
  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = window.innerHeight * 0.6;
      setIsScrolled(window.scrollY > scrollThreshold);

      // Detect dark sections by ID - only asset-management is dark now
      const darkSections = [
        document.getElementById("asset-management"),
      ].filter(Boolean) as HTMLElement[];
      
      const headerHeight = NAV_SIZES.header.mobile;
      const viewportHeight = window.innerHeight;
      
      // Check if header is over any dark section
      const isHeaderOverAnyDark = darkSections.some(section => {
        const rect = section.getBoundingClientRect();
        return rect.top <= headerHeight && rect.bottom >= 0;
      });
      setIsOverDarkSection(isHeaderOverAnyDark);
      
      // Footer is now always dark, no contextual switching needed
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Header is in dark mode when over hero (not scrolled) or over dark section
  const isHeaderDark = !isScrolled || isOverDarkSection;

  /* ═══════════════════════════════════════════════════════════════════════════
     DARK MODE CONTRAST VALUES (WCAG AA Compliant)
     Primary: rgba(255,255,255,0.88) — Logo, primary text
     Secondary: rgba(255,255,255,0.64) — Navigation links
     Utility: rgba(255,255,255,0.48) — Inactive items
     Dividers: rgba(255,255,255,0.08)
     ═══════════════════════════════════════════════════════════════════════════ */

  const navLinkClass = (path: string) => {
    const base = "transition-opacity duration-[120ms] ease-out focus-ring";
    if (!isHeaderDark) {
      return `${base} ${location.pathname === path
        ? "text-foreground"
        : "text-muted-foreground hover:opacity-88"}`;
    }
    return `${base} ${location.pathname === path
      ? "text-white/[0.88]"
      : "text-white/[0.64] hover:opacity-88"}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ═══════════════════════════════════════════════════════════════════════════
          HEADER — Institutional Navigation
          Dark over hero, light when scrolled. Mobile uses slide-in sheet.
          Logo sizing follows locked rules in src/lib/brand.ts
          ═══════════════════════════════════════════════════════════════════════════ */}
      {/* ═══════════════════════════════════════════════════════════════════════════
          MOBILE HEADER — Institutional, Minimal
          Contains only: TRIBES wordmark (left) + hamburger menu (right)
          No buttons, pills, or promotional elements. Height: 56px.
          This pattern is locked as the default mobile navigation style.
          MOBILE: Always dark, no scroll-based style changes.
          DESKTOP: Switches based on scroll position.
          ═══════════════════════════════════════════════════════════════════════════ */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-[120ms] ease-out 
          bg-[#111214] border-b border-white/[0.08]
          ${isHeaderDark 
            ? "md:bg-[#111214] md:border-white/[0.08]" 
            : "md:bg-background md:border-border/50"
          }`}
        style={{ 
          paddingTop: "env(safe-area-inset-top)",
          height: 56,
        }}
        data-surface-mobile="dark"
        data-surface-desktop={isHeaderDark ? "dark" : "light"}
      >
        <nav 
          className="max-w-[1200px] mx-auto h-full flex items-center justify-between px-4 md:px-6 lg:px-8"
        >
          {/* Mobile Header (≤768px) — Wordmark + Hamburger only, ALWAYS dark */}
          <div className="flex md:hidden items-center justify-between w-full h-full">
            {/* TRIBES Wordmark — Always white on mobile */}
            <Link 
              to="/" 
              className="font-semibold tracking-tight transition-colors duration-[120ms] text-white"
              style={{
                fontSize: 18,
                letterSpacing: "-0.01em",
              }}
            >
              {BRAND.wordmark}
            </Link>
            
            {/* Hamburger Menu — Opens right-side sheet */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button
                  className="flex items-center justify-center transition-colors duration-[120ms] text-white hover:text-white/80"
                  style={{ 
                    minHeight: 44,
                    minWidth: 44,
                  }}
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              
              {/* Mobile Menu Sheet — Right-side, not full-screen */}
              <SheetContent 
                side="right" 
                className="w-[280px] bg-background border-l border-border p-0"
              >
                <nav className="flex flex-col pt-16 px-6">
                  {/* Primary Navigation */}
                  <Link 
                    to="/services" 
                    className={`text-sm transition-colors duration-[120ms] flex items-center ${
                      location.pathname === "/services"
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    style={{ minHeight: 48 }}
                  >
                    Services
                  </Link>
                  <Link 
                    to="/contact" 
                    className={`text-sm transition-colors duration-[120ms] flex items-center ${
                      location.pathname === "/contact"
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    style={{ minHeight: 48 }}
                  >
                    Contact
                  </Link>
                  
                  {/* Divider */}
                  <div className="h-px bg-border my-4" />
                  
                  {/* Account Actions — Text-only, no CTA styling */}
                  <Link 
                    to="/auth" 
                    className={`text-sm transition-colors duration-[120ms] flex items-center ${
                      location.pathname === "/auth"
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    style={{ minHeight: 48 }}
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/auth?request=true" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-[120ms] flex items-center"
                    style={{ minHeight: 48 }}
                  >
                    Request Access
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop/Tablet Header (>768px) */}
          <div className="hidden md:flex items-center justify-between h-full w-full">
            {/* Logo — Full legal name on desktop */}
            <Link 
              to="/" 
              className={`font-semibold tracking-tight transition-colors duration-[120ms] ${
                isHeaderDark ? "text-white hover:text-white/80" : "text-foreground hover:text-foreground/80"
              }`}
              style={{
                fontSize: LOGO_SIZES.header.desktop.fontSize,
              }}
            >
              {BRAND.legalName}
            </Link>
            
            <div className="flex items-center gap-6">
              <Link 
                to="/services" 
                className={`text-sm ${navLinkClass("/services")}`}
              >
                Services
              </Link>
              <Link 
                to="/contact" 
                className={`text-sm ${navLinkClass("/contact")}`}
              >
                Contact
              </Link>
              <span className={`w-px h-4 transition-colors duration-[120ms] ease-out ${
                isHeaderDark ? "bg-white/[0.08]" : "bg-border"
              }`} />
              <Link 
                to="/auth" 
                className={`text-sm transition-colors duration-[120ms] ${
                  isHeaderDark 
                    ? "text-white/60 hover:text-white" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign In
              </Link>
              <Link 
                to="/auth?request=true" 
                className={`text-sm transition-colors duration-[120ms] ${
                  isHeaderDark 
                    ? "text-white/60 hover:text-white" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Request Access
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════════════
          MAIN CONTENT
          ═══════════════════════════════════════════════════════════════════════════ */}
      <main>{children}</main>

      {/* ═══════════════════════════════════════════════════════════════════════════
          FOOTER — Single Canonical Access Section + Minimal Legal Footer
          One intentional decision point. No duplication. Institutional tone.
          ═══════════════════════════════════════════════════════════════════════════ */}
      <footer 
        className="bg-[#111214]"
        data-surface="dark"
      >
        {/* Primary Access Section — The single canonical CTA */}
        <div className="py-20 md:py-28 lg:py-32">
          <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12">
            <div className="max-w-md">
              {/* Headline */}
              <h2 
                className="text-white font-medium tracking-tight mb-4"
                style={{ 
                  fontSize: "clamp(24px, 3.5vw, 32px)",
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                }}
              >
                Request access.
              </h2>
              
              {/* Supporting copy — Two lines max */}
              <p 
                className="text-white/55 mb-8"
                style={{ 
                  fontSize: 15,
                  lineHeight: 1.6,
                }}
              >
                Tribes is a professional publishing administration platform. Access is reviewed before accounts are activated.
              </p>
              
              {/* Actions — Clear hierarchy */}
              <div className="flex items-center gap-6">
                {/* Primary — Solid button */}
                <Link 
                  to="/auth?request=true"
                  className="inline-flex items-center justify-center px-5 py-2.5 bg-white text-[#111214] font-medium text-sm rounded transition-all duration-[120ms] ease-out hover:bg-white/90"
                >
                  Request Access
                </Link>
                
                {/* Secondary — Text link */}
                <Link 
                  to="/auth"
                  className="text-sm text-white/50 transition-colors duration-[120ms] ease-out hover:text-white/70"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Legal Footer — Minimal, quiet, compliant */}
        <div className="border-t border-white/[0.06] py-6 md:py-8">
          <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* Copyright */}
              <p className="text-[13px] text-white/35 leading-relaxed">
                {copyrightText}
              </p>
              
              {/* Legal links — Understated */}
              <div className="flex items-center gap-5">
                <Link 
                  to="/privacy" 
                  className="text-[13px] text-white/35 transition-colors duration-[120ms] hover:text-white/50"
                >
                  Privacy
                </Link>
                <Link 
                  to="/terms" 
                  className="text-[13px] text-white/35 transition-colors duration-[120ms] hover:text-white/50"
                >
                  Terms
                </Link>
                <Link 
                  to="/contact" 
                  className="text-[13px] text-white/35 transition-colors duration-[120ms] hover:text-white/50"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
