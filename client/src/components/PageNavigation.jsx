import { ArrowLeft, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getRoleRedirect } from "../utils/authRedirect";

const PageNavigation = ({ backTo = "/", homeTo, className = "" }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const resolvedHome =
    homeTo || (user && user.role !== "customer" ? getRoleRedirect(user.role) : "/");

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(backTo, { replace: true });
  };

  return (
    <nav className={`flex flex-wrap items-center gap-2 ${className}`} aria-label="Page navigation">
      <button type="button" onClick={goBack} className="premium-soft-button px-4 py-2 text-sm">
        <ArrowLeft size={17} />
        Back
      </button>
      <Link to={resolvedHome} className="premium-soft-button px-4 py-2 text-sm">
        <Home size={17} />
        Home
      </Link>
    </nav>
  );
};

export default PageNavigation;
