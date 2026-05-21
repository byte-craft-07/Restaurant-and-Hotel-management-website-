import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BadgePercent,
  Mail,
  Phone,
  ReceiptText,
  User,
} from "lucide-react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const CustomerProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(user);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await api.get("/auth/me");
      setProfile(res.data.user);
    };

    fetchProfile();
  }, []);

  return (
    <div className="premium-page p-5 md:p-8">
      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <Link
              to="/menu"
              className="premium-soft-button mb-4 px-4 py-2 text-sm"
            >
              <ArrowLeft size={18} />
              Back to menu
            </Link>

            <div className="premium-label-pill mb-4">
              <User size={18} />
              Guest Profile
            </div>

            <h1 className="text-4xl font-black text-slate-950">My Profile</h1>
            <p className="mt-2 text-slate-500">
              Your customer details and active restaurant offers.
            </p>
          </div>

          <Link to="/my-orders" className="premium-primary-button px-5 py-3">
            <ReceiptText size={18} />
            My Orders
          </Link>
        </div>

        <div className="premium-card mb-6 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
              <User size={30} />
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-950">
                {profile?.name}
              </h2>
              <p className="text-slate-500">
                Customer ID: {profile?.customerId || "Not assigned yet"}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 grid gap-5 md:grid-cols-2">
          <div className="premium-card p-5">
            <p className="flex items-center gap-2 font-semibold text-slate-500">
              <Mail size={16} />
              Email
            </p>
            <h3 className="mt-2 font-black text-slate-950">
              {profile?.email}
            </h3>
          </div>

          <div className="premium-card p-5">
            <p className="flex items-center gap-2 font-semibold text-slate-500">
              <Phone size={16} />
              Phone
            </p>
            <h3 className="mt-2 font-black text-slate-950">
              {profile?.phone}
            </h3>
          </div>

          <div className="premium-card p-5">
            <p className="font-semibold text-slate-500">Total Orders</p>
            <h3 className="mt-2 text-3xl font-black text-orange-500">
              {profile?.orderCount || 0}
            </h3>
          </div>

          <div className="premium-card p-5">
            <p className="font-semibold text-slate-500">Total Spent</p>
            <h3 className="mt-2 text-3xl font-black text-green-600">
              Rs. {profile?.totalSpent || 0}
            </h3>
          </div>
        </div>

        <div className="rounded-[2rem] border border-green-100 bg-green-50/90 p-6 shadow-xl">
          <p className="flex items-center gap-2 font-black text-green-700">
            <BadgePercent size={18} />
            Active Offer
          </p>

          {profile?.discountPercent > 0 ? (
            <>
              <h2 className="mt-3 text-4xl font-black text-green-600">
                {profile.discountPercent}% OFF
              </h2>
              <p className="mt-2 text-slate-600">
                {profile.offerNote || "Your discount will apply at checkout."}
              </p>
            </>
          ) : (
            <p className="mt-3 text-slate-500">No active offer assigned yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
