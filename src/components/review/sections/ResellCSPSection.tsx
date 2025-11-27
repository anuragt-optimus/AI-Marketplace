import { Badge } from "@/components/ui/badge";

interface ResellCSPSectionProps {
  data: {
    resellThroughCSP?: "all" | "specific" | "none";
    specificCSPs?: string[];
  };
}

export const ResellCSPSection = ({ data }: ResellCSPSectionProps) => {
  const getLabel = (option: string) => {
    switch (option) {
      case "all":
        return "All CSP partners can resell";
      case "specific":
        return "Only specific CSP partners";
      case "none":
        return "Do not allow CSP resale";
      default:
        return "Not configured";
    }
  };

  const getVariant = (option: string) => {
    switch (option) {
      case "all":
        return "default";
      case "specific":
        return "secondary";
      case "none":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted rounded-lg">
        <Badge variant={getVariant(data.resellThroughCSP || "")} className="text-sm">
          {getLabel(data.resellThroughCSP || "")}
        </Badge>
      </div>

      {data.resellThroughCSP === "specific" && data.specificCSPs && data.specificCSPs.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2">Approved CSP Partners</h4>
          <div className="space-y-2">
            {data.specificCSPs.map((csp, idx) => (
              <div key={idx} className="p-2 bg-muted rounded text-sm text-foreground">
                {csp}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
