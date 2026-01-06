import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AdminBanner, AdminFooterNote } from "@/components/admin/AdminGuardrails";
import { AccountMenu } from "@/components/AccountMenu";
import { ImpersonationBanner } from "@/components/ImpersonationBanner";
import { getCopyrightLine } from "@/lib/copyright";


interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const { isAnyAdmin, isAdminView } = useAuth();

  const isActive = (path: string) => location.pathname === path;
  const copyrightText = getCopyrightLine();

  const navItems = isAnyAdmin
    ? [
        { label: "Dashboard", path: "/admin" },
        { label: "Licenses", path: "/admin/licenses" },
        { label: "Access Requests", path: "/admin/access-requests" },
        { label: "Settings", path: "/admin/settings" },
      ]
    : [
        { label: "Dashboard", path: "/portal" },
        { label: "Licenses", path: "/portal/licenses" },
      ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Impersonation Banner - Always at top when active, cannot be hidden */}
      <ImpersonationBanner />
      
      <div className="flex-1 flex relative">
      {/* Left Navigation */}
      <aside className="w-56 border-r border-border/30 flex flex-col">
        {/* Brand */}
        <div className="h-14 flex items-center px-6">
          <Link to={isAnyAdmin ? "/admin" : "/portal"} className="flex items-center gap-2">
            <span className="text-[15px] font-semibold tracking-tight">TRIBES</span>
            {isAnyAdmin && (
              <>
                <span className="text-muted-foreground/30">|</span>
                <span className="text-[13px] text-muted-foreground">Admin</span>
              </>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3">
          <ul className="space-y-0.5">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`block h-11 flex items-center px-4 text-[13px] rounded-md transition-colors ${
                    isActive(item.path)
                      ? "text-foreground bg-muted/40"
                      : "text-muted-foreground hover:bg-muted/30"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        {isAdminView && (
          <div className="px-3 pb-4">
            <p className="h-11 flex items-center px-4 text-[12px] text-muted-foreground">
              View only
            </p>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar with Account Menu */}
        <div className="h-14 flex items-center justify-end px-8 border-b border-border/30">
          <AccountMenu />
        </div>

        {/* Admin Banner - Only for admin views */}
        {isAnyAdmin && <AdminBanner />}
        
        <main className="flex-1 px-8 py-8">
          {children}
        </main>

        <footer className="px-8 py-4 border-t border-border/40">
          <p className="text-xs text-muted-foreground">
            {copyrightText}
          </p>
          {isAnyAdmin && <AdminFooterNote />}
        </footer>
      </div>
    </div>
  </div>
  );
}
