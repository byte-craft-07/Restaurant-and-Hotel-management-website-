import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronDown,
  CalendarDays,
  CheckCircle,
  PartyPopper,
  Send,
  BedDouble,
  Utensils,
} from "lucide-react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const eventTypeOptions = [
  "Birthday",
  "Anniversary",
  "Office Party",
  "Family Function",
  "Other Event",
];

const decorationOptions = [
  "Birthday balloons",
  "Cake setup",
  "Theme backdrop",
  "Flower decor",
  "Music setup",
  "Private seating",
  "Stage area",
  "Photo corner",
];

const eventBaseRates = {
  Birthday: 350,
  Anniversary: 450,
  "Office Party": 500,
  "Family Function": 420,
  "Other Event": 380,
};

const estimateEventBill = (formData) => {
  const guests = Math.max(1, Number(formData.guestCount) || 1);
  const rate = eventBaseRates[formData.eventType] || 380;
  const text = `${formData.foodPreferences} ${formData.decorationPreferences} ${formData.specialRequests}`.toLowerCase();
  const foodSubtotal = guests * rate;

  let decorSubtotal = 0;
  if (text.includes("balloon") || text.includes("theme")) decorSubtotal += 1500;
  if (text.includes("music") || text.includes("dj")) decorSubtotal += 2500;
  if (text.includes("cake")) decorSubtotal += 1200;
  if (text.includes("stage") || text.includes("private")) decorSubtotal += 2000;

  let serviceSubtotal = guests >= 25 ? 2000 : guests >= 12 ? 1000 : 500;

  if (formData.tablePreference.toLowerCase().includes("rooftop")) {
    serviceSubtotal += 1500;
  }

  const total = foodSubtotal + decorSubtotal + serviceSubtotal;

  return {
    guests,
    perGuest: rate,
    foodSubtotal,
    decorSubtotal,
    serviceSubtotal,
    total,
  };
};

const initialForm = {
  eventType: "Birthday",
  eventDate: "",
  guestCount: 10,
  budget: "",
  tableRoom: "",
  tablePreference: "",
  foodPreferences: "",
  decorationPreferences: "",
  specialRequests: "",
  contactPhone: "",
};

const SpecialEvents = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [eventTypeOpen, setEventTypeOpen] = useState(false);
  const [tables, setTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [tableOpen, setTableOpen] = useState(false);
  const [customFoodItem, setCustomFoodItem] = useState("");
  const [customTablePreference, setCustomTablePreference] = useState("");

  const fetchBookings = async () => {
    try {
      const res = await api.get("/event-bookings/my");
      setBookings(res.data.bookings || []);
    } catch {
      setBookings([]);
    }
  };

  const fetchTables = async () => {
    try {
      const res = await api.get("/rooms");
      setTables(res.data.tableRooms || []);
    } catch {
      setTables([]);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const res = await api.get("/menu");
      setMenuItems(
        (res.data.menuItems || []).filter((item) => item.isAvailable !== false)
      );
    } catch {
      setMenuItems([]);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchTables();
    fetchMenuItems();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const selectedTable = tables.find((table) => table._id === formData.tableRoom);
  const tableLabel = selectedTable
    ? `${selectedTable.type?.toUpperCase()} ${selectedTable.number}${
        selectedTable.label ? ` - ${selectedTable.label}` : ""
      }`
    : "Select room or venue area";
  const estimatedBill = estimateEventBill(formData);

  const toggleListValue = (field, value) => {
    setFormData((prev) => {
      const values = prev[field]
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      const exists = values.includes(value);
      const nextValues = exists
        ? values.filter((item) => item !== value)
        : [...values, value];

      return {
        ...prev,
        [field]: nextValues.join(", "),
      };
    });
  };

  const addCustomFoodItem = () => {
    const value = customFoodItem.trim();

    if (!value) return;

    setFormData((prev) => {
      const values = prev.foodPreferences
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      if (values.includes(value)) return prev;

      return {
        ...prev,
        foodPreferences: [...values, value].join(", "),
      };
    });

    setCustomFoodItem("");
  };

  const addCustomTablePreference = () => {
    const value = customTablePreference.trim();

    if (!value) return;

    setFormData((prev) => ({
      ...prev,
      tableRoom: "",
      tablePreference: value,
    }));
    setCustomTablePreference("");
  };

  const selectedFoodItems = formData.foodPreferences
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const selectedDecorItems = formData.decorationPreferences
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const submitRequest = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!user || user.role !== "customer") {
      navigate("/login?redirect=/events");
      return;
    }

    if (!formData.eventType || !formData.eventDate || !formData.guestCount) {
      setError("Event type, date and guest count are required.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/event-bookings", {
        ...formData,
        budget: formData.budget || estimatedBill.total,
      });
      setMessage(res.data.message || "Event request submitted.");
      setFormData(initialForm);
      fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to submit event request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f6f2] p-4 text-slate-900 md:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-[2rem] border border-white/80 bg-white/75 p-7 shadow-xl backdrop-blur-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-pink-100 bg-pink-50 px-4 py-2 font-bold text-pink-600">
            <PartyPopper size={18} />
            Special Events
          </div>
          <h1 className="text-4xl font-black text-slate-950">
            Customize your celebration
          </h1>
          <p className="mt-2 max-w-2xl text-slate-500">
            Plan birthdays, family dinners, office parties or custom events with
            your own food, decoration and service preferences.
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.form
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={submitRequest}
            className="space-y-4 rounded-[2rem] border border-white/80 bg-white/80 p-6 shadow-xl backdrop-blur-2xl"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="relative space-y-2">
                <span className="text-sm font-black text-slate-700">
                  Event type
                </span>
                <button
                  type="button"
                  onClick={() => setEventTypeOpen((open) => !open)}
                  onBlur={() =>
                    window.setTimeout(() => setEventTypeOpen(false), 120)
                  }
                  className={`flex w-full items-center justify-between rounded-2xl border bg-white p-4 text-left font-bold outline-none transition ${
                    eventTypeOpen
                      ? "border-pink-300 ring-4 ring-pink-100"
                      : "border-slate-200 hover:border-pink-200"
                  }`}
                >
                  <span>{formData.eventType}</span>
                  <ChevronDown
                    size={19}
                    className={`text-pink-500 transition ${
                      eventTypeOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {eventTypeOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-pink-100 bg-white p-2 shadow-2xl shadow-pink-100/60"
                  >
                    {eventTypeOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            eventType: option,
                          }));
                          setEventTypeOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-black transition ${
                          formData.eventType === option
                            ? "bg-pink-50 text-pink-700"
                            : "text-slate-700 hover:bg-orange-50 hover:text-orange-600"
                        }`}
                      >
                        {option}
                        {formData.eventType === option && (
                          <CheckCircle size={16} />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>

              <label className="space-y-2">
                <span className="text-sm font-black text-slate-700">
                  Event date
                </span>
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white p-4 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-black text-slate-700">
                  Guests
                </span>
                <input
                  type="number"
                  min="1"
                  name="guestCount"
                  value={formData.guestCount}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white p-4 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-black text-slate-700">
                  Your budget
                </span>
                <input
                  type="number"
                  min="0"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder={`Auto estimate Rs. ${estimatedBill.total}`}
                  className="w-full rounded-2xl border border-slate-200 bg-white p-4 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                />
              </label>

              <div className="relative space-y-2">
                <span className="text-sm font-black text-slate-700">
                  Room / venue area
                </span>
                <button
                  type="button"
                  onClick={() => setTableOpen((open) => !open)}
                  onBlur={() =>
                    window.setTimeout(() => setTableOpen(false), 120)
                  }
                  className={`flex w-full items-center justify-between rounded-2xl border bg-white p-4 text-left font-bold outline-none transition ${
                    tableOpen
                      ? "border-orange-300 ring-4 ring-orange-100"
                      : "border-slate-200 hover:border-orange-200"
                  }`}
                >
                  <span>{tableLabel}</span>
                  <BedDouble size={19} className="text-orange-500" />
                </button>

                {tableOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute left-0 right-0 top-full z-30 mt-2 max-h-72 overflow-y-auto rounded-2xl border border-orange-100 bg-white p-2 shadow-2xl shadow-orange-100/60"
                  >
                    <button
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, tableRoom: "" }));
                        setTableOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-black transition ${
                        !formData.tableRoom
                          ? "bg-orange-50 text-orange-700"
                          : "text-slate-700 hover:bg-orange-50 hover:text-orange-600"
                      }`}
                    >
                      Decide with hotel
                      {!formData.tableRoom && <CheckCircle size={16} />}
                    </button>

                    {tables.map((table) => {
                      const label = `${table.type?.toUpperCase()} ${
                        table.number
                      }${table.label ? ` - ${table.label}` : ""}`;

                      return (
                        <button
                          key={table._id}
                          type="button"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              tableRoom: table._id,
                            }));
                            setTableOpen(false);
                          }}
                          className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-black transition ${
                            formData.tableRoom === table._id
                              ? "bg-orange-50 text-orange-700"
                              : "text-slate-700 hover:bg-orange-50 hover:text-orange-600"
                          }`}
                        >
                          {label}
                          {formData.tableRoom === table._id && (
                            <CheckCircle size={16} />
                          )}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-orange-100 bg-orange-50/40 p-3">
              {formData.tablePreference && !formData.tableRoom && (
                <div className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-black text-orange-700">
                  <span>{formData.tablePreference}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, tablePreference: "" }))
                    }
                    className="text-xs text-slate-500 hover:text-red-500"
                  >
                    Remove
                  </button>
                </div>
              )}

              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  value={customTablePreference}
                  onChange={(event) =>
                    setCustomTablePreference(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addCustomTablePreference();
                    }
                  }}
                  placeholder="Add custom room/area e.g. banquet hall, rooftop, private corner"
                  className="min-h-12 flex-1 rounded-2xl border border-slate-200 bg-white px-4 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                />
                <button
                  type="button"
                  onClick={addCustomTablePreference}
                  className="rounded-2xl bg-orange-500 px-5 py-3 font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
                >
                  Add Area
                </button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-green-100 bg-green-50 p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.16em] text-green-700">
                    Auto Estimated Bill
                  </p>
                  <h3 className="mt-1 text-3xl font-black text-green-700">
                    Rs. {estimatedBill.total}
                  </h3>
                </div>
                <div className="rounded-2xl bg-white px-4 py-3 text-right shadow-sm">
                  <p className="text-xs font-bold text-slate-500">
                    Per guest
                  </p>
                  <p className="font-black text-slate-900">
                    Rs. {estimatedBill.perGuest}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-white p-3">
                  <p className="text-xs font-bold text-slate-500">
                    Food package
                  </p>
                  <p className="font-black text-slate-900">
                    Rs. {estimatedBill.foodSubtotal}
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-3">
                  <p className="text-xs font-bold text-slate-500">
                    Decor add-ons
                  </p>
                  <p className="font-black text-slate-900">
                    Rs. {estimatedBill.decorSubtotal}
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-3">
                  <p className="text-xs font-bold text-slate-500">
                    Service setup
                  </p>
                  <p className="font-black text-slate-900">
                    Rs. {estimatedBill.serviceSubtotal}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-green-800">
                This is an automatic estimate based on your guest count, event
                type and preferences. Admin can confirm the final quotation.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-black text-slate-700">
                  Choose food from hotel menu
                </p>
                <p className="text-xs font-semibold text-slate-500">
                  Select available dishes, then add extra notes if needed.
                </p>
              </div>

              <div className="flex max-h-52 flex-wrap gap-2 overflow-y-auto rounded-2xl border border-orange-100 bg-orange-50/50 p-3">
                {menuItems.slice(0, 24).map((item) => {
                  const selected = selectedFoodItems.includes(item.name);

                  return (
                    <button
                      key={item._id}
                      type="button"
                      onClick={() => toggleListValue("foodPreferences", item.name)}
                      className={`rounded-full border px-4 py-2 text-sm font-black transition ${
                        selected
                          ? "border-orange-300 bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                          : "border-white bg-white text-slate-700 hover:border-orange-200 hover:text-orange-600"
                      }`}
                    >
                      {item.name}
                    </button>
                  );
                })}

                {menuItems.length === 0 && (
                  <p className="p-3 text-sm font-semibold text-slate-500">
                    Menu items are not loaded yet. You can type preferences
                    manually below.
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  value={customFoodItem}
                  onChange={(event) => setCustomFoodItem(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addCustomFoodItem();
                    }
                  }}
                  placeholder="Add custom dish or requirement not in menu"
                  className="min-h-12 flex-1 rounded-2xl border border-slate-200 bg-white px-4 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                />
                <button
                  type="button"
                  onClick={addCustomFoodItem}
                  className="rounded-2xl bg-orange-500 px-5 py-3 font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
                >
                  Add
                </button>
              </div>

              <textarea
                name="foodPreferences"
                value={formData.foodPreferences}
                onChange={handleChange}
                placeholder="Food menu preferences: starters, main course, desserts, veg/non-veg, drinks"
                className="min-h-24 w-full rounded-2xl border border-slate-200 bg-white p-4 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-black text-slate-700">
                  Choose decoration setup
                </p>
                <p className="text-xs font-semibold text-slate-500">
                  Pick available event setup options.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 rounded-2xl border border-pink-100 bg-pink-50/50 p-3">
                {decorationOptions.map((option) => {
                  const selected = selectedDecorItems.includes(option);

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() =>
                        toggleListValue("decorationPreferences", option)
                      }
                      className={`rounded-full border px-4 py-2 text-sm font-black transition ${
                        selected
                          ? "border-pink-300 bg-pink-600 text-white shadow-lg shadow-pink-500/20"
                          : "border-white bg-white text-slate-700 hover:border-pink-200 hover:text-pink-700"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              <textarea
                name="decorationPreferences"
                value={formData.decorationPreferences}
                onChange={handleChange}
                placeholder="Decoration preferences: theme, cake setup, balloons, music, seating"
                className="min-h-24 w-full rounded-2xl border border-slate-200 bg-white p-4 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <textarea
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              placeholder="Any other custom requirement"
              className="min-h-24 w-full rounded-2xl border border-slate-200 bg-white p-4 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            />

            <input
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              placeholder="Contact phone"
              className="w-full rounded-2xl border border-slate-200 bg-white p-4 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            />

            {error && (
              <p className="rounded-2xl border border-red-200 bg-red-50 p-4 font-semibold text-red-600">
                {error}
              </p>
            )}

            {message && (
              <p className="rounded-2xl border border-green-200 bg-green-50 p-4 font-semibold text-green-700">
                {message}
              </p>
            )}

            <button
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 p-4 font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:bg-slate-300"
            >
              <Send size={18} />
              Submit Event Request
            </button>
          </motion.form>

          <section className="rounded-[2rem] border border-white/80 bg-white/80 p-6 shadow-xl backdrop-blur-2xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-950">
                  My Requests
                </h2>
                <p className="text-sm text-slate-500">
                  Track submitted event plans.
                </p>
              </div>
              <Utensils className="text-orange-500" />
            </div>

            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="rounded-3xl border border-orange-50 bg-[#f8f6f2] p-4"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <h3 className="font-black text-slate-950">
                        {booking.eventType}
                      </h3>
                      <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                        <CalendarDays size={15} />
                        {new Date(booking.eventDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="h-fit rounded-full bg-white px-3 py-1 text-xs font-black capitalize text-orange-600">
                      {booking.status}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-slate-600">
                    {booking.guestCount} guests | Rs. {booking.budget || 0}
                  </p>
                  <p className="mt-2 text-sm font-bold text-orange-600">
                    Room/area:{" "}
                    {booking.tableRoom
                      ? `${booking.tableRoom.type?.toUpperCase()} ${
                          booking.tableRoom.number
                        }`
                      : booking.tablePreference || "To be decided"}
                  </p>
                  {booking.adminNote && (
                    <p className="mt-3 rounded-2xl bg-white p-3 text-sm text-slate-600">
                      Admin note: {booking.adminNote}
                    </p>
                  )}
                </div>
              ))}

              {bookings.length === 0 && (
                <div className="rounded-[2rem] border border-orange-100 bg-[#f8f6f2] p-8 text-center text-slate-500">
                  <CheckCircle className="mx-auto mb-3 text-orange-500" />
                  No event requests yet.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SpecialEvents;
