/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║  UNIFIED NAVIGATION SYSTEM                                                  ║
 * ║                                                                            ║
 * ║  Single navigation component for ALL breakpoints.                          ║
 * ║  - Mobile: Full-screen dropdown sheet                                       ║
 * ║  - Tablet/Desktop: Constrained dropdown panel                               ║
 * ║                                                                            ║
 * ║  Differences are container sizing ONLY — structure, logic, and content     ║
 * ║  are identical across all devices.                                          ║
 * ║                                                                            ║
 * ║  Source of truth: src/lib/navigation.ts (NAV_CONFIG)                        ║
 * ║  Spec: /docs/NAVIGATION_SPEC.md                                             ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { NAV_CONFIG, NAV_TIMING, NAV_EASING, NAV_TRANSFORM } from "@/lib/navigation";

interface UnifiedNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Unified Navigation Component
 * 
 * Renders identically on all devices with responsive container sizing:
 * - Mobile (<768px): Full-screen overlay
 * - Tablet/Desktop (≥768px): Constrained dropdown panel with blur
 * 
 * Animation timings are locked (see NAV_TIMING, NAV_EASING, NAV_TRANSFORM).
 */
export const UnifiedNavigation = forwardRef<HTMLDivElement, UnifiedNavigationProps>(
  ({ isOpen, onClose }, ref) => {
    
    // Shared nav item renderer for consistent output
    const renderNavItem = (item: typeof NAV_CONFIG.primary[0], isPrimary: boolean) => {
      const className = isPrimary ? "unified-nav-item-primary" : "unified-nav-item-action";
      
      if (item.external) {
        return (
          <a
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={className}
            role="menuitem"
          >
            {item.label}
          </a>
        );
      }
      
      return (
        <Link
          key={item.href}
          to={item.href}
          onClick={onClose}
          className={className}
          role="menuitem"
        >
          {item.label}
        </Link>
      );
    };

    return (
      <>
        {/* ═══════════════════════════════════════════════════════════════════════
            BACKDROP OVERLAY
            
            Unified backdrop for all breakpoints with synchronized transitions.
            ═══════════════════════════════════════════════════════════════════════ */}
        <div
          className={`unified-nav-backdrop fixed inset-0 z-40 ${isOpen ? '' : 'pointer-events-none'}`}
          style={{
            opacity: isOpen ? 1 : 0,
            transition: isOpen
              ? `opacity ${NAV_TIMING.dropdownOpen}ms ${NAV_EASING.open}`
              : `opacity ${NAV_TIMING.dropdownClose}ms ${NAV_EASING.close}`,
            willChange: 'opacity',
            overscrollBehavior: 'contain',
            touchAction: 'none',
          }}
          onClick={onClose}
          onWheel={(e) => e.preventDefault()}
          onTouchMove={(e) => e.preventDefault()}
          aria-hidden="true"
        />

        {/* ═══════════════════════════════════════════════════════════════════════
            NAVIGATION PANEL
            
            Single panel with responsive container sizing:
            - Mobile (<768px): Full viewport width/height
            - Tablet/Desktop (≥768px): Content-fit dropdown
            
            ╔═══════════════════════════════════════════════════════════════════════╗
            ║  DROPDOWN ANIMATION TIMINGS/EASING ARE FINAL                          ║
            ║  Do not alter without explicit instruction.                           ║
            ║                                                                       ║
            ║  Open:  opacity 0→1, translateY(-10px)→0, 320ms                       ║
            ║  Close: opacity 1→0, translateY(0)→-8px, 240ms                        ║
            ╚═══════════════════════════════════════════════════════════════════════╝
            ═══════════════════════════════════════════════════════════════════════ */}
        <nav
          ref={ref}
          className={`unified-nav-panel motion-safe:transition-[opacity,transform] ${
            isOpen ? '' : 'pointer-events-none'
          }`}
          style={{
            transformOrigin: 'top center',
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? NAV_TRANSFORM.openTo : NAV_TRANSFORM.closeTo,
            transition: isOpen
              ? `opacity ${NAV_TIMING.dropdownOpen}ms ${NAV_EASING.open}, transform ${NAV_TIMING.dropdownOpen}ms ${NAV_EASING.open}`
              : `opacity ${NAV_TIMING.dropdownClose}ms ${NAV_EASING.close}, transform ${NAV_TIMING.dropdownClose}ms ${NAV_EASING.close}`,
            willChange: 'opacity, transform',
          }}
          role="menu"
          aria-label="Navigation menu"
          aria-modal="true"
        >
          {/* Responsive container - full width on mobile, constrained on tablet+ */}
          <div className="unified-nav-container">
            {/* Close button - visible on mobile only */}
            <div className="unified-nav-header">
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-0"
                aria-label="Close menu"
              >
                Close
              </button>
            </div>

            {/* Navigation content */}
            <div className="unified-nav-content">
              {/* Primary Navigation Group */}
              <div className="unified-nav-group">
                {NAV_CONFIG.primary.map((item) => renderNavItem(item, true))}
              </div>

              {/* Divider */}
              <div className="unified-nav-divider" />

              {/* Action Items Group */}
              <div className="unified-nav-group">
                {NAV_CONFIG.actions.map((item) => renderNavItem(item, false))}
              </div>
            </div>
          </div>
        </nav>
      </>
    );
  }
);

UnifiedNavigation.displayName = "UnifiedNavigation";
