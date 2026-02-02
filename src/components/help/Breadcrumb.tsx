/**
 * Help Center Breadcrumb
 * Portal uses 12-13px for breadcrumbs
 */

import { Link } from "react-router-dom";

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
      <ol className="flex items-center flex-wrap" style={{ gap: '4px', fontSize: '12px' }}>
        <li>
          <Link 
            to={`/hc/${audienceSlug}`}
            className="transition-colors duration-150"
            style={{ color: COLORS.TEXT_SECONDARY }}
            onMouseEnter={(e) => e.currentTarget.style.color = COLORS.TEXT}
            onMouseLeave={(e) => e.currentTarget.style.color = COLORS.TEXT_SECONDARY}
          >
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center" style={{ gap: '4px' }}>
            <span style={{ color: COLORS.TEXT_MUTED }}>›</span>
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
