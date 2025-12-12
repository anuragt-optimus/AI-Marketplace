import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";

interface ResellCSPEditProps {
  data: {
    resellThroughCSP?: "all" | "specific" | "none";
    specificCSPs?: string[];
  };
  onSave: (data: any) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export const ResellCSPEdit = ({ data, onSave, onCancel, isSaving = false }: ResellCSPEditProps) => {
  const { watch, setValue, handleSubmit } = useForm({
    defaultValues: {
      resellThroughCSP: data?.resellThroughCSP || "none",
    }
  });

  const [specificCSPs, setSpecificCSPs] = useState<string[]>(data?.specificCSPs || []);
  const [newCSP, setNewCSP] = useState("");

  const resellOption = watch("resellThroughCSP");

  const addCSP = () => {
    if (!newCSP.trim()) return;
    if (specificCSPs.includes(newCSP)) return;
    setSpecificCSPs([...specificCSPs, newCSP]);
    setNewCSP("");
  };

  const removeCSP = (csp: string) => {
    setSpecificCSPs(specificCSPs.filter(c => c !== csp));
  };

  const onSubmit = (formData: any) => {
    onSave({
      ...formData,
      specificCSPs: resellOption === "specific" ? specificCSPs : [],
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label>Resell Option</Label>
        <RadioGroup value={resellOption} onValueChange={(val) => setValue("resellThroughCSP", val as any)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all" className="cursor-pointer font-normal">
              Any partner in the CSP program
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="specific" id="specific" />
            <Label htmlFor="specific" className="cursor-pointer font-normal">
              Only specific CSP partners
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="none" />
            <Label htmlFor="none" className="cursor-pointer font-normal">
              Do not allow CSP resale
            </Label>
          </div>
        </RadioGroup>
      </div>

      {resellOption === "specific" && (
        <div>
          <Label htmlFor="newCSP">Add CSP Partner</Label>
          <div className="flex gap-2 mb-3">
            <Input
              id="newCSP"
              value={newCSP}
              onChange={(e) => setNewCSP(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCSP())}
              placeholder="CSP Partner Name or ID"
            />
            <Button type="button" size="sm" onClick={addCSP}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {specificCSPs.length > 0 && (
            <div className="space-y-2">
              {specificCSPs.map((csp, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded">
                  <span className="text-sm text-foreground">{csp}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCSP(csp)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
