import { Badge } from "@/components/ui/badge";

interface PropertiesSectionProps {
  data: {
    categories?: {
      primary: string;
      secondary?: string[];
    };
    appVersion?: string;
    legalInfo?: {
      useStandardContract: boolean;
      privacyPolicyUrl?: string;
      termsOfUseUrl?: string;
    };
  };
}

export const PropertiesSection = ({ data }: PropertiesSectionProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-2">Categories</h4>
        <div className="flex flex-wrap gap-2">
          {data.categories?.primary && (
            <Badge variant="default" className="text-xs">
              {data.categories.primary}
            </Badge>
          )}
          {data.categories?.secondary?.map((cat, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      {data.appVersion && (
        <div className="p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium text-foreground">App Version: </span>
          <span className="text-sm text-muted-foreground">{data.appVersion}</span>
        </div>
      )}

      <div>
        <h4 className="text-sm font-semibold text-foreground mb-2">Legal</h4>
        <div className="space-y-2">
          <div className="p-3 bg-muted rounded-lg">
            <span className="text-sm font-medium text-foreground">Standard Contract: </span>
            <Badge variant={data.legalInfo?.useStandardContract ? "default" : "secondary"} className="text-xs ml-2">
              {data.legalInfo?.useStandardContract ? "Yes" : "Custom"}
            </Badge>
          </div>
          {data.legalInfo?.privacyPolicyUrl && (
            <div className="p-3 bg-muted rounded-lg">
              <a href={data.legalInfo.privacyPolicyUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                Privacy Policy →
              </a>
            </div>
          )}
          {data.legalInfo?.termsOfUseUrl && (
            <div className="p-3 bg-muted rounded-lg">
              <a href={data.legalInfo.termsOfUseUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                Terms of Use →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
