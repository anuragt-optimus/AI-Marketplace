import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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

  useEffect(() => {
    // Load auth state from localStorage
    const savedUser = localStorage.getItem("auth_user");
    const savedAccount = localStorage.getItem("partner_center_account");
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedAccount) {
      setSelectedAccount(JSON.parse(savedAccount));
    }
  }, []);

  const login = (email: string, name: string) => {
    const newUser = { email, name, avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}` };
    setUser(newUser);
    localStorage.setItem("auth_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    setSelectedAccount(null);
    localStorage.removeItem("auth_user");
    localStorage.removeItem("partner_center_account");
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
        login,
        logout,
        selectPartnerCenterAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
