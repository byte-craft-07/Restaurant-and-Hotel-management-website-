import { useState } from "react";
import { motion } from "framer-motion";
import { Banknote, CheckCircle, ReceiptText, Search } from "lucide-react";
import api from "../../services/api";
import { DEMO_KITCHEN_ORDERS_KEY } from "../../services/demoExperience";

const normalizeCashCode = (value = "") => {
  const code = value.trim().toUpperCase();

  if (!code) return "";
  return code.startsWith("CASH-") ? code : `CASH-${code}`;
};

const getDemoOrders = () => {
  try {
    return JSON.parse(localStorage.getItem(DEMO_KITCHEN_ORDERS_KEY) || "[]");
  } catch {
    return [];
  }
};

const Payments = () => {
  const [cashCode, setCashCode] = useState("");
  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const searchBill = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setOrder(null);

    const normalizedCode = normalizeCashCode(cashCode);

    if (!normalizedCode) {
      setError("Enter cash payment code.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.get(`/orders/cash-code/${normalizedCode}`);
      setOrder(res.data.order);
    } catch (err) {
      const demoOrder = getDemoOrders().find(
        (item) => normalizeCashCode(item.cashCode) === normalizedCode
      );

      if (demoOrder) {
        setOrder({ ...demoOrder, isDemoOrder: true });
        setMessage("Demo/local bill loaded.");
        return;
      }

      setError(err.response?.data?.message || "Unable to find this bill.");
    } finally {
      setLoading(false);
    }
  };

  const markPaid = async () => {
    if (!order?.cashCode) return;

    if (order.isDemoOrder) {
      const updatedOrder = {
        ...order,
        paymentStatus: "paid",
        status: order.status === "payment_pending" ? "pending" : order.status,
        paidAt: new Date().toISOString(),
      };

      const updatedOrders = getDemoOrders().map((item) =>
        item._id === order._id ? updatedOrder : item
      );

      localStorage.setItem(
        DEMO_KITCHEN_ORDERS_KEY,
        JSON.stringify(updatedOrders)
      );
      window.dispatchEvent(
        new CustomEvent("demo_payment_updated", { detail: updatedOrder })
      );
      setOrder(updatedOrder);
      setMessage("Demo/local payment complete. Order confirmed.");
      setError("");
      return;
    }

    try {
      setLoading(true);
      const res = await api.put(`/orders/cash-code/${order.cashCode}/paid`);
      setOrder(res.data.order);
      setMessage(res.data.message || "Payment complete. Order confirmed.");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-4 py-2 shadow-sm">
          <Banknote size={18} className="text-green-600" />
          <span className="text-sm font-bold text-slate-600">
            Cash Counter
          </span>
        </div>
        <h1 className="text-4xl font-black text-slate-950">Payments</h1>
        <p className="mt-2 text-slate-500">
          Enter the customer cash code to open the latest bill and confirm
          payment.
        </p>
      </div>

      <section className="rounded-[2rem] border border-white/80 bg-white/75 p-6 shadow-xl backdrop-blur-2xl">
        <form onSubmit={searchBill} className="flex flex-col gap-3 sm:flex-row">
          <input
            value={cashCode}
            onChange={(event) => setCashCode(event.target.value.toUpperCase())}
            placeholder="Enter code e.g. 123456 or CASH-123456"
            className="min-h-14 flex-1 rounded-2xl border border-slate-200 bg-white px-4 font-black uppercase tracking-wider outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
          />
          <button
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-4 font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:bg-slate-300"
          >
            <Search size={19} />
            Search Bill
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 font-semibold text-red-600">
            {error}
          </p>
        )}

        {message && (
          <p className="mt-4 rounded-2xl border border-green-200 bg-green-50 p-4 font-semibold text-green-700">
            {message}
          </p>
        )}
      </section>

      {order && (
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] border border-white/80 bg-white/75 p-6 shadow-xl backdrop-blur-2xl"
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 font-black text-green-700">
                <ReceiptText size={17} />
                {order.cashCode}
              </div>
              <h2 className="text-3xl font-black text-slate-950">
                Rs. {order.finalAmount || order.totalAmount}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {order.customer?.name || "Customer"} |{" "}
                {order.customer?.phone || "No phone"}
              </p>
              <p className="text-sm text-slate-500">
                Room {order.tableRoom?.number}
              </p>
            </div>

            <span
              className={`w-fit rounded-full border px-4 py-2 text-sm font-black ${
                order.paymentStatus === "paid"
                  ? "border-green-100 bg-green-50 text-green-700"
                  : "border-amber-100 bg-amber-50 text-amber-700"
              }`}
            >
              {order.paymentStatus === "paid" ? "Paid" : "Pending Cash"}
            </span>
          </div>

          <div className="mt-6 space-y-3">
            {order.items?.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
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

          <button
            onClick={markPaid}
            disabled={loading || order.paymentStatus === "paid"}
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-green-500 px-5 py-4 font-black text-white shadow-lg shadow-green-500/20 transition hover:bg-green-600 disabled:bg-slate-300"
          >
            <CheckCircle size={19} />
            {order.paymentStatus === "paid" ? "Already Paid" : "Mark Paid"}
          </button>
        </motion.section>
      )}
    </div>
  );
};

export default Payments;
