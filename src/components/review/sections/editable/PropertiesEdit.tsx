import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { PRIMARY_CATEGORIES, INDUSTRIES } from "@/constants/partnerCenterCategories";
import { AISelectField } from "@/components/review/AISelectField";
import { AILegalDocGenerator } from "@/components/review/AILegalDocGenerator";

interface PropertiesEditProps {
  data: {
    categories?: { primary: string; secondary?: string[] };
    industries?: string[];
    appVersion?: string;
    legalInfo?: {
      useStandardContract: boolean;
      privacyPolicyUrl?: string;
      termsOfUseUrl?: string;
    };
  };
  websiteUrl: string;
  offerId: string;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export const PropertiesEdit = ({ data, websiteUrl, offerId, onSave, onCancel }: PropertiesEditProps) => {
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      categories: {
        primary: data?.categories?.primary || "",
      },
      appVersion: data?.appVersion || "",
      legalInfo: {
        useStandardContract: data?.legalInfo?.useStandardContract || false,
        privacyPolicyUrl: data?.legalInfo?.privacyPolicyUrl || "",
        termsOfUseUrl: data?.legalInfo?.termsOfUseUrl || "",
      },
    }
  });

  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(data?.industries || []);
  const primaryCategory = watch("categories.primary");
  const useStandardContract = watch("legalInfo.useStandardContract");

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prev =>
      prev.includes(industry) ? prev.filter(i => i !== industry) : [...prev, industry]
    );
  };

  const onSubmit = (formData: any) => {
    onSave({
      ...formData,
      industries: selectedIndustries,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <AISelectField
        fieldName="categories.primary"
        section="properties"
        value={primaryCategory}
        onChange={(val) => setValue("categories.primary", val as string)}
        label="Primary Category"
        websiteUrl={websiteUrl}
        offerId={offerId}
        options={PRIMARY_CATEGORIES}
      />
      
      <div>
        <Label>Primary Category (Manual Select)</Label>
        <Select value={primaryCategory} onValueChange={(val) => setValue("categories.primary", val)}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {PRIMARY_CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <AISelectField
        fieldName="industries"
        section="properties"
        value={selectedIndustries}
        onChange={(val) => setSelectedIndustries(val as string[])}
        label="Industries"
        websiteUrl={websiteUrl}
        offerId={offerId}
        multiple
        options={INDUSTRIES}
      />

      <div>
        <Label>Industries (Manual Select)</Label>
        <div className="border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
          {INDUSTRIES.map((industry) => (
            <div key={industry} className="flex items-center space-x-2">
              <Checkbox
                id={`industry-${industry}`}
                checked={selectedIndustries.includes(industry)}
                onCheckedChange={() => toggleIndustry(industry)}
              />
              <Label htmlFor={`industry-${industry}`} className="cursor-pointer text-sm font-normal">
                {industry}
              </Label>
            </div>
          ))}
        </div>
        {selectedIndustries.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedIndustries.map((industry) => (
              <Badge key={industry} variant="secondary" className="cursor-pointer" onClick={() => toggleIndustry(industry)}>
                {industry} <X className="w-3 h-3 ml-1" />
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="appVersion">App Version</Label>
        <Input id="appVersion" {...register("appVersion")} placeholder="e.g., 1.0.0" />
      </div>

      <div className="space-y-3">
        <Label>Legal Information</Label>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="useStandardContract"
            checked={useStandardContract}
            onCheckedChange={(checked) => setValue("legalInfo.useStandardContract", !!checked)}
          />
          <Label htmlFor="useStandardContract" className="cursor-pointer">
            Use Standard Contract
          </Label>
        </div>
        <div className="space-y-2">
          <Label htmlFor="privacyPolicyUrl">Privacy Policy URL</Label>
          <AILegalDocGenerator
            type="privacy-policy"
            websiteUrl={websiteUrl}
            currentUrl={watch("legalInfo.privacyPolicyUrl")}
            onGenerated={(url) => setValue("legalInfo.privacyPolicyUrl", url)}
          />
          <Input id="privacyPolicyUrl" {...register("legalInfo.privacyPolicyUrl")} placeholder="https://..." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="termsOfUseUrl">Terms of Use URL</Label>
          <AILegalDocGenerator
            type="terms-of-use"
            websiteUrl={websiteUrl}
            currentUrl={watch("legalInfo.termsOfUseUrl")}
            onGenerated={(url) => setValue("legalInfo.termsOfUseUrl", url)}
          />
          <Input id="termsOfUseUrl" {...register("legalInfo.termsOfUseUrl")} placeholder="https://..." />
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t">
        <Button type="submit" size="sm">
          Save Changes
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
