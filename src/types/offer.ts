import { PartnerCenterOffer } from "./partnerCenterOffer";

// ============= NEW PARTNER CENTER-ALIGNED INTERFACES =============

// Offer Setup
export interface OfferSetupData {
  offerId: string;
  offerType: "SaaS" | "Azure Application";
  offerAlias: string; // 3-50 chars, lowercase, numbers, hyphens only
  sellThroughMicrosoft: boolean;
  licenseManagement: "microsoft" | "partner" | null;
  customerLeads: {
    enabled: boolean;
    isConnected: boolean;
  };
  microsoftIntegrations: {
    usesGraphAPI: boolean;
    integratesWithTeamsM365: boolean;
    marketplaceLinks?: string[];
  };
}

// Properties
export interface PropertiesData {
  categories: {
    primary: string;
    secondary?: string[];
  };
  industries?: string[];
  appVersion?: string;
  legalInfo: {
    useStandardContract: boolean;
    privacyPolicyUrl: string;
    termsOfUseUrl: string;
  };
}

// Offer Listing (Most Complex)
export interface OfferListingData {
  name: string; // AI
  searchSummary: string; // AI (50-160 chars)
  shortDescription: string; // AI (max 2000 chars)
  description: string; // AI (max 3000 chars)
  gettingStartedInstructions?: string; // AI
  
  // Contacts - AI suggests, user verifies
  contacts: {
    support: {
      name: string;
      email: string;
      phone?: string; // MANUAL
    };
    engineering: {
      name: string;
      email: string;
      phone?: string; // MANUAL
    };
    csp?: {
      name: string;
      email: string;
      phone?: string; // MANUAL
    };
  };
  
  // Marketing URLs
  supportUrl?: string; // MANUAL
  websiteUrl?: string; // AI (from input)
  privacyPolicyUrl: string; // MANUAL
  termsOfUseUrl: string; // MANUAL
  
  // Media (ALL MANUAL - uploaded in review phase)
  media: {
    logos: {
      small?: string; // 48x48 PNG
      medium?: string; // 90x90 PNG
      large?: string; // 216x216 PNG
      wide?: string; // 255x115 PNG
    };
    screenshots: string[]; // 1280x720, max 5
    videos?: Array<{
      url: string;
      thumbnail: string;
    }>;
  };
  
  // Documents (MANUAL)
  documents?: Array<{
    name: string;
    url: string;
  }>;
  
  // Certifications (AI suggests)
  certifications?: string[];
}

// Plan Overview
export interface PlanData {
  id: string;
  name: string; // AI
  description: string; // AI
  
  // Pricing & Availability (MANUAL/AI-assisted)
  markets: string[]; // ISO country codes, AI suggests US by default
  pricingModel: "flatRate" | "perUser"; // AI suggests based on website
  price: number; // AI suggests
  billingPeriod: "monthly" | "annual" | "both"; // AI suggests
  
  userLimits?: {
    min?: number;
    max?: number;
  };
  
  freeTrial?: {
    enabled: boolean;
    duration: number; // days
  };
  
  visibility: "public" | "private";
  restrictedAudience?: string[]; // Tenant IDs for private plans
  
  effectiveDates?: {
    start: string;
    end?: string;
  };
  
  features: string[]; // List of features for this plan
}

// Preview Audience
export interface PreviewAudienceData {
  previewAudience?: string[]; // Max 10 email addresses
}

// Technical Configuration
export interface TechnicalConfigData {
  landingPageUrl: string; // AI suggests
  connectionWebhook: string; // AI suggests
  entraAppId: string; // MANUAL
  entraTenantId: string; // MANUAL
}

// Resell CSPs
export interface ResellCSPData {
  resellThroughCSP: "all" | "specific" | "none"; // AI suggests "all"
  specificCSPs?: string[];
}

// Supplemental Content
export interface SupplementalContentData {
  saasScenario: "fullyHosted" | "partiallyHosted" | "notHosted"; // AI detects
  subscriptionIds?: string[]; // MANUAL
}

// Combined Offer Data
export interface CompleteOfferData {
  id: string;
  offerSetup: OfferSetupData;
  properties: PropertiesData;
  offerListing: OfferListingData;
  previewAudience: PreviewAudienceData;
  technicalConfig: TechnicalConfigData;
  plans: PlanData[];
  resellCSP: ResellCSPData;
  supplementalContent: SupplementalContentData;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// ============= LEGACY INTERFACES (Keep for backward compatibility) =============

// Legacy offer data interface (used in OfferReview page currently)
export interface LegacyOfferData {
  shortDescription: string;
  longDescription: string;
  features: string[];
  useCases: string[];
  plans: Array<{
    name: string;
    price: number;
    billingPeriod: string;
    features: string[];
  }>;
  legalText: string;
  icons: string[];
  screenshots: string[];
  technicalConfig: Record<string, string>;
  
  // Extended Partner Center fields
  partnerCenterData?: PartnerCenterOffer;
}

// Database offer data interface (from Supabase)
export interface OfferData {
  listingTitle: string;
  shortDescription: string;
  longDescription: string;
  keyFeatures: {
    title: string;
    description: string;
  }[];
  useCases: {
    title: string;
    description: string;
  }[];
  pricingDraft: {
    planName: string;
    price: string;
    billingPeriod: string;
    features: string[];
  }[];
  planDetails: {
    planId: string;
    name: string;
    description: string;
  }[];
  legalCopy: string;
  iconAssets: string[];
  screenshots: string[];
  documentationUrls: string[];
  webAppLink: string;
  fulfillmentManifest: {
    resourceType: string;
    parameters: Record<string, any>;
  };
}

export interface GenerateOfferRequest {
  websiteUrl: string;
  userId: string;
}

export interface GenerateOfferResponse {
  offerId: string;
  status: 'generating' | 'completed' | 'failed';
  data?: OfferData;
  error?: string;
}
