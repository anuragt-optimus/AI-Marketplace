import { Building2, ShoppingCart, Grid3x3, Sparkles } from "lucide-react";

export interface MockAccount {
  id: string;
  accountName: string;
  directoryName: string;
  enrolledPrograms: string[];
}

export interface Program {
  id: string;
  name: string;
  description: string;
  icon: any;
  offerTypes: string[];
}

export interface OfferTypeOption {
  value: string;
  label: string;
  description: string;
  badge?: "popular" | "new";
}

export const MOCK_ACCOUNTS: MockAccount[] = [
  {
    id: "acc-1",
    accountName: "Optimus Information Inc.-optimusinfo",
    directoryName: "Optimus Information Inc.",
    enrolledPrograms: ["commercial-marketplace", "microsoft-365"],
  },
  {
    id: "acc-2",
    accountName: "OptimusinInformation",
    directoryName: "Optimus Information Inc.",
    enrolledPrograms: ["commercial-marketplace"],
  },
];

export const PROGRAMS: Record<string, Program> = {
  "commercial-marketplace": {
    id: "commercial-marketplace",
    name: "Commercial Marketplace",
    description: "Sell your solutions in Microsoft Azure Marketplace and AppSource",
    icon: ShoppingCart,
    offerTypes: [
      "saas",
      "azure-app",
      "azure-vm",
      "azure-container",
      "professional-service",
      "d365-apps",
      "d365-ops",
      "d365-bc",
      "managed-service",
      "power-bi-app",
      "power-bi-visual",
    ],
  },
  "microsoft-365": {
    id: "microsoft-365",
    name: "Microsoft 365",
    description: "Extend Microsoft 365 with apps and add-ins",
    icon: Grid3x3,
    offerTypes: [
      "office-addin",
      "sharepoint-solution",
      "m365-copilot-app",
      "copilot-studio-connector",
    ],
  },
};

export const ALL_OFFER_TYPES: Record<string, OfferTypeOption> = {
  saas: {
    value: "saas",
    label: "Software as a Service",
    description: "SaaS-based technical solution hosted in your environment",
    badge: "popular",
  },
  "azure-app": {
    value: "azure-app",
    label: "Azure Application",
    description: "Azure-managed application deployed in customer subscriptions",
  },
  "azure-vm": {
    value: "azure-vm",
    label: "Azure Virtual Machine",
    description: "VM-based solution deployed to Azure",
  },
  "azure-container": {
    value: "azure-container",
    label: "Azure Container",
    description: "Container-based application running on Azure",
  },
  "professional-service": {
    value: "professional-service",
    label: "Professional Service",
    description: "Consulting and implementation services",
  },
  "d365-apps": {
    value: "d365-apps",
    label: "Dynamics 365 apps on Dataverse and Power Apps",
    description: "Apps built on Microsoft Dataverse and Power Platform",
  },
  "d365-ops": {
    value: "d365-ops",
    label: "Dynamics 365 Operations Apps",
    description: "Enterprise resource planning solutions",
  },
  "d365-bc": {
    value: "d365-bc",
    label: "Dynamics 365 Business Central",
    description: "Business management solutions for SMBs",
  },
  "managed-service": {
    value: "managed-service",
    label: "Managed Service",
    description: "Fully managed services for Azure infrastructure",
  },
  "power-bi-app": {
    value: "power-bi-app",
    label: "Power BI App",
    description: "Pre-built Power BI dashboards and reports",
  },
  "power-bi-visual": {
    value: "power-bi-visual",
    label: "Power BI Visual",
    description: "Custom visualizations for Power BI",
  },
  "office-addin": {
    value: "office-addin",
    label: "Office Add-in",
    description: "Extensions for Word, Excel, PowerPoint, and Outlook",
    badge: "popular",
  },
  "sharepoint-solution": {
    value: "sharepoint-solution",
    label: "SharePoint Solution",
    description: "Custom solutions for SharePoint Online",
  },
  "m365-copilot-app": {
    value: "m365-copilot-app",
    label: "Apps and agents for Microsoft 365 and Copilot",
    description: "AI-powered apps that extend Microsoft 365 and Copilot",
    badge: "new",
  },
  "copilot-studio-connector": {
    value: "copilot-studio-connector",
    label: "Connectors and Agents for Microsoft Copilot Studio",
    description: "Custom connectors and conversational agents",
    badge: "new",
  },
};

export const getOfferTypesByProgram = (programId: string): OfferTypeOption[] => {
  const program = PROGRAMS[programId];
  if (!program) return [];
  
  return program.offerTypes.map(typeId => ALL_OFFER_TYPES[typeId]).filter(Boolean);
};

export const getEnrolledPrograms = (accountId: string): Program[] => {
  const account = MOCK_ACCOUNTS.find(acc => acc.id === accountId);
  if (!account) return [];
  
  return account.enrolledPrograms
    .map(programId => PROGRAMS[programId])
    .filter(Boolean);
};
