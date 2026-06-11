import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BellRing,
  Banknote,
  CheckCircle,
  Clock,
  CookingPot,
  CreditCard,
  ReceiptText,
  XCircle,
} from "lucide-react";
import socket from "../../services/socket";
import api from "../../services/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data.orders || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load orders.");
    }
  };

  const fetchServiceRequests = async () => {
    try {
      const res = await api.get("/service-requests");
      setServiceRequests(res.data.serviceRequests || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load service calls.");
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, { status });

      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? res.data.order : order))
      );
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update order.");
    }
  };

  const updateServiceRequest = async (requestId, status) => {
    try {
      const res = await api.put(`/service-requests/${requestId}/status`, {
        status,
      });

      if (status === "resolved" || status === "cancelled") {
        setServiceRequests((prev) =>
          prev.filter((request) => request._id !== requestId)
        );
        return;
      }

      setServiceRequests((prev) =>
        prev.map((request) =>
          request._id === requestId ? res.data.serviceRequest : request
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update service call.");
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchServiceRequests();

    socket.on("new_order", (order) => {
      setOrders((prev) => [order, ...prev]);
    });

    socket.on("order_status_updated", (updatedOrder) => {
      setOrders((prev) =>
        prev.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    });

    socket.on("service_request_created", (serviceRequest) => {
      setServiceRequests((prev) => [
        serviceRequest,
        ...prev.filter((request) => request._id !== serviceRequest._id),
      ]);
    });

    socket.on("service_request_updated", (serviceRequest) => {
      setServiceRequests((prev) => {
        if (
          serviceRequest.status === "resolved" ||
          serviceRequest.status === "cancelled"
        ) {
          return prev.filter((request) => request._id !== serviceRequest._id);
        }

        return prev.map((request) =>
          request._id === serviceRequest._id ? serviceRequest : request
        );
      });
    });

    return () => {
      socket.off("new_order");
      socket.off("order_status_updated");
      socket.off("service_request_created");
      socket.off("service_request_updated");
    };
  }, []);

  const getStatusStyle = (status) => {
    const styles = {
      accepted: "bg-purple-50 text-purple-600 border-purple-100",
      cancelled: "bg-red-50 text-red-600 border-red-100",
      payment_pending: "bg-amber-50 text-amber-700 border-amber-100",
      pending: "bg-blue-50 text-blue-600 border-blue-100",
      preparing: "bg-yellow-50 text-yellow-600 border-yellow-100",
      served: "bg-green-50 text-green-600 border-green-100",
    };

    return styles[status] || "bg-slate-50 text-slate-600 border-slate-100";
  };

  return (
    <div>
      <div className="mb-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-4 py-2 shadow-sm">
          <ReceiptText size={18} className="text-orange-500" />
          <span className="text-sm font-bold text-slate-600">
            Live Order Operations
          </span>
        </div>

        <h1 className="text-4xl font-black text-slate-950">Orders</h1>
        <p className="mt-2 text-slate-500">
          Manage live orders, payments and service flow.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      <section className="mb-8 rounded-[2rem] border border-white/80 bg-white/75 p-6 shadow-xl backdrop-blur-2xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-950">
              Service Requests
            </h2>
            <p className="text-sm text-slate-500">
              Guest calls from QR menu that need staff acknowledgement.
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <BellRing />
          </div>
        </div>

        {serviceRequests.length === 0 ? (
          <div className="rounded-[2rem] border border-orange-100 bg-[#f8f6f2] p-8 text-center text-slate-500">
            No active service requests.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
            {serviceRequests.map((request) => (
              <motion.div
                key={request._id}
                layout
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="rounded-[2rem] border border-amber-100 bg-[#f8f6f2] p-5 shadow-sm"
              >
                <div className="flex justify-between gap-3">
                  <div>
                    <p className="font-black text-amber-600">
                      Room {request.tableRoom?.number}
                    </p>
                    <p className="text-sm text-slate-500">
                      {request.customer?.name || "Guest"} |{" "}
                      {request.customer?.phone || "No phone"}
                    </p>
                  </div>

                  <span className="h-fit rounded-full bg-white px-3 py-1 text-xs font-bold capitalize text-amber-700">
                    {request.status}
                  </span>
                </div>

                <p className="mt-4 rounded-2xl border border-white bg-white p-3 text-sm font-semibold text-slate-700">
                  {request.note || "Guest requested hotel service assistance."}
                </p>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  {request.status === "pending" && (
                    <button
                      onClick={() =>
                        updateServiceRequest(request._id, "acknowledged")
                      }
                      className="rounded-2xl bg-blue-500 px-4 py-3 font-bold text-white shadow-lg shadow-blue-500/20"
                    >
                      Acknowledge
                    </button>
                  )}

                  <button
                    onClick={() => updateServiceRequest(request._id, "resolved")}
                    className="rounded-2xl bg-green-500 px-4 py-3 font-bold text-white shadow-lg shadow-green-500/20"
                  >
                    Resolve
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-5">
        {orders.map((order) => (
          <motion.div
            key={order._id}
            layout
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2rem] border border-white/80 bg-white/75 p-6 shadow-xl backdrop-blur-2xl"
          >
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Room {order.tableRoom?.number}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Customer: {order.customer?.name || "Customer"} |{" "}
                  {order.customer?.phone || "No phone"}
                </p>

                <p className="text-sm text-slate-500">
                  People: {order.numberOfPeople}
                </p>

                <p className="mt-2 flex w-fit items-center gap-2 rounded-full border border-white bg-white px-3 py-1 text-xs font-black capitalize text-slate-600">
                  {order.paymentMethod === "cash" ? (
                    <Banknote size={15} className="text-green-600" />
                  ) : (
                    <CreditCard size={15} className="text-blue-600" />
                  )}
                  {order.paymentMethod || "online"} |{" "}
                  {order.paymentStatus === "paid"
                    ? "Paid"
                    : `Pending ${order.cashCode || ""}`}
                </p>
              </div>

              <span
                className={`w-fit rounded-full border px-4 py-2 text-sm font-black ${getStatusStyle(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {order.items?.map((item, index) => (
                <div
                  key={`${item.menuItem || item.name}-${index}`}
                  className="flex justify-between rounded-2xl border border-orange-50 bg-[#f8f6f2] p-4"
                >
                  <span className="font-bold">{item.name}</span>
                  <span className="font-black text-orange-500">
                    Rs. {item.price} x {item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {order.note && (
              <p className="mt-4 rounded-2xl border border-yellow-100 bg-yellow-50 p-4 text-sm text-slate-600">
                Note: {order.note}
              </p>
            )}

            {order.discountPercent > 0 && (
              <p className="mt-4 rounded-2xl border border-green-100 bg-green-50 p-4 text-sm font-semibold text-green-700">
                Discount {order.discountPercent}% applied (-Rs.{" "}
                {order.discountAmount})
              </p>
            )}

            <div className="mt-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <p className="text-2xl font-black text-orange-500">
                Total Rs. {order.finalAmount || order.totalAmount}
              </p>

              <div className="flex flex-col flex-wrap gap-2 sm:flex-row">
                <button
                  onClick={() => updateStatus(order._id, "accepted")}
                  className="flex items-center gap-2 rounded-2xl bg-blue-500 px-4 py-3 font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-600"
                >
                  <CheckCircle size={18} />
                  Accept
                </button>

                <button
                  onClick={() => updateStatus(order._id, "preparing")}
                  className="flex items-center gap-2 rounded-2xl bg-yellow-500 px-4 py-3 font-bold text-white shadow-lg shadow-yellow-500/20 transition hover:bg-yellow-600"
                >
                  <CookingPot size={18} />
                  Preparing
                </button>

                <button
                  onClick={() => updateStatus(order._id, "served")}
                  className="flex items-center gap-2 rounded-2xl bg-green-500 px-4 py-3 font-bold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-600"
                >
                  <Clock size={18} />
                  Served
                </button>

                <button
                  onClick={() => updateStatus(order._id, "cancelled")}
                  className="flex items-center gap-2 rounded-2xl bg-red-500 px-4 py-3 font-bold text-white shadow-lg shadow-red-500/20 transition hover:bg-red-600"
                >
                  <XCircle size={18} />
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {orders.length === 0 && (
          <div className="rounded-[2rem] border border-white/80 bg-white/75 p-12 text-center text-slate-500 shadow-xl">
            No orders yet.
          </div>
        )}
      </section>
    </div>
  );
};

export default Orders;
