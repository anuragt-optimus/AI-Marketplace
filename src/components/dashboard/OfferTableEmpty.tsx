import { Button } from "@/components/ui/button";
import { FileX, Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";

interface OfferTableEmptyProps {
  type: "no-offers" | "no-results";
  onClearFilters?: () => void;
}

export const OfferTableEmpty = ({ type, onClearFilters }: OfferTableEmptyProps) => {
  if (type === "no-offers") {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Plus className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No offers yet
        </h3>
        <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
          Create your first offer to get started with Microsoft Marketplace
        </p>
        <Button asChild>
          <Link to="/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Offer
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        No offers found
      </h3>
      <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
        Try adjusting your filters or search term
      </p>
      <Button variant="outline" onClick={onClearFilters}>
        Clear Filters
      </Button>
    </div>
  );
};
