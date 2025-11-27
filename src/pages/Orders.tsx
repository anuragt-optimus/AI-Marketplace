import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { OrderFilters } from "@/components/orders/OrderFilters";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Download } from "lucide-react";

interface Order {
  id: string;
  customer: string;
  tenantId: string;
  offerName: string;
  plan: string;
  quantity: number;
  billingPeriod: string;
  status: string;
  amount: number;
}

const Orders = () => {
  const [orders] = useState<Order[]>([
    {
      id: "ORD-001",
      customer: "Acme Corp",
      tenantId: "tenant-abc-123",
      offerName: "Enterprise SaaS Platform",
      plan: "Professional",
      quantity: 50,
      billingPeriod: "Monthly",
      status: "Active",
      amount: 14950
    },
    {
      id: "ORD-002",
      customer: "TechStart Inc",
      tenantId: "tenant-def-456",
      offerName: "AI Analytics Suite",
      plan: "Basic",
      quantity: 10,
      billingPeriod: "Annual",
      status: "Active",
      amount: 11880
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-status-live";
      case "pending":
        return "bg-status-generating";
      case "cancelled":
        return "bg-destructive";
      default:
        return "bg-muted";
    }
  };

  return (
    <Layout>
      <div className="flex gap-6 h-[calc(100vh-4rem)]">
        <OrderFilters />
        
        <div className="flex-1 overflow-auto">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Orders & Transactions</h1>
              <p className="text-muted-foreground">Track your sales and revenue</p>
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>

          <div className="bg-background rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Tenant ID</TableHead>
                  <TableHead>Offer Name</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Billing Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {order.customer.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{order.customer}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs text-muted-foreground font-mono">
                        {order.tenantId}
                      </code>
                    </TableCell>
                    <TableCell>{order.offerName}</TableCell>
                    <TableCell>{order.plan}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>{order.billingPeriod}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      ${order.amount.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
