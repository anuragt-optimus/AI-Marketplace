import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { OfferStatusBadge } from "./OfferStatusBadge";
import { OfferTableFilters, filterTabs, type FilterTab } from "./OfferTableFilters";
import { OfferTableEmpty } from "./OfferTableEmpty";
import {
  Copy,
  ExternalLink,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

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

// Hardcoded dummy data for demonstration purposes


export const OffersTable = () => {
  const navigate = useNavigate();
  const { msalInstance, isInitialized } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDummyData, setShowDummyData] = useState(false);
  const [counts, setCounts] = useState<Record<FilterTab, number>>({
    all: 0,
    drafts: 0,
    in_progress: 0,
    published: 0,
    failed: 0,
  });

  useEffect(() => {
    fetchOffers();
    
    // Subscribe to real-time updates (keeping this for future use)
    const channel = supabase
      .channel("offers-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "offers",
        },
        (payload) => {
          console.log("Offer changed:", payload);
          fetchOffers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isInitialized]); // Add isInitialized as dependency

  useEffect(() => {
    applyFilters();
  }, [offers, activeTab, searchTerm, showDummyData]);

  useEffect(() => {
    if (showDummyData) {
     
    } else {
      calculateCounts(offers);
    }
  }, [showDummyData, offers]);

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
        
        // Log the original status for debugging
        console.log(`Offer ${offer.id} - Original status: "${offer.status}", Converted: "${offer.status.toLowerCase()}"`);
        
        // Map API statuses to our expected statuses
        const mapStatus = (apiStatus: string): string => {
          const status = apiStatus.toLowerCase();
          
          // Direct mappings
          const statusMappings: Record<string, string> = {
            'draft': 'draft',
            'generating': 'generating', 
            'ready_to_review': 'ready_to_review',
            'ready_to_publish': 'ready_to_publish',
            'submitted': 'submitted',
            'in_preview': 'in_preview',
            'preview': 'in_preview',
            'in_certification': 'in_certification',
            'certification': 'in_certification',
            'published': 'published',
            'live': 'published',
            'failed': 'failed',
            'error': 'failed',
            'rejected': 'failed',
            // Add more mappings as needed
            'in_progress': 'submitted', // Assuming in_progress means submitted
            'pending': 'submitted',
            'reviewing': 'in_certification',
            'validating': 'submitted',
            'approved': 'published',
          };
          
          const mappedStatus = statusMappings[status];
          if (!mappedStatus) {
            console.warn(`Unknown status "${apiStatus}" for offer ${offer.id}, defaulting to draft`);
            return 'draft';
          }
          
          return mappedStatus;
        };
        
        return {
          id: offer.id,
          listing_title: mainListing?.title || productResource?.alias || null,
          status: mapStatus(offer.status),
          offer_type: productResource?.type === "softwareAsAService" ? "SaaS" : "Unknown",
          partner_center_id: offer.product_id || null,
          created_at: offer.created_at,
          updated_at: offer.updated_at,
          error_message: null, // API doesn't seem to provide error messages in this format
          job_id: offer.job_id,
          product_id: offer.product_id,
          user_email: offer.user_email,
        };
      }) || [];

      setOffers(transformedOffers);
      calculateCounts(transformedOffers);
      
      // Additional debug info
      console.log("Transformed offers:", transformedOffers);
      console.log("Status summary:", transformedOffers.map(offer => ({ id: offer.id, status: offer.status })));
    } catch (error) {
      console.error("Error fetching offers:", error);
      toast.error("Failed to load offers");
      // Fall back to dummy data or empty array
      setOffers([]);
      calculateCounts([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateCounts = (data: Offer[]) => {
    const newCounts: Record<FilterTab, number> = {
      all: data.length,
      drafts: 0,
      in_progress: 0,
      published: 0,
      failed: 0,
    };

    data.forEach((offer) => {
      filterTabs.forEach((tab) => {
        if (tab.value !== "all" && tab.statuses.includes(offer.status)) {
          newCounts[tab.value]++;
        }
      });
    });

    setCounts(newCounts);
  };

  const applyFilters = () => {
    // Use dummy data if toggle is on, otherwise use real offers
    let filtered = showDummyData ? [] : [...offers];

    // Apply tab filter
    if (activeTab !== "all") {
      const tabConfig = filterTabs.find((t) => t.value === activeTab);
      if (tabConfig) {
        filtered = filtered.filter((offer) =>
          tabConfig.statuses.includes(offer.status)
        );
      }
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (offer) =>
          offer.listing_title?.toLowerCase().includes(term) ||
          offer.id.toLowerCase().includes(term)
      );
    }

    setFilteredOffers(filtered);
  };

  const copyOfferId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Offer ID copied to clipboard");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;

    try {
      const { error } = await supabase.from("offers").delete().eq("id", id);
      if (error) throw error;
      toast.success("Offer deleted successfully");
      fetchOffers();
    } catch (error) {
      console.error("Error deleting offer:", error);
      toast.error("Failed to delete offer");
    }
  };

  const clearFilters = () => {
    setActiveTab("all");
    setSearchTerm("");
  };

  if (loading) {
    return (
      <Card className="mt-8">
        <div className="p-6 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </Card>
    );
  }

  if (!showDummyData && offers.length === 0) {
    return (
      <Card className="mt-8">
        <OfferTableEmpty type="no-offers" />
      </Card>
    );
  }

  return (
    <Card className="mt-8">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">Your Offers</h2>
          <p className="text-sm text-muted-foreground">
            Manage and track all your Microsoft Marketplace offerings
          </p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <OfferTableFilters
            activeTab={activeTab}
            onTabChange={setActiveTab}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            counts={counts}
          />
         
        </div>

        {filteredOffers.length === 0 ? (
          <OfferTableEmpty type="no-results" onClearFilters={clearFilters} />
        ) : (
          <div className="border rounded-lg">
            <ScrollArea className="h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Offer Name</TableHead>
                    <TableHead className="font-semibold">Offer ID</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">Partner Center ID</TableHead>
                    <TableHead className="font-semibold">Last Modified</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOffers.map((offer) => (
                    <TableRow
                      key={offer.id}
                      className="hover:bg-muted/30 cursor-pointer transition-colors"
                      onClick={() => navigate(`/offer/review/${offer.id}`)}
                    >
                      <TableCell className="font-medium">
                        {offer.listing_title || (
                          <span className="text-muted-foreground italic">Untitled Offer</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {offer.id.slice(0, 8)}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyOfferId(offer.id);
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <OfferStatusBadge status={offer.status} />
                        {offer.status === "failed" && offer.error_message && (
                          <div className="mt-2">
                            <Badge
                              variant="outline"
                              className="bg-destructive/10 text-destructive border-destructive/20 text-xs"
                            >
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Error: {offer.error_message.slice(0, 50)}...
                            </Badge>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {offer.offer_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {offer.partner_center_id ? (
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {offer.partner_center_id}
                            </code>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(
                                  `https://partner.microsoft.com/en-us/dashboard/commercial-marketplace/offers/${offer.product_id.replace("product/", "")}/overview`,
                                  "_blank"
                                );
                              }}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </TableCell>
                      <TableCell>
  <span
    className="text-sm"
    title={new Date(new Date(offer.updated_at).getTime() + (5.5 * 60 * 60 * 1000)).toLocaleString()}
  >
    {formatDistanceToNow(
      new Date(new Date(offer.updated_at).getTime() + (5.5 * 60 * 60 * 1000)),
      { addSuffix: true }
    )}
  </span>
</TableCell>

                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/offer/review/${offer.id}`)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            {["draft", "ready_to_review", "ready_to_publish"].includes(
                              offer.status
                            ) && (
                              <DropdownMenuItem onClick={() => navigate(`/offer/review/${offer.id}`)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                            )}
                            {offer.status === "failed" && (
                              <DropdownMenuItem>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Retry
                              </DropdownMenuItem>
                            )}
                            {["draft", "failed"].includes(offer.status) && (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(offer.id);
                                }}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        )}
      </div>
    </Card>
  );
};
