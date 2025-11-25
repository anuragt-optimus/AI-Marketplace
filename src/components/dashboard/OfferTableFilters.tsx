import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type FilterTab = "all" | "drafts" | "in_progress" | "published" | "failed";

interface FilterTabConfig {
  label: string;
  value: FilterTab;
  statuses: string[];
}

const filterTabs: FilterTabConfig[] = [
  {
    label: "All",
    value: "all",
    statuses: [],
  },
  {
    label: "Drafts",
    value: "drafts",
    statuses: ["draft", "generating", "ready_to_review", "ready_to_publish"],
  },
  {
    label: "In Progress",
    value: "in_progress",
    statuses: ["submitted", "in_preview", "in_certification"],
  },
  {
    label: "Published",
    value: "published",
    statuses: ["published"],
  },
  {
    label: "Failed",
    value: "failed",
    statuses: ["failed"],
  },
];

interface OfferTableFiltersProps {
  activeTab: FilterTab;
  onTabChange: (tab: FilterTab) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  counts: Record<FilterTab, number>;
}

export const OfferTableFilters = ({
  activeTab,
  onTabChange,
  searchTerm,
  onSearchChange,
  counts,
}: OfferTableFiltersProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {filterTabs.map((tab) => (
            <Button
              key={tab.value}
              variant={activeTab === tab.value ? "default" : "ghost"}
              size="sm"
              onClick={() => onTabChange(tab.value)}
              className={cn(
                "transition-colors",
                activeTab === tab.value && "shadow-sm"
              )}
            >
              {tab.label}
              {counts[tab.value] > 0 && (
                <span className={cn(
                  "ml-2 px-1.5 py-0.5 text-xs rounded-full",
                  activeTab === tab.value 
                    ? "bg-primary-foreground/20" 
                    : "bg-muted"
                )}>
                  {counts[tab.value]}
                </span>
              )}
            </Button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
    </div>
  );
};

export { filterTabs };
export type { FilterTab };
