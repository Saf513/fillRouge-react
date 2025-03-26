import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  component: React.ComponentType;
  allowedRoles: string[];
}

export const ProtectedRoute = ({
  component: Component,
  allowedRoles,
}: ProtectedRouteProps) => {

const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return <Component />;
};

// src/components/DashboardRouter.tsx

export default function DashboardRouter() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  switch (user?.role) {
    case "student":
      return <Navigate to="/student-dashboard" />;
    case "teacher":
      return <Navigate to="/teacher-dashboard" />;
    case "admin":
      return <Navigate to="/admin-dashboard" />;
    default:
      return <Navigate to="/unauthorized" />;
  }
}
