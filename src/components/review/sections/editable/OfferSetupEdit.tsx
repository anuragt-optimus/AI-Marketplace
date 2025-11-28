import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

interface OfferSetupEditProps {
  data: {
    offerAlias?: string;
    sellThroughMicrosoft?: boolean;
  };
  onSave: (data: any) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export const OfferSetupEdit = ({ data, onSave, onCancel, isSaving = false }: OfferSetupEditProps) => {
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      offerAlias: data?.offerAlias || "",
      sellThroughMicrosoft: data?.sellThroughMicrosoft || false,
    }
  });

  const sellThroughMicrosoft = watch("sellThroughMicrosoft");

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-4">
      <div>
        <Label htmlFor="offerAlias">Offer Alias</Label>
        <Input id="offerAlias" {...register("offerAlias")} placeholder="Enter offer alias" />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="sellThroughMicrosoft" 
          checked={sellThroughMicrosoft}
          onCheckedChange={(checked) => setValue("sellThroughMicrosoft", !!checked)}
        />
        <Label htmlFor="sellThroughMicrosoft" className="cursor-pointer">
          Sell through Microsoft
        </Label>
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
