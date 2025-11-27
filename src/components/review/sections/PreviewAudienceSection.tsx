import { Badge } from "@/components/ui/badge";
import { Mail } from "lucide-react";

interface PreviewAudienceSectionProps {
  data: {
    previewAudience?: string[];
  };
}

export const PreviewAudienceSection = ({ data }: PreviewAudienceSectionProps) => {
  if (!data.previewAudience || data.previewAudience.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="text-sm">No preview audience configured</p>
        <p className="text-xs mt-1">Add email addresses to grant early access</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground mb-3">
        {data.previewAudience.length} / 10 email addresses
      </p>
      <div className="space-y-2">
        {data.previewAudience.map((email, idx) => (
          <div key={idx} className="flex items-center gap-2 p-2 bg-muted rounded">
            <Mail className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground">{email}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
