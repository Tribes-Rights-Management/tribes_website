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
  const [isFooterDark, setIsFooterDark] = useState(false);
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

      // Detect dark sections by ID
      const darkSection = document.getElementById("how-it-works");
      
      if (darkSection) {
        const rect = darkSection.getBoundingClientRect();
        const headerHeight = NAV_SIZES.header.mobile;
        const viewportHeight = window.innerHeight;
        
        // Header is over dark section when section top is above header bottom and section bottom is below header top
        const isHeaderOverDark = rect.top <= headerHeight && rect.bottom >= 0;
        setIsOverDarkSection(isHeaderOverDark);
        
        // Footer is over dark section when section bottom is near or past viewport bottom
        const isFooterOverDark = rect.bottom >= viewportHeight - 100 && rect.top < viewportHeight;
        setIsFooterDark(isFooterOverDark);
      } else {
        setIsOverDarkSection(false);
        setIsFooterDark(false);
      }
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
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-[120ms] ease-out ${
          isHeaderDark 
            ? "bg-[#111214] border-b border-white/[0.08]" 
            : "bg-background border-b border-border/50"
        }`}
        style={{ 
          paddingTop: "env(safe-area-inset-top)",
          height: NAV_SIZES.header.mobile,
        }}
        data-surface={isHeaderDark ? "dark" : "light"}
      >
        <nav 
          className="max-w-[1200px] mx-auto h-full flex items-center"
          style={{
            paddingLeft: NAV_SIZES.headerPadding.horizontal.mobile,
            paddingRight: NAV_SIZES.headerPadding.horizontal.mobile,
          }}
        >
          {/* Mobile Header (≤768px) */}
          <div className="flex md:hidden items-center justify-between h-full">
            {/* Logo — Locked sizing from brand.ts */}
            <Link 
              to="/" 
              className={`transition-colors duration-[150ms] ${
                isHeaderDark ? "text-white/[0.88]" : "text-foreground"
              }`}
              style={{
                fontSize: LOGO_SIZES.header.mobile.fontSize,
                fontWeight: LOGO_SIZES.header.mobile.fontWeight,
                letterSpacing: LOGO_SIZES.header.mobile.letterSpacing,
              }}
            >
              {BRAND.wordmark}
            </Link>
            
            <div className="flex items-center gap-2">
              {/* Primary CTA — Neutral, compact button */}
              <Link 
                to="/auth?request=true" 
                className={`text-xs font-medium px-3 rounded transition-colors duration-[150ms] flex items-center border ${
                  isHeaderDark 
                    ? "border-white/20 bg-white/10 text-white/[0.82] hover:bg-white/15" 
                    : "border-border bg-muted text-foreground hover:bg-muted/80"
                }`}
                style={{ 
                  minHeight: NAV_SIZES.tapTarget.min,
                  height: NAV_SIZES.tapTarget.min,
                }}
              >
                Request Access
              </Link>
              
              {/* Hamburger — Opens sheet */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <button
                    className={`flex items-center justify-center transition-colors duration-[150ms] ${
                      isHeaderDark 
                        ? "text-white/[0.88] hover:text-white" 
                        : "text-foreground hover:text-foreground/70"
                    }`}
                    style={{ 
                      minHeight: NAV_SIZES.tapTarget.min,
                      minWidth: NAV_SIZES.tapTarget.min,
                    }}
                    aria-label="Open menu"
                  >
                    <Menu className="h-5 w-5" />
                  </button>
                </SheetTrigger>
                
                {/* Mobile Menu Sheet — Generous spacing, large tap targets */}
                <SheetContent 
                  side="right" 
                  className="w-[280px] bg-background border-l border-border p-0"
                >
                  <nav className="flex flex-col pt-16 px-6">
                    <Link 
                      to="/services" 
                      className={`text-sm transition-colors flex items-center ${
                        location.pathname === "/services"
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      style={{ minHeight: NAV_SIZES.tapTarget.comfortable }}
                    >
                      Services
                    </Link>
                    <Link 
                      to="/contact" 
                      className={`text-sm transition-colors flex items-center ${
                        location.pathname === "/contact"
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      style={{ minHeight: NAV_SIZES.tapTarget.comfortable }}
                    >
                      Contact
                    </Link>
                    
                    <div className="h-px bg-border my-4" />
                    
                    <Link 
                      to="/auth" 
                      className={`text-sm transition-colors flex items-center ${
                        location.pathname === "/auth"
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      style={{ minHeight: NAV_SIZES.tapTarget.comfortable }}
                    >
                      Sign In
                    </Link>
                    <Link 
                      to="/auth?request=true" 
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center"
                      style={{ minHeight: NAV_SIZES.tapTarget.comfortable }}
                    >
                      Request Access
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Desktop/Tablet Header (>768px) */}
          <div className="hidden md:flex items-center justify-between h-full w-full" style={{ paddingLeft: NAV_SIZES.headerPadding.horizontal.desktop - NAV_SIZES.headerPadding.horizontal.mobile, paddingRight: NAV_SIZES.headerPadding.horizontal.desktop - NAV_SIZES.headerPadding.horizontal.mobile }}>
            {/* Logo — Full name on desktop */}
            <Link 
              to="/" 
              className={`transition-opacity duration-[120ms] ease-out focus-ring ${
                isHeaderDark ? "text-white/[0.88] hover:opacity-88" : "text-foreground hover:opacity-88"
              }`}
              style={{
                fontSize: LOGO_SIZES.header.desktop.fontSize,
                fontWeight: LOGO_SIZES.header.desktop.fontWeight,
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
                className={`text-sm transition-opacity duration-[120ms] ease-out focus-ring ${
                  isHeaderDark 
                    ? "text-white/[0.48] hover:opacity-88" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign In
              </Link>
              <Link 
                to="/auth?request=true" 
                className={`text-sm transition-opacity duration-[120ms] ease-out focus-ring ${
                  isHeaderDark 
                    ? "text-white/[0.48] hover:opacity-88" 
                    : "text-muted-foreground hover:opacity-88"
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
          FOOTER — Context-Aware Surface Switching
          Automatically adapts to dark content sections with subtle crossfade.
          ═══════════════════════════════════════════════════════════════════════════ */}
      <footer 
        className={`py-8 transition-colors duration-[120ms] ease-out ${
          isFooterDark 
            ? "bg-[#111214] border-t border-white/[0.08]" 
            : "bg-background border-t border-border"
        }`}
        data-surface={isFooterDark ? "dark" : "light"}
      >
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <p 
            className={`tracking-[0.02em] mb-4 transition-colors duration-[120ms] ease-out ${
              isFooterDark ? "text-white/[0.48]" : "text-muted-foreground/60"
            }`}
            style={{ fontSize: LOGO_SIZES.footer.fontSize }}
          >
            Built for creators. Powered by precision.
          </p>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p 
              className={`transition-colors duration-[120ms] ease-out ${
                isFooterDark ? "text-white/[0.64]" : "text-muted-foreground"
              }`}
              style={{ fontSize: LOGO_SIZES.footer.fontSize }}
            >
              {copyrightText}
            </p>
            <div className="flex items-center gap-6">
              <Link 
                to="/privacy" 
                className={`text-xs transition-opacity duration-[120ms] ease-out focus-ring ${
                  isFooterDark 
                    ? "text-white/[0.48] hover:opacity-88" 
                    : "text-muted-foreground hover:opacity-88"
                }`}
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className={`text-xs transition-opacity duration-[120ms] ease-out focus-ring ${
                  isFooterDark 
                    ? "text-white/[0.48] hover:opacity-88" 
                    : "text-muted-foreground hover:opacity-88"
                }`}
              >
                Terms of Use
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
