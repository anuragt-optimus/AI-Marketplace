import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface LoadingStep {
  label: string;
  threshold: number; // Progress percentage when this step becomes active
}

interface GeneratingLoaderProps {
  progress?: number; // 0-100
}

export const GeneratingLoader = ({ progress = 0 }: GeneratingLoaderProps) => {
  const steps: LoadingStep[] = [
    { label: "Scraping Website", threshold: 0 },
    { label: "Extracting Product Info", threshold: 33 },
    { label: "Generating Listing Content", threshold: 66 },
  ];

  const getStepStatus = (step: LoadingStep, index: number): "completed" | "loading" | "pending" => {
    const nextStepThreshold = steps[index + 1]?.threshold ?? 100;
    
    if (progress >= nextStepThreshold) return "completed";
    if (progress >= step.threshold) return "loading";
    return "pending";
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
            <Loader2 className="h-8 w-8 text-accent animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Generating Your Offer</h2>
          <p className="text-muted-foreground">Our AI is working its magic...</p>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">{Math.round(progress)}% complete</p>
          </div>
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => {
            const status = getStepStatus(step, index);
            return (
              <div key={index} className="flex items-center gap-4 transition-all duration-300">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                    status === "completed" && "bg-status-ready scale-100",
                    status === "loading" && "bg-status-generating scale-110",
                    status === "pending" && "bg-muted scale-95"
                  )}
                >
                  {status === "completed" ? (
                    <Check className="h-4 w-4 text-white animate-scale-in" />
                  ) : status === "loading" ? (
                    <Loader2 className="h-4 w-4 text-white animate-spin" />
                  ) : (
                    <span className="text-xs text-muted-foreground">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={cn(
                      "font-medium transition-all duration-300",
                      status === "loading" && "text-foreground font-semibold",
                      status === "completed" && "text-muted-foreground",
                      status === "pending" && "text-muted-foreground opacity-60"
                    )}
                  >
                    {step.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
