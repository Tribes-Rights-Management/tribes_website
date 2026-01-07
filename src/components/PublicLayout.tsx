import { Link, useLocation } from "react-router-dom";
import { ReactNode, useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { BRAND, LOGO_SIZES, NAV_SIZES } from "@/lib/brand";
import { LegalRow } from "@/components/LegalRow";
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
      {/* ═══════════════════════════════════════════════════════════════════════════
          MOBILE HEADER: Solid background, no blur/transparency, passive sticky.
          DESKTOP HEADER: Contextual surface switching based on scroll position.
          ═══════════════════════════════════════════════════════════════════════════ */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50
          bg-[#111214] border-b border-white/[0.08]
          ${isHeaderDark 
            ? "md:bg-[#111214] md:border-white/[0.08]" 
            : "md:bg-background md:border-border/50"
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
                className="w-[280px] bg-background border-l border-border/10 p-0 [&>button]:hidden focus:outline-none"
                style={{
                  boxShadow: "-2px 0 12px rgba(0,0,0,0.04)",
                }}
              >
                <nav className="flex flex-col pt-5 pb-10 px-6 h-full">
                  {/* Close — quiet, top-right */}
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[13px] text-muted-foreground/50 hover:text-muted-foreground/70 transition-colors duration-150 self-end mb-10"
                    style={{ letterSpacing: "0.01em" }}
                  >
                    Close
                  </button>
                  
                  {/* Primary Navigation */}
                  <div>
                    <Link 
                      to="/licensing" 
                      className={`text-[15px] transition-colors duration-150 flex items-center ${
                        location.pathname === "/licensing"
                          ? "text-foreground"
                          : "text-foreground/80 hover:text-foreground"
                      }`}
                      style={{ 
                        minHeight: 46,
                        letterSpacing: "0.005em",
                      }}
                    >
                      Request Licensing Access
                    </Link>
                    <Link 
                      to="/inquire" 
                      className={`text-[15px] transition-colors duration-150 flex items-center ${
                        location.pathname === "/inquire"
                          ? "text-foreground/70"
                          : "text-foreground/55 hover:text-foreground/75"
                      }`}
                      style={{ 
                        minHeight: 46,
                        letterSpacing: "0.005em",
                      }}
                    >
                      Inquire About Services
                    </Link>
                    <Link 
                      to="/services" 
                      className={`text-[15px] transition-colors duration-150 flex items-center ${
                        location.pathname === "/services"
                          ? "text-foreground/70"
                          : "text-foreground/55 hover:text-foreground/75"
                      }`}
                      style={{ 
                        minHeight: 46,
                        letterSpacing: "0.005em",
                      }}
                    >
                      Services
                    </Link>
                    <Link 
                      to="/contact" 
                      className={`text-[15px] transition-colors duration-150 flex items-center ${
                        location.pathname === "/contact"
                          ? "text-foreground/70"
                          : "text-foreground/55 hover:text-foreground/75"
                      }`}
                      style={{ 
                        minHeight: 46,
                        letterSpacing: "0.005em",
                      }}
                    >
                      Contact
                    </Link>
                  </div>
                  
                  {/* Deliberate gap before utility actions */}
                  <div className="h-10" />
                  
                  {/* Utility — Client Sign In only */}
                  <div>
                    <Link 
                      to="/auth" 
                      className={`text-[15px] transition-colors duration-150 flex items-center ${
                        location.pathname === "/auth"
                          ? "text-foreground/70"
                          : "text-foreground/55 hover:text-foreground/75"
                      }`}
                      style={{ 
                        minHeight: 46,
                        letterSpacing: "0.005em",
                      }}
                    >
                      Client Sign In
                    </Link>
                  </div>
                  
                  {/* Flexible spacer pushes legal to bottom */}
                  <div className="flex-1 min-h-12" />
                  
                  {/* Legal Links — smaller, quieter, clear separation */}
                  <div className="pt-8">
                    <Link 
                      to="/privacy" 
                      className="text-[13px] text-muted-foreground/40 hover:text-muted-foreground/60 transition-colors duration-150 flex items-center"
                      style={{ 
                        minHeight: 40,
                        letterSpacing: "0.01em",
                      }}
                    >
                      Privacy Policy
                    </Link>
                    <Link 
                      to="/terms" 
                      className="text-[13px] text-muted-foreground/40 hover:text-muted-foreground/60 transition-colors duration-150 flex items-center"
                      style={{ 
                        minHeight: 40,
                        letterSpacing: "0.01em",
                      }}
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
                to="/licensing" 
                className={`text-sm font-medium ${navLinkClass("/licensing")}`}
              >
                Request Licensing Access
              </Link>
              <Link 
                to="/inquire" 
                className={`text-sm ${navLinkClass("/inquire")}`}
              >
                Inquire About Services
              </Link>
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
                Client Sign In
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* ═══════════════════════════════════════════════════════════════════════════
          TERMINAL ZONE — Unified Access CTA + Footer
          Single continuous dark section. No dividers. Definitive end of page.
          ═══════════════════════════════════════════════════════════════════════════ */}
      <footer 
        className="bg-[#111214]"
        data-surface="dark"
      >
        {/* Two-Path Entry Block */}
        <div className="pt-20 pb-16 md:pt-28 md:pb-20 lg:pt-32 lg:pb-24">
          <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12">
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 lg:gap-24">
              {/* Path 1: Request Licensing Access (Primary) */}
              <div>
                <h2 
                  className="text-white font-medium tracking-tight mb-4"
                  style={{ 
                    fontSize: "clamp(22px, 3vw, 28px)",
                    lineHeight: 1.2,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Request Licensing Access
                </h2>
                <p 
                  className="text-white/45 mb-4"
                  style={{ 
                    fontSize: 15,
                    lineHeight: 1.7,
                  }}
                >
                  For commercial, broadcast, or ministry use of music we administer.
                </p>
                <p 
                  className="text-white/35 mb-8"
                  style={{ 
                    fontSize: 13,
                    lineHeight: 1.6,
                  }}
                >
                  Account approval required before submitting license requests.
                </p>
                <Link 
                  to="/licensing"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#111214] font-medium text-[15px] rounded transition-all duration-150 hover:bg-white/90"
                  style={{ minHeight: 48 }}
                >
                  Request Licensing Access
                </Link>
              </div>
              
              {/* Path 2: Inquire About Services (Secondary) */}
              <div>
                <h2 
                  className="text-white/80 font-medium tracking-tight mb-4"
                  style={{ 
                    fontSize: "clamp(20px, 2.5vw, 24px)",
                    lineHeight: 1.2,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Inquire About Services
                </h2>
                <p 
                  className="text-white/40 mb-8"
                  style={{ 
                    fontSize: 14,
                    lineHeight: 1.7,
                  }}
                >
                  Publishing administration, rights management, and long-term catalog support for rights holders and creators.
                </p>
                <Link 
                  to="/inquire"
                  className="inline-flex items-center justify-center px-5 py-2.5 border border-white/15 text-white/70 text-[14px] rounded transition-all duration-150 hover:border-white/30 hover:text-white/90"
                  style={{ minHeight: 44 }}
                >
                  Inquire About Services
                </Link>
              </div>
            </div>
            
            {/* Client Portal — Utility position */}
            <div className="mt-16 pt-10 border-t border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <p className="text-white/35 text-sm">
                  Existing client?
                </p>
                <Link 
                  to="/auth"
                  className="text-sm text-white/50 hover:text-white/70 transition-colors duration-150"
                >
                  Client Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* ═══════════════════════════════════════════════════════════════════════
            ADMINISTRATIVE FOOTER — Uses canonical LegalRow component
            ═══════════════════════════════════════════════════════════════════════ */}
        <div className="pt-12 pb-10 md:pt-16 md:pb-12">
          <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12">
            <LegalRow variant="dark" showBrand={true} />
          </div>
        </div>
      </footer>
    </div>
  );
}
