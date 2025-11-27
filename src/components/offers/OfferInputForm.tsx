import { useState } from "react";
import { Upload, Globe, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OfferTypeSelector } from "@/components/offers/OfferTypeSelector";
import { AccountSelector } from "@/components/offers/AccountSelector";
import { ProgramSelector } from "@/components/offers/ProgramSelector";
import { MOCK_ACCOUNTS, getEnrolledPrograms, getOfferTypesByProgram } from "@/constants/mockPartnerCenterData";

interface OfferInputFormProps {
  onGenerate: (url: string, offerAlias: string, offerType: string) => void;
}

export const OfferInputForm = ({ onGenerate }: OfferInputFormProps) => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [selectedOfferType, setSelectedOfferType] = useState<string | null>(null);
  const [offerAlias, setOfferAlias] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  // Get programs based on selected account
  const availablePrograms = selectedAccount 
    ? getEnrolledPrograms(selectedAccount) 
    : [];

  // Get offer types based on selected program
  const availableOfferTypes = selectedProgram 
    ? getOfferTypesByProgram(selectedProgram) 
    : [];

  // Reset logic when selections change
  const handleAccountSelect = (accountId: string) => {
    setSelectedAccount(accountId);
    setSelectedProgram(null);
    setSelectedOfferType(null);
  };

  const handleProgramSelect = (programId: string) => {
    setSelectedProgram(programId);
    setSelectedOfferType(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = () => {
    if (offerAlias && websiteUrl && selectedOfferType) {
      onGenerate(websiteUrl, offerAlias, selectedOfferType);
    }
  };

  // Validate alias format: 3-50 chars, lowercase, numbers, hyphens only
  const isValidAlias = /^[a-z0-9-]{3,50}$/.test(offerAlias);
  const canSubmit = selectedAccount && selectedProgram && selectedOfferType && offerAlias && websiteUrl && isValidAlias;

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI-Powered Offer Generation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Account Selection */}
          <AccountSelector
            accounts={MOCK_ACCOUNTS}
            selectedAccount={selectedAccount}
            onSelect={handleAccountSelect}
          />

          {/* Step 2: Program Selection (only show if account selected) */}
          {selectedAccount && (
            <ProgramSelector
              programs={availablePrograms}
              selectedProgram={selectedProgram}
              onSelect={handleProgramSelect}
            />
          )}

          {/* Step 3: Offer Type Selection (only show if program selected) */}
          {selectedProgram && (
            <OfferTypeSelector
              offerTypes={availableOfferTypes}
              selectedType={selectedOfferType}
              onSelect={setSelectedOfferType}
            />
          )}

          {/* Offer Alias */}
          <div className="space-y-2">
            <Label htmlFor="alias" className="text-sm font-medium">
              Offer Alias
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="alias"
              type="text"
              placeholder="my-saas-product"
              value={offerAlias}
              onChange={(e) => setOfferAlias(e.target.value.toLowerCase())}
              className={offerAlias && !isValidAlias ? "border-destructive" : ""}
            />
            <p className="text-xs text-muted-foreground">
              3-50 characters, lowercase letters, numbers, and hyphens only
            </p>
            {offerAlias && !isValidAlias && (
              <p className="text-xs text-destructive">
                Invalid format. Use only lowercase letters, numbers, and hyphens.
              </p>
            )}
          </div>

          {/* Website URL */}
          <div className="space-y-2">
            <Label htmlFor="website" className="text-sm font-medium">
              Product Website URL
              <span className="text-destructive ml-1">*</span>
            </Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="website"
                type="url"
                placeholder="https://yourproduct.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="pl-10"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              AI will analyze your website to generate the marketplace listing
            </p>
          </div>

          {/* Optional Files */}
          <div className="space-y-2">
            <Label htmlFor="files" className="text-sm font-medium">
              Additional Documents (Optional)
            </Label>
            <label
              htmlFor="files"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground">
                {files.length > 0
                  ? `${files.length} file(s) selected`
                  : "Click to upload product brochures, specs, etc."}
              </span>
              <input
                id="files"
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
              />
            </label>
          </div>

          {/* Info Box */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-4 space-y-2 text-sm">
              <p className="font-medium">What happens next?</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• AI analyzes your website and extracts key information</li>
                <li>• Generates professional marketplace descriptions</li>
                <li>• Suggests pricing, categories, and technical details</li>
                <li>• You review and customize everything before publishing</li>
              </ul>
            </CardContent>
          </Card>

          {/* Generate Button */}
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full"
            size="lg"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Marketplace Listing
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
