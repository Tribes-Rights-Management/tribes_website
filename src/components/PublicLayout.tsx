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
          className="max-w-[1200px] mx-auto h-full flex items-center justify-between"
          style={{ paddingLeft: 24, paddingRight: 24 }}
        >
          {/* ═══════════════════════════════════════════════════════════════════════
              UNIFIED HEADER — Minimal Navigation (All Breakpoints)
              Wordmark left, Client Sign In + Hamburger right
              ═══════════════════════════════════════════════════════════════════════ */}
          <Link 
            to="/" 
            className={`font-semibold tracking-tight transition-colors duration-150 ${
              isHeaderDark ? "text-white hover:text-white/80" : "lg:text-foreground lg:hover:text-foreground/80 text-white hover:text-white/80"
            }`}
            style={{
              fontSize: 17,
              letterSpacing: "-0.01em",
            }}
          >
            <span className="lg:hidden">{BRAND.wordmark}</span>
            <span className="hidden lg:inline">{BRAND.legalName}</span>
          </Link>
          
          <div className="flex items-center gap-5">
            {/* Client Sign In — Desktop only, restrained typography */}
            <Link 
              to="/auth" 
              className={`hidden lg:block transition-opacity duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30 ${
                location.pathname === "/auth"
                  ? isHeaderDark ? "text-white/[0.95]" : "text-foreground/95"
                  : isHeaderDark ? "text-white/[0.78] hover:text-white/[0.95]" : "text-foreground/70 hover:text-foreground/90"
              }`}
              style={{
                fontSize: "0.8125rem",
                fontWeight: 500,
                letterSpacing: "0.02em",
              }}
            >
              Client Sign In
            </Link>
            
            {/* Hamburger Menu — All breakpoints */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button
                  className={`flex items-center justify-center transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/30 ${
                    isHeaderDark ? "text-white/80 hover:text-white" : "lg:text-foreground/70 lg:hover:text-foreground text-white/80 hover:text-white"
                  }`}
                  style={{ 
                    height: 44,
                    width: 44,
                    marginRight: -10,
                  }}
                  aria-label="Open menu"
                >
                  <Menu className="h-[20px] w-[20px]" />
                </button>
              </SheetTrigger>
              
              {/* ═══════════════════════════════════════════════════════════════════
                  MENU DRAWER — Institutional Control Surface
                  Order: Services, Request Licensing Access, Inquire About Services,
                         Contact, divider, Privacy Policy, Terms of Use
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
                    className="text-[13px] text-muted-foreground/50 hover:text-muted-foreground/70 transition-colors duration-150 self-end mb-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/20"
                    style={{ letterSpacing: "0.01em" }}
                  >
                    Close
                  </button>
                  
                  {/* ═══════════════════════════════════════════════════════════
                      PRIMARY NAVIGATION
                      ═══════════════════════════════════════════════════════════ */}
                  <div>
                    <Link 
                      to="/services" 
                      className={`transition-colors duration-150 flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/20 ${
                        location.pathname === "/services"
                          ? "text-foreground"
                          : "text-foreground/70 hover:text-foreground"
                      }`}
                      style={{ 
                        minHeight: 46,
                        fontSize: "0.9375rem",
                        letterSpacing: "0.005em",
                      }}
                    >
                      Services
                    </Link>
                    <Link 
                      to="/licensing" 
                      className={`transition-colors duration-150 flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/20 ${
                        location.pathname === "/licensing"
                          ? "text-foreground"
                          : "text-foreground/70 hover:text-foreground"
                      }`}
                      style={{ 
                        minHeight: 46,
                        fontSize: "0.9375rem",
                        letterSpacing: "0.005em",
                      }}
                    >
                      Request Licensing Access
                    </Link>
                    <Link 
                      to="/inquire" 
                      className={`transition-colors duration-150 flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/20 ${
                        location.pathname === "/inquire"
                          ? "text-foreground"
                          : "text-foreground/70 hover:text-foreground"
                      }`}
                      style={{ 
                        minHeight: 46,
                        fontSize: "0.9375rem",
                        letterSpacing: "0.005em",
                      }}
                    >
                      Inquire About Services
                    </Link>
                    <Link 
                      to="/contact" 
                      className={`transition-colors duration-150 flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/20 ${
                        location.pathname === "/contact"
                          ? "text-foreground"
                          : "text-foreground/70 hover:text-foreground"
                      }`}
                      style={{ 
                        minHeight: 46,
                        fontSize: "0.9375rem",
                        letterSpacing: "0.005em",
                      }}
                    >
                      Contact
                    </Link>
                  </div>
                  
                  {/* Divider */}
                  <div className="h-px bg-border/30 my-6" />
                  
                  {/* Legal Links */}
                  <div>
                    <Link 
                      to="/privacy" 
                      className="text-[13px] text-muted-foreground/50 hover:text-muted-foreground/70 transition-colors duration-150 flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/20"
                      style={{ 
                        minHeight: 40,
                        letterSpacing: "0.01em",
                      }}
                    >
                      Privacy Policy
                    </Link>
                    <Link 
                      to="/terms" 
                      className="text-[13px] text-muted-foreground/50 hover:text-muted-foreground/70 transition-colors duration-150 flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/20"
                      style={{ 
                        minHeight: 40,
                        letterSpacing: "0.01em",
                      }}
                    >
                      Terms of Use
                    </Link>
                  </div>
                  
                  {/* Flexible spacer pushes Client Sign In to bottom on mobile */}
                  <div className="flex-1 min-h-8 lg:hidden" />
                  
                  {/* Client Sign In — Mobile only (already in header on desktop) */}
                  <div className="lg:hidden pt-6">
                    <Link 
                      to="/auth" 
                      className={`transition-colors duration-150 flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/20 ${
                        location.pathname === "/auth"
                          ? "text-foreground"
                          : "text-foreground/85 hover:text-foreground"
                      }`}
                      style={{ 
                        minHeight: 46,
                        fontSize: "0.9375rem",
                        letterSpacing: "0.005em",
                      }}
                    >
                      Client Sign In
                    </Link>
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
              <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12">
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
          <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12">
            <LegalRow variant="dark" showBrand={true} />
          </div>
        </div>
      </footer>
    </div>
  );
}
