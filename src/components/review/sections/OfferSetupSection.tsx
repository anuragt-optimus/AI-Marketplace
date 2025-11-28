import { Badge } from "@/components/ui/badge";

interface OfferSetupSectionProps {
  data: {
    offerAlias?: string;
    sellThroughMicrosoft?: boolean;
    enableTestDrive?: boolean;
  };
}

export const OfferSetupSection = ({ data }: OfferSetupSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium text-foreground">Offer Alias</span>
          <Badge variant="secondary" className="font-mono text-xs">
            {data.offerAlias || "Not set"}
          </Badge>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium text-foreground">Sell through Microsoft</span>
          <Badge variant={data.sellThroughMicrosoft ? "default" : "secondary"} className="text-xs">
            {data.sellThroughMicrosoft ? "Yes" : "No"}
          </Badge>
        </div>
        
       
      </div>
    </div>
  );
};
