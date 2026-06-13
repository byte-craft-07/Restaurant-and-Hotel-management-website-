import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Banknote, CreditCard, ReceiptText, UserRound } from "lucide-react";
import api from "../../services/api";
import { DEMO_KITCHEN_ORDERS_KEY } from "../../services/demoExperience";

const getLocalOrders = () => {
  try {
    return JSON.parse(localStorage.getItem(DEMO_KITCHEN_ORDERS_KEY) || "[]");
  } catch {
    return [];
  }
};

const mergeOrders = (backendOrders, localOrders) => {
  const orderMap = new Map();

  [...backendOrders, ...localOrders].forEach((order) => {
    if (order?._id) {
      orderMap.set(order._id, order);
    }
  });

  return Array.from(orderMap.values()).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
};

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

  const fetchOrders = async () => {
    const localOrders = getLocalOrders();

    try {
      const res = await api.get("/orders/my-orders");
      setOrders(mergeOrders(res.data.orders || [], localOrders));
    } catch {
      setOrders(localOrders);
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
            <Link
              to="/menu"
              className="premium-soft-button mb-4 px-4 py-2 text-sm"
            >
              <ArrowLeft size={18} />
              Back to menu
            </Link>
            <div className="premium-label-pill mb-4">
              <ReceiptText size={18} />
              Dining Timeline
            </div>
            <h1 className="text-4xl font-black text-slate-950">My Orders</h1>
            <p className="mt-2 text-slate-500">
              Track your previous room-service orders and applied offers.
            </p>
          </div>

          <Link to="/profile" className="premium-primary-button px-5 py-3">
            <UserRound size={18} />
            Profile
          </Link>
        </div>

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
                    Room {order.tableRoom?.number}
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
      </div>
    </div>
  );
};

export default MyOrders;
