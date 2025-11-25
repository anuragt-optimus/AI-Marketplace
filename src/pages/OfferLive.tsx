import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { OfferInfoCards } from "@/components/offers/OfferInfoCards";
import { CheckCircle2, ExternalLink, ArrowLeft } from "lucide-react";

const OfferLive = () => {
  const { offerId } = useParams();
  const navigate = useNavigate();

  const offerInfo = {
    offerId: offerId || "OFF-2024-001",
    status: "Live",
    lastSync: new Date().toISOString(),
    planCount: 3,
    privateOffersCount: 0
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-12 px-6">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-l-4 border-primary rounded-lg p-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Your Offer is Now Live!
              </h1>
              <p className="text-muted-foreground mb-6">
                Congratulations! Your offer has been successfully published to Microsoft Marketplace
                and is now available for customers to discover and purchase.
              </p>
              <div className="flex gap-3">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Live on Marketplace
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate("/offers")}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  View in My Offers
                </Button>
              </div>
            </div>
          </div>
        </div>

        <OfferInfoCards offerInfo={offerInfo} />
      </div>
    </Layout>
  );
};

export default OfferLive;
