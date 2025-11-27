export const FIELD_REQUIREMENTS = {
  offerAlias: {
    minLength: 3,
    maxLength: 50,
    pattern: /^[a-z0-9-]+$/,
    description: "Lowercase letters, numbers, and hyphens only"
  },
  searchSummary: {
    minLength: 50,
    maxLength: 160,
    description: "Concise description for search results"
  },
  shortDescription: {
    minLength: 100,
    maxLength: 2000,
    description: "Brief overview of your offer"
  },
  description: {
    minLength: 200,
    maxLength: 3000,
    description: "Detailed description of features and benefits"
  },
  planDescription: {
    minLength: 50,
    maxLength: 1000,
    description: "Description of plan features"
  },
  gettingStartedInstructions: {
    maxLength: 3000,
    description: "Step-by-step setup instructions"
  }
} as const;

export const MEDIA_REQUIREMENTS = {
  logoSmall: {
    width: 48,
    height: 48,
    format: "PNG",
    maxSize: 100 * 1024 // 100KB
  },
  logoMedium: {
    width: 90,
    height: 90,
    format: "PNG",
    maxSize: 100 * 1024
  },
  logoLarge: {
    width: 216,
    height: 216,
    format: "PNG",
    maxSize: 100 * 1024
  },
  logoWide: {
    width: 255,
    height: 115,
    format: "PNG",
    maxSize: 100 * 1024
  },
  screenshot: {
    width: 1280,
    height: 720,
    format: "PNG",
    maxSize: 1024 * 1024, // 1MB
    maxCount: 5
  }
} as const;

export const REQUIRED_FIELDS = [
  "offerAlias",
  "listing.name",
  "listing.searchSummary",
  "listing.shortDescription",
  "listing.description",
  "listing.contacts.support",
  "listing.contacts.engineering",
  "listing.marketingUrls.privacyPolicy",
  "listing.marketingUrls.termsOfUse",
  "technicalConfig.landingPageUrl",
  "technicalConfig.connectionWebhook",
  "technicalConfig.entraAppId",
  "technicalConfig.entraTenantId",
  "plans" // At least one plan required
] as const;

export const OPTIONAL_FIELDS = [
  "categories.secondary",
  "industries",
  "appVersion",
  "listing.gettingStartedInstructions",
  "listing.contacts.csp",
  "listing.media.videos",
  "listing.documents",
  "previewAudience",
  "supplementalContent"
] as const;
