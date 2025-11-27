import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requirePartnerCenter?: boolean;
}

export const ProtectedRoute = ({ children, requirePartnerCenter = false }: ProtectedRouteProps) => {
  const { isAuthenticated, hasConfiguredPartnerCenter } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requirePartnerCenter && !hasConfiguredPartnerCenter) {
    return <Navigate to="/configure-partner-center" replace />;
  }

  return <>{children}</>;
};
