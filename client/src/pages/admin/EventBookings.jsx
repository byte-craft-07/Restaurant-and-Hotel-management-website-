import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BedDouble, CalendarDays, PartyPopper, Save } from "lucide-react";
import api from "../../services/api";

const statuses = ["new", "contacted", "planning", "confirmed", "cancelled"];

const EventBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState("");

  const fetchBookings = async () => {
    try {
      const res = await api.get("/event-bookings");
      setBookings(res.data.bookings || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load event requests.");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateLocal = (id, field, value) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking._id === id ? { ...booking, [field]: value } : booking
      )
    );
  };

  const saveBooking = async (booking) => {
    try {
      setSavingId(booking._id);
      const res = await api.put(`/event-bookings/${booking._id}`, {
        status: booking.status,
        adminNote: booking.adminNote,
      });
      setBookings((prev) =>
        prev.map((item) =>
          item._id === booking._id ? res.data.booking : item
        )
      );
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update request.");
    } finally {
      setSavingId("");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-4 py-2 shadow-sm">
          <PartyPopper size={18} className="text-pink-600" />
          <span className="text-sm font-bold text-slate-600">
            Event Planning
          </span>
        </div>
        <h1 className="text-4xl font-black text-slate-950">Special Events</h1>
        <p className="mt-2 text-slate-500">
          Review birthday, party and custom event requests from customers.
        </p>
      </div>

      {error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      <section className="grid gap-5">
        {bookings.map((booking) => (
          <motion.div
            key={booking._id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2rem] border border-white/80 bg-white/75 p-6 shadow-xl backdrop-blur-2xl"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-950">
                  {booking.eventType}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {booking.customer?.name || "Customer"} |{" "}
                  {booking.contactPhone ||
                    booking.customer?.phone ||
                    "No phone"}
                </p>
                <p className="mt-2 flex items-center gap-2 text-sm font-bold text-orange-600">
                  <CalendarDays size={16} />
                  {new Date(booking.eventDate).toLocaleDateString()} |{" "}
                  {booking.guestCount} guests | Rs. {booking.budget || 0}
                </p>
                <p className="mt-2 flex items-center gap-2 text-sm font-bold text-pink-600">
                  <BedDouble size={16} />
                  Room/area:{" "}
                  {booking.tableRoom
                    ? `${booking.tableRoom.type?.toUpperCase()} ${
                        booking.tableRoom.number
                      }${booking.tableRoom.label ? ` - ${booking.tableRoom.label}` : ""}`
                    : booking.tablePreference || "To be decided"}
                </p>
              </div>

              <select
                value={booking.status}
                onChange={(event) =>
                  updateLocal(booking._id, "status", event.target.value)
                }
                className="rounded-2xl border border-slate-200 bg-white p-3 font-black capitalize outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              <div className="rounded-3xl bg-[#f8f6f2] p-4">
                <p className="mb-2 font-black text-slate-900">Food</p>
                <p className="text-sm leading-6 text-slate-600">
                  {booking.foodPreferences || "No food preference added."}
                </p>
              </div>
              <div className="rounded-3xl bg-[#f8f6f2] p-4">
                <p className="mb-2 font-black text-slate-900">Decoration</p>
                <p className="text-sm leading-6 text-slate-600">
                  {booking.decorationPreferences ||
                    "No decoration preference added."}
                </p>
              </div>
              <div className="rounded-3xl bg-[#f8f6f2] p-4">
                <p className="mb-2 font-black text-slate-900">Other</p>
                <p className="text-sm leading-6 text-slate-600">
                  {booking.specialRequests || "No special request added."}
                </p>
              </div>
            </div>

            <textarea
              value={booking.adminNote || ""}
              onChange={(event) =>
                updateLocal(booking._id, "adminNote", event.target.value)
              }
              placeholder="Internal note or message for follow-up"
              className="mt-5 min-h-24 w-full rounded-2xl border border-slate-200 bg-white p-4 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            />

            <button
              onClick={() => saveBooking(booking)}
              disabled={savingId === booking._id}
              className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:bg-slate-300"
            >
              <Save size={18} />
              {savingId === booking._id ? "Saving..." : "Save Update"}
            </button>
          </motion.div>
        ))}

        {bookings.length === 0 && (
          <div className="rounded-[2rem] border border-white/80 bg-white/75 p-12 text-center text-slate-500 shadow-xl">
            No special event requests yet.
          </div>
        )}
      </section>
    </div>
  );
};

export default EventBookings;
