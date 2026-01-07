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
  footerVariant?: "full" | "minimal";
}

export function PublicLayout({ children, footerVariant = "full" }: PublicLayoutProps) {
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
    <div className="min-h-screen flex flex-col bg-background text-foreground">
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
            ? "lg:bg-[#111214] lg:border-white/[0.08]" 
            : "lg:bg-background lg:border-border/50"
          }`}
        style={{ 
          paddingTop: "env(safe-area-inset-top)",
          height: 64,
        }}
      >
        <nav 
          className="max-w-[1200px] mx-auto h-full flex items-center justify-between px-6 md:px-8 lg:px-14"
        >
          {/* ═══════════════════════════════════════════════════════════════════════
              UNIFIED HEADER — Minimal Navigation (All Breakpoints)
              Wordmark left, Client Sign In + Hamburger right
              ═══════════════════════════════════════════════════════════════════════ */}
          <Link 
            to="/" 
            className={`font-medium tracking-tight transition-colors duration-150 ${
              isHeaderDark ? "text-white hover:text-white/80" : "lg:text-foreground lg:hover:text-foreground/80 text-white hover:text-white/80"
            }`}
            style={{
              fontSize: 15,
              letterSpacing: "-0.005em",
              lineHeight: 1.4,
            }}
          >
            <span className="lg:hidden">{BRAND.wordmark}</span>
            <span className="hidden lg:inline">{BRAND.legalName}</span>
          </Link>
          
          <div className="flex items-center" style={{ gap: 24 }}>
            {/* Client Sign In — Desktop only, quiet typography */}
            <Link 
              to="/auth" 
              className={`hidden lg:block transition-opacity duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30 ${
                location.pathname === "/auth"
                  ? isHeaderDark ? "text-white/90" : "text-foreground/90"
                  : isHeaderDark ? "text-white/65 hover:text-white/85" : "text-foreground/60 hover:text-foreground/80"
              }`}
              style={{
                fontSize: 14,
                fontWeight: 450,
                letterSpacing: "0.005em",
                lineHeight: 1.5,
              }}
            >
              Client Sign In
            </Link>
            
            {/* Hamburger Menu — All breakpoints */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button
                  className={`flex items-center justify-center transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30 ${
                    isHeaderDark ? "text-white/65 hover:text-white/85" : "lg:text-foreground/60 lg:hover:text-foreground/80 text-white/65 hover:text-white/85"
                  }`}
                  style={{ 
                    height: 44,
                    width: 44,
                    marginRight: -10,
                  }}
                  aria-label="Open menu"
                >
                  <Menu className="h-[18px] w-[18px]" />
                </button>
              </SheetTrigger>
              
              {/* ═══════════════════════════════════════════════════════════════════
                  MENU DRAWER — Precision Institutional Panel
                  Desktop: 380px, aligned to content grid, clear hierarchy.
                  Mobile: Full width for accessibility.
                  ═══════════════════════════════════════════════════════════════════ */}
              <SheetContent 
                side="right" 
                className="w-full sm:w-[340px] lg:w-[380px] bg-background border-l border-foreground/[0.06] p-0 [&>button]:hidden focus:outline-none"
                style={{
                  boxShadow: "-4px 0 20px rgba(0,0,0,0.08)",
                }}
                onPointerDownOutside={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
              >
                <nav 
                  className="flex flex-col h-full justify-between"
                  style={{
                    paddingTop: 32,
                    paddingBottom: 32,
                    paddingLeft: 32,
                    paddingRight: 32,
                  }}
                >
                  {/* Top Section: Close + Primary Nav */}
                  <div>
                    {/* Close — aligned right, restrained, accessible */}
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-[13px] font-medium text-muted-foreground/50 hover:text-muted-foreground/80 transition-colors duration-150 mb-8 rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      style={{ 
                        letterSpacing: "0.01em",
                        minHeight: 44,
                        minWidth: 44,
                        display: "flex",
                        alignItems: "center",
                        marginLeft: "auto",
                        marginRight: -8,
                      }}
                    >
                      Close
                    </button>
                    
                    {/* ═══════════════════════════════════════════════════════════
                        PRIMARY NAVIGATION — Consistent vertical rhythm
                        Client Sign In leads (slightly stronger weight)
                        44px min-height for accessible click targets
                        ═══════════════════════════════════════════════════════════ */}
                    <div className="flex flex-col" style={{ gap: 4 }}>
                      <Link 
                        to="/auth" 
                        onClick={() => setMobileMenuOpen(false)}
                        className={`group transition-colors duration-150 flex items-center rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                          location.pathname === "/auth"
                            ? "text-foreground"
                            : "text-foreground/90 hover:text-foreground"
                        }`}
                        style={{ 
                          minHeight: 48,
                          paddingTop: 2,
                          paddingBottom: 2,
                          fontSize: 15,
                          fontWeight: 600,
                          lineHeight: 1.5,
                          letterSpacing: "0.005em",
                        }}
                      >
                        <span className="group-hover:underline group-hover:underline-offset-4 group-hover:decoration-1">
                          Client Sign In
                        </span>
                      </Link>
                      <Link 
                        to="/services" 
                        onClick={() => setMobileMenuOpen(false)}
                        className={`group transition-colors duration-150 flex items-center rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                          location.pathname === "/services"
                            ? "text-foreground"
                            : "text-foreground/75 hover:text-foreground/95"
                        }`}
                        style={{ 
                          minHeight: 48,
                          paddingTop: 2,
                          paddingBottom: 2,
                          fontSize: 15,
                          fontWeight: 500,
                          lineHeight: 1.5,
                          letterSpacing: "0.005em",
                        }}
                      >
                        <span className="group-hover:underline group-hover:underline-offset-4 group-hover:decoration-1">
                          Services
                        </span>
                      </Link>
                      <Link 
                        to="/licensing" 
                        onClick={() => setMobileMenuOpen(false)}
                        className={`group transition-colors duration-150 flex items-center rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                          location.pathname === "/licensing"
                            ? "text-foreground"
                            : "text-foreground/75 hover:text-foreground/95"
                        }`}
                        style={{ 
                          minHeight: 48,
                          paddingTop: 2,
                          paddingBottom: 2,
                          fontSize: 15,
                          fontWeight: 500,
                          lineHeight: 1.5,
                          letterSpacing: "0.005em",
                        }}
                      >
                        <span className="group-hover:underline group-hover:underline-offset-4 group-hover:decoration-1">
                          Request Licensing Access
                        </span>
                      </Link>
                      <Link 
                        to="/inquire" 
                        onClick={() => setMobileMenuOpen(false)}
                        className={`group transition-colors duration-150 flex items-center rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                          location.pathname === "/inquire"
                            ? "text-foreground"
                            : "text-foreground/75 hover:text-foreground/95"
                        }`}
                        style={{ 
                          minHeight: 48,
                          paddingTop: 2,
                          paddingBottom: 2,
                          fontSize: 15,
                          fontWeight: 500,
                          lineHeight: 1.5,
                          letterSpacing: "0.005em",
                        }}
                      >
                        <span className="group-hover:underline group-hover:underline-offset-4 group-hover:decoration-1">
                          Inquire About Services
                        </span>
                      </Link>
                      <Link 
                        to="/contact" 
                        onClick={() => setMobileMenuOpen(false)}
                        className={`group transition-colors duration-150 flex items-center rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                          location.pathname === "/contact"
                            ? "text-foreground"
                            : "text-foreground/75 hover:text-foreground/95"
                        }`}
                        style={{ 
                          minHeight: 48,
                          paddingTop: 2,
                          paddingBottom: 2,
                          fontSize: 15,
                          fontWeight: 500,
                          lineHeight: 1.5,
                          letterSpacing: "0.005em",
                        }}
                      >
                        <span className="group-hover:underline group-hover:underline-offset-4 group-hover:decoration-1">
                          Contact
                        </span>
                      </Link>
                    </div>
                  </div>
                  
                  {/* Bottom Section: Legal Links — Clearly Secondary */}
                  <div>
                    {/* Divider — subtle, increased spacing above */}
                    <div 
                      className="h-px bg-foreground/[0.06]" 
                      style={{ marginBottom: 20 }}
                    />
                    
                    {/* Legal Links — Receded but accessible */}
                    <div className="flex flex-col" style={{ gap: 2 }}>
                      <Link 
                        to="/privacy" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="group text-[12px] text-muted-foreground/45 hover:text-muted-foreground/70 transition-colors duration-150 flex items-center rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/15 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        style={{ 
                          minHeight: 36,
                          letterSpacing: "0.01em",
                        }}
                      >
                        <span className="group-hover:underline group-hover:underline-offset-4 group-hover:decoration-1">
                          Privacy Policy
                        </span>
                      </Link>
                      <Link 
                        to="/terms" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="group text-[12px] text-muted-foreground/45 hover:text-muted-foreground/70 transition-colors duration-150 flex items-center rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/15 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        style={{ 
                          minHeight: 36,
                          letterSpacing: "0.01em",
                        }}
                      >
                        <span className="group-hover:underline group-hover:underline-offset-4 group-hover:decoration-1">
                          Terms of Use
                        </span>
                      </Link>
                    </div>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* ═══════════════════════════════════════════════════════════════════════════
          TERMINAL ZONE — Unified Access CTA + Footer
          Single continuous dark section. No dividers. Definitive end of page.
          "minimal" variant: only legal row, no CTAs
          ═══════════════════════════════════════════════════════════════════════════ */}
      <footer 
        className="bg-[#111214]"
        data-surface="dark"
      >
        {footerVariant === "full" && (
          <>
            {/* ═══════════════════════════════════════════════════════════════════
                ACCESS PATHWAYS — Institutional Decision Surface
                Two equal text-based pathways. No buttons. No visual hierarchy.
                ═══════════════════════════════════════════════════════════════════ */}
            <div className="pt-16 pb-12 md:pt-20 md:pb-16">
              <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-14">
                <div className="max-w-[560px]">
                {/* ═══════════════════════════════════════════════════════════════════
                    ACCESS BLOCK — Mirrors Navigation Exactly
                    Same language, order, and styling as navigation.
                    All items are text links. No buttons. No explanatory copy.
                    ═══════════════════════════════════════════════════════════════════ */}
                  <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#8C8C8C] mb-8">
                    Access
                  </p>
                  
                  <div className="flex flex-col gap-4">
                    <Link 
                      to="/licensing"
                      className="text-[15px] text-[#B5B5B5] hover:text-white transition-colors duration-150"
                    >
                      Request Licensing Access
                    </Link>
                    <Link 
                      to="/inquire"
                      className="text-[15px] text-[#B5B5B5] hover:text-white transition-colors duration-150"
                    >
                      Inquire About Services
                    </Link>
                    <Link 
                      to="/auth"
                      className="text-[15px] text-[#EDEDED] hover:text-white transition-colors duration-150"
                    >
                      Client Sign In
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* ═══════════════════════════════════════════════════════════════════════
            ADMINISTRATIVE FOOTER — Uses canonical LegalRow component
            ═══════════════════════════════════════════════════════════════════════ */}
        <div className={`${footerVariant === "minimal" ? "pt-10 pb-8 md:pt-12 md:pb-10" : "pt-12 pb-10 md:pt-16 md:pb-12"}`}>
          <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-14">
            <LegalRow variant="dark" showBrand={true} />
          </div>
        </div>
      </footer>
    </div>
  );
}
