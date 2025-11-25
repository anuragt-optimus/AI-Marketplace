import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

export const OrderFilters = () => {
  const statuses = ["Active", "Pending", "Cancelled"];
  const billingPeriods = ["Monthly", "Annual"];

  return (
    <Card className="w-64 h-fit">
      <CardHeader>
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium mb-3 block">Status</Label>
          <div className="space-y-2">
            {statuses.map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox id={`status-${status}`} />
                <label
                  htmlFor={`status-${status}`}
                  className="text-sm text-foreground cursor-pointer"
                >
                  {status}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium mb-3 block">Billing Period</Label>
          <div className="space-y-2">
            {billingPeriods.map((period) => (
              <div key={period} className="flex items-center space-x-2">
                <Checkbox id={`billing-${period}`} />
                <label
                  htmlFor={`billing-${period}`}
                  className="text-sm text-foreground cursor-pointer"
                >
                  {period}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Button variant="outline" className="w-full" size="sm">
          Clear Filters
        </Button>
      </CardContent>
    </Card>
  );
};
