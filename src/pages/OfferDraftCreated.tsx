import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, ExternalLink, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const OfferDraftCreated = () => {
  const { offerId } = useParams();
  const navigate = useNavigate();
  const [partnerCenterId, setPartnerCenterId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOfferDetails = async () => {
      if (!offerId) return;
      
      const { data, error } = await supabase
        .from('offers')
        .select('partner_center_id, listing_title')
        .eq('id', offerId)
        .single();

      if (!error && data) {
        setPartnerCenterId(data.partner_center_id || "");
      }
      setLoading(false);
    };

    fetchOfferDetails();
  }, [offerId]);



  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-12 px-6">
        <Card className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-3">
            Offer Successfully Created on Partner Center
          </h1>
          
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Your offer draft has been created on Microsoft Partner Center. 
            You can now view, edit, and submit it for certification directly on Partner Center.
          </p>

          {loading ? (
            <div className="space-y-3">
              <div className="h-12 bg-muted animate-pulse rounded" />
              <div className="h-12 bg-muted animate-pulse rounded" />
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => window.open(`https://partner.microsoft.com/en-us/dashboard/commercial-marketplace/offers`, '_blank')}
                className="gap-2"
              >
                View on Partner Center
                <ExternalLink className="w-4 h-4" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/offers')}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to My Offers
              </Button>
            </div>
          )}

          {partnerCenterId && (
            <div className="mt-8 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Partner Center ID: <span className="font-mono font-medium text-foreground">{partnerCenterId}</span>
              </p>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default OfferDraftCreated;
