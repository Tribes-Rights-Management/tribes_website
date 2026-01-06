import { Link, useLocation } from "react-router-dom";
import { ReactNode, useState, useEffect } from "react";
import { getCopyrightLine } from "@/lib/copyright";
import { Menu } from "lucide-react";
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
      // Transition after scrolling past approximately the hero height
      const scrollThreshold = window.innerHeight * 0.6;
      setIsScrolled(window.scrollY > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state
    
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
      {/* Navigation - Transitions from dark to light */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          isScrolled 
            ? "bg-background border-b border-border/50" 
            : "bg-[#111214]/95 border-b border-white/[0.06]"
        }`}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <nav className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12">
          {/* Mobile Header (≤768px) */}
          <div className="flex md:hidden items-center justify-between h-14">
            <Link 
              to="/" 
              className={`text-sm font-semibold tracking-wide transition-colors duration-300 ${
                isScrolled ? "text-foreground" : "text-white/90"
              }`}
            >
              TRIBES
            </Link>
            <div className="flex items-center gap-3">
              <Link 
                to="/auth?request=true" 
                className={`text-xs font-medium px-3 py-2 rounded transition-colors duration-300 min-h-[44px] flex items-center ${
                  isScrolled 
                    ? "bg-foreground text-background hover:bg-foreground/90" 
                    : "bg-white text-[#111214] hover:bg-white/90"
                }`}
              >
                Request Access
              </Link>
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <button
                    className={`p-2 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors duration-300 ${
                      isScrolled 
                        ? "text-foreground hover:text-foreground/80" 
                        : "text-white/90 hover:text-white"
                    }`}
                    aria-label="Open menu"
                  >
                    <Menu className="h-5 w-5" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] bg-background border-l border-border">
                  <nav className="flex flex-col gap-1 mt-8">
                    <Link 
                      to="/services" 
                      className={`text-sm py-3 px-2 rounded transition-colors ${
                        location.pathname === "/services"
                          ? "text-foreground bg-muted"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      Services
                    </Link>
                    <Link 
                      to="/contact" 
                      className={`text-sm py-3 px-2 rounded transition-colors ${
                        location.pathname === "/contact"
                          ? "text-foreground bg-muted"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      Contact
                    </Link>
                    <div className="h-px bg-border my-2" />
                    <Link 
                      to="/auth" 
                      className={`text-sm py-3 px-2 rounded transition-colors ${
                        location.pathname === "/auth"
                          ? "text-foreground bg-muted"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      Sign In
                    </Link>
                    <Link 
                      to="/auth?request=true" 
                      className="text-sm py-3 px-2 rounded text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    >
                      Request Access
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Desktop/Tablet Header (>768px) */}
          <div className="hidden md:flex items-center justify-between h-14">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors duration-300 ${
                isScrolled ? "text-foreground" : "text-white/90"
              }`}
            >
              Tribes Rights Management
            </Link>
            <div className="flex items-center gap-6">
              <Link 
                to="/services" 
                className={`text-sm transition-colors duration-300 ${navLinkClass("/services")}`}
              >
                Services
              </Link>
              <Link 
                to="/contact" 
                className={`text-sm transition-colors duration-300 ${navLinkClass("/contact")}`}
              >
                Contact
              </Link>
              <span className={`w-px h-4 transition-colors duration-300 ${
                isScrolled ? "bg-border" : "bg-white/[0.12]"
              }`} />
              <Link 
                to="/auth" 
                className={`text-sm transition-colors duration-300 ${
                  isScrolled 
                    ? "text-muted-foreground hover:text-foreground" 
                    : "text-white/60 hover:text-white"
                }`}
              >
                Sign In
              </Link>
              <Link 
                to="/auth?request=true" 
                className={`text-sm transition-colors duration-300 ${
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
          MAIN CONTENT - Page components render here
          IMPORTANT: Do not render <footer> or footer-like content inside page components.
          Footer belongs to this layout only.
          ═══════════════════════════════════════════════════════════════════════════ */}
      <main>{children}</main>

      {/* Footer - Light background */}
      <footer className="border-t border-border py-8 bg-background">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <p className="text-xs text-muted-foreground/60 tracking-[0.02em] mb-4">
            Built for creators. Powered by precision.
          </p>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-xs text-muted-foreground">
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
