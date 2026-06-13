import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BellRing,
  CheckCircle,
  Home,
  ReceiptText,
  Sparkles,
  XCircle,
} from "lucide-react";
import socket from "../../services/socket";
import api from "../../services/api";

const WaiterDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);

  const fetchOrders = async () => {
    const res = await api.get("/orders");
    setOrders(res.data.orders || []);
  };

  const fetchServiceRequests = async () => {
    const res = await api.get("/service-requests");
    setServiceRequests(res.data.serviceRequests || []);
  };

  const updateStatus = async (orderId, status) => {
    const res = await api.put(`/orders/${orderId}/status`, { status });

    setOrders((prev) =>
      prev.map((order) => (order._id === orderId ? res.data.order : order))
    );
  };

  const updateServiceRequest = async (requestId, status) => {
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

  const activeOrders = orders.filter((order) =>
    ["pending", "accepted", "preparing"].includes(order.status)
  );

  const readyOrders = orders.filter((order) => order.status === "served");

  return (
    <div className="premium-page p-5 md:p-8">
      <div className="relative z-10">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="premium-label-pill mb-4">
              <Sparkles size={18} />
              Live Service Desk
            </div>
            <h1 className="text-4xl font-black text-slate-950">
              Service Staff Dashboard
            </h1>
            <p className="mt-2 text-slate-500">
              Live room orders and hotel service operations.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex w-fit items-center gap-2 rounded-2xl border border-orange-100 bg-white/85 px-5 py-3 font-black text-orange-600 shadow-lg shadow-orange-100/60 transition hover:border-orange-200 hover:bg-orange-50"
          >
            <Home size={18} />
            Home Page
          </Link>
        </div>

        <section className="premium-card mb-8 p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-950">
                Service Requests
              </h2>
              <p className="text-sm text-slate-500">
                Guest calls from hotel rooms.
              </p>
            </div>

            <div className="rounded-2xl bg-amber-50 p-3 text-amber-600">
              <BellRing />
            </div>
          </div>

          {serviceRequests.length === 0 ? (
            <p className="rounded-[2rem] bg-[#f8f6f2] p-8 text-center text-slate-500">
              No active service calls.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {serviceRequests.map((request) => (
                <motion.div
                  key={request._id}
                  whileHover={{ y: -5, scale: 1.01 }}
                  className="rounded-[2rem] border border-amber-100 bg-[#f8f6f2] p-5"
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

                  <p className="mt-4 rounded-2xl bg-white p-3 text-sm font-semibold text-slate-700">
                    {request.note || "Guest requested hotel service assistance."}
                  </p>

                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    {request.status === "pending" && (
                      <button
                        onClick={() =>
                          updateServiceRequest(request._id, "acknowledged")
                        }
                        className="rounded-2xl bg-blue-500 px-4 py-2 font-bold text-white shadow-lg shadow-blue-500/20"
                      >
                        Acknowledge
                      </button>
                    )}

                    <button
                      onClick={() =>
                        updateServiceRequest(request._id, "resolved")
                      }
                      className="rounded-2xl bg-green-500 px-4 py-2 font-bold text-white shadow-lg shadow-green-500/20"
                    >
                      Resolve
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        <h2 className="mb-4 text-2xl font-black text-slate-950">
          Active Orders
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
          {activeOrders.map((order) => (
            <motion.div
              key={order._id}
              layout
              whileHover={{ y: -5, scale: 1.01 }}
              className="premium-card p-5"
            >
              <div className="flex justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-black text-orange-500">
                    Room {order.tableRoom?.number}
                  </h3>
                  <p className="text-sm text-slate-500">
                    People: {order.numberOfPeople}
                  </p>
                </div>

                <span className="h-fit rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-orange-600">
                  {order.status}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                {order.items?.map((item, index) => (
                  <div
                    key={`${item.name}-${index}`}
                    className="flex justify-between rounded-2xl bg-[#f8f6f2] p-3"
                  >
                    <span className="font-semibold">{item.name}</span>
                    <span>x {item.quantity}</span>
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
                    onClick={() => updateStatus(order._id, "accepted")}
                    className="flex items-center gap-2 rounded-2xl bg-blue-500 px-4 py-2 font-bold text-white shadow-lg shadow-blue-500/20"
                  >
                    <CheckCircle size={18} />
                    Accept
                  </button>
                )}

                <button
                  onClick={() => updateStatus(order._id, "served")}
                  className="flex items-center gap-2 rounded-2xl bg-green-500 px-4 py-2 font-bold text-white shadow-lg shadow-green-500/20"
                >
                  <ReceiptText size={18} />
                  Served
                </button>

                <button
                  onClick={() => updateStatus(order._id, "cancelled")}
                  className="flex items-center gap-2 rounded-2xl bg-red-500 px-4 py-2 font-bold text-white shadow-lg shadow-red-500/20"
                >
                  <XCircle size={18} />
                  Cancel
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <h2 className="mb-4 mt-10 text-2xl font-black text-slate-950">
          Served Orders
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
          {readyOrders.map((order) => (
            <div
              key={order._id}
              className="rounded-[2rem] border border-green-100 bg-green-50/90 p-5 shadow-lg"
            >
              <h3 className="text-xl font-black text-green-700">
                {order.tableRoom?.type?.toUpperCase()}{" "}
                {order.tableRoom?.number}
              </h3>

              <p className="mt-1 text-slate-600">
                Total Rs. {order.finalAmount || order.totalAmount}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WaiterDashboard;
