import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, LockKeyhole, Utensils } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import PremiumHoverCard from "../components/motion/PremiumHoverCard";
import AccountChip from "../components/AccountChip";
import PageNavigation from "../components/PageNavigation";

const Unauthorized = () => {
  const { user } = useAuth();
  const isCustomer = user?.role === "customer";

  return (
    <div className="safe-page relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f8f6f2] px-5 py-12 text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#fb923c_0,transparent_28%),radial-gradient(circle_at_bottom_right,#fde68a_0,transparent_30%)] opacity-20" />
      <div className="absolute left-8 top-20 h-72 w-72 rounded-full bg-orange-300/30 blur-3xl" />
      <div className="absolute bottom-16 right-8 h-96 w-96 rounded-full bg-yellow-300/30 blur-3xl" />
      <div className="absolute right-5 top-5 z-20">
        <AccountChip />
      </div>

      <PremiumHoverCard className="relative z-10 w-full max-w-2xl rounded-[2.5rem] p-8 text-center md:p-12">
        <motion.div
          animate={{ y: [0, -7, 0], rotate: [0, 3, -3, 0] }}
          transition={{ duration: 3.2, repeat: Infinity }}
          className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-red-50 text-red-500 shadow-inner"
        >
          <LockKeyhole size={48} />
        </motion.div>

        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-sm font-black text-orange-600">
          <Utensils size={16} />
          {isCustomer ? "Customer account detected" : "Restricted section"}
        </div>

        <h1 className="text-4xl font-black text-slate-950 md:text-5xl">
          Staff Area Only
        </h1>

        <p className="mx-auto mt-4 max-w-lg text-slate-500">
          {isCustomer
            ? "Your guest account is ready, but this dashboard is only for admin, service, or kitchen staff."
            : "You do not have permission to access this hotel section."}
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {isCustomer && (
            <Link
              to="/menu"
              className="premium-primary-button px-6 py-4"
            >
              Open Menu
              <ArrowRight size={20} />
            </Link>
          )}

          <PageNavigation />

          {!user && (
            <Link to="/login" className="premium-soft-button px-6 py-4">
              Staff Login
            </Link>
          )}
        </div>
      </PremiumHoverCard>
    </div>
  );
};

export default Unauthorized;
