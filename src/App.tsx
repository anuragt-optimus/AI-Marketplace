import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

import Index from "./pages/Index";
import Login from "./pages/Login";
import ConfigurePartnerCenter from "./pages/ConfigurePartnerCenter";
import CreateOffer from "./pages/CreateOffer";
import Offers from "./pages/Offers";
import PrivateOffers from "./pages/PrivateOffers";
import Orders from "./pages/Orders";
import Settings from "./pages/Settings";
import OfferReview from "./pages/OfferReview";
import OfferPublish from "./pages/OfferPublish";
import OfferLive from "./pages/OfferLive";
import OfferDraftCreated from "./pages/OfferDraftCreated";
import NotFound from "./pages/NotFound";
import { msalInstance, initializeMsal } from "./utils/msalInstance";
import { AccountInfo } from "@azure/msal-browser";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [loading, setLoading] = useState(true);

 

  useEffect(() => {
    const initMSAL = async () => {
      try {
        await initializeMsal();

        // Check redirect response
        const response = await msalInstance.handleRedirectPromise();
        if (response && response.account) {
          setAccount(response.account);
          console.log("MSAL - Account from redirect:", response.account);
          console.log("User token:", response.accessToken);
          
        } else {
          // Check cached accounts
          const accounts = msalInstance.getAllAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            console.log("MSAL - Account from cache:", accounts[0]);
            
            // Try to get a fresh token for the user
            try {
              const tokenRequest = {
                scopes: ["https://graph.microsoft.com/.default"],
                account: accounts[0],
                forceRefresh: false
              };
              const tokenResponse = await msalInstance.acquireTokenSilent(tokenRequest);
              console.log("User token:", tokenResponse.accessToken);
            } catch (error) {
              console.log("Silent token acquisition failed, will require login");
            }
          }
        }
      } catch (error) {
        console.error("MSAL init error:", error);
      } finally {
        setLoading(false);
      }
    };

    initMSAL();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!account) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/configure-partner-center" element={<ProtectedRoute><ConfigurePartnerCenter /></ProtectedRoute>} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/create" element={<ProtectedRoute><CreateOffer /></ProtectedRoute>} />
            <Route path="/offers" element={<ProtectedRoute><Offers /></ProtectedRoute>} />
            <Route path="/private-offers" element={<ProtectedRoute><PrivateOffers /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/offer/review/:offerId" element={<ProtectedRoute><OfferReview /></ProtectedRoute>} />
            <Route path="/offer/publish/:offerId" element={<ProtectedRoute><OfferPublish /></ProtectedRoute>} />
            <Route path="/offer/draft-created/:offerId" element={<ProtectedRoute><OfferDraftCreated /></ProtectedRoute>} />
            <Route path="/offer/live/:offerId" element={<ProtectedRoute><OfferLive /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
