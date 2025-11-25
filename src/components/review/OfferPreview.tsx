import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LegacyOfferData as OfferData } from "@/types/offer";

interface OfferPreviewProps {
  offerData: OfferData;
  activeSection: string;
  onSectionClick: (section: string) => void;
}

export const OfferPreview = ({ offerData, activeSection, onSectionClick }: OfferPreviewProps) => {
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const activeRef = sectionRefs.current[activeSection];
    if (activeRef) {
      activeRef.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeSection]);

  const Section = ({ 
    id, 
    title, 
    children 
  }: { 
    id: string; 
    title: string; 
    children: React.ReactNode;
  }) => (
    <div
      ref={(el) => (sectionRefs.current[id] = el)}
      onClick={() => onSectionClick(id)}
      className={`cursor-pointer transition-all rounded-lg p-4 ${
        activeSection === id ? "bg-primary/5 ring-2 ring-primary" : "hover:bg-muted/50"
      }`}
    >
      <h3 className="text-lg font-semibold text-foreground mb-3">{title}</h3>
      {children}
    </div>
  );

  return (
    <div className="h-full overflow-y-auto bg-background p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Marketplace Listing Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Section id="shortDescription" title="Short Description">
            <p className="text-sm text-muted-foreground">
              {offerData.shortDescription}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {offerData.shortDescription.length} / 160 characters
            </p>
          </Section>

          <Separator />

          <Section id="longDescription" title="Long Description">
            <p className="text-sm text-foreground leading-relaxed">
              {offerData.longDescription}
            </p>
          </Section>

          <Separator />

          <Section id="features" title="Features & Benefits">
            <ul className="space-y-2">
              {offerData.features.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span className="text-sm text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Separator />

          <Section id="useCases" title="Use Cases">
            <div className="grid gap-2">
              {offerData.useCases.map((useCase, idx) => (
                <Card key={idx} className="p-3">
                  <p className="text-sm text-foreground">{useCase}</p>
                </Card>
              ))}
            </div>
          </Section>

          <Separator />

          <Section id="plans" title="Plans & Pricing">
            <div className="grid gap-4">
              {offerData.plans.map((plan, idx) => (
                <Card key={idx} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-foreground">{plan.name}</h4>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-primary">${plan.price}</span>
                      <span className="text-sm text-muted-foreground">/{plan.billingPeriod}</span>
                    </div>
                  </div>
                  <ul className="space-y-1">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="text-sm text-muted-foreground flex items-center">
                        <span className="text-primary mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </Section>

          <Separator />

          <Section id="legalText" title="Legal Text">
            <p className="text-xs text-muted-foreground italic">
              {offerData.legalText}
            </p>
          </Section>

          <Separator />

          <Section id="media" title="Icons & Screenshots">
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium mb-2">Icons</h4>
                {offerData.icons.length > 0 ? (
                  <div className="flex gap-2">
                    {offerData.icons.map((icon, idx) => (
                      <div key={idx} className="w-16 h-16 bg-muted rounded border" />
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No icons uploaded</p>
                )}
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Screenshots</h4>
                {offerData.screenshots.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {offerData.screenshots.map((screenshot, idx) => (
                      <div key={idx} className="aspect-video bg-muted rounded border" />
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No screenshots uploaded</p>
                )}
              </div>
            </div>
          </Section>

          <Separator />

          <Section id="technicalConfig" title="Technical Configuration">
            <div className="space-y-2">
              {Object.entries(offerData.technicalConfig).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-2 px-3 bg-muted rounded">
                  <span className="text-sm font-medium text-foreground">{key}</span>
                  <Badge variant="secondary" className="font-mono text-xs">{value}</Badge>
                </div>
              ))}
            </div>
          </Section>
        </CardContent>
      </Card>
    </div>
  );
};
