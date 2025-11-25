import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { mockPartnerCenterAccounts, PartnerCenterAccount } from "@/constants/mockPartnerCenterAccounts";
import { Building2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const ConfigurePartnerCenter = () => {
  const navigate = useNavigate();
  const { isAuthenticated, hasConfiguredPartnerCenter, selectPartnerCenterAccount } = useAuth();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleContinue = () => {
    const account = mockPartnerCenterAccounts.find(acc => acc.id === selectedId);
    if (account) {
      selectPartnerCenterAccount(account);
      navigate("/");
    }
  };

  const handleSkip = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto py-12 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 mb-4">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Configure Partner Center Account</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select the Microsoft Partner Center directory you want to use for managing your marketplace offerings
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {mockPartnerCenterAccounts.map((account) => (
            <Card
              key={account.id}
              className={cn(
                "p-6 cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]",
                selectedId === account.id && "ring-2 ring-primary bg-accent/5"
              )}
              onClick={() => setSelectedId(account.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-foreground mb-1">
                    {account.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {account.publisherId}
                  </p>
                </div>
                {selectedId === account.id && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={account.status === "active" ? "default" : "secondary"}>
                  {account.status === "active" ? "Active" : "Pending"}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {account.accountType}
                </Badge>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-border">
          <Button
            variant="ghost"
            onClick={handleSkip}
          >
            Skip for now
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!selectedId}
            size="lg"
          >
            Continue to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfigurePartnerCenter;
