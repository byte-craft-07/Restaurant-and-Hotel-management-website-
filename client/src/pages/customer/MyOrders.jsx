import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Banknote, CreditCard, ReceiptText, UserRound } from "lucide-react";
import api from "../../services/api";
import AccountChip from "../../components/AccountChip";
import PageNavigation from "../../components/PageNavigation";
import { ListSkeleton } from "../../components/Skeleton";

const getOrderStatusLabel = (order) => {
  if (order.status === "payment_pending") return "Awaiting payment";
  if (order.paymentStatus === "paid" && order.status === "pending") {
    return "Confirmed";
  }

  return order.status || "Confirmed";
};

const getOrderStatusStyle = (order) => {
  if (order.status === "payment_pending") {
    return "bg-amber-50 text-amber-700";
  }

  if (order.paymentStatus === "paid" && order.status === "pending") {
    return "bg-green-50 text-green-700";
  }

  return "bg-orange-50 text-orange-600";
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/orders/my-orders");
      setOrders(res.data.orders || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load your orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="premium-page p-5 md:p-8">
      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <PageNavigation backTo="/menu" className="mb-4" />
            <div className="premium-label-pill mb-4">
              <ReceiptText size={18} />
              Dining Timeline
            </div>
            <h1 className="text-4xl font-black text-slate-950">My Orders</h1>
            <p className="mt-2 text-slate-500">
              Track your previous room-service orders and applied offers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <AccountChip />
            <Link to="/profile" className="premium-primary-button px-5 py-3">
              <UserRound size={18} />
              Profile
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 font-bold text-red-600">
            <span>{error}</span>
            <button type="button" onClick={fetchOrders} className="rounded-xl bg-white px-4 py-2">Retry</button>
          </div>
        )}

        {loading ? (
          <ListSkeleton count={4} />
        ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <motion.div
              key={order._id}
              whileHover={{ y: -5, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              className="premium-card p-6"
            >
              <div className="flex justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-950">
                    {order.tableRoom?.number
                      ? `Room ${order.tableRoom.number}`
                      : "Website order"}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <span
                  className={`h-fit rounded-full px-4 py-2 text-sm font-black ${getOrderStatusStyle(
                    order
                  )}`}
                >
                  {getOrderStatusLabel(order)}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-black capitalize text-slate-600">
                  {order.paymentMethod === "cash" ? (
                    <Banknote size={15} className="text-green-600" />
                  ) : (
                    <CreditCard size={15} className="text-blue-600" />
                  )}
                  {order.paymentMethod || "online"}
                </span>

                {order.cashCode && (
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700">
                    {order.cashCode}
                  </span>
                )}

                <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-black capitalize text-slate-600">
                  {order.paymentStatus === "paid" ? "Paid" : "Pending cash"}
                </span>
              </div>

              <div className="mt-5 space-y-2">
                {order.items?.map((item, index) => (
                  <div
                    key={`${item.name}-${index}`}
                    className="flex justify-between rounded-2xl bg-[#f8f6f2] p-3 text-slate-700"
                  >
                    <span className="font-semibold">{item.name}</span>
                    <span>
                      Rs. {item.price} x {item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {order.discountPercent > 0 && (
                <p className="mt-4 rounded-2xl bg-green-50 p-3 text-sm font-semibold text-green-700">
                  Discount {order.discountPercent}% applied (-Rs.{" "}
                  {order.discountAmount})
                </p>
              )}

              <p className="mt-4 text-2xl font-black text-orange-500">
                Total Rs. {order.finalAmount || order.totalAmount}
              </p>
            </motion.div>
          ))}

          {orders.length === 0 && (
            <div className="premium-card p-10 text-center text-slate-500">
              No orders yet.
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
