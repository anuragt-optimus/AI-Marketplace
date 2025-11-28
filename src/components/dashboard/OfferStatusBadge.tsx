import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type OfferStatus = 
  | "draft" 
  | "generating" 
  | "ready_to_review" 
  | "ready_to_publish"
  | "submitted" 
  | "in_preview" 
  | "in_certification" 
  | "published" 
  | "failed";

interface StatusConfig {
  label: string;
  className: string;
  tooltip: string;
  icon?: React.ReactNode;
}

const statusConfig: Record<OfferStatus, StatusConfig> = {
  draft: {
    label: "Draft",
    className: "bg-[hsl(var(--status-draft))]/10 text-[hsl(var(--status-draft))] hover:bg-[hsl(var(--status-draft))]/20 border-[hsl(var(--status-draft))]/20",
    tooltip: "Complete your offer details and submit when ready",
  },
  generating: {
    label: "Generating",
    className: "bg-[hsl(var(--status-generating))]/10 text-[hsl(var(--status-generating))] hover:bg-[hsl(var(--status-generating))]/20 border-[hsl(var(--status-generating))]/20",
    tooltip: "AI is creating your offer content. This usually takes 1-2 minutes.",
    icon: <Loader2 className="h-3 w-3 animate-spin" />,
  },
  ready_to_review: {
    label: "Ready to Review",
    className: "bg-[hsl(var(--status-ready))]/10 text-[hsl(var(--status-ready))] hover:bg-[hsl(var(--status-ready))]/20 border-[hsl(var(--status-ready))]/20",
    tooltip: "Review your generated offer and make any edits before publishing",
  },
  ready_to_publish: {
    label: "Ready to Publish",
    className: "bg-[hsl(var(--status-ready))]/10 text-[hsl(var(--status-ready))] hover:bg-[hsl(var(--status-ready))]/20 border-[hsl(var(--status-ready))]/20",
    tooltip: "Your offer is ready to be published to Partner Center",
  },
  submitted: {
    label: "Submitted",
    className: "bg-[hsl(var(--status-submitted))]/10 text-[hsl(var(--status-submitted))] hover:bg-[hsl(var(--status-submitted))]/20 border-[hsl(var(--status-submitted))]/20",
    tooltip: "Automated validation in progress (~40-60 min). Checking offer setup and configuration.",
  },
  in_preview: {
    label: "In Preview",
    className: "bg-[hsl(var(--status-preview))]/10 text-[hsl(var(--status-preview))] hover:bg-[hsl(var(--status-preview))]/20 border-[hsl(var(--status-preview))]/20",
    tooltip: "Validation passed! Test your offer preview before final submission.",
  },
  in_certification: {
    label: "In Certification",
    className: "bg-[hsl(var(--status-certification))]/10 text-[hsl(var(--status-certification))] hover:bg-[hsl(var(--status-certification))]/20 border-[hsl(var(--status-certification))]/20",
    tooltip: "Microsoft is reviewing your offer. This can take up to 2 business days.",
  },
  published: {
    label: "Published",
    className: "bg-[hsl(var(--status-published))]/10 text-[hsl(var(--status-published))] hover:bg-[hsl(var(--status-published))]/20 border-[hsl(var(--status-published))]/20",
    tooltip: "Your offer is live on Microsoft Marketplace!",
  },
  failed: {
    label: "Failed",
    className: "bg-[hsl(var(--status-failed))]/10 text-[hsl(var(--status-failed))] hover:bg-[hsl(var(--status-failed))]/20 border-[hsl(var(--status-failed))]/20",
    tooltip: "Review the error message and try again",
  },
};

interface OfferStatusBadgeProps {
  status: string;
  className?: string;
}

export const OfferStatusBadge = ({ status, className }: OfferStatusBadgeProps) => {
  const config = statusConfig[status as OfferStatus];
  
  // Handle unknown statuses
  if (!config) {
    console.warn(`Unknown status: "${status}" - using default draft config`);
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn("inline-flex items-center gap-1.5", className)}>
              <Badge variant="outline" className="font-medium bg-yellow-50 text-yellow-700 border-yellow-200">
                {status || 'Unknown'}
              </Badge>
              <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="text-sm">Unknown status: {status}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("inline-flex items-center gap-1.5", className)}>
            <Badge variant="outline" className={cn("font-medium", config.className)}>
              {config.icon}
              {config.label}
            </Badge>
            <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-sm">{config.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
