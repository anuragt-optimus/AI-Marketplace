import { Plus, Edit, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

export const QuickActions = () => {
  const actions = [
    {
      icon: Plus,
      title: "Create New Offer",
      description: "Start with AI-powered generation",
      path: "/create",
      variant: "default" as const,
    },
    {
      icon: Edit,
      title: "Continue Editing",
      description: "Resume your draft offers",
      path: "/offers",
      variant: "outline" as const,
    },
    {
      icon: ShoppingCart,
      title: "View Transactions",
      description: "Track your orders and revenue",
      path: "/orders",
      variant: "outline" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      {actions.map((action) => (
        <Card key={action.title} className="p-6 hover:shadow-md transition-shadow">
          <Link to={action.path}>
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <action.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{action.title}</h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </div>
              <Button variant={action.variant} className="w-full">
                Get Started
              </Button>
            </div>
          </Link>
        </Card>
      ))}
    </div>
  );
};
