import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  CheckCircle,
  Clock,
  CookingPot,
  Flame,
  IndianRupee,
  ReceiptText,
  Sparkles,
} from "lucide-react";
import socket from "../../services/socket";
import api from "../../services/api";
import {
  DEMO_KITCHEN_ORDERS_KEY,
  DEMO_ORDERS,
} from "../../services/demoExperience";

const activeStatuses = ["pending", "accepted", "preparing"];

const isToday = (dateValue) => {
  const date = new Date(dateValue);
  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};

const buildStats = (orders) => {
  const todayOrders = orders.filter((order) => isToday(order.createdAt));

  return {
    totalOrders: todayOrders.length,
    pending: todayOrders.filter((order) => order.status === "pending").length,
    preparing: todayOrders.filter((order) =>
      ["accepted", "preparing"].includes(order.status)
    ).length,
    served: todayOrders.filter((order) => order.status === "served").length,
    revenue: todayOrders
      .filter((order) => order.status === "served")
      .reduce(
        (sum, order) => sum + (order.finalAmount || order.totalAmount || 0),
        0
      ),
  };
};

const formatElapsed = (dateValue, now = Date.now()) => {
  const diffMs = Math.max(0, now - new Date(dateValue).getTime());
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) return "Just now";
  if (minutes === 1) return "1 min ago";
  return `${minutes} min ago`;
};

const getStoredDemoOrders = () => {
  try {
    return JSON.parse(localStorage.getItem(DEMO_KITCHEN_ORDERS_KEY) || "[]");
  } catch {
    return [];
  }
};

const getDemoOrderSeed = () => [...getStoredDemoOrders(), ...DEMO_ORDERS];

const KitchenDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [, setAllOrders] = useState([]);
  const [demoMode, setDemoMode] = useState(false);
  const [highlightedOrderId, setHighlightedOrderId] = useState("");
  const [nowTick, setNowTick] = useState(Date.now());
  const [stats, setStats] = useState({
    totalOrders: 0,
    pending: 0,
    preparing: 0,
    served: 0,
    revenue: 0,
  });

  const applyOrderCollection = (nextOrders) => {
    setAllOrders(nextOrders);
    setOrders(
      nextOrders.filter((order) => activeStatuses.includes(order.status))
    );
    setStats(buildStats(nextOrders));
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      const fetchedOrders = res.data.orders || [];
      const hasRealOrders = fetchedOrders.length > 0;
      const nextOrders = hasRealOrders ? fetchedOrders : getDemoOrderSeed();

      setDemoMode(!hasRealOrders);
      applyOrderCollection(nextOrders);
    } catch {
      setDemoMode(true);
      applyOrderCollection(getDemoOrderSeed());
    }
  };

  const updateStatus = async (orderId, status) => {
    if (demoMode || orderId.startsWith("demo-")) {
      setAllOrders((prev) => {
        const next = prev.map((order) =>
          order._id === orderId ? { ...order, status } : order
        );

        setOrders(
          next.filter((order) => activeStatuses.includes(order.status))
        );
        setStats(buildStats(next));
        return next;
      });
      return;
    }

    const res = await api.put(`/orders/${orderId}/status`, { status });

    setOrders((prev) =>
      prev.map((order) => (order._id === orderId ? res.data.order : order))
    );
  };

  useEffect(() => {
    fetchOrders();

    socket.on("new_order", (order) => {
      setAllOrders((prev) => {
        const next = [order, ...prev.filter((item) => item._id !== order._id)];
        setStats(buildStats(next));
        return next;
      });
      setOrders((prev) => [
        order,
        ...prev.filter((item) => item._id !== order._id),
      ]);
      setHighlightedOrderId(order._id);
      new Audio("/notification.mp3").play().catch(() => {});
    });

    socket.on("order_status_updated", (updatedOrder) => {
      setAllOrders((prev) => {
        const hasOrder = prev.some((order) => order._id === updatedOrder._id);
        const next = hasOrder
          ? prev.map((order) =>
              order._id === updatedOrder._id ? updatedOrder : order
            )
          : [updatedOrder, ...prev];

        setStats(buildStats(next));
        return next;
      });

      setOrders((prev) => {
        if (
          updatedOrder.status === "served" ||
          updatedOrder.status === "cancelled"
        ) {
          return prev.filter((order) => order._id !== updatedOrder._id);
        }

        return prev.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        );
      });
    });

    return () => {
      socket.off("new_order");
      socket.off("order_status_updated");
    };
  }, []);

  useEffect(() => {
    if (!highlightedOrderId) return undefined;
    const timeout = setTimeout(() => setHighlightedOrderId(""), 4500);
    return () => clearTimeout(timeout);
  }, [highlightedOrderId]);

  useEffect(() => {
    const interval = setInterval(() => setNowTick(Date.now()), 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!demoMode) return undefined;

    const statusCycle = {
      pending: "accepted",
      accepted: "preparing",
      preparing: "pending",
    };

    const interval = setInterval(() => {
      setAllOrders((prev) => {
        const activeOrders = prev.filter((order) =>
          activeStatuses.includes(order.status)
        );
        if (activeOrders.length === 0) return prev;

        const targetOrder = activeOrders[Date.now() % activeOrders.length];
        const next = prev.map((order) =>
          order._id === targetOrder._id
            ? { ...order, status: statusCycle[order.status] || "pending" }
            : order
        );

        setOrders(
          next.filter((order) => activeStatuses.includes(order.status))
        );
        setStats(buildStats(next));
        return next;
      });
    }, 9000);

    return () => clearInterval(interval);
  }, [demoMode]);

  useEffect(() => {
    const addDemoOrder = (order) => {
      setDemoMode(true);
      setHighlightedOrderId(order._id);
      setAllOrders((prev) => {
        const next = [order, ...prev.filter((item) => item._id !== order._id)];
        setOrders(
          next.filter((item) => activeStatuses.includes(item.status))
        );
        setStats(buildStats(next));
        return next;
      });
    };

    const handleDemoOrder = (event) => {
      if (event.detail) addDemoOrder(event.detail);
    };

    const handleStorage = (event) => {
      if (event.key !== DEMO_KITCHEN_ORDERS_KEY) return;
      const [latestOrder] = getStoredDemoOrders();
      if (latestOrder) addDemoOrder(latestOrder);
    };

    window.addEventListener("demo_order_created", handleDemoOrder);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("demo_order_created", handleDemoOrder);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const statsCards = [
    {
      label: "Total Orders Today",
      value: stats.totalOrders,
      color: "text-orange-500",
      icon: ReceiptText,
    },
    {
      label: "Pending",
      value: stats.pending,
      color: "text-blue-600",
      icon: Clock,
    },
    {
      label: "Preparing",
      value: stats.preparing,
      color: "text-yellow-600",
      icon: CookingPot,
    },
    {
      label: "Served",
      value: stats.served,
      color: "text-green-600",
      icon: CheckCircle,
    },
    {
      label: "Revenue Today",
      value: `Rs. ${stats.revenue}`,
      color: "text-pink-500",
      icon: IndianRupee,
    },
  ];

  const columns = [
    {
      title: "New Orders",
      status: "pending",
    },
    {
      title: "Accepted",
      status: "accepted",
    },
    {
      title: "Preparing",
      status: "preparing",
    },
  ];

  return (
    <div className="premium-page p-5 md:p-8">
      <div className="relative z-10">
        <div className="mb-8">
          <div className="premium-label-pill mb-4">
            <Sparkles size={18} />
            {demoMode ? "Kitchen Display - Demo Activity" : "Kitchen Display"}
          </div>
          <h1 className="text-4xl font-black text-slate-950">
            Kitchen Display System
          </h1>
          <p className="mt-2 text-slate-500">
            Live kitchen order queue for food preparation.
          </p>
          {demoMode && (
            <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700">
              <Activity size={16} />
              Story mode is keeping this screen alive until real orders arrive.
            </p>
          )}
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {statsCards.map((card) => {
            const Icon = card.icon;

            return (
              <div key={card.label} className="premium-card p-5">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                  <Icon size={20} />
                </div>
                <p className="text-sm font-semibold text-slate-500">
                  {card.label}
                </p>
                <h2 className={`mt-2 text-3xl font-black ${card.color}`}>
                  {card.value}
                </h2>
              </div>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {columns.map((column) => {
            const columnOrders = orders.filter(
              (order) => order.status === column.status
            );

            return (
              <section key={column.status} className="premium-card p-5">
                <h2 className="mb-5 text-2xl font-black text-slate-950">
                  {column.title}{" "}
                  <span className="text-orange-500">
                    ({columnOrders.length})
                  </span>
                </h2>

                <div className="space-y-5">
                  {columnOrders.map((order) => (
                    <motion.div
                      key={order._id}
                      layout
                      whileHover={{ y: -5, scale: 1.01 }}
                      className={`relative overflow-hidden rounded-[2rem] border bg-[#f8f6f2] p-5 transition ${
                        highlightedOrderId === order._id
                          ? "border-orange-300 ring-4 ring-orange-100"
                          : "border-orange-100"
                      }`}
                    >
                      {highlightedOrderId === order._id && (
                        <motion.div
                          initial={{ x: "-100%" }}
                          animate={{ x: "120%" }}
                          transition={{ duration: 1.2 }}
                          className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-orange-200/50 to-transparent"
                        />
                      )}

                      <div className="mb-4 flex justify-between gap-3">
                        <div>
                          <h3 className="text-2xl font-black text-orange-500">
                            {order.tableRoom?.type?.toUpperCase()}{" "}
                            {order.tableRoom?.number}
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            People: {order.numberOfPeople} |{" "}
                            {formatElapsed(order.createdAt, nowTick)}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="h-fit rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-orange-600">
                            {order.status}
                          </span>
                          {order.status === "preparing" && (
                            <p className="mt-2 flex items-center justify-end gap-1 text-xs font-black text-yellow-600">
                              <Flame size={14} />
                              Cooking now
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        {order.items?.map((item, index) => (
                          <div
                            key={`${item.name}-${index}`}
                            className="flex justify-between rounded-2xl bg-white p-3"
                          >
                            <span className="font-semibold">{item.name}</span>
                            <span className="font-black text-orange-500">
                              x {item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>

                      {order.note && (
                        <p className="mt-4 rounded-2xl border border-yellow-100 bg-yellow-50 p-3 text-sm text-slate-700">
                          Note: {order.note}
                        </p>
                      )}

                      <div className="mt-5 flex flex-col flex-wrap gap-2 sm:flex-row">
                        {order.status === "pending" && (
                          <button
                            onClick={() =>
                              updateStatus(order._id, "accepted")
                            }
                            aria-label={`Accept order for ${order.tableRoom?.type || "table"} ${order.tableRoom?.number || ""}`}
                            className="rounded-2xl bg-blue-500 px-4 py-3 font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-600"
                          >
                            Accept
                          </button>
                        )}

                        {order.status !== "preparing" && (
                          <button
                            onClick={() =>
                              updateStatus(order._id, "preparing")
                            }
                            aria-label={`Start preparing order for ${order.tableRoom?.type || "table"} ${order.tableRoom?.number || ""}`}
                            className="rounded-2xl bg-yellow-500 px-4 py-3 font-bold text-white shadow-lg shadow-yellow-500/20 hover:bg-yellow-600"
                          >
                            Start Preparing
                          </button>
                        )}

                        <button
                          onClick={() => updateStatus(order._id, "served")}
                          aria-label={`Mark order ready for ${order.tableRoom?.type || "table"} ${order.tableRoom?.number || ""}`}
                          className="rounded-2xl bg-green-500 px-4 py-3 font-bold text-white shadow-lg shadow-green-500/20 hover:bg-green-600"
                        >
                          Mark Ready/Served
                        </button>
                      </div>
                    </motion.div>
                  ))}

                  {columnOrders.length === 0 && (
                    <div className="rounded-[2rem] border border-orange-50 bg-white/70 px-5 py-10 text-center text-slate-500">
                      <Clock className="mx-auto mb-3 text-orange-300" />
                      <p className="font-bold text-slate-700">
                        Queue is clear
                      </p>
                      <p className="mt-1 text-sm">
                        New tickets will appear here instantly.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default KitchenDashboard;
