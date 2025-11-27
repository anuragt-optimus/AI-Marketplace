import { LogLevel } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: "0891d2f5-a450-443d-9baf-6c4ae68092fb",
    authority: "https://login.microsoftonline.com/common",
    redirectUri: window.location.origin,
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    allowNativeBroker: false,
    loggerOptions: {
      logLevel: LogLevel.Info,
      piiLoggingEnabled: false,
    },

  },
};


export const loginRequest = {
  scopes: ["https://graph.microsoft.com/.default"],
};

// Partner Center API configuration for client credentials flow
export const partnerCenterConfig = {
  tenantId: "b5db11ac-8f37-4109-a146-5d7a302f5881",
  clientId: "0891d2f5-a450-443d-9baf-6c4ae68092fb",
  clientSecret: "" ,
  scope: "https://graph.microsoft.com/.default",
  tokenUrl: `https://login.microsoftonline.com/b5db11ac-8f37-4109-a146-5d7a302f5881/oauth2/v2.0/token`
};
