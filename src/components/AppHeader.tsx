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
import { Music2, LogOut, User, ChevronDown } from "lucide-react";
import { ROLE_LABELS } from "@/types";
import { BRAND, LOGO_SIZES, NAV_SIZES } from "@/lib/brand";

export function AppHeader() {
  const { profile, role, signOut } = useAuth();

  return (
    <header 
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      style={{ height: NAV_SIZES.header.desktop }}
    >
      <div 
        className="container flex items-center h-full"
        style={{
          paddingLeft: NAV_SIZES.headerPadding.horizontal.mobile,
          paddingRight: NAV_SIZES.headerPadding.horizontal.mobile,
        }}
      >
        {/* Logo — Locked sizing from brand.ts */}
        <Link 
          to="/portal" 
          className="flex items-center space-x-2 mr-8 focus-ring transition-opacity duration-[120ms] ease-out hover:opacity-88"
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Music2 className="w-4 h-4 text-primary-foreground" />
          </div>
          <span 
            className="hidden sm:inline-block"
            style={{
              fontSize: LOGO_SIZES.portal.fontSize,
              fontWeight: LOGO_SIZES.portal.fontWeight,
            }}
          >
            {BRAND.legalName}
          </span>
        </Link>

        {/* Spacer */}
        <div className="flex-1" />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center space-x-2 focus-ring transition-opacity duration-[120ms] ease-out hover:opacity-88 hover:bg-transparent"
            >
              <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-sm font-medium max-w-[120px] truncate">
                  {profile?.name || profile?.email || "User"}
                </span>
                {role && (
                  <span className="text-xs text-muted-foreground">
                    {ROLE_LABELS[role]}
                  </span>
                )}
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{profile?.name || "User"}</p>
              <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
              {role && (
                <p className="text-xs text-muted-foreground mt-1">{ROLE_LABELS[role]}</p>
              )}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={signOut} 
              className="text-destructive focus:text-destructive focus-ring"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
