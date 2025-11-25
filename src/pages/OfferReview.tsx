import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { OfferSectionCard } from "@/components/review/OfferSectionCard";
import { OfferSetupSection } from "@/components/review/sections/OfferSetupSection";
import { OfferListingSection } from "@/components/review/sections/OfferListingSection";
import { PropertiesSection } from "@/components/review/sections/PropertiesSection";
import { TechnicalConfigSection } from "@/components/review/sections/TechnicalConfigSection";
import { PreviewAudienceSection } from "@/components/review/sections/PreviewAudienceSection";
import { ResellCSPSection } from "@/components/review/sections/ResellCSPSection";
import { SupplementalContentSection } from "@/components/review/sections/SupplementalContentSection";
import { OfferSetupEdit } from "@/components/review/sections/editable/OfferSetupEdit";
import { PropertiesEdit } from "@/components/review/sections/editable/PropertiesEdit";
import { OfferListingEdit } from "@/components/review/sections/editable/OfferListingEdit";
import { PlansEdit } from "@/components/review/sections/editable/PlansEdit";
import { TechnicalConfigEdit } from "@/components/review/sections/editable/TechnicalConfigEdit";
import { PreviewAudienceEdit } from "@/components/review/sections/editable/PreviewAudienceEdit";
import { ResellCSPEdit } from "@/components/review/sections/editable/ResellCSPEdit";
import { SupplementalContentEdit } from "@/components/review/sections/editable/SupplementalContentEdit";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const OfferReview = () => {
  const { offerId } = useParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>("");
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [offerData, setOfferData] = useState<any>({
  offer_alias: "AI Video Suite",
  website_url: "https://example.com",

  offer_setup: {
    category: "Productivity",
    publisherName: "TechLabs Inc.",
    type: "SaaS Subscription",
    visibility: "Public",
  },

  properties: {
    sku: "AI-VIDEO-SUITE-001",
    publisherId: "PUB-123456",
    version: "v1.0",
    keywords: ["AI", "video", "generator", "content"],
    supportContact: "support@example.com",
    legalTerms: "Standard SaaS subscription applies.",
  },

  offer_listing: {
    name: "AI Video Generator",
    summary: "Turn any text into a realistic video with avatars.",
    language: "English",
    longDescription:
      "AI Video Generator allows users to create professional talking videos using realistic AI avatars and voices. Ideal for education, marketing, and enterprise training.",
    images: [
      { type: "logo", url: "https://via.placeholder.com/200" },
      { type: "banner", url: "https://via.placeholder.com/600x200" },
    ],
  },

  plans: [
    {
      name: "Starter Plan",
      description: "Ideal for individuals and small teams",
      price: 19,
      billingPeriod: "month",
      features: ["10 videos/month", "Standard voice library", "Email support"],
      markets: ["US", "IN", "UK"],
    },
    {
      name: "Enterprise Plan",
      description: "Best for companies and agencies",
      price: 99,
      billingPeriod: "month",
      features: [
        "Unlimited videos",
        "Premium avatars",
        "Multilingual support",
        "Priority support",
      ],
      markets: ["Global"],
    },
  ],

  technical_config: {
    integrationType: "OAuth2",
    loginUrl: "https://example.com/login",
    webhookEnabled: true,
    apiDocs: "https://docs.example.com",
  },

  preview_audience: {
    testerEmails: ["preview.user@example.com", "qa@example.com"],
    allowSandboxTesting: true,
  },

  resell_csp: {
    availableForResellers: true,
    partnerMargin: "15%",
    contractRequired: false,
  },

  supplemental_content: {
    documents: [
      { name: "User Guide", url: "https://via.placeholder.com/pdf" },
      { name: "Marketing Kit", url: "https://via.placeholder.com/pdf" },
    ],
    videos: [
      { name: "Product Walkthrough", url: "https://youtube.com/demo" },
    ],
  },
});

  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
  const fetchOffer = async () => {
    if (!offerId) {
      toast.error("No offer ID provided");
      navigate("/offers");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .eq("id", offerId)
        .single();

      if (!error && data) {
        setOfferData(data);
      } else {
        console.warn("⚠️ Supabase returned no data — using mock offer.");
      }
    } catch (err) {
      console.warn("⚠️ Supabase fetch error — using mock offer.", err);
    } finally {
      setIsLoading(false);
    }
  };

  fetchOffer();
}, [offerId]);


  const handleApproveAndPublish = () => {
    toast.success("Preparing to publish offer...");
    navigate(`/offer/publish/${offerId}`);
  };

  const handleEditSection = (sectionId: string, sectionName: string) => {
    setActiveSection(sectionId);
    setEditingSection(sectionId);
  };

  const handleSaveSection = async (sectionId: string, updatedData: any) => {
    const columnMap: Record<string, string> = {
      'offerSetup': 'offer_setup',
      'properties': 'properties',
      'offerListing': 'offer_listing',
      'plans': 'plans',
      'technicalConfig': 'technical_config',
      'previewAudience': 'preview_audience',
      'resellCSP': 'resell_csp',
      'supplementalContent': 'supplemental_content'
    };

    try {
      const columnName = columnMap[sectionId];
      const { error } = await supabase
        .from('offers')
        .update({ [columnName]: updatedData })
        .eq('id', offerId);

      if (error) throw error;

      setOfferData((prev: any) => ({
        ...prev,
        [columnName]: updatedData
      }));

      toast.success("Changes saved successfully");
      setEditingSection(null);
    } catch (error) {
      console.error('Error saving:', error);
      toast.error("Failed to save changes");
    }
  };

  const handleCancelEdit = () => {
    setEditingSection(null);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col bg-background">
          <div className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur-sm px-8 py-4 flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="flex-1 px-8 py-6 max-w-5xl mx-auto w-full">
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!offerData) {
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen flex flex-col bg-background">
        <div className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur-sm px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {offerData.offer_listing?.name || "Review Offer"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {offerData.offer_alias || `ID: ${offerId}`}
            </p>
          </div>
          <Button onClick={handleApproveAndPublish} size="lg" className="bg-primary hover:bg-primary/90">
            Submit to Partner Center
          </Button>
        </div>

        <div className="flex-1 px-8 py-6 max-w-5xl mx-auto w-full">
          <div className="space-y-6 animate-fade-in">
            {/* Offer Setup */}
            <OfferSectionCard
              sectionId="offerSetup"
              title="Offer Setup"
              isActive={activeSection === "offerSetup"}
              isEditing={editingSection === "offerSetup"}
              onEdit={handleEditSection}
              editComponent={
                <OfferSetupEdit
                  data={offerData.offer_setup}
                  onSave={(data) => handleSaveSection('offerSetup', data)}
                  onCancel={handleCancelEdit}
                />
              }
            >
              <OfferSetupSection data={offerData.offer_setup} />
            </OfferSectionCard>

            {/* Properties */}
            <OfferSectionCard
              sectionId="properties"
              title="Properties"
              isActive={activeSection === "properties"}
              isEditing={editingSection === "properties"}
              onEdit={handleEditSection}
              editComponent={
                <PropertiesEdit
                  data={offerData.properties}
                  websiteUrl={offerData.website_url}
                  offerId={offerId || ''}
                  onSave={(data) => handleSaveSection('properties', data)}
                  onCancel={handleCancelEdit}
                />
              }
            >
              <PropertiesSection data={offerData.properties} />
            </OfferSectionCard>

            {/* Offer Listing */}
            <OfferSectionCard
              sectionId="offerListing"
              title="Offer Listing"
              isActive={activeSection === "offerListing"}
              isEditing={editingSection === "offerListing"}
              onEdit={handleEditSection}
              editComponent={
                <OfferListingEdit
                  data={offerData.offer_listing}
                  websiteUrl={offerData.website_url}
                  offerId={offerId || ''}
                  existingOfferData={offerData}
                  onSave={(data) => handleSaveSection('offerListing', data)}
                  onCancel={handleCancelEdit}
                />
              }
            >
              <OfferListingSection data={offerData.offer_listing} />
            </OfferSectionCard>

            {/* Plans & Pricing */}
            {offerData.plans && offerData.plans.length > 0 && (
              <OfferSectionCard
                sectionId="plans"
                title="Plans & Pricing"
                isActive={activeSection === "plans"}
                isEditing={editingSection === "plans"}
                onEdit={handleEditSection}
                editComponent={
                  <PlansEdit
                    data={offerData.plans}
                    websiteUrl={offerData.website_url}
                    offerId={offerId || ''}
                    existingOfferData={offerData}
                    onSave={(data) => handleSaveSection('plans', data)}
                    onCancel={handleCancelEdit}
                  />
                }
              >
                <div className="grid gap-4">
                  {offerData.plans.map((plan: any, idx: number) => (
                    <div key={idx} className="p-4 border rounded-lg bg-background">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-foreground">{plan.name}</h4>
                          {plan.description && (
                            <p className="text-sm text-muted-foreground">{plan.description}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-primary">
                            ${plan.pricing?.basePrice || plan.price || 0}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            /{plan.billing?.term || plan.billingPeriod || "month"}
                          </span>
                        </div>
                      </div>
                      {plan.features && (
                        <ul className="space-y-1">
                          {plan.features.map((feature: string, fIdx: number) => (
                            <li key={fIdx} className="text-sm text-muted-foreground flex items-center">
                              <span className="text-primary mr-2">✓</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      )}
                      {plan.markets && (
                        <div className="mt-2 pt-2 border-t">
                          <p className="text-xs text-muted-foreground">
                            Markets: {plan.markets.join(", ")}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </OfferSectionCard>
            )}

            {/* Technical Configuration */}
            <OfferSectionCard
              sectionId="technicalConfig"
              title="Technical Configuration"
              isActive={activeSection === "technicalConfig"}
              isEditing={editingSection === "technicalConfig"}
              onEdit={handleEditSection}
              editComponent={
                <TechnicalConfigEdit
                  data={offerData.technical_config}
                  onSave={(data) => handleSaveSection('technicalConfig', data)}
                  onCancel={handleCancelEdit}
                />
              }
            >
              <TechnicalConfigSection data={offerData.technical_config} />
            </OfferSectionCard>

            {/* Preview Audience */}
            <OfferSectionCard
              sectionId="previewAudience"
              title="Preview Audience"
              isActive={activeSection === "previewAudience"}
              isEditing={editingSection === "previewAudience"}
              onEdit={handleEditSection}
              editComponent={
                <PreviewAudienceEdit
                  data={offerData.preview_audience}
                  onSave={(data) => handleSaveSection('previewAudience', data)}
                  onCancel={handleCancelEdit}
                />
              }
            >
              <PreviewAudienceSection data={offerData.preview_audience} />
            </OfferSectionCard>

            {/* Resell through CSPs */}
            <OfferSectionCard
              sectionId="resellCSP"
              title="Resell through CSPs"
              isActive={activeSection === "resellCSP"}
              isEditing={editingSection === "resellCSP"}
              onEdit={handleEditSection}
              editComponent={
                <ResellCSPEdit
                  data={offerData.resell_csp}
                  onSave={(data) => handleSaveSection('resellCSP', data)}
                  onCancel={handleCancelEdit}
                />
              }
            >
              <ResellCSPSection data={offerData.resell_csp} />
            </OfferSectionCard>

            {/* Supplemental Content */}
            <OfferSectionCard
              sectionId="supplementalContent"
              title="Supplemental Content"
              isActive={activeSection === "supplementalContent"}
              isEditing={editingSection === "supplementalContent"}
              onEdit={handleEditSection}
              editComponent={
                <SupplementalContentEdit
                  data={{ supplementalContent: offerData.supplemental_content }}
                  onSave={(data) => handleSaveSection('supplementalContent', data.supplementalContent)}
                  onCancel={handleCancelEdit}
                />
              }
            >
              <SupplementalContentSection data={{ supplementalContent: offerData.supplemental_content }} />
            </OfferSectionCard>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OfferReview;
