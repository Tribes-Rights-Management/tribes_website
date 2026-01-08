import { useEffect } from "react";
import { Link } from "react-router-dom";

interface DesktopSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DesktopSidebar({ isOpen, onClose }: DesktopSidebarProps) {
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop - Apple-grade blur overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-220 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{
          backgroundColor: 'rgba(0,0,0,0.35)',
          backdropFilter: isOpen ? 'blur(10px)' : 'blur(0px)',
          WebkitBackdropFilter: isOpen ? 'blur(10px)' : 'blur(0px)',
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar Panel - 420px desktop, full-width mobile */}
      <aside
        className={`fixed top-0 right-0 h-screen w-full md:w-[420px] bg-white z-50 flex flex-col shadow-2xl transition-transform duration-220 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:duration-0 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          paddingRight: 'env(safe-area-inset-right)',
        }}
        aria-label="Desktop navigation"
      >
        {/* Header with Close button */}
        <div className="flex justify-end px-8 pt-6 pb-4">
          <button
            onClick={onClose}
            className="text-sm text-muted-foreground hover:opacity-85 transition-opacity duration-160 focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground/20 focus-visible:outline-offset-2"
          >
            Close
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col flex-1 px-8 pt-6">
          {/* Primary Section */}
          <div className="flex flex-col gap-5">
            {/* Client Sign In - Bold/emphasized */}
            <Link
              to="/auth"
              onClick={onClose}
              className="text-[15px] font-semibold text-foreground hover:opacity-85 transition-opacity duration-160"
            >
              Client Sign In
            </Link>
          </div>

          {/* Services Section */}
          <div className="mt-10">
            <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground mb-4">
              Services
            </p>
            <div className="flex flex-col gap-4">
              <Link
                to="/licensing-account"
                onClick={onClose}
                className="text-[15px] text-foreground hover:opacity-85 transition-opacity duration-160"
              >
                Request Licensing Access
              </Link>
              <Link
                to="/services/inquiry"
                onClick={onClose}
                className="text-[15px] text-foreground hover:opacity-85 transition-opacity duration-160"
              >
                Inquire About Services
              </Link>
              <Link
                to="/contact"
                onClick={onClose}
                className="text-[15px] text-foreground hover:opacity-85 transition-opacity duration-160"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border mt-10 mb-6" />

          {/* Secondary/Footer Links */}
          <div className="flex flex-col gap-3">
            <Link
              to="/privacy"
              onClick={onClose}
              className="text-sm text-muted-foreground hover:opacity-85 transition-opacity duration-160"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              onClick={onClose}
              className="text-sm text-muted-foreground hover:opacity-85 transition-opacity duration-160"
            >
              Terms of Use
            </Link>
          </div>
        </nav>
      </aside>
    </>
  );
}
