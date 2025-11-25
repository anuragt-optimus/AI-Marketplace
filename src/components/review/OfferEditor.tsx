import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { LegacyOfferData as OfferData } from "@/types/offer";

interface OfferEditorProps {
  offerData: OfferData;
  onUpdate: (data: OfferData) => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const OfferEditor = ({ offerData, onUpdate, activeSection, onSectionChange }: OfferEditorProps) => {
  const updateField = <K extends keyof OfferData>(field: K, value: OfferData[K]) => {
    onUpdate({ ...offerData, [field]: value });
  };

  const addFeature = () => {
    updateField("features", [...offerData.features, ""]);
  };

  const removeFeature = (index: number) => {
    updateField("features", offerData.features.filter((_, i) => i !== index));
  };

  const updateFeature = (index: number, value: string) => {
    const updated = [...offerData.features];
    updated[index] = value;
    updateField("features", updated);
  };

  const addUseCase = () => {
    updateField("useCases", [...offerData.useCases, ""]);
  };

  const removeUseCase = (index: number) => {
    updateField("useCases", offerData.useCases.filter((_, i) => i !== index));
  };

  const updateUseCase = (index: number, value: string) => {
    const updated = [...offerData.useCases];
    updated[index] = value;
    updateField("useCases", updated);
  };

  return (
    <div className="h-full overflow-y-auto bg-muted/30 p-6">
      <Tabs value={activeSection} onValueChange={onSectionChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="shortDescription">Description</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="technicalConfig">Technical</TabsTrigger>
        </TabsList>

        <TabsContent value="shortDescription" className="space-y-4">
          <div>
            <Label htmlFor="shortDescription" className="text-foreground">Short Description</Label>
            <Textarea
              id="shortDescription"
              value={offerData.shortDescription}
              onChange={(e) => updateField("shortDescription", e.target.value)}
              maxLength={160}
              className="mt-2"
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {offerData.shortDescription.length} / 160 characters
            </p>
          </div>

          <div>
            <Label htmlFor="longDescription" className="text-foreground">Long Description</Label>
            <Textarea
              id="longDescription"
              value={offerData.longDescription}
              onChange={(e) => updateField("longDescription", e.target.value)}
              className="mt-2"
              rows={8}
            />
          </div>

          <div>
            <Label htmlFor="legalText" className="text-foreground">Legal Text</Label>
            <Textarea
              id="legalText"
              value={offerData.legalText}
              onChange={(e) => updateField("legalText", e.target.value)}
              className="mt-2"
              rows={4}
            />
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-foreground">Features & Benefits</Label>
              <Button onClick={addFeature} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Add Feature
              </Button>
            </div>
            <div className="space-y-2">
              {offerData.features.map((feature, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    value={feature}
                    onChange={(e) => updateFeature(idx, e.target.value)}
                    placeholder="Enter feature"
                  />
                  <Button
                    onClick={() => removeFeature(idx)}
                    size="icon"
                    variant="ghost"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-foreground">Use Cases</Label>
              <Button onClick={addUseCase} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                Add Use Case
              </Button>
            </div>
            <div className="space-y-2">
              {offerData.useCases.map((useCase, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    value={useCase}
                    onChange={(e) => updateUseCase(idx, e.target.value)}
                    placeholder="Enter use case"
                  />
                  <Button
                    onClick={() => removeUseCase(idx)}
                    size="icon"
                    variant="ghost"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
          {offerData.plans.map((plan, planIdx) => (
            <Card key={planIdx}>
              <CardContent className="pt-6 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor={`plan-name-${planIdx}`}>Plan Name</Label>
                    <Input
                      id={`plan-name-${planIdx}`}
                      value={plan.name}
                      onChange={(e) => {
                        const updated = [...offerData.plans];
                        updated[planIdx].name = e.target.value;
                        updateField("plans", updated);
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`plan-price-${planIdx}`}>Price</Label>
                    <Input
                      id={`plan-price-${planIdx}`}
                      type="number"
                      value={plan.price}
                      onChange={(e) => {
                        const updated = [...offerData.plans];
                        updated[planIdx].price = Number(e.target.value);
                        updateField("plans", updated);
                      }}
                    />
                  </div>
                </div>
                <div>
                  <Label>Plan Features</Label>
                  <div className="space-y-2 mt-2">
                    {plan.features.map((feature, fIdx) => (
                      <Input
                        key={fIdx}
                        value={feature}
                        onChange={(e) => {
                          const updated = [...offerData.plans];
                          updated[planIdx].features[fIdx] = e.target.value;
                          updateField("plans", updated);
                        }}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="technicalConfig" className="space-y-4">
          <div>
            <Label className="text-foreground mb-3 block">Technical Configuration</Label>
            <div className="space-y-3">
              {Object.entries(offerData.technicalConfig).map(([key, value]) => (
                <div key={key}>
                  <Label htmlFor={`tech-${key}`} className="text-sm text-muted-foreground">
                    {key.replace(/_/g, " ").toUpperCase()}
                  </Label>
                  <Input
                    id={`tech-${key}`}
                    value={value}
                    onChange={(e) => {
                      updateField("technicalConfig", {
                        ...offerData.technicalConfig,
                        [key]: e.target.value
                      });
                    }}
                    className="mt-1"
                  />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
