import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Banknote,
  CreditCard,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import api from "../services/api";
import socket from "../services/socket";
import { FieldError } from "./form/PremiumFields";
import OrderSuccessPanel from "./order/OrderSuccessPanel";

const getFriendlyOrderError = (error) => {
  if (!error.response) {
    return "The hotel service connection is taking a moment. Your cart is safe, please try again.";
  }

  if (error.response?.status === 404) {
    return "This room QR is not active anymore. You can clear it and place a normal website order, or scan a fresh room QR.";
  }

  return (
    error.response?.data?.message ||
    "We could not place the order yet. Please check once and try again."
  );
};

const isSameOrder = (currentOrder, updatedOrder) =>
  currentOrder?._id === updatedOrder?._id ||
  (currentOrder?.cashCode &&
    updatedOrder?.cashCode &&
    currentOrder.cashCode === updatedOrder.cashCode);

const CartDrawer = ({ open, onClose, tableContext }) => {
  const navigate = useNavigate();
  const {
    cartItems,
    increaseQty,
    decreaseQty,
    removeFromCart,
    clearCart,
    totalAmount,
  } = useCart();

  const { user } = useAuth();

  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [lastOrder, setLastOrder] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("online");

  const discountPercent = user?.discountPercent || 0;
  const discountAmount = Math.round((totalAmount * discountPercent) / 100);
  const finalAmount = totalAmount - discountAmount;

  useEffect(() => {
    const applyPaidUpdate = (updatedOrder) => {
      if (!updatedOrder) return;

      setLastOrder((currentOrder) => {
        if (!isSameOrder(currentOrder, updatedOrder)) return currentOrder;

        return {
          ...currentOrder,
          ...updatedOrder,
          paymentStatus: "paid",
          status:
            updatedOrder.status ||
            (currentOrder.status === "payment_pending"
              ? "pending"
              : currentOrder.status),
        };
      });
    };

    socket.on("order_payment_updated", applyPaidUpdate);
    socket.on("order_status_updated", applyPaidUpdate);

    return () => {
      socket.off("order_payment_updated", applyPaidUpdate);
      socket.off("order_status_updated", applyPaidUpdate);
    };
  }, []);

  const placeOrder = async () => {
    if (cartItems.length === 0) {
      setMessage("Cart is empty.");
      return;
    }

    if (!numberOfPeople || Number(numberOfPeople) < 1) {
      setFormErrors({ numberOfPeople: "Enter at least 1 guest." });
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      let activeSessionId = sessionId;

      if (!activeSessionId) {
        const qrToken = localStorage.getItem("qrToken");

        if (!qrToken) {
          activeSessionId = "";
        } else {
          const cartPreview = cartItems.map((item) => ({
            menuItem: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          }));

          let scanRes;

          try {
            scanRes = await api.get(`/rooms/scan/${qrToken}`, {
              params: {
                cartPreview: JSON.stringify(cartPreview),
                numberOfPeople,
                note,
                totalAmount,
              },
            });
          } catch (error) {
            if (error.response?.status === 404) {
              localStorage.removeItem("qrToken");
              localStorage.removeItem("verifiedSessionId");
              setSessionId("");
              activeSessionId = "";
              setMessage("Old room QR cleared. Placing this as a normal website order.");
            } else {
              throw error;
            }
          }

          if (scanRes?.data?.data?.sessionId) {
            activeSessionId = scanRes.data.data.sessionId;
            setSessionId(activeSessionId);
          }
        }
      }

      const payload = {
        sessionId: activeSessionId || undefined,
        numberOfPeople,
        note,
        paymentMethod,
        tableContext: tableContext
          ? {
              type: tableContext.type,
              number: tableContext.number,
              label: tableContext.label,
            }
          : undefined,
        items: cartItems.map((item) => ({
          menuItem: item._id,
          quantity: item.quantity,
        })),
      };

      const res = await api.post("/orders", payload);
      const successOrder = res.data.order || {
        _id: `local-order-${Date.now()}`,
        tableRoom: tableContext,
        numberOfPeople,
        note,
        totalAmount,
        finalAmount,
        createdAt: new Date().toISOString(),
        items: cartItems.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      };

      clearCart();
      setSessionId("");
      setPaymentMethod("online");
      setMessage(res.data.message || "");
      setLastOrder(successOrder);
      onClose();
      navigate(`/my-orders?order=${successOrder._id}`, {
        state: { message: "Order placed successfully." },
      });
    } catch (error) {
      setMessage(getFriendlyOrderError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: "100%", opacity: 0.6 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.6 }}
            transition={{ type: "spring", damping: 28, stiffness: 230 }}
            className="fixed right-0 top-0 z-50 h-full w-full overflow-y-auto bg-[#f8f6f2] p-4 text-slate-900 shadow-2xl sm:max-w-md md:p-5"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black">
                  {lastOrder ? "Order Status" : "Your Cart"}
                </h2>
                <p className="text-sm text-slate-500">
                  {lastOrder
                    ? "Track the service flow in real time."
                    : "Review your room-service order."}
                </p>
              </div>

              <button
                onClick={onClose}
                className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
              >
                <X />
              </button>
            </div>

            {lastOrder ? (
              <OrderSuccessPanel
                order={lastOrder}
                onClose={onClose}
                onNewOrder={() => {
                  setLastOrder(null);
                  setMessage("");
                }}
              />
            ) : (
              <>
            <div className="space-y-4">
              {cartItems.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="overflow-hidden rounded-[2rem] border border-white bg-white/85 p-8 text-center shadow-xl backdrop-blur-xl"
                >
                  <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-orange-50 text-orange-500">
                    <motion.span
                      animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ duration: 2.4, repeat: Infinity }}
                      className="absolute inset-0 rounded-[1.75rem] border border-orange-300"
                    />
                    <ShoppingBag size={30} />
                  </div>

                  <h3 className="text-2xl font-black text-slate-900">
                    Your cart is waiting
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Add dishes manually or use the AI assistant to build an
                    order from a simple sentence.
                  </p>

                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 font-black text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600"
                  >
                    <Sparkles size={17} />
                    Explore menu
                  </button>
                </motion.div>
              )}

              {cartItems.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 14 }}
                  className="rounded-[2rem] border border-white bg-white/85 p-4 shadow-lg backdrop-blur-xl"
                >
                  <div className="flex justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-black">{item.name}</h3>
                      <p className="font-bold text-orange-500">
                        Rs. {item.price}
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item._id)}
                      aria-label={`Remove ${item.name} from cart`}
                      className="h-fit rounded-xl bg-red-50 p-2 text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={() => decreaseQty(item._id)}
                      aria-label={`Decrease ${item.name} quantity`}
                      className="rounded-xl bg-slate-100 p-2"
                    >
                      <Minus size={16} />
                    </button>

                    <span className="text-lg font-black">{item.quantity}</span>

                    <button
                      onClick={() => increaseQty(item._id)}
                      aria-label={`Increase ${item.name} quantity`}
                      className="rounded-xl bg-orange-50 p-2 text-orange-500"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 space-y-4">
              <input
                type="number"
                min="1"
                value={numberOfPeople}
                onChange={(e) => {
                  setNumberOfPeople(Number(e.target.value));
                  setFormErrors((prev) => ({
                    ...prev,
                    numberOfPeople: "",
                  }));
                }}
                className={`w-full rounded-2xl border bg-white p-4 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100 ${
                  formErrors.numberOfPeople
                    ? "border-red-200 bg-red-50/60"
                    : "border-slate-200"
                }`}
                placeholder="Number of people"
                aria-invalid={Boolean(formErrors.numberOfPeople)}
              />
              <FieldError>{formErrors.numberOfPeople}</FieldError>

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white p-4 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                placeholder="Special note e.g. less spicy"
              />

              <div className="space-y-3 rounded-[2rem] border border-white bg-white/85 p-5 shadow-lg">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>Rs. {totalAmount}</span>
                </div>

                {discountPercent > 0 && (
                  <div className="flex justify-between font-bold text-green-600">
                    <span>Discount ({discountPercent}%)</span>
                    <span>-Rs. {discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between border-t border-slate-200 pt-4 text-2xl font-black">
                  <span>Total</span>
                  <span className="text-orange-500">Rs. {finalAmount}</span>
                </div>

                {user?.offerNote && (
                  <p className="rounded-2xl bg-green-50 p-3 text-sm text-green-700">
                    Offer: {user.offerNote}
                  </p>
                )}
              </div>

              <div className="space-y-3 rounded-[2rem] border border-white bg-white/85 p-5 shadow-lg">
                <div>
                  <h3 className="font-black text-slate-900">
                    Payment before order
                  </h3>
                  <p className="text-sm text-slate-500">
                    Order normally from the website, or scan a room QR to link
                    it with a room. Cash orders generate a counter code.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("online")}
                    className={`rounded-2xl border p-4 text-left transition ${
                      paymentMethod === "online"
                        ? "border-orange-300 bg-orange-50 text-orange-600"
                        : "border-slate-200 bg-white text-slate-600"
                    }`}
                  >
                    <CreditCard className="mb-2" size={22} />
                    <span className="block font-black">Online</span>
                    <span className="text-xs font-semibold">
                      Simulated paid
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cash")}
                    className={`rounded-2xl border p-4 text-left transition ${
                      paymentMethod === "cash"
                        ? "border-green-300 bg-green-50 text-green-700"
                        : "border-slate-200 bg-white text-slate-600"
                    }`}
                  >
                    <Banknote className="mb-2" size={22} />
                    <span className="block font-black">Cash</span>
                    <span className="text-xs font-semibold">
                      Code at counter
                    </span>
                  </button>
                </div>
              </div>

              {message && (
                <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-700">
                  <p>{message}</p>
                  {message.toLowerCase().includes("room qr") && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link
                        to="/rooms"
                        onClick={onClose}
                        className="rounded-xl bg-orange-500 px-3 py-2 text-xs font-black text-white"
                      >
                        View rooms
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          localStorage.removeItem("qrToken");
                          localStorage.removeItem("verifiedSessionId");
                          setSessionId("");
                          setMessage("Room QR cleared. Please scan a fresh room QR.");
                        }}
                        className="rounded-xl bg-white px-3 py-2 text-xs font-black text-orange-600"
                      >
                        Clear QR
                      </button>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={placeOrder}
                disabled={loading}
                className="w-full rounded-2xl bg-orange-500 p-4 font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:bg-slate-300"
              >
                {loading
                  ? "Processing..."
                  : paymentMethod === "cash"
                  ? "Generate Cash Code"
                  : "Pay Online & Place Order"}
              </button>
            </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
