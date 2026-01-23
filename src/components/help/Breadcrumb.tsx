/**
 * Help Center Breadcrumb
 * 13px font with › separator
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
    <nav className="mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap gap-x-1 text-[13px]">
        <li>
          <Link 
            to={`/hc/${audienceSlug}`}
            className="text-[#525252] hover:text-[#1a1a1a] transition-colors duration-150"
          >
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1">
            <span className="text-[#a3a3a3]">›</span>
            {item.href ? (
              <Link 
                to={item.href}
                className="text-[#525252] hover:text-[#1a1a1a] transition-colors duration-150"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-[#a3a3a3]">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
