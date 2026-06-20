import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BarChart3,
  IndianRupee,
  ShoppingBag,
  Sparkles,
  Utensils,
  Users,
} from "lucide-react";
import api from "../../services/api";

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");

  const fetchAnalytics = async () => {
    try {
      const res = await api.get("/analytics");
      setAnalytics(res.data.analytics);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load analytics.");
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-600 shadow-lg">
        {error}
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="space-y-6">
        <div className="premium-shimmer h-28 rounded-[2rem] shadow-lg" />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="premium-shimmer h-36 rounded-[2rem] shadow-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  const topItems = analytics.topItems || [];
  const topCustomers = analytics.topCustomers || [];
  const maxItemQuantity = Math.max(
    1,
    ...topItems.map((item) => item.quantity || 0)
  );

  const cards = [
    {
      title: "Total Revenue",
      value: `Rs. ${analytics.totalRevenue || 0}`,
      note: "All completed billing",
      icon: IndianRupee,
      color: "text-orange-500",
      tint: "bg-orange-50",
    },
    {
      title: "Total Orders",
      value: analytics.totalOrders || 0,
      note: `${analytics.pendingOrders || 0} pending right now`,
      icon: ShoppingBag,
      color: "text-blue-600",
      tint: "bg-blue-50",
    },
    {
      title: "Customers",
      value: analytics.totalCustomers || 0,
      note: "Registered guests",
      icon: Users,
      color: "text-purple-600",
      tint: "bg-purple-50",
    },
    {
      title: "Served Orders",
      value: analytics.servedOrders || 0,
      note: "Kitchen completed",
      icon: Utensils,
      color: "text-green-600",
      tint: "bg-green-50",
    },
  ];

  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/75 p-7 shadow-xl backdrop-blur-2xl"
      >
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-orange-200/50 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-28 w-28 rounded-full bg-yellow-200/50 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-sm font-bold text-orange-600">
              <Sparkles size={17} />
              Live Hotel Analytics
            </div>

            <h1 className="text-4xl font-black text-slate-950">
              Analytics Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-slate-600">
              Track sales, customer activity, top menu items, and live service
              health from one premium control view.
            </p>
          </div>

          <Link
            to="/admin/orders"
            className="group flex w-fit items-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-1 hover:bg-orange-600"
          >
            View Orders
            <ArrowUpRight
              size={18}
              className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </motion.section>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ y: -6, scale: 1.015 }}
              className="group rounded-[2rem] border border-white/80 bg-white/80 p-6 shadow-xl shadow-orange-100/40 backdrop-blur-xl transition"
            >
              <div className="flex justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    {card.title}
                  </p>
                  <h2 className={`mt-2 text-3xl font-black ${card.color}`}>
                    {card.value}
                  </h2>
                  <p className="mt-2 text-xs font-semibold text-slate-400">
                    {card.note}
                  </p>
                </div>

                <motion.div
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: index * 0.4,
                  }}
                  className={`h-fit rounded-2xl p-3 ${card.tint} ${card.color}`}
                >
                  <Icon />
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <motion.section
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-[2rem] border border-white/80 bg-white/80 p-6 shadow-xl backdrop-blur-xl"
        >
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-950">
                Top Ordered Items
              </h2>
              <p className="text-sm text-slate-500">
                Best performing menu items by quantity.
              </p>
            </div>

            <div className="rounded-2xl bg-orange-50 p-3 text-orange-500">
              <BarChart3 />
            </div>
          </div>

          <div className="space-y-4">
            {topItems.length === 0 ? (
              <p className="rounded-2xl bg-[#f8f6f2] p-5 text-slate-500">
                No item sales yet.
              </p>
            ) : (
              topItems.map((item, index) => {
                const width = `${Math.max(
                  10,
                  ((item.quantity || 0) / maxItemQuantity) * 100
                )}%`;

                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.18 + index * 0.05 }}
                    className="rounded-3xl bg-[#f8f6f2] p-4"
                  >
                    <div className="flex justify-between gap-4">
                      <div>
                        <h3 className="font-black text-slate-900">
                          {item.name}
                        </h3>
                        <p className="text-sm text-slate-500">
                          Ordered {item.quantity} times
                        </p>
                      </div>

                      <p className="font-black text-orange-500">
                        Rs. {item.revenue}
                      </p>
                    </div>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-full rounded-full bg-gradient-to-r from-orange-400 to-yellow-400"
                      />
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="rounded-[2rem] border border-white/80 bg-white/80 p-6 shadow-xl backdrop-blur-xl"
        >
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-950">
                Top Customers
              </h2>
              <p className="text-sm text-slate-500">
                Loyal guests ranked by total spending.
              </p>
            </div>

            <Link
              to="/admin/customers"
              className="rounded-2xl bg-orange-50 px-4 py-2 text-sm font-bold text-orange-600 transition hover:bg-orange-100"
            >
              View all
            </Link>
          </div>

          <div className="space-y-4">
            {topCustomers.length === 0 ? (
              <p className="rounded-2xl bg-[#f8f6f2] p-5 text-slate-500">
                No customers yet.
              </p>
            ) : (
              topCustomers.map((customer, index) => (
                <motion.div
                  key={customer._id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.18 + index * 0.05 }}
                >
                  <Link
                    to={`/admin/customers/${customer._id}`}
                    className="group flex justify-between gap-4 rounded-3xl bg-[#f8f6f2] p-4 transition hover:-translate-y-1 hover:bg-orange-50"
                  >
                    <div>
                      <h3 className="font-black text-slate-900 group-hover:text-orange-600">
                        {customer.name}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {customer.customerId || "No ID"}
                      </p>
                    </div>

                    <p className="font-black text-green-600">
                      Rs. {customer.totalSpent || 0}
                    </p>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default AdminDashboard;
