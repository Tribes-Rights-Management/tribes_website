import { Link } from "react-router-dom";
import { CONTENT_CONTAINER_CLASS } from "@/lib/layout";
import { THEME_DARK_BG } from "@/lib/theme";

interface HeroProps {
  /** If provided, renders a button that scrolls to the anchor. Otherwise renders a Link to /our-approach */
  contactAnchor?: string;
}

/**
 * HERO COMPONENT — GLOBAL STANDARD (LOCKED)
 * 
 * This hero is used on root (/) and /marketing pages only.
 * It must be pixel-perfect identical on both.
 * 
 * Mobile behavior (LOCKED):
 * - Full viewport height (min-height: 100svh with fallbacks)
 * - Black background fills entire screen
 * - No white section visible on initial load
 * - Content vertically centered
 * 
 * Desktop behavior (LOCKED):
 * - Full viewport height minus header
 * - Content vertically centered
 * 
 * Typography (LOCKED - do not modify):
 * - H1: 42px/58px/76px, font-medium, -0.015em tracking
 * - Eyebrow: 14px, uppercase, 0.08em tracking, #8F8F8F
 * - Subhead: 16px/18px, font-light, #C7C7C7
 */
export function Hero({ contactAnchor }: HeroProps) {
  const scrollToContact = () => {
    if (contactAnchor) {
      document.getElementById(contactAnchor)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section 
      data-theme="dark"
      className="relative flex flex-col"
      style={{ 
        backgroundColor: THEME_DARK_BG,
        width: '100%',
      }}
    >
      
      {/* Content container - uses identical sizing to header for perfect left-rail alignment */}
      {/* Intrinsic height via generous vertical padding — no viewport units */}
      <div className={`${CONTENT_CONTAINER_CLASS} py-24 md:py-32 lg:py-40`}>
        <div className="max-w-[640px]">
          {/* Eyebrow - medium gray for subtle visibility */}
          <p className="text-sm font-medium tracking-[0.08em] text-[#8F8F8F] mb-14">
            TRIBES
          </p>

          {/* H1 - Pure white, slightly larger */}
          <h1 className="text-[42px] md:text-[58px] lg:text-[76px] font-medium leading-[1.08] tracking-[-0.015em] text-[#FFFFFF] mb-8">
            Rights management, built to last.
          </h1>

          {/* Secondary supporting line - brighter for visibility */}
          <p className="text-base md:text-lg font-light text-[#C7C7C7] leading-[1.5] tracking-[0.01em] mb-16">
            Publishing administration, built for precision.
          </p>

          {/* Divider */}
          <div className="w-16 h-px bg-white/15 mb-10" />

          {/* CTA Link - medium gray, hover to white */}
          {contactAnchor ? (
            <button
              onClick={scrollToContact}
              className="text-sm text-[#8F8F8F] hover:text-[#FFFFFF] transition-colors duration-150 ease-out underline underline-offset-4 decoration-[#8F8F8F]/40 hover:decoration-[#FFFFFF]/40"
            >
              Contact
            </button>
          ) : (
            <Link
              to="/our-approach"
              className="text-xs text-[#8F8F8F] hover:text-[#FFFFFF] transition-colors duration-150 ease-out underline underline-offset-4 decoration-[#8F8F8F]/40 hover:decoration-[#FFFFFF]/40"
            >
              Our approach
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
