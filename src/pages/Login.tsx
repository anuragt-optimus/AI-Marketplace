import { useAuth } from "@/contexts/AuthContext";
import { Building2 } from "lucide-react";
import optimusLogo from "@/assets/optimus-logo.png";
import bgImage from "@/assets/bg-image.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PublicClientApplication } from "@azure/msal-browser";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { msalConfig, loginRequest } from "@/config/authConfig";

const msalInstance = new PublicClientApplication(msalConfig);
const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const {
    isAuthenticated,
    login
  } = useAuth();
   useEffect(() => {
      const handleAuthRedirect = async () => {
        try {
          if (typeof (msalInstance as any).initialize === "function") {
            await (msalInstance as any).initialize();
          }
  
          console.log("--------Auth - Handling redirect promise...");
          const response = await msalInstance.handleRedirectPromise();
          console.log("--------Auth - Redirect response:", response);
  
          let account = response?.account;
          if (!account) {
            const accounts = msalInstance.getAllAccounts();
            console.log("--------Auth - Stored accounts:", accounts);
            account = accounts.length > 0 ? accounts[0] : null;
          }
  
          console.log("--------Auth - Final account:", account);
  
          // 4. If we have an account, store it and navigate
          if (account) {
            console.log("--------Auth - Account found, storing and navigating...");
            localStorage.setItem("authUser", JSON.stringify(account));
  
            // Clean up URL hash after successful redirect
            if (window.location.hash && window.location.hash.includes("code=")) {
              try {
                window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
              } catch (e) {
                // ignore
              }
            }


            // Navigate to home (will be caught by ProtectedRoute)
            navigate("/", { replace: true });
          }
        } catch (err) {
          console.error("--------Auth - Error in handleAuthRedirect:", err);
        }
      };
  
      handleAuthRedirect();
    }, [navigate]);


  const handleLogin = async () => {
  setIsLoading(true); // start loading instantly

  try {
    if (typeof (msalInstance as any).initialize === "function") {
      await (msalInstance as any).initialize();
    }

    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0 && typeof (msalInstance as any).logoutPopup === "function") {
      await (msalInstance as any).logoutPopup();
    }

    // 🚀 redirect — page navigation will happen immediately
    msalInstance.loginRedirect(loginRequest);
  } catch (error: any) {
    console.error("Login error:", error);
    toast({
      title: "Login Failed",
      description: error.message || "Unable to start Microsoft login flow.",
      variant: "destructive",
    });

    setIsLoading(false); // only stop loading if login failed
  }
};


  // const handleMicrosoftLogin = () => {
  //   // Simulate Microsoft OAuth login
  //   // In production, this would redirect to Microsoft OAuth endpoint
  //   login("john.doe@contoso.com", "John Doe");
  //   navigate("/configure-partner-center");
  // };







  const handleDemoLogin = () => {
    // Quick demo login with dummy credentials
    login("demo@marketplace.com", "Demo User");
    navigate("/configure-partner-center");
  };
  return <div className="min-h-screen flex flex-col items-center justify-center p-4 py-12 relative" style={{
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }}>
      <div className="w-full max-w-4xl space-y-8 flex-col py-[57px] flex items-center justify-start">
        {/* Header Section */}
        <div className="text-center space-y-3 my-[19px] pt-0">
          <h1 className="font-bold text-foreground whitespace-nowrap text-6xl">
            Welcome to Optimus Marketplace Studio
          </h1>
          <p className="text-muted-foreground text-2xl">
            Your AI-powered companion for creating and managing Microsoft Marketplace offers
          </p>
        </div>

        {/* Login Card */}
        <Card className="w-full p-8 space-y-8 shadow-md pb-[60px] rounded-md">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 mb-4">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Welcome Back</h2>
            <p className="text-muted-foreground">
              Sign in to access Optimus Marketplace Studio
            </p>
          </div>

          <div className="space-y-4">
            <Button
  onClick={handleLogin}
  className="w-full h-12 text-base bg-[#0078D4] hover:bg-[#106EBE] text-white"
  size="lg"
  disabled={isLoading}
>
  {isLoading ? (
    <svg
      className="animate-spin h-5 w-5 mr-2 text-white"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  ) : (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 23 23" fill="none">
      <rect x="1" y="1" width="10" height="10" fill="#F25022" />
      <rect x="12" y="1" width="10" height="10" fill="#7FBA00" />
      <rect x="1" y="12" width="10" height="10" fill="#00A4EF" />
      <rect x="12" y="12" width="10" height="10" fill="#FFB900" />
    </svg>
  )}

  {isLoading ? "Signing in..." : "Sign in with Microsoft"}
</Button>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </div>
        </Card>
      </div>

      {/* Footer Section */}
      <div className="absolute bottom-8 flex items-center gap-6 text-4xl text-muted-foreground">
        <span>Built by</span>
        <img src={optimusLogo} alt="Optimus Information" className="h-18 object-contain" />
      </div>
    </div>;
};
export default Login;