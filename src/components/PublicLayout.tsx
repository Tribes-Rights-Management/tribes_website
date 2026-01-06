import { Link, useLocation } from "react-router-dom";
import { ReactNode, useEffect } from "react";
import { getCopyrightLine } from "@/lib/copyright";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";

interface PublicLayoutProps {
  children: ReactNode;
}

function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  
  const cycleTheme = () => {
    if (theme === "system") {
      setTheme("light");
    } else if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("system");
    }
  };

  const label = theme === "system" ? "Auto" : theme === "dark" ? "Dark" : "Light";

  return (
    <button
      onClick={cycleTheme}
      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
      aria-label={`Current theme: ${label}. Click to change.`}
    >
      {label}
    </button>
  );
}

function PublicLayoutInner({ children }: PublicLayoutProps) {
  const location = useLocation();
  const copyrightText = getCopyrightLine();
  const { resolvedTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b ${
        resolvedTheme === "dark" 
          ? "bg-background/90 border-border" 
          : "bg-background/80 border-border/50"
      }`}>
        <nav className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="text-sm font-medium text-foreground">
              Tribes Rights Management
            </Link>
            <div className="flex items-center gap-6">
              <Link 
                to="/services" 
                className={`text-sm transition-colors ${
                  location.pathname === "/services" 
                    ? "text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Services
              </Link>
              <Link 
                to="/contact" 
                className={`text-sm transition-colors ${
                  location.pathname === "/contact" 
                    ? "text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Contact
              </Link>
              <span className="w-px h-4 bg-border" />
              <Link 
                to="/auth" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/auth?request=true" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Request Access
              </Link>
              <span className="w-px h-4 bg-border" />
              <ThemeToggle />
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

      {/* Footer */}
      <footer className="border-t border-border py-8">
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

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <ThemeProvider>
      <PublicLayoutInner>{children}</PublicLayoutInner>
    </ThemeProvider>
  );
}
