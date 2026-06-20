import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SessionLoader from "../components/SessionLoader";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <SessionLoader />;
  }

  if (!user) {
    const target = `${location.pathname}${location.search || ""}`;

    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(target)}`}
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
