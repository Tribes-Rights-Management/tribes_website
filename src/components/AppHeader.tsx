import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Music2, FileText, LayoutDashboard, LogOut, User, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function AppHeader() {
  const { profile, isAdmin, signOut } = useAuth();
  const location = useLocation();

  const navItems = [
    { href: "/", label: "My Requests", icon: FileText },
    ...(isAdmin ? [{ href: "/admin", label: "Admin", icon: LayoutDashboard }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 mr-8">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Music2 className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm hidden sm:inline-block">
            Music Licensing
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                location.pathname === item.href
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <item.icon className="w-4 h-4 mr-2" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="text-sm font-medium hidden sm:inline-block max-w-[150px] truncate">
                {profile?.name || profile?.email || "User"}
              </span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{profile?.name || "User"}</p>
              <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
