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
    { icon: Tag, label: "Private Offers", path: "/private-offers" },
    { icon: ShoppingCart, label: "Orders", path: "/orders" },
    { icon: Settings, label: "Settings", path: "/settings" },
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
            to={item.path}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-nav-hover hover:text-foreground transition-colors"
            activeClassName="bg-nav-hover text-foreground"
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
