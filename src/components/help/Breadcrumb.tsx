/**
 * Help Center Breadcrumb
 * Navigation trail with chevron separators
 */

import { Link } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-1.5 text-[13px]">
        <li>
          <Link 
            to="/help" 
            className="text-[#666666] hover:text-[#1a1a1a] transition-colors duration-150"
          >
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1.5">
            <span className="text-[#999999]">›</span>
            {item.href ? (
              <Link 
                to={item.href}
                className="text-[#666666] hover:text-[#1a1a1a] transition-colors duration-150"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-[#999999]">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
