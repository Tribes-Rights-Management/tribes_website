import { Link, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { getCopyrightLine } from "@/lib/copyright";

interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const location = useLocation();
  const copyrightText = getCopyrightLine();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation - Near-black header (#111214) */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#111214] border-b border-white/[0.06]">
        <nav className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="text-sm font-medium text-white/90">
              Tribes Rights Management
            </Link>
            <div className="flex items-center gap-6">
              <Link 
                to="/services" 
                className={`text-sm transition-colors ${
                  location.pathname === "/services" 
                    ? "text-white" 
                    : "text-white/60 hover:text-white"
                }`}
              >
                Services
              </Link>
              <Link 
                to="/contact" 
                className={`text-sm transition-colors ${
                  location.pathname === "/contact" 
                    ? "text-white" 
                    : "text-white/60 hover:text-white"
                }`}
              >
                Contact
              </Link>
              <span className="w-px h-4 bg-white/[0.12]" />
              <Link 
                to="/auth" 
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/auth?request=true" 
                className="text-sm text-white/60 hover:text-white transition-colors"
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
