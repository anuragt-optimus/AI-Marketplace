import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, RefreshCw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface AITextFieldProps {
  fieldName: string;
  section: string;
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  maxLength?: number;
  multiline?: boolean;
  rows?: number;
  websiteUrl: string;
  offerId: string;
  existingOfferData?: any;
  showCharCount?: boolean;
}

export const AITextField = ({
  fieldName,
  section,
  value,
  onChange,
  label,
  placeholder,
  maxLength,
  multiline = false,
  rows = 3,
  websiteUrl,
  offerId,
  existingOfferData,
  showCharCount = false
}: AITextFieldProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [hasGenerated, setHasGenerated] = useState(false);
  const { msalInstance } = useAuth();

  const handleGenerate = async (isRegenerate: boolean = false) => {
    if (!value && isRegenerate) {
      toast.error("No content to regenerate");
      return;
    }

    setIsGenerating(true);
    try {
      // Get authentication token
      const accounts = msalInstance.getAllAccounts();
      if (!accounts.length) {
        toast.error("No authenticated account found");
        return;
      }

      const tokenResponse = await msalInstance.acquireTokenSilent({
        scopes: ["https://graph.microsoft.com/.default"],
        account: accounts[0],
      });

      // Prepare the API request
      const requestBody = {
        current_text: isRegenerate ? value : (placeholder || `Generate ${label.toLowerCase()}`),
        prompt: isRegenerate ? (feedback || "regenerate") : `generate ${label.toLowerCase()}`
      };

      const response = await fetch(
        'https://ca-ailaunchpad-cc-001.wittysky-b9a849a9.canadacentral.azurecontainerapps.io/ai/regenerate',
        {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenResponse.accessToken}`,
          },
          body: JSON.stringify(requestBody)
        }
      );

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const result = await response.json();
      console.log('AI regeneration result:', result);

      if (result.success && result.regenerated_text) {
        onChange(result.regenerated_text);
        setHasGenerated(true);
        setFeedback("");
        toast.success(`${label} ${isRegenerate ? 'regenerated' : 'generated'} successfully`);
      } else {
        throw new Error(result.message || 'Failed to generate content');
      }
    } catch (error) {
      console.error('AI generation error:', error);
      toast.error("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const InputComponent = multiline ? Textarea : Input;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={fieldName}>{label}</Label>
        <div className="flex gap-2">
          {!hasGenerated ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleGenerate(false)}
              disabled={isGenerating}
              className="h-7 px-2 text-xs"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3 mr-1" />
                  Generate with AI
                </>
              )}
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleGenerate(true)}
              disabled={isGenerating}
              className="h-7 px-2 text-xs"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Regenerate
                </>
              )}
            </Button>
          )}
        </div>
      </div>
      
      <InputComponent
        id={fieldName}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={multiline ? rows : undefined}
        disabled={isGenerating}
      />
      
      {showCharCount && maxLength && (
        <p className="text-xs text-muted-foreground">
          {value.length} / {maxLength} characters
        </p>
      )}

      {hasGenerated && (
        <div className="pt-2">
          <Input
            placeholder="Add feedback to refine (e.g., 'make it more technical', 'shorter')"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="text-xs h-8"
          />
        </div>
      )}
    </div>
  );
};
