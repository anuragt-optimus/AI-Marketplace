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
<<<<<<< HEAD
import { partnerCenterApi } from "@/services/partnerCenterApi";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
=======
import { toast } from "sonner";
>>>>>>> 37b679081df77938da66b621e07bfb79a56632a3

const OfferReview = () => {
  const { offerId } = useParams();
  const navigate = useNavigate();
<<<<<<< HEAD
  const { msalInstance, isInitialized } = useAuth();
=======
>>>>>>> 37b679081df77938da66b621e07bfb79a56632a3
  const [activeSection, setActiveSection] = useState<string>("");
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [offerData, setOfferData] = useState<any>({
  offer_alias: "AI Video Suite",
  website_url: "https://example.com",

  offer_setup: {
<<<<<<< HEAD
    offerAlias: "AI Video Suite",
    sellThroughMicrosoft: true,
    enableTestDrive: false,
=======
>>>>>>> 37b679081df77938da66b621e07bfb79a56632a3
    category: "Productivity",
    publisherName: "TechLabs Inc.",
    type: "SaaS Subscription",
    visibility: "Public",
  },

  properties: {
<<<<<<< HEAD
    categories: {
      primary: "Productivity",
      secondary: ["AI", "Video", "Content Creation"]
    },
    industries: ["Technology", "Marketing", "Education"],
    appVersion: "v1.0",
    legalInfo: {
      useStandardContract: true,
      privacyPolicyUrl: "https://example.com/privacy",
      termsOfUseUrl: "https://example.com/terms"
    },
=======
>>>>>>> 37b679081df77938da66b621e07bfb79a56632a3
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
<<<<<<< HEAD
    landingPageUrl: "https://example.com/landing",
    connectionWebhook: "https://example.com/webhook",
    entraAppId: "12345678-1234-1234-1234-123456789012",
    entraTenantId: "87654321-4321-4321-4321-210987654321",
=======
>>>>>>> 37b679081df77938da66b621e07bfb79a56632a3
    integrationType: "OAuth2",
    loginUrl: "https://example.com/login",
    webhookEnabled: true,
    apiDocs: "https://docs.example.com",
  },

  preview_audience: {
<<<<<<< HEAD
    previewAudience: ["preview.user@example.com", "qa@example.com"],
=======
>>>>>>> 37b679081df77938da66b621e07bfb79a56632a3
    testerEmails: ["preview.user@example.com", "qa@example.com"],
    allowSandboxTesting: true,
  },

  resell_csp: {
<<<<<<< HEAD
    resellThroughCSP: "all",
    specificCSPs: [],
=======
>>>>>>> 37b679081df77938da66b621e07bfb79a56632a3
    availableForResellers: true,
    partnerMargin: "15%",
    contractRequired: false,
  },

  supplemental_content: {
<<<<<<< HEAD
    supplementalContent: {
      saasScenario: "fullyHosted",
      subscriptionIds: ["12345678-1234-1234-1234-123456789012"]
    },
=======
>>>>>>> 37b679081df77938da66b621e07bfb79a56632a3
    documents: [
      { name: "User Guide", url: "https://via.placeholder.com/pdf" },
      { name: "Marketing Kit", url: "https://via.placeholder.com/pdf" },
    ],
    videos: [
      { name: "Product Walkthrough", url: "https://youtube.com/demo" },
    ],
  },
});

<<<<<<< HEAD
  const [isLoading, setIsLoading] = useState(true);


 useEffect(() => {
  const loadOffer = async () => {
    // Only proceed if MSAL is initialized
    if (!isInitialized) {
      console.log("MSAL not initialized yet, waiting...");
=======
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
  const fetchOffer = async () => {
    if (!offerId) {
      toast.error("No offer ID provided");
      navigate("/offers");
>>>>>>> 37b679081df77938da66b621e07bfb79a56632a3
      return;
    }

    try {
<<<<<<< HEAD
      // 1. Get account
      const accounts = msalInstance.getAllAccounts();
      if (!accounts.length) {
        console.log("No accounts found");
        return;
      }

      // 2. Acquire token
      const tokenResponse = await msalInstance.acquireTokenSilent({
        scopes: ["https://graph.microsoft.com/.default"],
        account: accounts[0],
      });

      // 3. Fetch offer from your backend
      const res = await fetch(`https://ca-ailaunchpad-cc-001.wittysky-b9a849a9.canadacentral.azurecontainerapps.io/offers/${offerId}`, {
        headers: {
          Authorization: `Bearer ${tokenResponse.accessToken}`,
          Accept: "application/json",
        },
      });

      const raw = await res.json();
      console.log("Fetched offer data:", raw);

      // 4. Map to offerData structure
      // Find different resource types from the API response
      const productResource = raw.resources?.find((r: any) => r.type === "softwareAsAService");
      const marketplaceSetup = raw.resources?.find((r: any) => r.resourceName === "marketplaceSetup");
      const properties = raw.resources?.find((r: any) => r.resourceName === "productProperties");
      const listing = raw.resources?.find((r: any) => r.resourceName === "mainListing");
      const techConfig = raw.resources?.find((r: any) => r.resourceName === "technicalConfiguration");
      const priceAvailability = raw.resources?.find((r: any) => r.resourceName === "priceAndAvailability");
      const resellerConfig = raw.resources?.find((r: any) => r.resourceName === "resellerConfiguration");
      
      // Extract plans
      const planResources = raw.resources?.filter((r: any) => r.resourceName?.includes("Plan") && !r.resourceName?.includes("Pricing") && !r.resourceName?.includes("Listing"));
      const planListings = raw.resources?.filter((r: any) => r.resourceName?.includes("PlanListing"));
      const planPricings = raw.resources?.filter((r: any) => r.resourceName?.includes("PlanPricing"));
      
      // Map plans data
      const plans = planResources?.map((plan: any) => {
        const listing = planListings?.find((l: any) => l.plan?.externalId === plan.identity?.externalId);
        const pricing = planPricings?.find((p: any) => p.plan?.externalId === plan.identity?.externalId);
        
        return {
          name: plan.alias || listing?.name,
          description: listing?.description,
          price: pricing?.pricing?.recurrentPrice?.prices?.[0]?.pricePerPaymentInUsd,
          billingPeriod: pricing?.pricing?.recurrentPrice?.prices?.[0]?.billingTerm?.type,
          markets: pricing?.markets,
          features: [], // This would need to come from another source or be hardcoded
        };
      }) || [];

      setOfferData({
        offer_alias: productResource?.alias,
        website_url: listing?.generalLinks?.[0]?.link,
        
        offer_setup: {
          offerAlias: productResource?.alias,
          sellThroughMicrosoft: marketplaceSetup?.sellThroughMicrosoft || false,
          enableTestDrive: false, // This field doesn't seem to be in the API
          category: properties?.categories?.web?.[0] || "Web",
          publisherName: listing?.supportContact?.name || "Publisher",
          type: productResource?.type === "softwareAsAService" ? "SaaS" : "Unknown",
          visibility: priceAvailability?.audience || "Public",
        },

        properties: {
          categories: {
            primary: properties?.categories?.web?.[0] || "Web",
            secondary: properties?.categories?.web?.slice(1) || []
          },
          industries: properties?.industries?.other || [],
          appVersion: properties?.appVersion,
          legalInfo: {
            useStandardContract: properties?.termsConditions === "standard",
            privacyPolicyUrl: listing?.privacyPolicyLink,
            termsOfUseUrl: properties?.termsOfUseUrl
          },
          sku: productResource?.identity?.externalId,
          publisherId: raw.product_id,
          version: properties?.appVersion,
          keywords: listing?.searchKeywords || [],
          supportContact: listing?.supportContact?.email,
          legalTerms: properties?.termsOfUse,
        },

        offer_listing: {
          name: listing?.title,
          searchSummary: listing?.searchResultSummary,
          language: listing?.languageId?.replace("-", "_") || "en_us",
          description: listing?.description,
          gettingStartedInstructions: listing?.gettingStartedInstructions,
          images: [], // Would need to extract from somewhere else
          searchKeywords: listing?.searchKeywords,
          contacts: {
            support: listing?.supportContact,
            engineering: listing?.engineeringContact,
          },
          marketingUrls: {
            website: listing?.generalLinks?.[0]?.link,
            privacyPolicy: listing?.privacyPolicyLink,
            supportUrl: listing?.globalSupportWebsite,
          },
          generalLinks: listing?.generalLinks,
        },

        plans: plans,

        technical_config: {
          landingPageUrl: techConfig?.landingPageUrl,
          connectionWebhook: techConfig?.connectionWebhook,
          entraAppId: techConfig?.azureAdAppId,
          entraTenantId: techConfig?.azureAdTenantId,
          integrationType: "OAuth2",
          loginUrl: techConfig?.landingPageUrl,
          webhookEnabled: !!techConfig?.connectionWebhook,
        },

        preview_audience: {
          previewAudience: priceAvailability?.previewAudiences?.map((p: any) => p.id) || [],
          testerEmails: priceAvailability?.previewAudiences?.map((p: any) => p.id) || [],
          allowSandboxTesting: true,
        },

        resell_csp: {
          resellThroughCSP: resellerConfig?.resellerChannelState || "none",
          specificCSPs: resellerConfig?.audiences || [],
          availableForResellers: resellerConfig?.resellerChannelState === "all",
          partnerMargin: "15%",
          contractRequired: false,
        },

        supplemental_content: {
          supplementalContent: {
            saasScenario: "fullyHosted",
            subscriptionIds: []
          },
          documents: [],
          videos: [],
        },
      });
    } catch (error) {
      console.error("Error loading offer:", error);
      // Continue with demo data for now
=======
      // const { data, error } = await supabase
      //   .from("offers")
      //   .select("*")
      //   .eq("id", offerId)
      //   .single();

      // if (!error && data) {
      //   setOfferData(data);
      // } else {
      //   console.warn("⚠️ Supabase returned no data — using mock offer.");
      // }
    } catch (err) {
      console.warn("⚠️ Supabase fetch error — using mock offer.", err);
>>>>>>> 37b679081df77938da66b621e07bfb79a56632a3
    } finally {
      setIsLoading(false);
    }
  };

<<<<<<< HEAD
  loadOffer();
}, [offerId, msalInstance, isInitialized]);


  const handleApproveAndPublish = async () => {
    try {
      toast.success("Preparing to publish offer...");
      
      // Test Partner Center API connection
      console.log('Testing Partner Center API for publishing...');
      
      try {
        // Try to get offer status from Partner Center
        const status = await partnerCenterApi.getOfferStatus(offerId!);
        console.log('Partner Center offer status:', status);
      } catch (apiError) {
        console.log('Partner Center API test failed:', apiError);
        // Continue with demo flow for now
      }
      
      navigate(`/offer/publish/${offerId}`);
    } catch (error) {
      console.error('Publish preparation failed:', error);
      toast.error("Failed to prepare offer for publishing");
    }
=======
  fetchOffer();
}, [offerId]);


  const handleApproveAndPublish = () => {
    toast.success("Preparing to publish offer...");
    navigate(`/offer/publish/${offerId}`);
>>>>>>> 37b679081df77938da66b621e07bfb79a56632a3
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
      // const { error } = await supabase
      //   .from('offers')
      //   .update({ [columnName]: updatedData })
      //   .eq('id', offerId);

      // if (error) throw error;

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
<<<<<<< HEAD
                  data={offerData.offer_setup || {}}
=======
                  data={offerData.offer_setup}
>>>>>>> 37b679081df77938da66b621e07bfb79a56632a3
                  onSave={(data) => handleSaveSection('offerSetup', data)}
                  onCancel={handleCancelEdit}
                />
              }
            >
<<<<<<< HEAD
              <OfferSetupSection data={offerData.offer_setup || {}} />
=======
              <OfferSetupSection data={offerData.offer_setup} />
>>>>>>> 37b679081df77938da66b621e07bfb79a56632a3
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
<<<<<<< HEAD
                  data={offerData.properties || {}}
=======
                  data={offerData.properties}
>>>>>>> 37b679081df77938da66b621e07bfb79a56632a3
                  websiteUrl={offerData.website_url}
                  offerId={offerId || ''}
                  onSave={(data) => handleSaveSection('properties', data)}
                  onCancel={handleCancelEdit}
                />
              }
            >
<<<<<<< HEAD
              <PropertiesSection data={offerData.properties || {}} />
=======
              <PropertiesSection data={offerData.properties} />
>>>>>>> 37b679081df77938da66b621e07bfb79a56632a3
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
<<<<<<< HEAD
                  data={offerData.offer_listing || {}}
=======
                  data={offerData.offer_listing}
>>>>>>> 37b679081df77938da66b621e07bfb79a56632a3
                  websiteUrl={offerData.website_url}
                  offerId={offerId || ''}
                  existingOfferData={offerData}
                  onSave={(data) => handleSaveSection('offerListing', data)}
                  onCancel={handleCancelEdit}
                />
              }
            >
<<<<<<< HEAD
              <OfferListingSection data={offerData.offer_listing || {}} />
=======
              <OfferListingSection data={offerData.offer_listing} />
>>>>>>> 37b679081df77938da66b621e07bfb79a56632a3
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
<<<<<<< HEAD
                  data={offerData.technical_config || {}}
=======
                  data={offerData.technical_config}
>>>>>>> 37b679081df77938da66b621e07bfb79a56632a3
                  onSave={(data) => handleSaveSection('technicalConfig', data)}
                  onCancel={handleCancelEdit}
                />
              }
            >
<<<<<<< HEAD
              <TechnicalConfigSection data={offerData.technical_config || {}} />
=======
              <TechnicalConfigSection data={offerData.technical_config} />
>>>>>>> 37b679081df77938da66b621e07bfb79a56632a3
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
<<<<<<< HEAD
                  data={offerData.preview_audience || {}}
=======
                  data={offerData.preview_audience}
>>>>>>> 37b679081df77938da66b621e07bfb79a56632a3
                  onSave={(data) => handleSaveSection('previewAudience', data)}
                  onCancel={handleCancelEdit}
                />
              }
            >
<<<<<<< HEAD
              <PreviewAudienceSection data={offerData.preview_audience || {}} />
=======
              <PreviewAudienceSection data={offerData.preview_audience} />
>>>>>>> 37b679081df77938da66b621e07bfb79a56632a3
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
<<<<<<< HEAD
                  data={offerData.resell_csp || {}}
=======
                  data={offerData.resell_csp}
>>>>>>> 37b679081df77938da66b621e07bfb79a56632a3
                  onSave={(data) => handleSaveSection('resellCSP', data)}
                  onCancel={handleCancelEdit}
                />
              }
            >
<<<<<<< HEAD
              <ResellCSPSection data={offerData.resell_csp || {}} />
=======
              <ResellCSPSection data={offerData.resell_csp} />
>>>>>>> 37b679081df77938da66b621e07bfb79a56632a3
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
<<<<<<< HEAD
                  data={{ supplementalContent: offerData.supplemental_content?.supplementalContent || {} }}
=======
                  data={{ supplementalContent: offerData.supplemental_content }}
>>>>>>> 37b679081df77938da66b621e07bfb79a56632a3
                  onSave={(data) => handleSaveSection('supplementalContent', data.supplementalContent)}
                  onCancel={handleCancelEdit}
                />
              }
            >
<<<<<<< HEAD
              <SupplementalContentSection data={{ supplementalContent: offerData.supplemental_content?.supplementalContent || {} }} />
=======
              <SupplementalContentSection data={{ supplementalContent: offerData.supplemental_content }} />
>>>>>>> 37b679081df77938da66b621e07bfb79a56632a3
            </OfferSectionCard>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OfferReview;
