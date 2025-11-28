import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, MoreVertical, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface Offer {
  id: string;
  listing_title: string | null;
  status: string;
  offer_type: string;
  partner_center_id: string | null;
  created_at: string;
  updated_at: string;
  error_message: string | null;
  job_id?: string;
  product_id?: string;
  user_email?: string;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'published':
    case 'live':
      return 'bg-green-500';
    case 'draft':
    case 'ready_to_review':
      return 'bg-yellow-500';
    case 'generating':
    case 'in_progress':
    case 'submitted':
      return 'bg-blue-500';
    case 'failed':
    case 'error':
      return 'bg-red-500';
    case 'in_preview':
    case 'in_certification':
      return 'bg-purple-500';
    default:
      return 'bg-gray-500';
  }
};

const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case 'draft':
      return { variant: "secondary" as const, text: "Draft" };
    case 'published':
    case 'live':
      return { variant: "default" as const, text: "Published" };
    case 'generating':
      return { variant: "secondary" as const, text: "Generating" };
    case 'failed':
      return { variant: "destructive" as const, text: "Failed" };
    case 'submitted':
      return { variant: "secondary" as const, text: "Submitted" };
    case 'in_preview':
      return { variant: "secondary" as const, text: "In Preview" };
    case 'in_certification':
      return { variant: "secondary" as const, text: "In Certification" };
    default:
      return { variant: "outline" as const, text: status };
  }
};

const Offers = () => {
  const navigate = useNavigate();
  const { msalInstance, isInitialized } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, [isInitialized]);

  const fetchOffers = async () => {
    // Only proceed if MSAL is initialized
    if (!isInitialized) {
      console.log("MSAL not initialized yet, waiting...");
      return;
    }

    try {
      // Get account
      const accounts = msalInstance.getAllAccounts();
      if (!accounts.length) {
        console.log("No accounts found");
        setLoading(false);
        return;
      }

      // Acquire token
      const tokenResponse = await msalInstance.acquireTokenSilent({
        scopes: ["https://graph.microsoft.com/.default"],
        account: accounts[0],
      });

      // Fetch offers from API
      const response = await fetch(
        "https://ca-ailaunchpad-cc-001.wittysky-b9a849a9.canadacentral.azurecontainerapps.io/user/offers",
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${tokenResponse.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched offers data:", data);

      // Transform API response to match our interface
      const transformedOffers: Offer[] = data.offers?.map((offer: any) => {
        // Extract listing title from resources
        const mainListing = offer.resources?.find((r: any) => r.resourceName === "mainListing");
        const productResource = offer.resources?.find((r: any) => r.type === "softwareAsAService");
        
        return {
          id: offer.id,
          listing_title: mainListing?.title || productResource?.alias || null,
          status: offer.status.toLowerCase(), // Convert to lowercase to match our statuses
          offer_type: productResource?.type === "softwareAsAService" ? "SaaS" : "Unknown",
          partner_center_id: offer.product_id || null,
          created_at: offer.created_at,
          updated_at: offer.updated_at,
          error_message: null, 
          job_id: offer.job_id,
          product_id: offer.product_id,
          user_email: offer.user_email,
        };
      }) || [];

      setOffers(transformedOffers);
    } catch (error) {
      console.error("Error fetching offers:", error);
      toast.error("Failed to load offers");
      // Fall back to empty array
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">My Offers</h1>
              <p className="text-muted-foreground">Manage your marketplace listings</p>
            </div>
            <Button onClick={() => navigate('/create-offer')}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Offer
            </Button>
          </div>

          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <Skeleton className="w-16 h-16 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-6 w-48 mb-2" />
                      <Skeleton className="h-4 w-32 mb-4" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Offers</h1>
            <p className="text-muted-foreground">Manage your marketplace listings</p>
          </div>
          <Button onClick={() => navigate('/create-offer')}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Offer
          </Button>
        </div>

        {offers.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-foreground mb-2">No offers yet</h3>
              <p className="text-muted-foreground mb-6">
                Start building your marketplace presence by creating your first offer.
              </p>
              <Button onClick={() => navigate('/create-offer')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Offer
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {offers.map((offer) => {
              const statusBadge = getStatusBadge(offer.status);
              return (
                <Card key={offer.id} className="p-6 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => navigate(`/offer/review/${offer.id}`)}>
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl font-bold text-primary">
                          {(offer.listing_title || 'U').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-foreground">
                            {offer.listing_title || "Untitled Offer"}
                          </h3>
                          <Badge variant={statusBadge.variant}>
                            {statusBadge.text}
                          </Badge>
                        
                        </div>
                        <p className="text-muted-foreground mb-4">{offer.offer_type}</p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(offer.status)}`} />
                            <span className="text-sm text-muted-foreground capitalize">{offer.status.replace('_', ' ')}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
  Updated {formatDistanceToNow(
    new Date(new Date(offer.updated_at).getTime() + (5.5 * 60 * 60 * 1000)),
    { addSuffix: true }
  )}
</div>

                          {offer.partner_center_id && (
                            <div className="text-sm text-muted-foreground">
                              Partner Center ID: {offer.partner_center_id.split('/').pop()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/offer/review/${offer.id}`);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        {offer.status === 'draft' ? 'Edit' : 'View'}
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Offers;
