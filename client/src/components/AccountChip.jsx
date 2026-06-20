import { Link, useNavigate } from "react-router-dom";
import { CalendarCheck2, LogOut, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getRoleRedirect } from "../utils/authRedirect";

const AccountChip = ({ className = "" }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const accountPath = user.role === "customer" ? "/profile" : getRoleRedirect(user.role);

  return (
    <div
      className={`flex flex-wrap items-center gap-2 rounded-3xl border border-white/80 bg-white/85 p-2 shadow-lg shadow-slate-900/5 backdrop-blur-2xl ${className}`}
    >
      <Link
        to={accountPath}
        className="flex min-w-0 items-center gap-3 rounded-2xl px-3 py-2 transition hover:bg-orange-50"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/20">
          <UserRound size={18} />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-black text-slate-950">
            {user.name || "Account"}
          </span>
          <span className="block truncate text-xs font-bold capitalize text-slate-500">
            {user.customerId || user.role}
          </span>
        </span>
      </Link>

      {user.role === "customer" && (
        <Link
          to="/bookings"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 transition hover:bg-orange-100"
          aria-label="Track my bookings"
          title="My bookings"
        >
          <CalendarCheck2 size={18} />
        </Link>
      )}

      <button
        type="button"
        onClick={handleLogout}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-500 transition hover:bg-red-100"
        aria-label="Logout"
        title="Logout"
      >
        <LogOut size={18} />
      </button>
    </div>
  );
};

export default AccountChip;
