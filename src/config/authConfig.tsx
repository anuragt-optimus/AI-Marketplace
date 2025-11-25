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
  scopes: ["https://api.partner.microsoft.com/.default"],
};
