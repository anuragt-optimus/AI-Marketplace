import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, Download, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface AILegalDocGeneratorProps {
  type: 'privacy-policy' | 'terms-of-use';
  websiteUrl: string;
  currentUrl?: string;
  onGenerated: (url: string) => void;
}

export const AILegalDocGenerator = ({
  type,
  websiteUrl,
  currentUrl,
  onGenerated
}: AILegalDocGeneratorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const { msalInstance } = useAuth();

  const docType = type === 'privacy-policy' ? 'Privacy Policy' : 'Terms of Use';

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const prompt = type === 'privacy-policy'
        ? `Generate a comprehensive Privacy Policy for a SaaS application. Include sections on: data collection, usage, storage, sharing, user rights, cookies, GDPR compliance, CCPA compliance, contact information. Make it professional and legally sound. Website: ${websiteUrl}`
        : `Generate comprehensive Terms of Use for a SaaS application. Include sections on: acceptable use, user obligations, intellectual property, disclaimers, limitations of liability, termination, governing law, dispute resolution. Make it professional and legally sound. Website: ${websiteUrl}`;

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
        current_text: `Generate ${docType}`,
        prompt: prompt
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
      console.log('Legal doc generation result:', result);

      if (result.success && result.regenerated_text) {
        setGeneratedContent(result.regenerated_text);
        toast.success(`${docType} generated successfully`);
      } else {
        throw new Error(result.message || 'Failed to generate document');
      }
    } catch (error) {
      console.error('Legal doc generation error:', error);
      toast.error(`Failed to generate ${docType}. Please try again.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setIsCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded successfully");
  };

  const handleUseDocument = () => {
    // In a real implementation, you would upload to storage and get a URL
    // For now, we'll prompt the user to host it themselves
    const placeholder = `https://yourdomain.com/${type}`;
    onGenerated(placeholder);
    toast.info(`Please host this document and update the URL. Placeholder added: ${placeholder}`);
    setIsOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => {
          setIsOpen(true);
          if (!generatedContent) {
            handleGenerate();
          }
        }}
        className="w-full"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        Generate {docType} with AI
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>AI-Generated {docType}</DialogTitle>
            <DialogDescription>
              Review the generated document below. You can edit it, copy it, or download it.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {isGenerating ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Generating {docType}...</span>
              </div>
            ) : (
              <Textarea
                value={generatedContent}
                onChange={(e) => setGeneratedContent(e.target.value)}
                rows={15}
                className="font-mono text-xs"
                placeholder="Generated content will appear here..."
              />
            )}
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={!generatedContent}
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={!generatedContent}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleUseDocument}
              disabled={!generatedContent}
            >
              Use This Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
