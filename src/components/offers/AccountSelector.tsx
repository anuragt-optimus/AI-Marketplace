import { Building2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MockAccount } from "@/constants/mockPartnerCenterData";

interface AccountSelectorProps {
  accounts: MockAccount[];
  selectedAccount: string | null;
  onSelect: (accountId: string) => void;
}

export const AccountSelector = ({
  accounts,
  selectedAccount,
  onSelect,
}: AccountSelectorProps) => {
  const selected = accounts.find(acc => acc.id === selectedAccount);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Label htmlFor="account" className="text-sm font-medium">
          Select Partner Center Account
        </Label>
      </div>
      <Select value={selectedAccount || ""} onValueChange={onSelect}>
        <SelectTrigger id="account" className="w-full">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Select your Partner Center account" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {accounts.map((account) => (
            <SelectItem key={account.id} value={account.id}>
              <div className="flex flex-col gap-1 py-1">
                <span className="font-medium">{account.accountName}</span>
                <span className="text-xs text-muted-foreground">
                  {account.directoryName}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selected && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {selected.enrolledPrograms.map((program) => (
            <Badge key={program} variant="secondary" className="text-xs">
              {program === "commercial-marketplace"
                ? "Commercial Marketplace"
                : "Microsoft 365"}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
