import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BadgePercent, Phone, ReceiptText, Save, UserRound } from "lucide-react";
import api from "../../services/api";
import { FieldError, fieldClass } from "../../components/form/PremiumFields";

const CustomerDetails = () => {
  const { id } = useParams();

  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [offerForm, setOfferForm] = useState({
    discountPercent: 0,
    offerNote: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [message, setMessage] = useState("");

  const fetchDetails = async () => {
    const res = await api.get(`/users/customers/${id}`);
    setCustomer(res.data.customer);
    setOrders(res.data.orders || []);

    setOfferForm({
      discountPercent: res.data.customer.discountPercent || 0,
      offerNote: res.data.customer.offerNote || "",
    });
  };

  const updateOffer = async (e) => {
    e.preventDefault();
    const discountPercent = Number(offerForm.discountPercent);

    if (
      Number.isNaN(discountPercent) ||
      discountPercent < 0 ||
      discountPercent > 100
    ) {
      setFormErrors({
        discountPercent: "Discount must be between 0 and 100.",
      });
      return;
    }

    await api.put(`/users/customers/${id}/offer`, offerForm);
    setMessage("Offer updated successfully.");
    setFormErrors({});
    fetchDetails();
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  if (!customer) {
    return <div className="premium-card p-10 text-slate-500">Loading...</div>;
  }

  const stats = [
    {
      label: "Phone",
      value: customer.phone,
      color: "text-slate-900",
      icon: Phone,
    },
    {
      label: "Orders",
      value: customer.orderCount || 0,
      color: "text-orange-500",
      icon: ReceiptText,
    },
    {
      label: "Total Spent",
      value: `Rs. ${customer.totalSpent || 0}`,
      color: "text-green-600",
      icon: UserRound,
    },
    {
      label: "Discount",
      value: `${customer.discountPercent || 0}%`,
      color: "text-pink-500",
      icon: BadgePercent,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <div className="premium-label-pill mb-4">
          <UserRound size={18} />
          Customer Profile
        </div>
        <h1 className="text-4xl font-black text-slate-950">
          {customer.name}
        </h1>
        <p className="mt-2 text-slate-500">
          Customer ID: {customer.customerId || "Not assigned"}
        </p>
      </div>

      <div className="mb-8 grid gap-5 md:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div key={stat.label} className="premium-card p-5">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                <Icon size={20} />
              </div>
              <p className="text-sm font-semibold text-slate-500">
                {stat.label}
              </p>
              <h2 className={`mt-2 text-2xl font-black ${stat.color}`}>
                {stat.value}
              </h2>
            </div>
          );
        })}
      </div>

      <form
        onSubmit={updateOffer}
        noValidate
        className="premium-card mb-8 p-6"
      >
        <h2 className="mb-4 text-2xl font-black text-slate-950">
          Assign Offer
        </h2>

        {message && (
          <div className="mb-4 rounded-2xl border border-green-200 bg-green-50 p-3 text-sm font-semibold text-green-700">
            {message}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <input
              type="number"
              min="0"
              max="100"
              value={offerForm.discountPercent}
              onChange={(e) => {
                setOfferForm({
                  ...offerForm,
                  discountPercent: e.target.value,
                });
                setFormErrors((prev) => ({
                  ...prev,
                  discountPercent: "",
                }));
                setMessage("");
              }}
              placeholder="Discount %"
              className={fieldClass(formErrors.discountPercent)}
              aria-invalid={Boolean(formErrors.discountPercent)}
            />
            <FieldError>{formErrors.discountPercent}</FieldError>
          </div>

          <input
            value={offerForm.offerNote}
            onChange={(e) =>
              setOfferForm({ ...offerForm, offerNote: e.target.value })
            }
            placeholder="Offer note"
            className="premium-input w-full p-4 md:col-span-2"
          />
        </div>

        <button className="premium-primary-button mt-4 px-5 py-3">
          <Save size={18} />
          Save Offer
        </button>
      </form>

      <h2 className="mb-4 text-2xl font-black text-slate-950">
        Order History
      </h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="premium-card p-5">
            <div className="flex justify-between gap-4">
              <p className="font-black text-slate-900">
                {new Date(order.createdAt).toLocaleString()}
              </p>
              <p className="font-black text-orange-500">
                Rs. {order.finalAmount || order.totalAmount}
              </p>
            </div>

            <div className="mt-4 space-y-2">
              {order.items.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className="flex justify-between rounded-2xl bg-[#f8f6f2] p-3 text-slate-700"
                >
                  <span className="font-semibold">{item.name}</span>
                  <span>x {item.quantity}</span>
                </div>
              ))}
            </div>

            {order.discountPercent > 0 && (
              <p className="mt-3 rounded-2xl bg-green-50 p-3 text-sm font-semibold text-green-700">
                Discount {order.discountPercent}% applied (-Rs.{" "}
                {order.discountAmount})
              </p>
            )}
          </div>
        ))}

        {orders.length === 0 && (
          <div className="premium-card p-8 text-center text-slate-500">
            No order history yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDetails;
