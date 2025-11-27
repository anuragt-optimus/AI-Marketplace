import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "@/config/authConfig";

// Create a singleton MSAL instance
export const msalInstance = new PublicClientApplication(msalConfig);

// Initialize the MSAL instance
let isInitialized = false;

export const initializeMsal = async (): Promise<void> => {
  if (!isInitialized) {
    await msalInstance.initialize();
    isInitialized = true;
  }
};

export const isMsalInitialized = (): boolean => {
  return isInitialized;
};
