import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Eye } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, isAnyAdmin, isSuperAdmin, isAdminView } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { label: "Dashboard", path: isAnyAdmin ? "/admin" : "/portal" },
    { label: "Licenses", path: isAnyAdmin ? "/admin/licenses" : "/portal/licenses" },
    ...(isAnyAdmin ? [{ label: "Access Requests", path: "/admin/access-requests" }] : []),
    { label: "Settings", path: isAnyAdmin ? "/admin/settings" : "/portal/settings" },
  ];

  async function handleSignOut() {
    await signOut();
    navigate("/auth");
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Navigation */}
      <aside className="w-52 border-r border-border/40 flex flex-col">
        {/* Brand */}
        <div className="h-14 flex items-center px-5 border-b border-border/40">
          <Link to={isAnyAdmin ? "/admin" : "/portal"} className="flex items-center gap-2">
            <span className="text-base font-semibold tracking-tight">TRIBES</span>
            {isAnyAdmin && (
              <>
                <span className="text-muted-foreground/40">|</span>
                <span className="text-sm text-muted-foreground">Admin</span>
              </>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                    isActive(item.path)
                      ? "text-foreground font-medium bg-muted/50"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border/40">
          {isAdminView && (
            <div className="flex items-center gap-1.5 px-3 py-2 text-xs text-muted-foreground mb-2">
              <Eye className="w-3 h-3" />
              View Only
            </div>
          )}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/30"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 px-8 py-8">
          {children}
        </main>

        <footer className="px-8 py-4 border-t border-border/40">
          <p className="text-xs text-muted-foreground">
            © 2026 Tribes Rights Management LLC. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
