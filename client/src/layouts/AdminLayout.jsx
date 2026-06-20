import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Home,
  ChefHat,
  ClipboardList,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  IndianRupee,
  ShoppingBag,
  BedDouble,
  CalendarCheck2,
  Users,
  UserCog,
  Utensils,
} from "lucide-react";
import BrandLogo from "../components/BrandLogo";
import { useAuth } from "../context/AuthContext";
import AccountChip from "../components/AccountChip";
import PageNavigation from "../components/PageNavigation";

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const links = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { to: "/admin/payments", label: "Payments", icon: IndianRupee },
    { to: "/admin/events", label: "Events", icon: CalendarDays },
    { to: "/admin/waiter", label: "Service", icon: ClipboardList },
    { to: "/admin/kitchen", label: "Kitchen", icon: ChefHat },
    { to: "/admin/menu", label: "Menu", icon: Utensils },
    { to: "/admin/tables", label: "Rooms", icon: BedDouble },
    { to: "/admin/hotel-rooms", label: "Hotel Rooms", icon: BedDouble },
    { to: "/admin/bookings", label: "Bookings", icon: CalendarCheck2 },
    { to: "/admin/customers", label: "Customers", icon: Users },
    { to: "/admin/staff", label: "Staff", icon: UserCog },
  ];

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#f8f6f2] text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#fb923c_0,transparent_25%),radial-gradient(circle_at_bottom_right,#fde68a_0,transparent_28%)] opacity-20" />

      <aside className="relative z-10 hidden w-72 flex-col border-r border-white/80 bg-white/75 p-5 shadow-xl backdrop-blur-2xl md:flex">
        <div className="mb-10">
          <BrandLogo subtitle="Admin Control Panel" />
        </div>

        <Link
          to="/"
          className="mb-4 flex items-center gap-3 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 font-bold text-orange-600 shadow-sm transition hover:border-orange-200 hover:bg-orange-100"
        >
          <Home size={20} />
          Home Page
        </Link>

        <nav className="flex-1 space-y-2">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/admin"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 font-bold transition ${
                    isActive
                      ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                      : "text-slate-600 hover:bg-orange-50 hover:text-orange-600"
                  }`
                }
              >
                <Icon size={20} />
                {link.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="mb-4 rounded-3xl border border-orange-100 bg-[#f8f6f2] p-4">
          <p className="text-xs text-slate-500">Logged in as</p>
          <p className="mt-1 font-black text-slate-900">{user?.name}</p>
          <p className="text-xs font-bold text-orange-500">{user?.role}</p>
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-2xl bg-red-50 px-4 py-3 font-bold text-red-500 transition hover:bg-red-100"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      <nav className="fixed bottom-3 left-3 right-3 z-50 flex gap-1 overflow-x-auto rounded-[2rem] border border-white/80 bg-white/85 p-2 shadow-2xl backdrop-blur-2xl md:hidden">
        <Link
          to="/"
          className="flex min-w-20 shrink-0 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-bold text-slate-500 transition hover:bg-orange-50"
        >
          <Home size={18} />
          <span>Home</span>
        </Link>
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/admin"}
              className={({ isActive }) =>
                `flex min-w-20 shrink-0 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-bold transition ${
                  isActive
                    ? "bg-orange-500 text-white"
                    : "text-slate-500 hover:bg-orange-50"
                }`
              }
            >
              <Icon size={18} />
              <span>{link.label.split("/")[0]}</span>
            </NavLink>
          );
        })}
      </nav>

      <main className="relative z-10 flex-1 overflow-y-auto p-4 pb-28 md:p-6 md:pb-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <PageNavigation backTo="/admin" homeTo="/admin" />
          <AccountChip />
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
