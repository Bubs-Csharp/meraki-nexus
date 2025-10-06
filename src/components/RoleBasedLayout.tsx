import { ReactNode } from "react";
import { useAuth, UserRole } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";

interface RoleBasedLayoutProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

const RoleBasedLayout = ({ children, allowedRoles }: RoleBasedLayoutProps) => {
  const { role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default RoleBasedLayout;
