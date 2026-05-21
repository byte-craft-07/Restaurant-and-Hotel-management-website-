import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ChefHat,
  Clock3,
  ConciergeBell,
  ReceiptText,
  Sparkles,
} from "lucide-react";
import { RESTAURANT_BRAND, getTableDisplay } from "../../services/restaurantBranding";

const timelineSteps = [
  {
    title: "Order Received",
    description: "Your table order has reached the service team.",
    icon: ReceiptText,
  },
  {
    title: "Preparing",
    description: "Kitchen is reviewing your dishes and notes.",
    icon: ChefHat,
  },
  {
    title: "Almost Ready",
    description: "Final plating and checks are underway.",
    icon: Clock3,
  },
  {
    title: "Ready to Serve",
    description: "Staff will bring it to your table shortly.",
    icon: ConciergeBell,
  },
];

const OrderSuccessPanel = ({
  order,
  onNewOrder,
  onClose,
  brand = RESTAURANT_BRAND,
}) => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => Math.min(prev + 1, timelineSteps.length - 1));
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  const itemCount = useMemo(
    () =>
      (order?.items || []).reduce(
        (sum, item) => sum + (Number(item.quantity) || 0),
        0
      ),
    [order]
  );

  if (!order) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <div className="relative overflow-hidden rounded-[2rem] border border-green-100 bg-green-50 p-6 text-center shadow-xl">
        <motion.div
          animate={{ scale: [1, 1.08, 1], rotate: [0, 3, -3, 0] }}
          transition={{ duration: 2.4, repeat: Infinity }}
          className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-white text-green-600 shadow-lg"
        >
          <CheckCircle2 size={42} />
        </motion.div>

        <div className="premium-label-pill mb-4 bg-white/80">
          <Sparkles size={17} />
          Order confirmed
        </div>

        <h2 className="text-3xl font-black text-slate-950">
          Thank you, your order is in motion.
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-600">
          {brand.name} has received your order for{" "}
          <span className="font-black text-slate-900">
            {getTableDisplay(order.tableRoom)}
          </span>
          . Estimated preparation time is{" "}
          <span className="font-black text-orange-600">
            {brand.prepTimeMinutes} min
          </span>
          .
        </p>
      </div>

      <div className="rounded-[2rem] border border-white bg-white/85 p-5 shadow-lg">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-black text-slate-950">
              Order Summary
            </h3>
            <p className="text-sm text-slate-500">
              {itemCount} item{itemCount === 1 ? "" : "s"} confirmed
            </p>
          </div>
          <p className="text-xl font-black text-orange-500">
            Rs. {order.finalAmount || order.totalAmount}
          </p>
        </div>

        <div className="space-y-2">
          {order.items?.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="flex items-center justify-between rounded-2xl bg-[#f8f6f2] px-4 py-3 text-sm"
            >
              <span className="font-bold text-slate-800">{item.name}</span>
              <span className="font-black text-orange-500">
                x {item.quantity}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[2rem] border border-white bg-white/85 p-5 shadow-lg">
        <h3 className="mb-4 text-xl font-black text-slate-950">
          Live Order Timeline
        </h3>

        <div className="space-y-3">
          {timelineSteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index <= activeStep;

            return (
              <motion.div
                key={step.title}
                animate={{
                  scale: isActive && index === activeStep ? [1, 1.02, 1] : 1,
                }}
                transition={{ duration: 0.7 }}
                className={`flex gap-3 rounded-2xl border p-4 ${
                  isActive
                    ? "border-orange-100 bg-orange-50"
                    : "border-slate-100 bg-slate-50"
                }`}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                    isActive
                      ? "bg-orange-500 text-white"
                      : "bg-white text-slate-400"
                  }`}
                >
                  <Icon size={19} />
                </div>
                <div>
                  <p className="font-black text-slate-900">{step.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={onNewOrder}
          className="rounded-2xl bg-orange-500 px-5 py-4 font-black text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600"
        >
          Add more items
        </button>
        <Link
          to="/kitchen"
          className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-center font-black text-slate-700 shadow-sm hover:border-orange-200 hover:text-orange-500"
          onClick={onClose}
        >
          View kitchen demo
        </Link>
      </div>
    </motion.div>
  );
};

export default OrderSuccessPanel;
