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
     Desktop header adapts to content sections.
     Mobile header is always dark for consistency.
     ═══════════════════════════════════════════════════════════════════════════ */
  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = window.innerHeight * 0.6;
      setIsScrolled(window.scrollY > scrollThreshold);

      const darkSections = [
        document.getElementById("asset-management"),
      ].filter(Boolean) as HTMLElement[];
      
      const headerHeight = NAV_SIZES.header.mobile;
      
      const isHeaderOverAnyDark = darkSections.some(section => {
        const rect = section.getBoundingClientRect();
        return rect.top <= headerHeight && rect.bottom >= 0;
      });
      setIsOverDarkSection(isHeaderOverAnyDark);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isHeaderDark = !isScrolled || isOverDarkSection;

  const navLinkClass = (path: string) => {
    const base = "transition-opacity duration-[120ms] ease-out";
    if (!isHeaderDark) {
      return `${base} ${location.pathname === path
        ? "text-foreground"
        : "text-muted-foreground hover:text-foreground"}`;
    }
    return `${base} ${location.pathname === path
      ? "text-white/90"
      : "text-white/60 hover:text-white"}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ═══════════════════════════════════════════════════════════════════════════
          HEADER — Apple-grade Mobile Navigation
          Mobile: Always dark, backdrop blur, 60px height, wordmark + hamburger only
          Desktop: Contextual surface switching based on scroll position
          ═══════════════════════════════════════════════════════════════════════════ */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-150 ease-out
          bg-[#111214]/95 backdrop-blur-md border-b border-white/[0.06]
          ${isHeaderDark 
            ? "md:bg-[#111214]/95 md:backdrop-blur-md md:border-white/[0.06]" 
            : "md:bg-background/95 md:backdrop-blur-md md:border-border/40"
          }`}
        style={{ 
          paddingTop: "env(safe-area-inset-top)",
          height: 60,
        }}
      >
        <nav 
          className="max-w-[1200px] mx-auto h-full flex items-center justify-between px-4 md:px-6 lg:px-8"
        >
          {/* ═══════════════════════════════════════════════════════════════════════
              MOBILE HEADER (≤768px) — Wordmark + Hamburger Only
              No CTAs, no buttons. Clean system UI bar aesthetic.
              ═══════════════════════════════════════════════════════════════════════ */}
          <div className="flex md:hidden items-center justify-between w-full h-full">
            <Link 
              to="/" 
              className="font-semibold tracking-tight text-white"
              style={{
                fontSize: 17,
                letterSpacing: "-0.01em",
              }}
            >
              {BRAND.wordmark}
            </Link>
            
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button
                  className="flex items-center justify-center text-white/80 hover:text-white transition-colors duration-150"
                  style={{ 
                    height: 44,
                    width: 44,
                    marginRight: -8,
                  }}
                  aria-label="Open menu"
                >
                  <Menu className="h-[22px] w-[22px]" />
                </button>
              </SheetTrigger>
              
              {/* ═══════════════════════════════════════════════════════════════════
                  MOBILE MENU — Institutional Control Surface
                  Typography: 16px regular/medium only. No bold, no mixed sizes.
                  Spacing: 28-32px between groups. Generous top/bottom padding.
                  Animation: 200ms ease-out slide. Closes via overlay or hamburger.
                  ═══════════════════════════════════════════════════════════════════ */}
              <SheetContent 
                side="right" 
                className="w-[280px] bg-background border-l border-border/20 p-0 [&>button]:hidden focus:outline-none"
                style={{
                  boxShadow: "-4px 0 20px rgba(0,0,0,0.06)",
                }}
              >
                <nav className="flex flex-col pt-14 pb-10 px-6 h-full">
                  {/* Primary Navigation — 16px, regular weight */}
                  <div className="space-y-0">
                    <Link 
                      to="/services" 
                      className={`text-[16px] transition-colors duration-150 flex items-center ${
                        location.pathname === "/services"
                          ? "text-foreground"
                          : "text-foreground/65 hover:text-foreground"
                      }`}
                      style={{ minHeight: 52 }}
                    >
                      Services
                    </Link>
                    <Link 
                      to="/contact" 
                      className={`text-[16px] transition-colors duration-150 flex items-center ${
                        location.pathname === "/contact"
                          ? "text-foreground"
                          : "text-foreground/65 hover:text-foreground"
                      }`}
                      style={{ minHeight: 52 }}
                    >
                      Contact
                    </Link>
                  </div>
                  
                  {/* Spacer — Use space, not lines */}
                  <div className="h-7" />
                  
                  {/* Account Actions — 16px, regular weight */}
                  <div className="space-y-0">
                    <Link 
                      to="/auth" 
                      className={`text-[16px] transition-colors duration-150 flex items-center ${
                        location.pathname === "/auth"
                          ? "text-foreground"
                          : "text-foreground/65 hover:text-foreground"
                      }`}
                      style={{ minHeight: 52 }}
                    >
                      Sign In
                    </Link>
                    <Link 
                      to="/auth?request=true" 
                      className="text-[16px] text-foreground/65 hover:text-foreground transition-colors duration-150 flex items-center"
                      style={{ minHeight: 52 }}
                    >
                      Request Access
                    </Link>
                  </div>
                  
                  {/* Spacer — Generous breathing room */}
                  <div className="flex-1 min-h-8" />
                  
                  {/* Legal Links — 14px, secondary text, bottom-aligned */}
                  <div className="space-y-0 pt-6 border-t border-border/30">
                    <Link 
                      to="/privacy" 
                      className="text-[14px] text-muted-foreground/50 hover:text-muted-foreground/70 transition-colors duration-150 flex items-center"
                      style={{ minHeight: 44 }}
                    >
                      Privacy Policy
                    </Link>
                    <Link 
                      to="/terms" 
                      className="text-[14px] text-muted-foreground/50 hover:text-muted-foreground/70 transition-colors duration-150 flex items-center"
                      style={{ minHeight: 44 }}
                    >
                      Terms of Use
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════════
              DESKTOP HEADER (>768px) — Full navigation
              ═══════════════════════════════════════════════════════════════════════ */}
          <div className="hidden md:flex items-center justify-between h-full w-full">
            <Link 
              to="/" 
              className={`font-semibold tracking-tight transition-colors duration-150 ${
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
              <span className={`w-px h-4 transition-colors duration-150 ${
                isHeaderDark ? "bg-white/10" : "bg-border"
              }`} />
              <Link 
                to="/auth" 
                className={`text-sm transition-colors duration-150 ${
                  isHeaderDark 
                    ? "text-white/60 hover:text-white" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign In
              </Link>
              <Link 
                to="/auth?request=true" 
                className={`text-sm transition-colors duration-150 ${
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

      {/* Main Content */}
      <main>{children}</main>

      {/* ═══════════════════════════════════════════════════════════════════════════
          FOOTER — Single Canonical Access CTA + Utility Footer
          Dark background creates rhythm break from light content sections.
          One decision point. No duplication. Institutional tone.
          ═══════════════════════════════════════════════════════════════════════════ */}
      <footer 
        className="bg-[#111214]"
        data-surface="dark"
      >
        {/* Primary Access Section — The single canonical CTA */}
        <div className="py-16 md:py-24 lg:py-28">
          <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12">
            <div className="max-w-lg">
              {/* Eyebrow */}
              <p 
                className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/40 mb-5"
              >
                Access
              </p>
              
              {/* Headline */}
              <h2 
                className="text-white font-medium tracking-tight mb-4"
                style={{ 
                  fontSize: "clamp(22px, 3vw, 28px)",
                  lineHeight: 1.2,
                  letterSpacing: "-0.015em",
                }}
              >
                Request access to Tribes.
              </h2>
              
              {/* Supporting copy */}
              <p 
                className="text-white/50 mb-8"
                style={{ 
                  fontSize: 15,
                  lineHeight: 1.65,
                }}
              >
                Approved clients receive a secure login for submissions, documentation, and clearance status.
              </p>
              
              {/* Actions — Clear hierarchy */}
              <div className="flex flex-wrap items-center gap-4 md:gap-5">
                {/* Primary — Solid button */}
                <Link 
                  to="/auth?request=true"
                  className="inline-flex items-center justify-center px-5 py-2.5 bg-white text-[#111214] font-medium text-sm rounded transition-all duration-150 hover:bg-white/90"
                  style={{ minHeight: 44 }}
                >
                  Request Access
                </Link>
                
                {/* Secondary — Text link */}
                <Link 
                  to="/auth"
                  className="inline-flex items-center justify-center px-2 py-2.5 text-sm text-white/50 transition-colors duration-150 hover:text-white/70"
                  style={{ minHeight: 44 }}
                >
                  Sign In
                </Link>
              </div>
              
              {/* Tertiary link */}
              <div className="mt-8">
                <Link 
                  to="/how-licensing-works"
                  className="text-[13px] text-white/35 transition-colors duration-150 hover:text-white/50"
                >
                  Learn how licensing works
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* ═══════════════════════════════════════════════════════════════════════
            UTILITY FOOTER — Minimal, mobile-first, no social icons
            ═══════════════════════════════════════════════════════════════════════ */}
        <div className="border-t border-white/[0.05] py-8 md:py-10">
          <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12">
            {/* Mobile: Stacked layout */}
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              {/* Left: Brand + Copyright */}
              <div className="flex flex-col gap-2">
                <p className="text-[13px] font-medium text-white/50 tracking-tight">
                  {BRAND.wordmark}
                </p>
                <p className="text-[12px] text-white/30 leading-relaxed">
                  {copyrightText}
                </p>
              </div>
              
              {/* Right: Legal links — Large tap targets on mobile */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <Link 
                  to="/privacy" 
                  className="text-[13px] text-white/35 transition-colors duration-150 hover:text-white/55 py-2"
                >
                  Privacy Policy
                </Link>
                <Link 
                  to="/terms" 
                  className="text-[13px] text-white/35 transition-colors duration-150 hover:text-white/55 py-2"
                >
                  Terms of Use
                </Link>
                <Link 
                  to="/contact" 
                  className="text-[13px] text-white/35 transition-colors duration-150 hover:text-white/55 py-2"
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
