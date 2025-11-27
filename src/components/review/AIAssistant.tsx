import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, RefreshCw, Minimize2, Maximize2 } from "lucide-react";

interface AIAssistantProps {
  activeSection: string;
  onRegenerate: (section: string) => void;
}

export const AIAssistant = ({ activeSection, onRegenerate }: AIAssistantProps) => {
  const actions = [
    { label: "Regenerate section", icon: RefreshCw },
    { label: "Improve clarity", icon: Sparkles },
    { label: "Make it shorter", icon: Minimize2 },
    { label: "Expand with details", icon: Maximize2 }
  ];

  return (
    <Card className="m-6 mt-0 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
          <div className="relative">
            <Sparkles className="w-4 h-4 text-primary" />
            <div className="absolute inset-0 animate-pulse">
              <Sparkles className="w-4 h-4 text-primary opacity-50" />
            </div>
          </div>
          AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-xs text-muted-foreground mb-3">
          Editing: {activeSection.replace(/([A-Z])/g, " $1").trim()}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action, idx) => (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              onClick={() => onRegenerate(activeSection)}
              className="text-xs h-auto py-2 hover:bg-primary/10 hover:text-primary hover:border-primary"
            >
              <action.icon className="w-3 h-3 mr-1" />
              {action.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
