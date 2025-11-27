export interface PartnerCenterAccount {
  id: string;
  name: string;
  publisherId: string;
  status: "active" | "pending";
  accountType: string;
}

export const mockPartnerCenterAccounts: PartnerCenterAccount[] = [
  {
    id: "1",
    name: "Contoso Solutions",
    publisherId: "PUB-CONTOSO-2024",
    status: "active",
    accountType: "Global Admin"
  },
  {
    id: "2",
    name: "Fabrikam Cloud Services",
    publisherId: "PUB-FABRIKAM-2024",
    status: "active",
    accountType: "Developer"
  },
  {
    id: "3",
    name: "Northwind Traders",
    publisherId: "PUB-NORTHWIND-2024",
    status: "pending",
    accountType: "Publisher"
  },
  {
    id: "4",
    name: "Adventure Works",
    publisherId: "PUB-ADVENTURE-2024",
    status: "active",
    accountType: "Admin"
  }
];
