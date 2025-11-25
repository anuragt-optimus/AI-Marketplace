import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { OfferInputForm } from "@/components/offers/OfferInputForm";
import { GeneratingLoader } from "@/components/offers/GeneratingLoader";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const CreateOffer = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

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
    // Simulating offer creation (replace with real logic later)
    const dummyOfferId = "123"; 

    // ⏳ artificial wait to match loader time
    await new Promise(res => setTimeout(res, 3000));

    clearInterval(progressInterval);
    setProgress(100);

    toast({
      title: "Offer generated!",
      description: "Redirecting you to the review screen..."
    });

    // ⏱ Give 1s for the loader to visibly hit 100%
    setTimeout(() => {
      navigate(`/offer/review/${dummyOfferId}`);
    }, 800);

  } catch (error) {
    console.error(error);
    clearInterval(progressInterval);

    toast({
      title: "Generation failed",
      description: error instanceof Error ? error.message : "Unexpected error",
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
