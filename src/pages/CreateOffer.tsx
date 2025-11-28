import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { OfferInputForm } from "@/components/offers/OfferInputForm";
import { GeneratingLoader } from "@/components/offers/GeneratingLoader";
import { partnerCenterApi } from "@/services/partnerCenterApi";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "@/config/authConfig";

import { toast } from "@/hooks/use-toast";

const msalInstance = new PublicClientApplication(msalConfig);

const CreateOffer = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeMSAL = async () => {
      try {
        await msalInstance.initialize();
        setIsInitialized(true);
      } catch (error) {
        console.error("MSAL initialization error:", error);
      }
    };

    initializeMSAL();
  }, []);

  const handleGenerate = async (
  websiteUrl: string,
  offerAlias: string,
  offerType: string
) => {
  setIsGenerating(true);
  setProgress(0);

  const progressInterval = setInterval(() => {
    setProgress(prev => {
      if (prev < 25) return prev + 2;
      if (prev < 50) return prev + 1.5;
      if (prev < 75) return prev + 1;
      if (prev < 95) return prev + 0.5;
      return prev;
    });
  }, 200);

  try {
    console.log("🚀 Getting access token from MSAL...");
    
    // Check if MSAL is initialized
    if (!isInitialized) {
      throw new Error("MSAL is not initialized yet. Please try again.");
    }
    
    // Get the authenticated account
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length === 0) {
      throw new Error("No authenticated account found. Please login first.");
    }

    // Get access token using MSAL
    const tokenRequest = {
      scopes: ["https://graph.microsoft.com/.default"],
      account: accounts[0],
      forceRefresh: false
    };
    const tokenResponse = await msalInstance.acquireTokenSilent(tokenRequest);
    const accessToken = tokenResponse.accessToken;
    
    console.log("🚀 Calling API to generate SaaS offer...");

    const form = new FormData();
    form.append("partner_center_account", "string");   // change later if dynamic
    form.append("program", "string");                  // change later if dynamic
    form.append("offer_type", offerType);
    form.append("offer_alias", offerAlias);
    form.append("product_website_url", websiteUrl);

    const res = await fetch(
      "https://ca-ailaunchpad-cc-001.wittysky-b9a849a9.canadacentral.azurecontainerapps.io/generate-saas-offer",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
          // ❗ DO NOT ADD Content-Type when sending FormData
        },
        body: form
      }
    );

    if (!res.ok) throw new Error(`API failed: ${res.status}`);

    const data = await res.json();
    console.log("✅ Response:", data);

    clearInterval(progressInterval);
    setProgress(100);

    toast({
      title: "Success",
      description: data.message,
    });

    // optional: redirect to offer detail page
    navigate(`/offer/review/${data.offer_id}`);
    
  } catch (error: any) {
    clearInterval(progressInterval);

    console.error("❌ Generation failed:", error);

    toast({
      title: "You are not authorized to create an offer.",
      variant: "destructive"
    });

    setIsGenerating(false);
  }
};



  return (
    <Layout>
      <div className="max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create New Offer</h1>
          <p className="text-muted-foreground">
            Let AI generate your marketplace listing from your product information
          </p>
        </div>

        {isGenerating ? (
          <GeneratingLoader progress={progress} />
        ) : (
          <OfferInputForm onGenerate={handleGenerate} />
        )}
      </div>
    </Layout>
  );
};

export default CreateOffer;
