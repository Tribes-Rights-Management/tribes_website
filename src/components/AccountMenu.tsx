import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";

export function AccountMenu() {
  const navigate = useNavigate();
  const { profile, signOut, isAnyAdmin } = useAuth();

  const initials = getInitials(profile?.name || profile?.email || "U");

  async function handleSignOut() {
    await signOut();
    navigate("/auth");
  }

  function handleNavigate(path: string) {
    navigate(path);
  }

  const basePath = isAnyAdmin ? "/admin" : "/portal";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="w-8 h-8 rounded-full bg-muted/60 flex items-center justify-center text-[13px] font-medium text-muted-foreground hover:bg-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Account menu"
        >
          {initials}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 bg-background border border-border/40 shadow-lg rounded-lg p-1"
      >
        <DropdownMenuItem 
          onClick={() => handleNavigate(`${basePath}/account`)}
          className="h-9 px-3 text-[13px] text-foreground rounded-md cursor-pointer hover:bg-muted/50 focus:bg-muted/50"
        >
          Account
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleNavigate(`${basePath}/notifications`)}
          className="h-9 px-3 text-[13px] text-foreground rounded-md cursor-pointer hover:bg-muted/50 focus:bg-muted/50"
        >
          Notifications
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleNavigate(`${basePath}/security`)}
          className="h-9 px-3 text-[13px] text-foreground rounded-md cursor-pointer hover:bg-muted/50 focus:bg-muted/50"
        >
          Security
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1 bg-border/40" />
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="h-9 px-3 text-[13px] text-muted-foreground rounded-md cursor-pointer hover:bg-muted/50 focus:bg-muted/50"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}
