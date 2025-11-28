import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X, Loader2 } from "lucide-react";
import { PRIMARY_CATEGORIES } from "@/constants/partnerCenterCategories";
import { AISelectField } from "@/components/review/AISelectField";

interface PropertiesEditProps {
  data: {
    categories?: { primary: string; secondary?: string[] };
    appVersion?: string;
    legalInfo?: {
      useStandardContract: boolean;
      privacyPolicyUrl?: string;
      termsOfUseUrl?: string;
    };
    standardContractAmendment?: string;
  };
  websiteUrl: string;
  offerId: string;
  onSave: (data: any) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export const PropertiesEdit = ({ data, websiteUrl, offerId, onSave, onCancel, isSaving = false }: PropertiesEditProps) => {
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
      standardContractAmendment: data?.standardContractAmendment || "",
    }
  });

  const primaryCategory = watch("categories.primary");
  const useStandardContract = watch("legalInfo.useStandardContract");

  const onSubmit = (formData: any) => {
    onSave(formData);
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
        
        {useStandardContract && (
          <div className="space-y-2 pl-6 border-l-2 border-primary/20">
            <Label htmlFor="standardContractAmendment">Standard Contract Amendment</Label>
            <Textarea 
              id="standardContractAmendment" 
              {...register("standardContractAmendment")} 
              placeholder="Enter any amendments or additions to the standard contract..."
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Optional: Add any specific terms or amendments to the standard Microsoft contract.
            </p>
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="privacyPolicyUrl">Privacy Policy URL</Label>
          <Input id="privacyPolicyUrl" {...register("legalInfo.privacyPolicyUrl")} placeholder="https://..." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="termsOfUseUrl">Terms of Use URL</Label>
          <Input id="termsOfUseUrl" {...register("legalInfo.termsOfUseUrl")} placeholder="https://..." />
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t">
        <Button type="submit" size="sm" disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
