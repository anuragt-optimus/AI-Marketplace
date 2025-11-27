import { Layout } from "@/components/layout/Layout";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { OffersTable } from "@/components/dashboard/OffersTable";

const Dashboard = () => {

  return (
    <Layout>
      <div className="max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your Microsoft Marketplace offerings with AI-powered automation
          </p>
        </div>

        <QuickActions />
        <OffersTable />
      </div>
    </Layout>
  );
};

export default Dashboard;
