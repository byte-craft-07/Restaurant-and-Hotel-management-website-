import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShieldCheck, ShoppingBag, Sparkles, Trash2, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import api from "../services/api";
import { FieldError } from "./form/PremiumFields";
import OrderSuccessPanel from "./order/OrderSuccessPanel";
import {
  DEMO_KITCHEN_ORDERS_KEY,
  DEMO_VERIFICATION_CODE,
  createDemoOrderFromCart,
  isDemoQrToken,
} from "../services/demoExperience";

const getFriendlyOrderError = (error) => {
  if (!error.response) {
    return "The restaurant connection is taking a moment. Your cart is safe, please try again.";
  }

  return (
    error.response?.data?.message ||
    "We could not place the order yet. Please check once and try again."
  );
};

const CartDrawer = ({ open, onClose, tableContext }) => {
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
  const [verificationCode, setVerificationCode] = useState("");
  const [needVerification, setNeedVerification] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [lastOrder, setLastOrder] = useState(null);

  const discountPercent = user?.discountPercent || 0;
  const discountAmount = Math.round((totalAmount * discountPercent) / 100);
  const finalAmount = totalAmount - discountAmount;

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

      if (!needVerification && !activeSessionId) {
        const qrToken = localStorage.getItem("qrToken");

        if (!qrToken) {
          setMessage("Please scan table QR first.");
          return;
        }

        if (isDemoQrToken(qrToken)) {
          activeSessionId = `demo-session-${Date.now()}`;
          setSessionId(activeSessionId);
          setNeedVerification(true);
          setMessage(
            `Demo verification generated. Use code ${DEMO_VERIFICATION_CODE} to place the order.`
          );
          return;
        }

        const cartPreview = cartItems.map((item) => ({
          menuItem: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        }));

        const scanRes = await api.get(`/table-rooms/scan/${qrToken}`, {
          params: {
            cartPreview: JSON.stringify(cartPreview),
            numberOfPeople,
            note,
            totalAmount,
          },
        });

        activeSessionId = scanRes.data.data.sessionId;
        setSessionId(activeSessionId);
        setNeedVerification(true);

        setMessage(
          "Verification code generated. Ask waiter/admin for the code."
        );
        return;
      }

      if (needVerification) {
        if (!verificationCode) {
          setFormErrors({
            verificationCode: "Enter verification code first.",
          });
          return;
        }

        if (
          activeSessionId?.startsWith("demo-session") &&
          verificationCode !== DEMO_VERIFICATION_CODE
        ) {
          setFormErrors({
            verificationCode: `Use demo code ${DEMO_VERIFICATION_CODE}.`,
          });
          return;
        }

        if (activeSessionId?.startsWith("demo-session")) {
          const demoOrder = createDemoOrderFromCart({
            cartItems,
            numberOfPeople,
            note,
            totalAmount: finalAmount,
            tableContext,
          });

          const savedOrders = JSON.parse(
            localStorage.getItem(DEMO_KITCHEN_ORDERS_KEY) || "[]"
          );

          localStorage.setItem(
            DEMO_KITCHEN_ORDERS_KEY,
            JSON.stringify([demoOrder, ...savedOrders].slice(0, 8))
          );
          window.dispatchEvent(
            new CustomEvent("demo_order_created", { detail: demoOrder })
          );

          clearCart();
          setSessionId("");
          setVerificationCode("");
          setNeedVerification(false);
          setMessage("");
          setLastOrder(demoOrder);
          return;
        }

        await api.post("/table-rooms/verify", {
          sessionId: activeSessionId,
          verificationCode,
        });

        setNeedVerification(false);
      }

      const payload = {
        sessionId: activeSessionId,
        numberOfPeople,
        note,
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
      setVerificationCode("");
      setNeedVerification(false);
      setMessage(res.data.message || "");
      setLastOrder(successOrder);
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
                    : "Review and verify your order."}
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

              {needVerification && (
                <div className="space-y-3 rounded-[2rem] border border-orange-200 bg-orange-50 p-5">
                  <div className="flex items-center gap-2 font-black text-orange-600">
                    <ShieldCheck />
                    Verification Required
                  </div>

                  <p className="text-sm text-slate-600">
                    Ask the waiter/admin for your 6-digit verification code.
                  </p>

                  <input
                    value={verificationCode}
                    onChange={(e) => {
                      setVerificationCode(e.target.value);
                      setFormErrors((prev) => ({
                        ...prev,
                        verificationCode: "",
                      }));
                    }}
                    placeholder="Enter 6-digit code"
                    className={`w-full rounded-2xl border bg-white p-4 outline-none focus:ring-4 focus:ring-orange-100 ${
                      formErrors.verificationCode
                        ? "border-red-200 bg-red-50/60"
                        : "border-orange-200"
                    }`}
                    aria-invalid={Boolean(formErrors.verificationCode)}
                  />
                  <FieldError>{formErrors.verificationCode}</FieldError>
                </div>
              )}

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

              {message && (
                <p className="rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-700">
                  {message}
                </p>
              )}

              <button
                onClick={placeOrder}
                disabled={loading}
                className="w-full rounded-2xl bg-orange-500 p-4 font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:bg-slate-300"
              >
                {loading
                  ? "Processing..."
                  : needVerification
                  ? "Verify & Place Order"
                  : "Place Order"}
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
