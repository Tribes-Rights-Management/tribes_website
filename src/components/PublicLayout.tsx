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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Track scroll position for header transition
  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = window.innerHeight * 0.6;
      setIsScrolled(window.scrollY > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinkClass = (path: string) => {
    if (isScrolled) {
      return location.pathname === path
        ? "text-foreground"
        : "text-muted-foreground hover:text-foreground";
    }
    return location.pathname === path
      ? "text-white"
      : "text-white/60 hover:text-white";
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ═══════════════════════════════════════════════════════════════════════════
          HEADER — Institutional Navigation
          Dark over hero, light when scrolled. Mobile uses slide-in sheet.
          Logo sizing follows locked rules in src/lib/brand.ts
          ═══════════════════════════════════════════════════════════════════════════ */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
          isScrolled 
            ? "bg-background border-b border-border/50" 
            : "bg-[#111214]/95 border-b border-white/[0.06]"
        }`}
        style={{ 
          paddingTop: "env(safe-area-inset-top)",
          height: NAV_SIZES.header.mobile,
        }}
      >
        <nav className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12 h-full">
          {/* Mobile Header (≤768px) */}
          <div className="flex md:hidden items-center justify-between h-full">
            {/* Logo — Locked sizing from brand.ts */}
            <Link 
              to="/" 
              className={`transition-colors duration-200 ${
                isScrolled ? "text-foreground" : "text-white/90"
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
                className={`text-xs font-medium px-3 rounded transition-colors duration-150 flex items-center border ${
                  isScrolled 
                    ? "border-border bg-muted text-foreground hover:bg-muted/80" 
                    : "border-white/20 bg-white/10 text-white/90 hover:bg-white/15"
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
                    className={`flex items-center justify-center transition-colors duration-150 ${
                      isScrolled 
                        ? "text-foreground hover:text-foreground/70" 
                        : "text-white/90 hover:text-white"
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
          <div className="hidden md:flex items-center justify-between h-full">
            {/* Logo — Full name on desktop */}
            <Link 
              to="/" 
              className={`transition-colors duration-200 ${
                isScrolled ? "text-foreground" : "text-white/90"
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
                className={`text-sm transition-colors duration-200 ${navLinkClass("/services")}`}
              >
                Services
              </Link>
              <Link 
                to="/contact" 
                className={`text-sm transition-colors duration-200 ${navLinkClass("/contact")}`}
              >
                Contact
              </Link>
              <span className={`w-px h-4 transition-colors duration-200 ${
                isScrolled ? "bg-border" : "bg-white/[0.12]"
              }`} />
              <Link 
                to="/auth" 
                className={`text-sm transition-colors duration-200 ${
                  isScrolled 
                    ? "text-muted-foreground hover:text-foreground" 
                    : "text-white/60 hover:text-white"
                }`}
              >
                Sign In
              </Link>
              <Link 
                to="/auth?request=true" 
                className={`text-sm transition-colors duration-200 ${
                  isScrolled 
                    ? "text-muted-foreground hover:text-foreground" 
                    : "text-white/60 hover:text-white"
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
          FOOTER
          ═══════════════════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-border py-8 bg-background">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <p 
            className="text-muted-foreground/60 tracking-[0.02em] mb-4"
            style={{ fontSize: LOGO_SIZES.footer.fontSize }}
          >
            Built for creators. Powered by precision.
          </p>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p 
              className="text-muted-foreground"
              style={{ fontSize: LOGO_SIZES.footer.fontSize }}
            >
              {copyrightText}
            </p>
            <div className="flex items-center gap-6">
              <Link 
                to="/privacy" 
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
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
