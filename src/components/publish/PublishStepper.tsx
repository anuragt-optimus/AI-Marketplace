import { Check, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PublishStep } from "@/pages/OfferPublish";

interface PublishStepperProps {
  steps: PublishStep[];
  currentStep: number;
}

export const PublishStepper = ({ steps, currentStep }: PublishStepperProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "bg-status-live text-white";
      case "processing":
        return "bg-status-generating text-white";
      case "failed":
        return "bg-destructive text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done":
        return <Check className="w-5 h-5" />;
      case "processing":
        return <Loader2 className="w-5 h-5 animate-spin" />;
      case "failed":
        return <X className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      {/* Progress bar */}
      <div className="absolute top-6 left-0 right-0 h-0.5 bg-muted">
        <div 
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
      </div>

      {/* Steps */}
      <div className="relative flex justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center" style={{ width: `${100 / steps.length}%` }}>
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all duration-300 z-10",
                getStatusColor(step.status)
              )}
            >
              {getStatusIcon(step.status) || (
                <span className="text-sm font-semibold">{index + 1}</span>
              )}
            </div>
            <p className={cn(
              "text-sm text-center font-medium transition-colors",
              step.status === "done" || step.status === "processing" 
                ? "text-foreground" 
                : "text-muted-foreground"
            )}>
              {step.label}
            </p>
            {step.status === "processing" && (
              <p className="text-xs text-muted-foreground mt-1">In progress...</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
