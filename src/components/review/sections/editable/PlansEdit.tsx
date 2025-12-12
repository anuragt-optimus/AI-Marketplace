import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, X } from "lucide-react";
import { AITextField } from "@/components/review/AITextField";
import { MARKETS } from "@/constants/markets";

interface Plan {
  name: string;
  description?: string;
  price: number;
  billingPeriod: string;
  features?: string[];
  markets?: string[];
  pricingModel?: "flatRate" | "perUser";
  userLimits?: {
    min: number;
    max: number;
  };
}

interface PlansEditProps {
  data: Plan[];
  websiteUrl: string;
  offerId: string;
  existingOfferData?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export const PlansEdit = ({ data, websiteUrl, offerId, existingOfferData, onSave, onCancel, isSaving = false }: PlansEditProps) => {
  const [plans, setPlans] = useState<Plan[]>(data?.map(plan => ({
    ...plan,
    pricingModel: plan.pricingModel || "flatRate",
    userLimits: plan.userLimits || { min: 1, max: 10000 }
  })) || []);

  const addPlan = () => {
    setPlans([...plans, {
      name: "",
      description: "",
      price: 0,
      billingPeriod: "month",
      features: [],
      markets: [],
      pricingModel: "flatRate",
      userLimits: {
        min: 1,
        max: 10000
      }
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

  const addMarket = (planIndex: number, market: string) => {
    const plan = plans[planIndex];
    const currentMarkets = plan.markets || [];
    if (!currentMarkets.includes(market)) {
      updatePlan(planIndex, 'markets', [...currentMarkets, market]);
    }
  };

  const removeMarket = (planIndex: number, marketToRemove: string) => {
    const plan = plans[planIndex];
    const currentMarkets = plan.markets || [];
    updatePlan(planIndex, 'markets', currentMarkets.filter(market => market !== marketToRemove));
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

          <div className="space-y-3">
            <Label>Markets</Label>
            <div className="space-y-2">
              <Select onValueChange={(market) => addMarket(idx, market)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select markets" />
                </SelectTrigger>
                <SelectContent>
                  {MARKETS.filter(market => !(plan.markets || []).includes(market)).map((market) => (
                    <SelectItem key={market} value={market}>
                      {market}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(plan.markets || []).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {(plan.markets || []).map((market, marketIdx) => (
                    <Badge key={marketIdx} variant="outline" className="text-xs">
                      {market}
                      <button
                        type="button"
                        onClick={() => removeMarket(idx, market)}
                        className="ml-1 text-red-500 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <Label>Pricing Model</Label>
            <RadioGroup
              value={plan.pricingModel || "flatRate"}
              onValueChange={(val) => updatePlan(idx, 'pricingModel', val as "flatRate" | "perUser")}
              className="flex gap-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="flatRate" id={`flatRate-${idx}`} />
                <Label htmlFor={`flatRate-${idx}`}>Flat Rate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="perUser" id={`perUser-${idx}`} />
                <Label htmlFor={`perUser-${idx}`}>Per User</Label>
              </div>
            </RadioGroup>
          </div>

          {(plan.pricingModel === "perUser") && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Minimum Users</Label>
                <Input
                  type="number"
                  value={plan.userLimits?.min || 1}
                  onChange={(e) => updatePlan(idx, 'userLimits', {
                    ...plan.userLimits,
                    min: parseInt(e.target.value) || 1
                  })}
                  placeholder="1"
                  min="1"
                />
              </div>
              <div>
                <Label>Maximum Users</Label>
                <Input
                  type="number"
                  value={plan.userLimits?.max || 10000}
                  onChange={(e) => updatePlan(idx, 'userLimits', {
                    ...plan.userLimits,
                    max: parseInt(e.target.value) || 10000
                  })}
                  placeholder="10000"
                  min="1"
                />
              </div>
            </div>
          )}

          <div>
            <Label>
              Price (USD) {plan.pricingModel === "perUser" ? "per user" : ""}
            </Label>
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

         
        </div>
      ))}

      <Button type="button" variant="outline" onClick={addPlan} className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Plan
      </Button>

      <div className="flex gap-2 pt-4 border-t">
        <Button type="button" size="sm" onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
      </div>
    </div>
  );
};
