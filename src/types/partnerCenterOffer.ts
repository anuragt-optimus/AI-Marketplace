// Complete Partner Center SaaS Offer Structure

export interface PartnerCenterContact {
  name: string;
  email: string;
  phone?: string;
}

export interface PartnerCenterMedia {
  logos: {
    small: string; // 48x48
    medium: string; // 90x90
    large: string; // 216x216
    wide: string; // 255x115
  };
  screenshots: string[]; // 1280x720, max 5
  videos?: Array<{
    url: string;
    thumbnail: string;
  }>;
}

export interface PartnerCenterPlan {
  id: string;
  name: string;
  description: string;
  pricingModel: "flatRate" | "perUser";
  price: number;
  billingPeriod: "monthly" | "annual" | "both";
  markets: string[]; // ISO country codes
  visibility: "public" | "private";
  restrictedAudience?: string[]; // Tenant IDs for private plans
  features: string[];
  userLimits?: {
    min?: number;
    max?: number;
  };
  freeTrial?: {
    enabled: boolean;
    duration: number; // days
  };
}

export interface PartnerCenterOffer {
  // Offer Setup
  offerAlias: string;
  sellThroughMicrosoft: boolean;
  enableTestDrive: boolean;
  customerLeads?: {
    crmSystem: string;
    connectionString: string;
  };

  // Properties
  categories: {
    primary: string;
    secondary?: string[];
  };
  industries?: string[];
  appVersion?: string;
  legalInfo: {
    useStandardContract: boolean;
    amendments?: string;
    privacyPolicyUrl: string;
    termsOfUseUrl: string;
  };

  // Offer Listing
  listing: {
    name: string;
    searchSummary: string; // 50-160 chars
    shortDescription: string; // 2000 chars
    description: string; // 3000 chars
    gettingStartedInstructions?: string;
    contacts: {
      support: PartnerCenterContact;
      engineering: PartnerCenterContact;
      csp?: PartnerCenterContact;
    };
    supportUrls?: {
      azureGovernment?: string;
      general?: string;
    };
    marketingUrls?: {
      website?: string;
      privacyPolicy: string;
      termsOfUse: string;
    };
    media: PartnerCenterMedia;
    documents?: Array<{
      name: string;
      url: string;
    }>;
  };

  // Preview Audience
  previewAudience?: string[]; // Email addresses, max 10

  // Technical Configuration
  technicalConfig: {
    landingPageUrl: string;
    connectionWebhook: string;
    entraAppId: string;
    entraTenantId: string;
  };

  // Plans & Pricing
  plans: PartnerCenterPlan[];

  // Co-sell with Microsoft
  coSell?: {
    documents?: string[];
  };

  // Resell through CSPs
  resellThroughCSP: "all" | "specific" | "none";
  specificCSPs?: string[];

  // Supplemental Content
  supplementalContent?: {
    saasScenario: "fullyHosted" | "partiallyHosted" | "notHosted";
    subscriptionIds?: string[];
  };
}
