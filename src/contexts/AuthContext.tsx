import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalInstance, initializeMsal } from "../utils/msalInstance";

interface PartnerCenterAccount {
  id: string;
  name: string;
  publisherId: string;
  status: "active" | "pending";
  accountType: string;
}

interface User {
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  selectedAccount: PartnerCenterAccount | null;
  isAuthenticated: boolean;
  hasConfiguredPartnerCenter: boolean;
  msalInstance: PublicClientApplication;
  isInitialized: boolean;
  login: (email: string, name: string) => void;
  logout: () => void;
  selectPartnerCenterAccount: (account: PartnerCenterAccount) => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<PartnerCenterAccount | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize MSAL and load auth state
    const initializeAuth = async () => {
      try {
        // Initialize MSAL
        await initializeMsal();
        setIsInitialized(true);

        // Load auth state from localStorage
        const savedUser = localStorage.getItem("auth_user");
        const savedAccount = localStorage.getItem("partner_center_account");
        
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
        if (savedAccount) {
          setSelectedAccount(JSON.parse(savedAccount));
        }
      } catch (error) {
        console.error("MSAL initialization error:", error);
      }
    };

    initializeAuth();
  }, []);

  const login = (email: string, name: string) => {
    const newUser = { email, name, avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}` };
    setUser(newUser);
    localStorage.setItem("auth_user", JSON.stringify(newUser));
  };

  // const logout = () => {
  //   setUser(null);
  //   setSelectedAccount(null);
  //   localStorage.removeItem("auth_user");
  //   localStorage.removeItem("partner_center_account");
  // };
  const logout = async () => {
    try {
      // Only call MSAL logout if initialized
      if (isInitialized) {
        await msalInstance.logoutRedirect({
          postLogoutRedirectUri: window.location.origin + "/login",
        });
      }

      // Clear app state
      setUser(null);
      setSelectedAccount(null);

      // Clear cache
      sessionStorage.clear();
      localStorage.clear();
    } catch (err) {
      console.error("Logout Error:", err);
      // Even if MSAL logout fails, clear local state
      setUser(null);
      setSelectedAccount(null);
      sessionStorage.clear();
      localStorage.clear();
    }
  };

  const selectPartnerCenterAccount = (account: PartnerCenterAccount) => {
    setSelectedAccount(account);
    localStorage.setItem("partner_center_account", JSON.stringify(account));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        selectedAccount,
        isAuthenticated: !!user,
        hasConfiguredPartnerCenter: !!selectedAccount,
        msalInstance,
        isInitialized,
        login,
        logout,
        selectPartnerCenterAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
