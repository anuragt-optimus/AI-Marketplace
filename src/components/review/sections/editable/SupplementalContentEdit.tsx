import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";

interface SupplementalContentEditProps {
  data: {
    supplementalContent?: {
      saasScenario?: "fullyHosted" | "partiallyHosted" | "notHosted";
      subscriptionIds?: string[];
    };
  };
  onSave: (data: any) => void;
  onCancel: () => void;
}

export const SupplementalContentEdit = ({ data, onSave, onCancel }: SupplementalContentEditProps) => {
  const { watch, setValue, handleSubmit } = useForm({
    defaultValues: {
      saasScenario: data?.supplementalContent?.saasScenario || "notHosted",
    }
  });

  const [subscriptionIds, setSubscriptionIds] = useState<string[]>(
    data?.supplementalContent?.subscriptionIds || []
  );
  const [newId, setNewId] = useState("");

  const saasScenario = watch("saasScenario");

  const addSubscriptionId = () => {
    if (!newId.trim()) return;
    if (subscriptionIds.includes(newId)) return;
    setSubscriptionIds([...subscriptionIds, newId]);
    setNewId("");
  };

  const removeSubscriptionId = (id: string) => {
    setSubscriptionIds(subscriptionIds.filter(subId => subId !== id));
  };

  const onSubmit = (formData: any) => {
    onSave({
      supplementalContent: {
        ...formData,
        subscriptionIds,
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label>SaaS Hosting Scenario</Label>
        <Select value={saasScenario} onValueChange={(val) => setValue("saasScenario", val as any)}>
          <SelectTrigger>
            <SelectValue placeholder="Select scenario" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fullyHosted">Fully hosted in Azure</SelectItem>
            <SelectItem value="partiallyHosted">Partially hosted in Azure</SelectItem>
            <SelectItem value="notHosted">Not hosted in Azure</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="newId">Azure Subscription IDs</Label>
        <div className="flex gap-2 mb-3">
          <Input
            id="newId"
            value={newId}
            onChange={(e) => setNewId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSubscriptionId())}
            placeholder="Subscription ID"
          />
          <Button type="button" size="sm" onClick={addSubscriptionId}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {subscriptionIds.length > 0 && (
          <div className="space-y-2">
            {subscriptionIds.map((id, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded">
                <code className="text-xs text-foreground font-mono">{id}</code>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSubscriptionId(id)}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
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
