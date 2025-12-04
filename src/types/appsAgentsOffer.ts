export interface AppsAgentsOfferData {
  // Step 1: Name Selection
  productName: string;
  
  // Step 2: Product Setup
  additionalPurchases: boolean;
  customerLeads: {
    enabled: boolean;
    crmConnected: boolean;
    crmType?: string;
  };
  
  // Step 3: Package
  packageFile: {
    url: string;
    fileName: string;
    uploadedAt: string;
  };
  
  // Step 4: Properties
  properties: {
    categories: string[];
    industries: string[];
    privacyPolicyUrl: string;
    supportDocumentUrl: string;
  };
  
  // Step 5: Marketplace Listing (AI GENERATED)
  marketplaceListing: {
    name: string;
    summary: string;
    description: string;
    searchKeywords: string[];
    marketplaceIcon: string;
    screenshots: string[];
    videoLink?: string;
  };
  
  // Step 6: Availability (AI PRESELECTS)
  availability: {
    markets: string[];
    scheduleDate: string;
  };
  
  // Step 7: Additional Certification Info (AI GENERATED)
  certificationInfo: {
    testingInstructionsDocument: string;
    testingNotes: string;
  };
  
  // Step 8: App Compliance (MANUAL WITH AI ASSISTANCE)
  appCompliance: {
    publisherAttestation: Record<string, any>;
    m365Certification: Record<string, any>;
  };
}

export interface PackageUploadStatus {
  isUploading: boolean;
  progress: number;
  error?: string;
  file?: File;
  url?: string;
  fileName?: string;
}
