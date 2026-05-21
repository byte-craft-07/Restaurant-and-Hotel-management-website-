import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SessionLoader from "../components/SessionLoader";
import { isDemoQrToken } from "../services/demoExperience";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const demoModeEnabled = import.meta.env.VITE_ENABLE_DEMO_MODE !== "false";
  const demoQrActive = isDemoQrToken(localStorage.getItem("qrToken"));
  const demoSafeRoutes = ["/menu", "/kitchen"];

  if (loading) {
    return <SessionLoader />;
  }

  if (!user) {
    if (
      demoModeEnabled &&
      demoQrActive &&
      demoSafeRoutes.includes(location.pathname)
    ) {
      return children;
    }

    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
