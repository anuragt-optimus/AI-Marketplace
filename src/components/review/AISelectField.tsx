import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AISelectFieldProps {
  fieldName: string;
  section: string;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  label: string;
  websiteUrl: string;
  offerId: string;
  multiple?: boolean;
  options?: Array<{ value: string; label: string } | string> | readonly { value: string; label: string }[] | readonly string[];
}

export const AISelectField = ({
  fieldName,
  section,
  value,
  onChange,
  label,
  websiteUrl,
  offerId,
  multiple = false,
  options = []
}: AISelectFieldProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleAnalyze = async () => {
    if (!websiteUrl) {
      toast.error("Website URL is required for AI analysis");
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('regenerate-field', {
        body: {
          offerId,
          websiteUrl,
          section,
          fieldName,
          currentValue: null,
          userFeedback: `Analyze the website and suggest the most appropriate ${label.toLowerCase()}. Return as a comma-separated list.`,
          existingOfferData: null
        }
      });

      if (error) throw error;

      if (data?.generatedValue) {
        const suggestedValues = data.generatedValue
          .split(',')
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0);
        
        setSuggestions(suggestedValues);
        toast.success(`AI suggestions ready for ${label}`);
      }
    } catch (error) {
      console.error('AI analysis error:', error);
      toast.error("Failed to analyze. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAcceptSuggestion = (suggestion: string) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      if (!currentValues.includes(suggestion)) {
        onChange([...currentValues, suggestion]);
      }
    } else {
      onChange(suggestion);
    }
  };

  const handleAcceptAll = () => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = [...new Set([...currentValues, ...suggestions])];
      onChange(newValues);
    } else if (suggestions.length > 0) {
      onChange(suggestions[0]);
    }
    setSuggestions([]);
    toast.success("Suggestions applied");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="h-7 px-2 text-xs"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-3 h-3 mr-1" />
              Suggest with AI
            </>
          )}
        </Button>
      </div>

      {suggestions.length > 0 && (
        <div className="p-3 border rounded-lg bg-primary/5 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-foreground">AI Suggestions:</p>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAcceptAll}
                className="h-6 px-2 text-xs"
              >
                <Check className="w-3 h-3 mr-1" />
                Accept All
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSuggestions([])}
                className="h-6 px-2 text-xs"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="cursor-pointer hover:bg-primary/10"
                onClick={() => handleAcceptSuggestion(suggestion)}
              >
                <Sparkles className="w-3 h-3 mr-1" />
                {suggestion}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
