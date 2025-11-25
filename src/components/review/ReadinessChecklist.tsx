import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChecklistItem {
  label: string;
  completed: boolean;
  required: boolean;
}

interface ReadinessChecklistProps {
  offerData: any;
}

export const ReadinessChecklist = ({ offerData }: ReadinessChecklistProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const checklistItems: ChecklistItem[] = [
    { label: "Offer Alias", completed: !!offerData.partnerCenterData?.offerAlias, required: true },
    { label: "Offer Name", completed: !!offerData.partnerCenterData?.listing.name, required: true },
    { label: "Search Summary (50-160 chars)", completed: !!offerData.partnerCenterData?.listing.searchSummary && offerData.partnerCenterData.listing.searchSummary.length >= 50 && offerData.partnerCenterData.listing.searchSummary.length <= 160, required: true },
    { label: "Short Description (100+ chars)", completed: !!offerData.shortDescription && offerData.shortDescription.length >= 100, required: true },
    { label: "Long Description (200+ chars)", completed: !!offerData.longDescription && offerData.longDescription.length >= 200, required: true },
    { label: "Primary Category", completed: !!offerData.partnerCenterData?.categories.primary, required: true },
    { label: "Support Contact", completed: !!offerData.partnerCenterData?.listing.contacts.support.email, required: true },
    { label: "Engineering Contact", completed: !!offerData.partnerCenterData?.listing.contacts.engineering.email, required: true },
    { label: "Privacy Policy URL", completed: !!offerData.partnerCenterData?.legalInfo.privacyPolicyUrl, required: true },
    { label: "Terms of Use URL", completed: !!offerData.partnerCenterData?.legalInfo.termsOfUseUrl, required: true },
    { label: "Landing Page URL", completed: !!offerData.partnerCenterData?.technicalConfig.landingPageUrl, required: true },
    { label: "Connection Webhook", completed: !!offerData.partnerCenterData?.technicalConfig.connectionWebhook, required: true },
    { label: "Entra App ID", completed: !!offerData.partnerCenterData?.technicalConfig.entraAppId, required: true },
    { label: "Entra Tenant ID", completed: !!offerData.partnerCenterData?.technicalConfig.entraTenantId, required: true },
    { label: "Pricing Plans (min 1)", completed: offerData.partnerCenterData?.plans && offerData.partnerCenterData.plans.length >= 1, required: true },
    { label: "Features (min 3)", completed: offerData.features?.length >= 3, required: true },
    { label: "Secondary Categories", completed: offerData.partnerCenterData?.categories.secondary && offerData.partnerCenterData.categories.secondary.length > 0, required: false },
    { label: "Industries", completed: offerData.partnerCenterData?.industries && offerData.partnerCenterData.industries.length > 0, required: false },
    { label: "App Version", completed: !!offerData.partnerCenterData?.appVersion, required: false },
    { label: "Preview Audience", completed: offerData.partnerCenterData?.previewAudience && offerData.partnerCenterData.previewAudience.length > 0, required: false },
    { label: "Screenshots", completed: offerData.screenshots?.length > 0, required: false },
  ];

  const requiredItems = checklistItems.filter(item => item.required);
  const completedRequired = requiredItems.filter(item => item.completed).length;
  const completionPercentage = Math.round((completedRequired / requiredItems.length) * 100);

  const allRequired = checklistItems.filter(item => item.required);
  const completedAll = checklistItems.filter(item => item.completed).length;
  const totalPercentage = Math.round((completedAll / checklistItems.length) * 100);

  return (
    <Card className="fixed top-24 right-8 w-80 shadow-xl border-primary/20 z-40 animate-fade-in">
      <CardHeader className="pb-3 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            Readiness Checklist
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CardTitle>
          <Badge 
            variant={completionPercentage === 100 ? "default" : "secondary"}
            className={cn(
              completionPercentage === 100 && "bg-status-ready text-white"
            )}
          >
            {completionPercentage}%
          </Badge>
        </div>
        <Progress value={totalPercentage} className="h-2 mt-2" />
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-2">
          <div className="space-y-1.5">
            {checklistItems.map((item, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex items-center justify-between py-1.5 px-2 rounded transition-colors",
                  item.completed && "bg-status-ready/10",
                  !item.completed && item.required && "bg-muted"
                )}
              >
                <div className="flex items-center gap-2 flex-1">
                  {item.completed ? (
                    <CheckCircle2 className="h-4 w-4 text-status-ready flex-shrink-0" />
                  ) : (
                    <AlertCircle className={cn(
                      "h-4 w-4 flex-shrink-0",
                      item.required ? "text-status-failed" : "text-muted-foreground"
                    )} />
                  )}
                  <span className={cn(
                    "text-xs",
                    item.completed ? "text-foreground font-medium" : "text-muted-foreground"
                  )}>
                    {item.label}
                  </span>
                </div>
                {!item.required && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    Optional
                  </Badge>
                )}
              </div>
            ))}
          </div>

          {completionPercentage < 100 && (
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                Complete all required fields to publish your offer
              </p>
            </div>
          )}

          {completionPercentage === 100 && (
            <div className="pt-2 border-t">
              <div className="flex items-center gap-2 text-status-ready">
                <CheckCircle2 className="h-4 w-4" />
                <p className="text-xs font-medium">Ready to publish!</p>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};
