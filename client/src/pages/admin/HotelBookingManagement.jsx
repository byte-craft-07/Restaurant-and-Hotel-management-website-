import { useEffect, useMemo, useState } from "react";
import { CalendarCheck2, RefreshCcw } from "lucide-react";
import api from "../../services/api";
import { ListSkeleton } from "../../components/Skeleton";

const bookingStatuses = [
  "pending",
  "confirmed",
  "checked-in",
  "checked-out",
  "cancelled",
];

const bookingStatusStyles = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  confirmed: "border-green-200 bg-green-50 text-green-700",
  "checked-in": "border-blue-200 bg-blue-50 text-blue-700",
  "checked-out": "border-slate-200 bg-slate-100 text-slate-700",
  cancelled: "border-red-200 bg-red-50 text-red-600",
};

const HotelBookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingBookingId, setUpdatingBookingId] = useState("");

  const stats = useMemo(() => {
    const today = new Date().toDateString();

    return {
      total: bookings.length,
      pending: bookings.filter((booking) => booking.status === "pending").length,
      confirmed: bookings.filter((booking) => booking.status === "confirmed").length,
      checkedIn: bookings.filter((booking) => booking.status === "checked-in").length,
      checkoutDue: bookings.filter(
        (booking) =>
          booking.status === "checked-in" &&
          new Date(booking.checkOutDate).toDateString() === today
      ).length,
    };
  }, [bookings]);

  const fetchBookings = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/room-bookings");
      setBookings(res.data.bookings || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load room bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateBookingStatus = async (bookingId, status) => {
    setError("");
    setUpdatingBookingId(bookingId);

    try {
      await api.patch(`/room-bookings/${bookingId}/status`, { status });
      await fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update booking status.");
    } finally {
      setUpdatingBookingId("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-white bg-white/80 p-6 shadow-xl shadow-slate-900/5">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-black text-orange-600">
              <CalendarCheck2 size={18} />
              Hotel booking desk
            </div>
            <h1 className="text-4xl font-black text-slate-950">
              Room bookings
            </h1>
            <p className="mt-2 max-w-2xl text-slate-600">
              Approve offline bookings, track online confirmations, and manage
              guest check-in/check-out status.
            </p>
          </div>
          <button
            onClick={fetchBookings}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-orange-200 bg-white px-4 py-3 font-black text-orange-600"
          >
            <RefreshCcw size={18} />
            Refresh
          </button>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-5">
          {[
            ["Total", stats.total],
            ["Pending", stats.pending],
            ["Confirmed", stats.confirmed],
            ["Checked in", stats.checkedIn],
            ["Checkout due", stats.checkoutDue],
          ].map(([label, value]) => (
            <div key={label} className="rounded-3xl bg-[#f8f6f2] p-4">
              <p className="text-sm font-bold text-slate-500">{label}</p>
              <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-4 font-bold text-red-600">
          {error}
        </div>
      )}

      <div className="rounded-[2rem] border border-white bg-white/80 p-5 shadow-xl shadow-slate-900/5">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-2xl bg-orange-50 p-3 text-orange-500">
            <CalendarCheck2 size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black">Booking list</h2>
            <p className="text-sm font-semibold text-slate-500">
              Online bookings are already confirmed. Offline bookings stay
              pending until admin confirms payment.
            </p>
          </div>
        </div>

        {loading ? (
          <ListSkeleton count={4} />
        ) : (
          <div className="grid gap-3">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="grid gap-4 rounded-3xl bg-[#f8f6f2] p-4 xl:grid-cols-[1fr_auto_auto]"
              >
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">
                    Room {booking.room?.roomNumber} | {booking.room?.type}
                  </p>
                  <h3 className="text-xl font-black">{booking.guestName}</h3>
                  <p className="text-sm font-semibold text-slate-500">
                    {new Date(booking.checkInDate).toLocaleDateString()} to{" "}
                    {new Date(booking.checkOutDate).toLocaleDateString()} | Rs.{" "}
                    {booking.roomAmount}
                  </p>
                  <p className="mt-2 text-sm font-black capitalize text-slate-600">
                    Payment: {booking.paymentMethod || "online"} |{" "}
                    {booking.paymentStatus === "paid"
                      ? "Paid"
                      : booking.paymentStatus === "failed"
                        ? "Cancelled"
                        : `Pending ${booking.cashCode || ""}`}
                  </p>
                  {booking.paymentMethod === "cash" && booking.cashCode && (
                    <p className="mt-2 inline-flex rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-black text-orange-600">
                      Cash code: {booking.cashCode}
                    </p>
                  )}
                </div>

                <div className="flex max-w-sm flex-wrap gap-2 rounded-2xl bg-white p-2">
                  {bookingStatuses.map((status) => {
                    const active = booking.status === status;

                    return (
                      <button
                        key={status}
                        type="button"
                        disabled={active || updatingBookingId === booking._id}
                        onClick={() => updateBookingStatus(booking._id, status)}
                        className={`rounded-xl border px-3 py-2 text-xs font-black capitalize transition hover:-translate-y-0.5 ${
                          active
                            ? bookingStatusStyles[status]
                            : "border-transparent bg-[#f8f6f2] text-slate-500 hover:border-orange-100 hover:text-orange-600"
                        } disabled:cursor-not-allowed disabled:opacity-70`}
                      >
                        {status}
                      </button>
                    );
                  })}
                </div>

                <div className="rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-600">
                  Final bill ready: Rs.{" "}
                  {booking.billingSummary?.finalAmount || booking.roomAmount}
                </div>
              </div>
            ))}

            {!bookings.length && (
              <div className="rounded-3xl bg-[#f8f6f2] p-6 text-center font-bold text-slate-500">
                No room bookings yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelBookingManagement;
