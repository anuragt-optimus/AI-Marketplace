import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface InlineAIButtonProps {
  sectionId: string;
  sectionName: string;
  onClick: () => void;
  className?: string;
}

export const InlineAIButton = ({ sectionId, sectionName, onClick, className }: InlineAIButtonProps) => {
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-200",
        "bg-background/95 backdrop-blur-sm border-primary/20 hover:border-primary hover:bg-primary/5",
        "shadow-lg hover:shadow-xl hover:scale-105",
        className
      )}
    >
      <Sparkles className="h-3.5 w-3.5 mr-1.5 text-primary" />
      <span className="text-xs font-medium">Edit</span>
    </Button>
  );
};
