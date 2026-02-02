/**
 * Help Center Breadcrumb
 * Typography matches Portal exactly
 */

import { Link } from "react-router-dom";

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
    <nav style={{ marginBottom: '20px' }} aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap" style={{ gap: '4px', fontSize: '12px' }}>
        <li>
          <Link 
            to={`/hc/${audienceSlug}`}
            className="hover:text-[#1F2937] transition-colors duration-150"
            style={{ color: '#6B7280' }}
          >
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center" style={{ gap: '4px' }}>
            <span style={{ color: '#9CA3AF' }}>›</span>
            {item.href ? (
              <Link 
                to={item.href}
                className="hover:text-[#1F2937] transition-colors duration-150"
                style={{ color: '#6B7280' }}
              >
                {item.label}
              </Link>
            ) : (
              <span style={{ color: '#9CA3AF' }}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
