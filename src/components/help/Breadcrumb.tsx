/**
 * Breadcrumb Navigation
 * Font-size: 13px, separator: " › ", color: #a3a3a3
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
    <nav className="mb-6 text-[13px]">
      <ol className="flex items-center flex-wrap">
        <li>
          <Link 
            to="/hc" 
            className="text-[#525252] hover:text-[#1a1a1a] transition-colors duration-150"
          >
            Help Center
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <span className="mx-2 text-[#a3a3a3]">›</span>
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
