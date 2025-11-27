import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";
import { AITextField } from "@/components/review/AITextField";

interface Plan {
  name: string;
  description?: string;
  price: number;
  billingPeriod: string;
  features?: string[];
  markets?: string[];
}

interface PlansEditProps {
  data: Plan[];
  websiteUrl: string;
  offerId: string;
  existingOfferData?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export const PlansEdit = ({ data, websiteUrl, offerId, existingOfferData, onSave, onCancel }: PlansEditProps) => {
  const [plans, setPlans] = useState<Plan[]>(data || []);

  const addPlan = () => {
    setPlans([...plans, {
      name: "",
      description: "",
      price: 0,
      billingPeriod: "month",
      features: [],
      markets: [],
    }]);
  };

  const removePlan = (index: number) => {
    setPlans(plans.filter((_, i) => i !== index));
  };

  const updatePlan = (index: number, field: keyof Plan, value: any) => {
    const updated = [...plans];
    updated[index] = { ...updated[index], [field]: value };
    setPlans(updated);
  };

  const updateFeatures = (index: number, featuresText: string) => {
    const features = featuresText.split('\n').filter(f => f.trim());
    updatePlan(index, 'features', features);
  };

  const handleSave = () => {
    onSave(plans);
  };

  return (
    <div className="space-y-6">
      {plans.map((plan, idx) => (
        <div key={idx} className="border rounded-lg p-4 space-y-4 bg-muted/50">
          <div className="flex items-center justify-between">
            <Label className="text-base">Plan {idx + 1}</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removePlan(idx)}
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <AITextField
              fieldName={`plans.${idx}.name`}
              section="plans"
              value={plan.name}
              onChange={(val) => updatePlan(idx, 'name', val)}
              label="Plan Name"
              placeholder="e.g., Basic, Pro, Enterprise"
              websiteUrl={websiteUrl}
              offerId={offerId}
              existingOfferData={existingOfferData}
            />
            <div>
              <Label>Billing Period</Label>
              <Select
                value={plan.billingPeriod}
                onValueChange={(val) => updatePlan(idx, 'billingPeriod', val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Monthly</SelectItem>
                  <SelectItem value="year">Yearly</SelectItem>
                  <SelectItem value="one-time">One-time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Price (USD)</Label>
            <Input
              type="number"
              value={plan.price}
              onChange={(e) => updatePlan(idx, 'price', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
            />
          </div>

          <AITextField
            fieldName={`plans.${idx}.description`}
            section="plans"
            value={plan.description || ""}
            onChange={(val) => updatePlan(idx, 'description', val)}
            label="Description"
            placeholder="Brief description of this plan"
            multiline
            rows={3}
            websiteUrl={websiteUrl}
            offerId={offerId}
            existingOfferData={existingOfferData}
          />

          <AITextField
            fieldName={`plans.${idx}.features`}
            section="plans"
            value={(plan.features || []).join('\n')}
            onChange={(val) => updateFeatures(idx, val)}
            label="Features (one per line)"
            placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
            multiline
            rows={5}
            websiteUrl={websiteUrl}
            offerId={offerId}
            existingOfferData={existingOfferData}
          />
        </div>
      ))}

      <Button type="button" variant="outline" onClick={addPlan} className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Plan
      </Button>

      <div className="flex gap-2 pt-4 border-t">
        <Button type="button" size="sm" onClick={handleSave}>
          Save Changes
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
