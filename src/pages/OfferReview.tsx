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
import { partnerCenterApi } from "@/services/partnerCenterApi";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const OfferReview = () => {
  const { offerId } = useParams();
  const navigate = useNavigate();
  const { msalInstance, isInitialized } = useAuth();
  const [activeSection, setActiveSection] = useState<string>("");
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [offerData, setOfferData] = useState<any>({
  offer_alias: "AI Video Suite",
  website_url: "https://example.com",

  offer_setup: {
    offerAlias: "AI Video Suite",
    sellThroughMicrosoft: true,
    enableTestDrive: false,
    category: "Productivity",
    publisherName: "TechLabs Inc.",
    type: "SaaS Subscription",
    visibility: "Public",
  },

  properties: {
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
    searchSummary: "Turn any text into a realistic video with avatars.",
    language: "English",
    description: "AI Video Generator allows users to create professional talking videos using realistic AI avatars and voices. Ideal for education, marketing, and enterprise training.",
    longDescription: "AI Video Generator allows users to create professional talking videos using realistic AI avatars and voices. Ideal for education, marketing, and enterprise training.",
    gettingStartedInstructions: "",
    images: [
      { type: "logo", url: "https://via.placeholder.com/200" },
      { type: "banner", url: "https://via.placeholder.com/600x200" },
    ],
    searchKeywords: [],
    contacts: {
      support: {},
      engineering: {},
    },
    marketingUrls: {
      website: "",
      privacyPolicy: "",
      supportUrl: "",
    },
    generalLinks: [],
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
    landingPageUrl: "https://example.com/landing",
    connectionWebhook: "https://example.com/webhook",
    entraAppId: "12345678-1234-1234-1234-123456789012",
    entraTenantId: "87654321-4321-4321-4321-210987654321",
    integrationType: "OAuth2",
    loginUrl: "https://example.com/login",
    webhookEnabled: true,
    apiDocs: "https://docs.example.com",
  },

  preview_audience: {
    previewAudience: ["preview.user@example.com", "qa@example.com"],
    testerEmails: ["preview.user@example.com", "qa@example.com"],
    allowSandboxTesting: true,
  },

  resell_csp: {
    resellThroughCSP: "all",
    specificCSPs: [],
    availableForResellers: true,
    partnerMargin: "15%",
    contractRequired: false,
  },

  supplemental_content: {
    supplementalContent: {
      saasScenario: "fullyHosted",
      subscriptionIds: ["12345678-1234-1234-1234-123456789012"]
    },
    documents: [
      { name: "User Guide", url: "https://via.placeholder.com/pdf" },
      { name: "Marketing Kit", url: "https://via.placeholder.com/pdf" },
    ],
    videos: [
      { name: "Product Walkthrough", url: "https://youtube.com/demo" },
    ],
  },
});

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);


 useEffect(() => {
  const loadOffer = async () => {
    // Only proceed if MSAL is initialized
    if (!isInitialized) {
      console.log("MSAL not initialized yet, waiting...");
      return;
    }

    try {
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
        product_id: raw.product_id, // Add product_id at the top level
        job_id: raw.job_id, // Add job_id at the top level
        created_at: raw.created_at, // Add created_at at the top level
        updated_at: raw.updated_at, // Add updated_at at the top level
        status: raw.status, // Add status at the top level
        
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
          name: listing?.title || "Untitled Offer",
          summary: listing?.searchResultSummary || "",
          searchSummary: listing?.searchResultSummary || "",
          language: listing?.languageId?.replace("-", "_") || "en_us",
          description: listing?.description || "",
          longDescription: listing?.description || "",
          gettingStartedInstructions: listing?.gettingStartedInstructions || "",
          images: [], // Would need to extract from somewhere else
          searchKeywords: listing?.searchKeywords || [],
          contacts: {
            support: listing?.supportContact || {},
            engineering: listing?.engineeringContact || {},
          },
          marketingUrls: {
            website: listing?.generalLinks?.[0]?.link || "",
            privacyPolicy: listing?.privacyPolicyLink || "",
            supportUrl: listing?.globalSupportWebsite || "",
          },
          generalLinks: listing?.generalLinks || [],
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
    } finally {
      setIsLoading(false);
    }
  };

  loadOffer();
}, [offerId, msalInstance, isInitialized]);


  const handleApproveAndPublish = async () => {
    try {
      //toast.success("Submitting offer to Partner Center...");
      
      // Get access token for authentication
      const accounts = msalInstance.getAllAccounts();
      if (!accounts.length) {
        toast.error("No authenticated account found");
        return;
      }

      const tokenResponse = await msalInstance.acquireTokenSilent({
        scopes: ["https://graph.microsoft.com/.default"],
        account: accounts[0],
      });

      // Submit to Partner Center API
      const response = await fetch(
        `https://ca-ailaunchpad-cc-001.wittysky-b9a849a9.canadacentral.azurecontainerapps.io/submit-to-partner-portal?offer_id=${offerId}`,
        {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${tokenResponse.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: ''
        }
      );

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Submit to Partner Center result:', result);
      
      if (result.job_status === 'running') {
        toast(`Submitting offer to Partner Center...`);
        
        // Update offer status to "in_progress" after successful submission
        try {
          // Convert current offer data to API format with status "in_progress"
          const apiPayload = await convertToApiFormat({...offerData, status: 'in_progress'});
          apiPayload.status = "in_progress";

          console.log('Updating offer status to in_progress with payload:',  JSON.stringify(apiPayload));
          
          // Send PUT request to update the offer status
          const updateResponse = await fetch(
            `https://ca-ailaunchpad-cc-001.wittysky-b9a849a9.canadacentral.azurecontainerapps.io/offers/${offerId}`,
            {
              method: 'PUT',
              headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenResponse.accessToken}`,
              },
              body: JSON.stringify(apiPayload)
            }
          );

          if (updateResponse.ok) {
            const updateResult = await updateResponse.json();
            console.log('Offer status updated to in_progress:', updateResult);
            
            // Update local state to reflect the status change
            setOfferData((prev: any) => ({
              ...prev,
              status: 'in_progress'
            }));
          } else {
            console.warn('Failed to update offer status to in_progress');
          }
        } catch (statusUpdateError) {
          console.error('Error updating offer status:', statusUpdateError);
          // Don't fail the whole process if status update fails
        }
        
        navigate(`/offer/publish/${offerId}`);
      } else {
        toast.error(`Submission failed: ${result.message || 'Unknown error'}`);
      }
      
    } catch (error) {
      console.error('Submit to Partner Center failed:', error);
      toast.error("Failed to submit offer to Partner Center");
    }
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

    setIsSaving(true); // Start loading
    
    try {
      const columnName = columnMap[sectionId];
      
      // Update local state first
      const updatedOfferData = {
        ...offerData,
        [columnName]: updatedData
      };
      
      setOfferData(updatedOfferData);

      // Convert updated offer data to API format
      const apiPayload = await convertToApiFormat(updatedOfferData);
      
      // Get authentication token
      const accounts = msalInstance.getAllAccounts();
      if (!accounts.length) {
        toast.error("No authenticated account found");
        return;
      }

      const tokenResponse = await msalInstance.acquireTokenSilent({
        scopes: ["https://graph.microsoft.com/.default"],
        account: accounts[0],
      });

      // Send PUT request to update the offer
      const response = await fetch(
        `https://ca-ailaunchpad-cc-001.wittysky-b9a849a9.canadacentral.azurecontainerapps.io/offers/${offerId}`,
        {
          method: 'PUT',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenResponse.accessToken}`,
          },
          body: JSON.stringify(apiPayload)
        }
      );

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Update offer result:', result);

      toast.success("Changes saved successfully");
      setEditingSection(null);
    } catch (error) {
      console.error('Error saving:', error);
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false); // End loading
    }
  };

  // Helper function to convert internal offer data to API format
  const convertToApiFormat = async (data: any) => {
    // Get the original offer data to preserve structure and IDs
    const originalData = offerData;
    console.log('-------------Converting to API format. Original data:', originalData.product_id);
    
    return {
      "$schema": "https://schema.mp.microsoft.com/schema/configure/2022-03-01-preview2",
      "id": offerId,
      "partner_center_account": "string",
      "resources": [
        {
          "$schema": "https://schema.mp.microsoft.com/schema/product/2022-03-01-preview3",
          "resourceName": "mySaaSProduct",
          "identity": {
            "externalId": data.properties?.sku || data.offer_setup?.offerAlias || "default-sku"
          },
          "type": "softwareAsAService",
          "alias": data.offer_setup?.offerAlias || "default-alias"
        },
        {
          "$schema": "https://schema.mp.microsoft.com/schema/commercial-marketplace-setup/2022-03-01-preview2",
          "resourceName": "marketplaceSetup",
          "product": data.product_id || "product/default",
          "sellThroughMicrosoft": data.offer_setup?.sellThroughMicrosoft || true
        },
        {
          "$schema": "https://schema.mp.microsoft.com/schema/property/2022-03-01-preview5",
          "resourceName": "productProperties",
          "product": data.product_id || "product/default",
          "kind": "azureSaaS",
          "termsConditions": data.properties?.legalInfo?.useStandardContract ? "standard" : "custom",
          "termsOfUseUrl": data.properties?.legalInfo?.termsOfUseUrl || "https://www.yourcompany.com/legal/terms-of-use",
          "termsOfUse": data.properties?.legalTerms || "Your custom terms and conditions text goes here.",
          "categories": {
            "web": [data.properties?.categories?.primary || "web"]
          },
          "industries": {},
          "appVersion": data.properties?.appVersion || "1.0.0"
        },
        {
          "$schema": "https://schema.mp.microsoft.com/schema/listing/2022-03-01-preview5",
          "resourceName": "mainListing",
          "kind": "azureSaaS",
          "product": data.product_id || "product/default",
          "languageId": data.offer_listing?.language?.replace("_", "-") || "en-us",
          "title": data.offer_listing?.name || "Untitled Offer",
          "searchResultSummary": data.offer_listing?.summary || data.offer_listing?.searchSummary || "",
          "description": data.offer_listing?.description || data.offer_listing?.longDescription || "",
          "gettingStartedInstructions": data.offer_listing?.gettingStartedInstructions || "",
          "searchKeywords": data.offer_listing?.searchKeywords || data.properties?.keywords || ["saas", "web", "cloud"],
          "supportContact": {
            "name": data.offer_listing?.contacts?.support?.name || "Support Team",
            "email": data.offer_listing?.contacts?.support?.email || data.properties?.supportContact || "support@yourcompany.com",
            "phone": data.offer_listing?.contacts?.support?.phone || "+1-800-123-4567",
            "url": data.offer_listing?.contacts?.support?.url || "https://yourcompany.com/support"
          },
          "engineeringContact": {
            "name": data.offer_listing?.contacts?.engineering?.name || "Engineering Team",
            "email": data.offer_listing?.contacts?.engineering?.email || "engineering@yourcompany.com",
            "phone": data.offer_listing?.contacts?.engineering?.phone || "+1-800-123-4568"
          },
          "generalLinks": data.offer_listing?.generalLinks || [
            {
              "displayText": "Company Website",
              "link": data.offer_listing?.marketingUrls?.website || data.website_url || "https://www.optimusinfo.com/"
            },
            {
              "displayText": "Documentation",
              "link": "https://docs.yourcompany.com"
            }
          ],
          "privacyPolicyLink": data.offer_listing?.marketingUrls?.privacyPolicy || data.properties?.legalInfo?.privacyPolicyUrl || "https://yourcompany.com/legal/privacy",
          "globalSupportWebsite": data.offer_listing?.marketingUrls?.supportUrl || data.website_url || "https://www.optimusinfo.com/"
        },
        {
          "$schema": "https://schema.mp.microsoft.com/schema/software-as-a-service-technical-configuration/2022-03-01-preview3",
          "resourceName": "technicalConfiguration",
          "product": data.product_id || "product/default",
          "landingPageUrl": data.technical_config?.landingPageUrl || "https://yourcompany.com/landing",
          "connectionWebhook": data.technical_config?.connectionWebhook || "https://yourcompany.com/api/webhook",
          "azureAdTenantId": data.technical_config?.entraTenantId || "00000000-0000-0000-0000-000000000000",
          "azureAdAppId": data.technical_config?.entraAppId || "00000000-0000-0000-0000-000000000000"
        },
        {
          "$schema": "https://schema.mp.microsoft.com/schema/price-and-availability-offer/2022-03-01-preview3",
          "resourceName": "priceAndAvailability",
          "product": data.product_id || "product/default",
          "previewAudiences": data.preview_audience?.previewAudience?.map((email: string) => ({
            "type": "email",
            "id": email,
            "label": `Preview User: ${email}`
          })) || [
            {
              "type": "email",
              "id": "user@example.com",
              "label": "Preview User 1"
            }
          ]
        },
        {
          "$schema": "https://schema.mp.microsoft.com/schema/reseller/2022-03-01-preview2",
          "resourceName": "resellerConfiguration",
          "product": data.product_id || "product/default",
          "resellerChannelState": data.resell_csp?.resellThroughCSP === "all" ? "all" : 
                                  data.resell_csp?.resellThroughCSP === "none" ? "none" : 
                                  data.resell_csp?.resellThroughCSP === "specific" ? "some" : "none",
          "audiences": data.resell_csp?.resellThroughCSP === "specific" ? (data.resell_csp?.specificCSPs || []) : []
        }
      ],
      "product_id": data.product_id || "product/default",
      "job_id": data.job_id || "default-job-id",
      "created_at": data.created_at || new Date().toISOString(),
      "updated_at": new Date().toISOString(),
      "status": "Draft"
    };
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
              isEditing={false}
            >
              <OfferSetupSection data={offerData.offer_setup || {}} />
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
                  data={offerData.properties || {}}
                  websiteUrl={offerData.website_url}
                  offerId={offerId || ''}
                  onSave={(data) => handleSaveSection('properties', data)}
                  onCancel={handleCancelEdit}
                  isSaving={isSaving}
                />
              }
            >
              <PropertiesSection data={offerData.properties || {}} />
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
                  data={offerData.offer_listing || {}}
                  websiteUrl={offerData.website_url}
                  offerId={offerId || ''}
                  existingOfferData={offerData}
                  onSave={(data) => handleSaveSection('offerListing', data)}
                  onCancel={handleCancelEdit}
                />
              }
            >
              <OfferListingSection data={offerData.offer_listing || {}} />
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
                  data={offerData.technical_config || {}}
                  onSave={(data) => handleSaveSection('technicalConfig', data)}
                  onCancel={handleCancelEdit}
                />
              }
            >
              <TechnicalConfigSection data={offerData.technical_config || {}} />
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
                  data={offerData.preview_audience || {}}
                  onSave={(data) => handleSaveSection('previewAudience', data)}
                  onCancel={handleCancelEdit}
                />
              }
            >
              <PreviewAudienceSection data={offerData.preview_audience || {}} />
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
                  data={offerData.resell_csp || {}}
                  onSave={(data) => handleSaveSection('resellCSP', data)}
                  onCancel={handleCancelEdit}
                />
              }
            >
              <ResellCSPSection data={offerData.resell_csp || {}} />
            </OfferSectionCard>

            {/* Supplemental Content */}
            {/* <OfferSectionCard
              sectionId="supplementalContent"
              title="Supplemental Content"
              isActive={activeSection === "supplementalContent"}
              isEditing={editingSection === "supplementalContent"}
              onEdit={handleEditSection}
              editComponent={
                <SupplementalContentEdit
                  data={{ supplementalContent: offerData.supplemental_content?.supplementalContent || {} }}
                  onSave={(data) => handleSaveSection('supplementalContent', data.supplementalContent)}
                  onCancel={handleCancelEdit}
                />
              }
            >
              <SupplementalContentSection data={{ supplementalContent: offerData.supplemental_content?.supplementalContent || {} }} />
            </OfferSectionCard> */}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OfferReview;
