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
import { MediaSection } from "@/components/review/sections/MediaSection";
import { PropertiesEdit } from "@/components/review/sections/editable/PropertiesEdit";
import { OfferListingEdit } from "@/components/review/sections/editable/OfferListingEdit";
import { PlansEdit } from "@/components/review/sections/editable/PlansEdit";
import { TechnicalConfigEdit } from "@/components/review/sections/editable/TechnicalConfigEdit";
import { PreviewAudienceEdit } from "@/components/review/sections/editable/PreviewAudienceEdit";
import { ResellCSPEdit } from "@/components/review/sections/editable/ResellCSPEdit";
import { MediaEdit } from "@/components/review/sections/editable/MediaEdit";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { COUNTRY_NAME_TO_CODE, COUNTRY_CODE_TO_NAME } from "@/constants/markets";
import { htmlToPlainText, sanitizeHtml, plainTextToHtml } from "@/utils/htmlUtils";

const OfferReview = () => {
  const { offerId } = useParams();
  const navigate = useNavigate();
  const { msalInstance, isInitialized } = useAuth();
  const [activeSection, setActiveSection] = useState<string>("");
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [originalMediaAssets, setOriginalMediaAssets] = useState<any[]>([]); // Store original media asset resources
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
      industries: ["Education", "MediaAndCommunications", "ProfessionalServices"],
      appVersion: "v1.0",
      legalInfo: {
        useStandardContract: true,
        privacyPolicyUrl: "https://example.com/privacy",
        termsOfUseType: "url" as const,
        termsOfUseUrl: "https://example.com/terms",
        termsOfUseText: ""
      },
      standardContractAmendment: "This is a sample standard contract amendment text.",
      useMicrosoftLicenseManagement: false,
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
        markets: ["United States", "India", "United Kingdom"],
        pricingModel: "flatRate",
        userLimits: { min: 1, max: 10000 }
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
        pricingModel: "perUser",
        userLimits: { min: 1, max: 10000 }
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

    media: {
      logos: {
        large: "",
      },
      screenshots: [],
    },
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


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
        
        // Extract media assets
        const mediaAssets = raw.resources?.filter((r: any) => 
          r.resourceName?.includes("logo") || 
          r.resourceName?.includes("screenshot") || 
          r.type?.includes("Logo") || 
          r.type?.includes("Screenshot")
        ) || [];
        
        console.log("Found media assets:", mediaAssets);
        
        // Store original media assets for preservation
        setOriginalMediaAssets(mediaAssets);
        
        // Map media assets to logos and screenshots
        const mediaData = {
          logos: {
            large: mediaAssets.find((asset: any) => 
              asset.type === "azureLogoLarge" || 
              asset.resourceName === "logoLarge"
            )?.url || "",
          },
          screenshots: mediaAssets
            .filter((asset: any) => 
              asset.type === "azureLogoScreenshot" || 
              asset.resourceName?.includes("screenshot")
            )
            .sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0))
            .map((asset: any) => asset.url) // Just return the URL string
        };

        // Map plans data
        const plans = planResources?.map((plan: any) => {
          const listing = planListings?.find((l: any) => l.plan?.externalId === plan.identity?.externalId);
          const pricing = planPricings?.find((p: any) => p.plan?.externalId === plan.identity?.externalId);

          return {
            name: plan.alias || listing?.name,
            description: listing?.description ? htmlToPlainText(listing.description) : "",
            price: pricing?.pricing?.recurrentPrice?.prices?.[0]?.pricePerPaymentInUsd,
            billingPeriod: pricing?.pricing?.recurrentPrice?.prices?.[0]?.billingTerm?.type,
            markets: convertCountryCodesToNames(pricing?.markets || []),
            features: [], // This would need to come from another source or be hardcoded
            pricingModel: pricing?.pricing?.recurrentPrice?.recurrentPriceMode || "flatRate",
            userLimits: pricing?.pricing?.recurrentPrice?.userLimits || { min: 1, max: 10000 }
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
            // useMicrosoftLicenseManagement: properties?.useMicrosoftLicenseManagement || false,
            useMicrosoftLicenseManagementService: properties?.useMicrosoftLicenseManagementService,
            requireLicenseForInstall: properties?.requireLicenseForInstall,
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
            industries: parseIndustriesFromApi(properties?.industries),
            appVersion: properties?.appVersion,
            legalInfo: {
              useStandardContract: properties?.termsConditions === "standardMicrosoft" || properties?.termsConditions === "standard",
              privacyPolicyUrl: listing?.privacyPolicyLink,
              termsOfUseUrl: properties?.termsOfUseUrl || "",
              termsOfUseText: properties?.termsOfUse || "",
              termsOfUseType: properties?.termsOfUseUrl ? "url" as const : "text" as const
            },
            standardContractAmendment: properties?.standardContractAmendment || "",
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
            description: listing?.description ? htmlToPlainText(listing.description) : "",
            longDescription: listing?.description ? htmlToPlainText(listing.description) : "",
            gettingStartedInstructions: listing?.gettingStartedInstructions ? htmlToPlainText(listing.gettingStartedInstructions) : "",
            images: [], // Would need to extract from somewhere else
            searchKeywords: listing?.searchKeywords || [],
            contacts: {
              support: listing?.supportContact || {},
              engineering: listing?.engineeringContact || {},
              csp: listing?.cloudSolutionProviderContact || {},
            },
            cloudSolutionProviderMarketingMaterials: listing?.cloudSolutionProviderMarketingMaterials || "",
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

          media: mediaData,
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
    setIsSubmitting(true); // Start loading

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
          const apiPayload = await convertToApiFormat({ ...offerData, status: 'in_progress' });
          apiPayload.status = "in_progress";

          console.log('Updating offer status to in_progress with payload:', JSON.stringify(apiPayload));

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
    } finally {
      setIsSubmitting(false); // End loading
    }
  };

  const handleEditSection = (sectionId: string, sectionName: string) => {
    // Prevent editing if the offer has been submitted
    if (offerData?.status === 'in_progress' || offerData?.status === 'submitted') {
      toast.error("Cannot edit offer that has been submitted to Partner Center");
      return;
    }
    
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
      'supplementalContent': 'supplemental_content',
      'media': 'media'
    };

    setIsSaving(true); // Start loading

    try {
      const columnName = columnMap[sectionId];
      
      // Update local state first
      const updatedOfferData = {
        ...offerData,
        [columnName]: updatedData
      };      setOfferData(updatedOfferData);

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

      // Handle media uploads first if this is a media section save
      if (sectionId === 'media' && updatedData.files) {
        console.log('Media section detected, uploading files:', updatedData.files);
        
        // Upload media files - this stores data to DB via the endpoint
        await uploadMediaAssets(tokenResponse.accessToken, updatedData.files);
        
        // Media upload is complete, don't call PUT endpoint
        toast.success("Changes saved successfully");
        setEditingSection(null);
        return; // Exit early after media upload
      }

      // Convert updated offer data to API format
      const apiPayload = await convertToApiFormat(updatedOfferData);
      
      // Preserve existing media assets by updating the originalMediaAssets state
      if (updatedOfferData.media) {
        const currentMediaAssets: any[] = [];
        
        // Add large logo if it exists and is not a blob URL
        if (updatedOfferData.media?.logos?.large && !updatedOfferData.media.logos.large.startsWith('blob:')) {
          currentMediaAssets.push({
            "$schema": "https://schema.mp.microsoft.com/schema/listing-asset/2022-03-01-preview5",
            "resourceName": "logoLarge",
            "kind": "azure",
            "product": updatedOfferData.product_id || "product/default",
            "listing": { "resourceName": "mainListing" },
            "languageId": "en-us",
            "type": "azureLogoLarge",
            "fileName": updatedOfferData.media.logos.large.split('/').pop() || "logo-large.png",
            "friendlyName": "Large Logo (216x216)",
            "description": "Large Logo (216x216) for marketplace listing",
            "displayOrder": 0,
            "url": updatedOfferData.media.logos.large
          });
        }
        
        // Add screenshot assets
        if (updatedOfferData.media?.screenshots) {
          updatedOfferData.media.screenshots
            .filter((screenshot: string) => screenshot && !screenshot.startsWith('blob:'))
            .forEach((screenshot: string, index: number) => {
              currentMediaAssets.push({
                "$schema": "https://schema.mp.microsoft.com/schema/listing-asset/2022-03-01-preview5",
                "resourceName": `screenshot${index + 1}`,
                "kind": "azure",
                "product": updatedOfferData.product_id || "product/default",
                "listing": { "resourceName": "mainListing" },
                "languageId": "en-us",
                "type": "azureLogoScreenshot",
                "fileName": screenshot.split('/').pop() || `screenshot-${index + 1}.png`,
                "friendlyName": `Screenshot ${index + 1}`,
                "description": `Screenshot ${index + 1} for marketplace listing`,
                "displayOrder": index,
                "url": screenshot
              });
            });
        }
        
        setOriginalMediaAssets(currentMediaAssets);
      }

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

  // Helper function to upload media assets
  const uploadMediaAssets = async (accessToken: string, files: any) => {
    try {
      const formData = new FormData();

      // Add logo files - only large logo
      if (files.logoLarge) {
        formData.append('logo_large', files.logoLarge);
      }

      // Add screenshot files
      if (files.screenshots) {
        files.screenshots.forEach((screenshot: File, index: number) => {
          formData.append(`screenshot_${index + 1}`, screenshot);
        });
      }

      console.log('Uploading media assets with formData:', {
        logoLarge: !!files.logoLarge,
        screenshots: files.screenshots?.length || 0
      });

      const response = await fetch(
        `https://ca-ailaunchpad-cc-001.wittysky-b9a849a9.canadacentral.azurecontainerapps.io/offers/${offerId}/upload-assets`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          body: formData
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Asset upload failed:', {
          status: response.status,
          statusText: response.statusText,
          errorBody: errorText
        });
        throw new Error(`Asset upload failed with status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('------Asset upload result:', result);
      
      // Update local media data with the URLs from the response
      if (result.urls) {
        const updatedMediaData = {
          logos: {
            large: result.urls.logo_large || offerData.media?.logos?.large || "",
          },
          screenshots: result.urls.screenshots || offerData.media?.screenshots || []
        };
        
        // Update the local offer data with the new media URLs
        setOfferData((prev: any) => ({
          ...prev,
          media: updatedMediaData
        }));
        
        // Update originalMediaAssets with new asset resources
        if (result.urls) {
          const newMediaAssets = [];
          
          if (result.urls.logo_large) {
            newMediaAssets.push({
              "$schema": "https://schema.mp.microsoft.com/schema/listing-asset/2022-03-01-preview5",
              "resourceName": "logoLarge",
              "kind": "azure",
              "product": offerData.product_id || "product/default",
              "listing": { "resourceName": "mainListing" },
              "languageId": "en-us",
              "type": "azureLogoLarge",
              "fileName": result.urls.logo_large.split('/').pop() || "logo-large.png",
              "friendlyName": "Large Logo (216x216)",
              "description": "Large Logo (216x216) for marketplace listing",
              "displayOrder": 0,
              "url": result.urls.logo_large
            });
          }
          
          if (result.urls.screenshots && result.urls.screenshots.length > 0) {
            result.urls.screenshots.forEach((screenshotUrl: string, index: number) => {
              newMediaAssets.push({
                "$schema": "https://schema.mp.microsoft.com/schema/listing-asset/2022-03-01-preview5",
                "resourceName": `screenshot${index + 1}`,
                "kind": "azure",
                "product": offerData.product_id || "product/default",
                "listing": { "resourceName": "mainListing" },
                "languageId": "en-us",
                "type": "azureLogoScreenshot",
                "fileName": screenshotUrl.split('/').pop() || `screenshot-${index + 1}.png`,
                "friendlyName": `Screenshot ${index + 1}`,
                "description": `Screenshot ${index + 1} for marketplace listing`,
                "displayOrder": index,
                "url": screenshotUrl
              });
            });
          }
          
          // Update originalMediaAssets by removing old assets and adding new ones
          setOriginalMediaAssets(prev => {
            // Remove assets that were just uploaded
            let filtered = prev.filter(asset => {
              if (result.urls.logo_large && (asset.type === "azureLogoLarge" || asset.resourceName === "logoLarge")) return false;
              if (result.urls.screenshots && (asset.type === "azureLogoScreenshot" || asset.resourceName?.includes("screenshot"))) return false;
              return true;
            });
            // Add new assets
            return [...filtered, ...newMediaAssets];
          });
        }
      }
      
      toast.success("Media assets uploaded successfully");
      
      // Force reload the page to reflect the changes
      setTimeout(() => {
        window.location.reload();
      }, 1000); // Wait 1 second for toast to be visible

    } catch (error) {
      console.error('Error uploading assets:', error);
      toast.error(`Failed to upload media assets: ${error.message}`);
      throw error;
    }
  };

  // Helper function to determine the correct API kind based on offer type
  const getOfferKind = (offerData: any) => {
    const offerType = offerData.offer_setup?.type;
    console.log('Detected offer type:', offerType, 'Full offer_setup:', offerData.offer_setup);

    switch (offerType) {
      case 'SaaS':
        return 'azureSaaS';
      case 'VM':
      case 'Virtual Machine':
        return 'azureVM';
      case 'Container':
        return 'azureContainer';
      case 'Managed Application':
        return 'azureManagedApplication';
      default:
        return 'azureVM';
    }

  };

  // Default countries for plans
  const default_countries = ["United States", "Canada", "United Kingdom"];

  // Helper function to convert country names to country codes for API
  const convertCountryNamesToCodes = (countryNames: string[]): string[] => {
    return countryNames.map(name => {
      // If it's already a code (2 letters), return as is
      if (name.length === 2) {
        return name.toLowerCase();
      }
      // Convert name to code
      return COUNTRY_NAME_TO_CODE[name] || name.toLowerCase();
    });
  };

  // Helper function to convert country codes from API to country names for UI
  const convertCountryCodesToNames = (countryCodes: string[]): string[] => {
    if (!countryCodes || !Array.isArray(countryCodes)) {
      return [];
    }
    return countryCodes.map(code => {
      const lowerCode = code.toLowerCase();
      return COUNTRY_CODE_TO_NAME[lowerCode] || code;
    });
  };

  // Helper function to convert industries object back to array
  const parseIndustriesFromApi = (industriesObj: any) => {
    if (!industriesObj || typeof industriesObj !== 'object') {
      return [];
    }
    
    // If it's already an array (old format), return as is
    if (Array.isArray(industriesObj)) {
      return industriesObj;
    }
    
    // Convert object keys back to array (using original names)
    return Object.keys(industriesObj);
  };

  // Helper function to transform industries array to object structure (using original names)
  const transformIndustries = (industries: string[]) => {
    const industriesObject: Record<string, string[]> = {};
    industries.forEach(industry => {
      industriesObject[industry] = [industry];
    });
    console.log('Transformed industries:', { original: industries, transformed: industriesObject });
    return industriesObject;
  };

  // Helper function to convert internal offer data to API format
  const convertToApiFormat = async (data: any) => {
    // Get the original offer data to preserve structure and IDs
    const originalData = offerData;
    const offerKind = getOfferKind(data);
    
    console.log('Converting to API format. Original data:', originalData.product_id);
    console.log('Current originalMediaAssets:', originalMediaAssets);
    console.log('Current data.media:', data.media);

    return {
      "$schema": "https://schema.mp.microsoft.com/schema/configure/2022-03-01-preview2",
      "id": offerId,
      "partner_center_account": "string",
      "resources": [
        {
          "$schema": "https://schema.mp.microsoft.com/schema/product/2022-03-01-preview3",
          "resourceName": "mySaaSProduct",
          "identity": {
            "externalId": (() => {
              const baseId = data.properties?.sku || data.offer_setup?.offerAlias || "default-sku";
              // Remove all non-alphanumeric characters except hyphens, convert to lowercase, ensure it starts with letter
              let cleanId = baseId.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
              // Ensure it starts with a letter
              if (!/^[a-z]/.test(cleanId)) {
                cleanId = 'offer-' + cleanId;
              }
              // Ensure it's between 3-50 characters and doesn't end with hyphen
              cleanId = cleanId.replace(/-+$/, '').substring(0, 50);
              return cleanId.length < 3 ? 'offer-' + cleanId : cleanId;
            })()
          },
          "type": "softwareAsAService",
          "alias": data.offer_setup?.offerAlias || "default-alias"
        },
        {
          "$schema": "https://schema.mp.microsoft.com/schema/commercial-marketplace-setup/2022-03-01-preview2",
          "resourceName": "marketplaceSetup",
          "product": data.product_id || "product/default",
          "sellThroughMicrosoft": data.offer_setup?.sellThroughMicrosoft || true,
          "useMicrosoftLicenseManagement": data.properties?.useMicrosoftLicenseManagement || false,
          ...(data.properties?.useMicrosoftLicenseManagementService !== undefined && {
            "useMicrosoftLicenseManagementService": data.properties.useMicrosoftLicenseManagementService
          }),
          ...(data.properties?.requireLicenseForInstall !== undefined && {
            "requireLicenseForInstall": data.properties.requireLicenseForInstall
          })
        },
        {
          "$schema": "https://schema.mp.microsoft.com/schema/property/2022-03-01-preview5",
          "resourceName": "productProperties",
          "product": data.product_id || "product/default",
          "kind": offerKind,
          "termsConditions": data.properties?.legalInfo?.useStandardContract ? "standardMicrosoft" : "custom",
          "standardContractAmendment": data.properties?.legalInfo?.useStandardContract ? (data.properties?.standardContractAmendment || "") : undefined,
          "termsOfUseUrl": data.properties?.legalInfo?.termsOfUseType === "url" ?
            (data.properties?.legalInfo?.termsOfUseUrl || "https://www.yourcompany.com/legal/terms-of-use") :
            undefined,
          "termsOfUse": data.properties?.legalInfo?.termsOfUseType === "text" ?
            (data.properties?.legalInfo?.termsOfUseText || data.properties?.legalTerms || "Your custom terms and conditions text goes here.") :
            (data.properties?.legalTerms || "Your custom terms and conditions text goes here."),
          "categories": {
            "web": [data.properties?.categories?.primary || "web"]
          },
          "industries": data.properties?.industries && data.properties.industries.length > 0 ? 
            transformIndustries(data.properties.industries) : {},
          "appVersion": data.properties?.appVersion || "1.0.0"
        },
        {
          "$schema": "https://schema.mp.microsoft.com/schema/listing/2022-03-01-preview5",
          "resourceName": "mainListing",
          "kind": offerKind,
          "product": data.product_id || "product/default",
          "languageId": data.offer_listing?.language?.replace("_", "-") || "en-us",
          "title": data.offer_listing?.name || "Untitled Offer",
          "searchResultSummary": data.offer_listing?.summary || data.offer_listing?.searchSummary || "",
          "description": plainTextToHtml(data.offer_listing?.description || data.offer_listing?.longDescription || ""),
          "gettingStartedInstructions": plainTextToHtml(data.offer_listing?.gettingStartedInstructions || ""),
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
          "cloudSolutionProviderContact": {
            "name": data.offer_listing?.contacts?.csp?.name || "CSP Contact",
            "email": data.offer_listing?.contacts?.csp?.email || "csp@yourcompany.com",
            "phone": data.offer_listing?.contacts?.csp?.phone || "+1-800-000-0000"
          },
          "cloudSolutionProviderMarketingMaterials": data.offer_listing?.cloudSolutionProviderMarketingMaterials || "https://cspmarketingmaterials.com",
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
        },
        // Add plan resources dynamically
        ...(data.plans ? data.plans.flatMap((plan: any, index: number) => {
          const planExternalId = `${plan.name || `plan-${index + 1}`}`.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
          const planResourceName = `${planExternalId}Plan`;
          const planListingResourceName = `${planExternalId}PlanListing`;
          const planPricingResourceName = `${planExternalId}PlanPricing`;

          const billingTerm = plan.billingPeriod === "month" ? { type: "month", value: 1 } :
            plan.billingPeriod === "year" ? { type: "year", value: 1 } :
              { type: "month", value: 1 };

          return [
            // Plan Resource
            {
              "$schema": "https://schema.mp.microsoft.com/schema/plan/2022-03-01-preview3",
              "resourceName": planResourceName,
              "product": data.product_id || "product/default",
              "identity": {
                "externalId": planExternalId
              },
              "alias": plan.name || `Plan ${index + 1}`
            },
            // Plan Listing Resource
            {
              "$schema": "https://schema.mp.microsoft.com/schema/plan-listing/2022-03-01-preview5",
              "resourceName": planListingResourceName,
              "kind": "azureSaaS-plan",
              "product": data.product_id || "product/default",
              "plan": {
                "externalId": planExternalId
              },
              "languageId": "en-us",
              "name": plan.name || `Plan ${index + 1}`,
              "description": plainTextToHtml(plan.description || `Plan ${index + 1} description`)
            },
            // Plan Pricing Resource
            {
              "$schema": "https://schema.mp.microsoft.com/schema/price-and-availability-plan/2022-03-01-preview4",
              "resourceName": planPricingResourceName,
              "product": data.product_id || "product/default",
              "plan": {
                "externalId": planExternalId
              },
              "audience": "public",
              "markets": convertCountryNamesToCodes(plan.markets || default_countries),
              "pricing": {
                "recurrentPrice": {
                  "priceInputOption": "usd",
                  "recurrentPriceMode": plan.pricingModel === "perUser" ? "perUser" : "flatRate",
                  ...(plan.pricingModel === "perUser" && plan.userLimits ? {
                    "userLimits": {
                      "min": plan.userLimits.min || 1,
                      "max": plan.userLimits.max || 10000
                    }
                  } : {}),
                  "prices": [
                    {
                      "billingTerm": billingTerm,
                      "pricePerPaymentInUsd": plan.price || 0
                    }
                  ]
                }
              }
            }
          ];
        }) : []),
        // Add media asset resources - preserve original assets from API
        ...originalMediaAssets,
        // Always include media assets that have valid URLs (not blob URLs) from current data
        ...(data.media?.logos?.large && !data.media.logos.large.startsWith('blob:') && 
            !originalMediaAssets.find(asset => asset.type === "azureLogoLarge" || asset.resourceName === "logoLarge") ? [{
          "$schema": "https://schema.mp.microsoft.com/schema/listing-asset/2022-03-01-preview5",
          "resourceName": "logoLarge",
          "kind": "azure",
          "product": data.product_id || "product/default",
          "listing": { "resourceName": "mainListing" },
          "languageId": "en-us",
          "type": "azureLogoLarge",
          "fileName": data.media.logos.large.split('/').pop() || "logo-large.png",
          "friendlyName": "Large Logo (216x216)",
          "description": "Large Logo (216x216) for marketplace listing",
          "displayOrder": 0,
          "url": data.media.logos.large
        }] : []),
        ...(data.media?.screenshots ? data.media.screenshots
          .filter((screenshot: string) => screenshot && 
                  !screenshot.startsWith('blob:') && 
                  !originalMediaAssets.find(asset => asset.url === screenshot))
          .map((screenshot: string, index: number) => ({
            "$schema": "https://schema.mp.microsoft.com/schema/listing-asset/2022-03-01-preview5",
            "resourceName": `screenshot${index + 1}`,
            "kind": "azure",
            "product": data.product_id || "product/default",
            "listing": { "resourceName": "mainListing" },
            "languageId": "en-us",
            "type": "azureLogoScreenshot",
            "fileName": screenshot.split('/').pop() || `screenshot-${index + 1}.png`,
            "friendlyName": `Screenshot ${index + 1}`,
            "description": `Screenshot ${index + 1} for marketplace listing`,
            "displayOrder": index,
            "url": screenshot
          })) : [])
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

  // Check if editing is disabled due to offer status
  const isEditingDisabled = offerData?.status === 'in_progress' || offerData?.status === 'submitted';

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
          <Button 
            onClick={handleApproveAndPublish} 
            size="lg" 
            className="bg-primary hover:bg-primary/90" 
            disabled={isSubmitting || isEditingDisabled}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : isEditingDisabled ? (
              "Already Submitted"
            ) : (
              "Submit to Partner Center"
            )}
          </Button>
        </div>

        <div className="flex-1 px-8 py-6 max-w-5xl mx-auto w-full">
          <div className="space-y-6 animate-fade-in">
            {/* Show status warning if offer is submitted */}
            {(offerData?.status === 'in_progress' || offerData?.status === 'submitted') && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.19-1.458-1.517-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800">
                      Offer Submitted to Partner Center
                    </h3>
                    <div className="mt-2 text-sm text-amber-700">
                      <p>
                        This offer has been submitted to Partner Center and is currently being processed. 
                        Editing is disabled until the submission process is complete.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
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
              onEdit={!isEditingDisabled ? handleEditSection : undefined}
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
              onEdit={!isEditingDisabled ? handleEditSection : undefined}
              editComponent={
                <OfferListingEdit
                  data={offerData.offer_listing || {}}
                  websiteUrl={offerData.website_url}
                  offerId={offerId || ''}
                  existingOfferData={offerData}
                  onSave={(data) => handleSaveSection('offerListing', data)}
                  onCancel={handleCancelEdit}
                  isSaving={isSaving}
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
                onEdit={!isEditingDisabled ? handleEditSection : undefined}
                editComponent={
                  <PlansEdit
                    data={offerData.plans}
                    websiteUrl={offerData.website_url}
                    offerId={offerId || ''}
                    existingOfferData={offerData}
                    onSave={(data) => handleSaveSection('plans', data)}
                    onCancel={handleCancelEdit}
                    isSaving={isSaving}
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
                            {plan.pricingModel === "perUser" ? " per user" : ""}
                          </span>
                          {plan.pricingModel && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {plan.pricingModel === "flatRate" ? "Flat Rate" : "Per User"}
                              {plan.pricingModel === "perUser" && plan.userLimits && (
                                <div className="text-xs">
                                  {plan.userLimits.min} - {plan.userLimits.max} users
                                </div>
                              )}
                            </div>
                          )}
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
              onEdit={!isEditingDisabled ? handleEditSection : undefined}
              editComponent={
                <TechnicalConfigEdit
                  data={offerData.technical_config || {}}
                  onSave={(data) => handleSaveSection('technicalConfig', data)}
                  onCancel={handleCancelEdit}
                  isSaving={isSaving}
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
              onEdit={!isEditingDisabled ? handleEditSection : undefined}
              editComponent={
                <PreviewAudienceEdit
                  data={offerData.preview_audience || {}}
                  onSave={(data) => handleSaveSection('previewAudience', data)}
                  onCancel={handleCancelEdit}
                  isSaving={isSaving}
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
              onEdit={!isEditingDisabled ? handleEditSection : undefined}
              editComponent={
                <ResellCSPEdit
                  data={offerData.resell_csp || {}}
                  onSave={(data) => handleSaveSection('resellCSP', data)}
                  onCancel={handleCancelEdit}
                  isSaving={isSaving}
                />
              }
            >
              <ResellCSPSection data={offerData.resell_csp || {}} />
            </OfferSectionCard>

            {/* Media */}
            <OfferSectionCard
              sectionId="media"
              title="Media"
              isActive={activeSection === "media"}
              isEditing={editingSection === "media"}
              onEdit={!isEditingDisabled ? handleEditSection : undefined}
              editComponent={
                <MediaEdit
                  data={offerData.media || {}}
                  onSave={(data) => handleSaveSection('media', data)}
                  onCancel={handleCancelEdit}
                  isSaving={isSaving}
                />
              }
            >
              <MediaSection data={offerData.media || {}} />
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
