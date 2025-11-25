import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, MoreVertical } from "lucide-react";

const Offers = () => {
  const offers = [
    {
      id: 1,
      name: "OptiPost",
      category: "Software as a Service",
      status: "Review Pending",
      statusColor: "bg-status-generating",
      badges: ["New", "AI Generated"],
    },
  ];

  return (
    <Layout>
      <div className="max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Offers</h1>
            <p className="text-muted-foreground">Manage your marketplace listings</p>
          </div>
          <Button>Create New Offer</Button>
        </div>

        <div className="grid gap-4">
          {offers.map((offer) => (
            <Card key={offer.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-primary">O</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-foreground">{offer.name}</h3>
                      {offer.badges.map((badge) => (
                        <Badge
                          key={badge}
                          variant="secondary"
                          className={badge === "AI Generated" ? "bg-badge-ai text-accent" : "bg-badge-new"}
                        >
                          {badge}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4">{offer.category}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${offer.statusColor}`} />
                        <span className="text-sm text-muted-foreground">{offer.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Offers;
