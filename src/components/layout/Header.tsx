import { Bell, Settings, User, LogOut, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { PublicClientApplication, AccountInfo } from "@azure/msal-browser";
import { msalConfig } from "@/config/authConfig";
import { useState, useEffect } from "react";

const msalInstance = new PublicClientApplication(msalConfig);

export const Header = () => {
  const { selectedAccount, logout } = useAuth();
  const navigate = useNavigate();
  const [msalAccount, setMsalAccount] = useState<AccountInfo | null>(null);

  useEffect(() => {
    // Get MSAL account info
    const initializeMsal = async () => {
      try {
        await msalInstance.initialize();
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
          setMsalAccount(accounts[0]);
        }
      } catch (error) {
        console.error("Error getting MSAL account:", error);
      }
    };

    initializeMsal();
  }, []);

  // Use MSAL account info for user display
  const displayName = msalAccount?.name || "User";
  const email = msalAccount?.username || "";

  // Safe initials generation
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

  // Generate avatar URL from initials
  const avatarSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=6366f1&color=fff`;

  const handleLogout = () => {
    logout();
    // If logout() performs msalInstance.logoutRedirect(), it will redirect by itself.
    // If not, keep the navigate to send user to /login:
    navigate("/login");
  };

  return (
    <header className="h-16 border-b border-border bg-background px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">O</span>
          </div>
          <span className="font-bold text-lg text-foreground">Optimus Marketplace Studio</span>
        </div>

        {selectedAccount && (
          <div className="hidden md:flex items-center gap-2 ml-4 px-3 py-1.5 rounded-md bg-muted/50">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground font-medium">{selectedAccount.name}</span>
            <Badge variant="secondary" className="text-xs">
              {selectedAccount.publisherId}
            </Badge>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Avatar className="h-8 w-8">
                <AvatarImage src={avatarSrc} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{displayName}</p>
                <p className="text-xs text-muted-foreground">{email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              <User className="mr-2 h-4 w-4" />
              Profile Settings
            </DropdownMenuItem>
            {selectedAccount && (
              <DropdownMenuItem onClick={() => navigate("/configure-partner-center")}>
                <Building2 className="mr-2 h-4 w-4" />
                Switch Account
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
