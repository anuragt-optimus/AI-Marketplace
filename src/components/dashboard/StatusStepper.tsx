import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  label: string;
  status: "completed" | "current" | "pending";
}

const steps: Step[] = [
  { label: "Draft", status: "completed" },
  { label: "AI Generating", status: "completed" },
  { label: "Review Pending", status: "current" },
  { label: "Publishing", status: "pending" },
  { label: "Microsoft Validation", status: "pending" },
  { label: "Live", status: "pending" },
];

export const StatusStepper = () => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-sm font-semibold text-foreground mb-4">Active Offer Status</h3>
      <div className="flex items-center gap-2">
        {steps.map((step, index) => (
          <div key={step.label} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                  step.status === "completed" && "bg-status-live text-white",
                  step.status === "current" && "bg-status-generating text-white",
                  step.status === "pending" && "bg-muted text-muted-foreground"
                )}
              >
                {step.status === "completed" ? (
                  <Check className="h-4 w-4" />
                ) : step.status === "current" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <span className="text-xs">{index + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  "text-xs mt-2 text-center",
                  step.status === "current" ? "font-semibold text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2",
                  step.status === "completed" ? "bg-status-live" : "bg-border"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
