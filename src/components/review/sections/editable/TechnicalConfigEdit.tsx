import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TechnicalConfigEditProps {
  data: {
    landingPageUrl?: string;
    connectionWebhook?: string;
    entraAppId?: string;
    entraTenantId?: string;
  };
  onSave: (data: any) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export const TechnicalConfigEdit = ({ data, onSave, onCancel, isSaving = false }: TechnicalConfigEditProps) => {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      landingPageUrl: data?.landingPageUrl || "",
      connectionWebhook: data?.connectionWebhook || "",
      entraAppId: data?.entraAppId || "",
      entraTenantId: data?.entraTenantId || "",
    }
  });

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-4">
      <div>
        <Label htmlFor="landingPageUrl">Landing Page URL</Label>
        <Input id="landingPageUrl" {...register("landingPageUrl")} placeholder="https://..." type="url" />
      </div>

      <div>
        <Label htmlFor="connectionWebhook">Connection Webhook</Label>
        <Input id="connectionWebhook" {...register("connectionWebhook")} placeholder="https://..." type="url" />
      </div>

      <div>
        <Label htmlFor="entraAppId">Microsoft Entra App ID</Label>
        <Input id="entraAppId" {...register("entraAppId")} placeholder="Enter App ID" />
      </div>

      <div>
        <Label htmlFor="entraTenantId">Microsoft Entra Tenant ID</Label>
        <Input id="entraTenantId" {...register("entraTenantId")} placeholder="Enter Tenant ID" />
      </div>

      <div className="flex gap-2 pt-4 border-t">
        <Button type="submit" size="sm" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
