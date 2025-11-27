import { Badge } from "@/components/ui/badge";

interface SupplementalContentSectionProps {
  data: {
    supplementalContent?: {
      saasScenario?: "fullyHosted" | "partiallyHosted" | "notHosted";
      subscriptionIds?: string[];
    };
  };
}

export const SupplementalContentSection = ({ data }: SupplementalContentSectionProps) => {
  const getScenarioLabel = (scenario?: string) => {
    switch (scenario) {
      case "fullyHosted":
        return "Fully hosted in Azure";
      case "partiallyHosted":
        return "Partially hosted in Azure";
      case "notHosted":
        return "Not hosted in Azure";
      default:
        return "Not specified";
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted rounded-lg">
        <h4 className="text-sm font-semibold text-foreground mb-2">SaaS Hosting Scenario</h4>
        <Badge variant="secondary" className="text-xs">
          {getScenarioLabel(data.supplementalContent?.saasScenario)}
        </Badge>
      </div>

      {data.supplementalContent?.subscriptionIds && data.supplementalContent.subscriptionIds.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2">Azure Subscription IDs</h4>
          <div className="space-y-2">
            {data.supplementalContent.subscriptionIds.map((id, idx) => (
              <div key={idx} className="p-2 bg-muted rounded">
                <code className="text-xs text-foreground font-mono">{id}</code>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
