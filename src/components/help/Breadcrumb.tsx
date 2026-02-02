/**
 * Help Center Breadcrumb
 * Mercury-inspired with ChevronRight icons
 * "Help Center" instead of "Home", 6px gap
 */

import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

/* Portal exact colors */
const COLORS = {
  TEXT_SECONDARY: '#6B7280',
  TEXT_MUTED: '#9CA3AF',
  TEXT: '#111827',
};

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  audienceSlug: string;
}

export function Breadcrumb({ items, audienceSlug }: BreadcrumbProps) {
  return (
    <nav style={{ marginBottom: '16px' }} aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap" style={{ gap: '6px', fontSize: '13px' }}>
        <li>
          <Link 
            to={`/hc/${audienceSlug}`}
            className="transition-colors duration-150"
            style={{ color: COLORS.TEXT_SECONDARY }}
            onMouseEnter={(e) => e.currentTarget.style.color = COLORS.TEXT}
            onMouseLeave={(e) => e.currentTarget.style.color = COLORS.TEXT_SECONDARY}
          >
            Help Center
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center" style={{ gap: '6px' }}>
            <ChevronRight style={{ width: '14px', height: '14px', color: COLORS.TEXT_MUTED }} />
            {item.href ? (
              <Link 
                to={item.href}
                className="transition-colors duration-150"
                style={{ color: COLORS.TEXT_SECONDARY }}
                onMouseEnter={(e) => e.currentTarget.style.color = COLORS.TEXT}
                onMouseLeave={(e) => e.currentTarget.style.color = COLORS.TEXT_SECONDARY}
              >
                {item.label}
              </Link>
            ) : (
              <span style={{ color: COLORS.TEXT_MUTED }}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
