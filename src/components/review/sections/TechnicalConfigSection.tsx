import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

interface TechnicalConfigSectionProps {
  data: {
    landingPageUrl?: string;
    connectionWebhook?: string;
    entraAppId?: string;
    entraTenantId?: string;
  };
}

export const TechnicalConfigSection = ({ data }: TechnicalConfigSectionProps) => {
  const configs = [
    { label: "Landing Page URL", value: data.landingPageUrl, isUrl: true },
    { label: "Connection Webhook", value: data.connectionWebhook, isUrl: true },
    { label: "Microsoft Entra App ID", value: data.entraAppId, isUrl: false },
    { label: "Microsoft Entra Tenant ID", value: data.entraTenantId, isUrl: false },
  ];

  return (
    <div className="space-y-3">
      {configs.map((config, idx) => (
        <div key={idx} className="flex justify-between items-center p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium text-foreground">{config.label}</span>
          <div className="flex items-center gap-2">
            {config.value ? (
              <>
                <Badge variant="secondary" className="font-mono text-xs max-w-[300px] truncate">
                  {config.value}
                </Badge>
                {config.isUrl && (
                  <a href={config.value} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </>
            ) : (
              <Badge variant="outline" className="text-xs">Not set</Badge>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
