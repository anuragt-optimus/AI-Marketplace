export const PRIMARY_CATEGORIES = [
  { value: "analytics", label: "Analytics" },
  { value: "ai-ml", label: "AI + Machine Learning" },
  { value: "blockchain", label: "Blockchain" },
  { value: "collaboration", label: "Collaboration" },
  { value: "commerce", label: "Commerce" },
  { value: "compute", label: "Compute" },
  { value: "containers", label: "Containers" },
  { value: "databases", label: "Databases" },
  { value: "developer-tools", label: "Developer Tools" },
  { value: "devops", label: "DevOps" },
  { value: "identity", label: "Identity" },
  { value: "integration", label: "Integration" },
  { value: "internet-of-things", label: "Internet of Things" },
  { value: "it-management", label: "IT & Management Tools" },
  { value: "media", label: "Media" },
  { value: "migration", label: "Migration" },
  { value: "mixed-reality", label: "Mixed Reality" },
  { value: "monitoring-diagnostics", label: "Monitoring & Diagnostics" },
  { value: "networking", label: "Networking" },
  { value: "security", label: "Security" },
  { value: "storage", label: "Storage" },
  { value: "web", label: "Web" },
] as const;

export const CATEGORY_SUBCATEGORIES: Record<string, string[]> = {
  "analytics": [
    "Big Data",
    "Data Visualization",
    "Real-time Analytics",
    "Data Lake",
    "Data Warehouse"
  ],
  "ai-ml": [
    "ML Ops",
    "Cognitive Services",
    "Knowledge Mining",
    "Bot Service",
    "Automated ML"
  ],
  "security": [
    "Identity & Access Management",
    "Threat Protection",
    "Information Protection",
    "Security Management",
    "Compliance"
  ],
  "devops": [
    "Application Lifecycle Management",
    "Continuous Integration",
    "Continuous Delivery",
    "Testing",
    "Release Management"
  ],
  "developer-tools": [
    "IDEs",
    "Code Editors",
    "Debugging",
    "Testing Tools",
    "Version Control"
  ]
};

export const INDUSTRIES = [
  "Agriculture",
  "Automotive",
  "Banking",
  "Distribution",
  "Education",
  "Energy",
  "Financial Services",
  "Government",
  "Healthcare",
  "Hospitality",
  "Insurance",
  "Manufacturing",
  "Media & Entertainment",
  "Professional Services",
  "Public Safety & Justice",
  "Retail & Consumer Goods",
  "Telecommunications",
  "Transportation & Logistics",
  "Other"
] as const;

export const MARKETS = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "JP", name: "Japan" },
  { code: "IN", name: "India" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
  // Add more markets as needed
] as const;
