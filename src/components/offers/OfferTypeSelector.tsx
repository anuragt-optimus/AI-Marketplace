import { Sparkles, TrendingUp } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { OfferTypeOption } from "@/constants/mockPartnerCenterData";

interface OfferTypeSelectorProps {
  offerTypes: OfferTypeOption[];
  selectedType: string | null;
  onSelect: (typeId: string) => void;
  disabled?: boolean;
}

export const OfferTypeSelector = ({
  offerTypes,
  selectedType,
  onSelect,
  disabled = false,
}: OfferTypeSelectorProps) => {
  const selected = offerTypes.find(type => type.value === selectedType);

  return (
    <div className="space-y-3">
      <Label htmlFor="offer-type" className="text-sm font-medium">
        Offer Type
      </Label>
      <Select
        value={selectedType || ""}
        onValueChange={onSelect}
        disabled={disabled}
      >
        <SelectTrigger id="offer-type" className="w-full">
          <SelectValue placeholder="Select the type of offer to create" />
        </SelectTrigger>
        <SelectContent>
  {offerTypes.map((type) => (
    <SelectItem
      key={type.value}
      value={type.value}
      disabled={type.value !== "SaaS"} // disable all except SaaS
    >
      <div className="flex items-center gap-2">
        <span>{type.label}</span>

        {type.badge === "popular" && (
          <Badge variant="secondary" className="text-xs">
            <TrendingUp className="h-3 w-3 mr-1" />
            Popular
          </Badge>
        )}

        {type.badge === "new" && (
          <Badge variant="secondary" className="text-xs">
            <Sparkles className="h-3 w-3 mr-1" />
            New
          </Badge>
        )}
      </div>
    </SelectItem>
  ))}
</SelectContent>

      </Select>
      {selected && (
        <p className="text-sm text-muted-foreground mt-2">
          {selected.description}
        </p>
      )}
    </div>
  );
};
