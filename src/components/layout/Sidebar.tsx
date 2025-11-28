import { Home, Plus, Tag, ShoppingCart, CreditCard, Settings, Shield } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";

interface SidebarProps {
  userRole?: "customer" | "internal";
}

export const Sidebar = ({ userRole = "customer" }: SidebarProps) => {
  const navItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Plus, label: "Create New Offer", path: "/create" },
    { icon: Tag, label: "My Offers", path: "/offers" },
    { icon: Tag, label: "Private Offers", path: "/private-offers", disabled: true },
    { icon: ShoppingCart, label: "Orders", path: "/orders", disabled: true },
    { icon: Settings, label: "Settings", path: "/settings", disabled: true },
  ];

  const internalItems = [
    { icon: Shield, label: "Admin", path: "/admin" },
  ];

  return (
    <aside className="w-64 min-h-screen border-r border-sidebar-border bg-sidebar-bg">
      <nav className="p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.disabled ? "#" : item.path}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              item.disabled
                ? "text-muted-foreground/50 cursor-not-allowed"
                : "text-muted-foreground hover:bg-nav-hover hover:text-foreground"
            )}
            activeClassName={item.disabled ? "" : "bg-nav-hover text-foreground"}
            onClick={item.disabled ? (e) => e.preventDefault() : undefined}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
        
        {userRole === "internal" && (
          <>
            <div className="h-px bg-border my-4" />
            {internalItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-nav-hover hover:text-foreground transition-colors"
                activeClassName="bg-nav-hover text-foreground"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </>
        )}
      </nav>
    </aside>
  );
};
