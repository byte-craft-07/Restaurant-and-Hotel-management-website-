import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  BedDouble,
  CalendarCheck2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  PartyPopper,
  RefreshCw,
  Users,
} from "lucide-react";
import api from "../../services/api";
import AccountChip from "../../components/AccountChip";
import { ListSkeleton } from "../../components/Skeleton";
import PageNavigation from "../../components/PageNavigation";

const roomStatusLabels = {
  pending: "Awaiting approval",
  confirmed: "Confirmed",
  "checked-in": "Checked in",
  "checked-out": "Checked out",
  cancelled: "Cancelled",
};

const eventStatusLabels = {
  new: "Request received",
  contacted: "Hotel contacted you",
  planning: "Planning in progress",
  confirmed: "Event confirmed",
  cancelled: "Cancelled",
};

const statusClass = (status) => {
  if (["confirmed", "checked-in", "checked-out"].includes(status)) {
    return "bg-emerald-50 text-emerald-700";
  }
  if (status === "cancelled") return "bg-rose-50 text-rose-700";
  return "bg-orange-50 text-orange-700";
};

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(value))
    : "Not available";

const getPaymentLabel = (booking) => {
  if (booking.paymentStatus === "paid") return "Paid";
  if (booking.paymentStatus === "failed") return "Cancelled";
  return "Pending at hotel";
};

const TrackingLine = ({ history, currentStatus, labels, createdAt, updatedAt }) => {
  const entries = history?.length
    ? history
    : [{ status: currentStatus, changedAt: updatedAt || createdAt }];

  return (
    <div className="mt-5 border-t border-slate-100 pt-4">
      <p className="mb-3 text-xs font-black uppercase text-slate-400">
        Status timeline
      </p>
      <div className="flex flex-wrap gap-2">
        {entries.map((entry, index) => (
          <div
            key={`${entry.status}-${entry.changedAt || index}`}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600"
          >
            <CheckCircle2 size={14} className="text-orange-500" />
            {labels[entry.status] || entry.status}
            <span className="font-semibold text-slate-400">
              {formatDate(entry.changedAt)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const MyBookings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") === "events" ? "events" : "rooms"
  );
  const [roomBookings, setRoomBookings] = useState([]);
  const [eventBookings, setEventBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [roomsResponse, eventsResponse] = await Promise.all([
        api.get("/room-bookings"),
        api.get("/event-bookings/my"),
      ]);
      setRoomBookings(roomsResponse.data.bookings || []);
      setEventBookings(eventsResponse.data.bookings || []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Your bookings could not be loaded. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return (
    <div className="min-h-screen bg-[#f8f6f2] px-4 py-6 text-slate-950 md:px-8 md:py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-start">
          <div>
            <PageNavigation backTo="/profile" className="mb-5" />
            <div className="flex items-center gap-2 text-sm font-black text-orange-600">
              <CalendarCheck2 size={18} />
              Guest booking tracker
            </div>
            <h1 className="mt-2 text-4xl font-black md:text-5xl">My bookings</h1>
            <p className="mt-2 max-w-2xl font-semibold text-slate-500">
              Track room stays, payment progress and special event requests from one place.
            </p>
          </div>
          <AccountChip />
        </header>

        <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl border border-white bg-white/80 p-2 shadow-lg shadow-slate-900/5 sm:flex sm:w-fit">
          <button
            type="button"
            onClick={() => {
              setActiveTab("rooms");
              setSearchParams({ tab: "rooms" });
            }}
            className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-black transition ${
              activeTab === "rooms"
                ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
                : "text-slate-500 hover:bg-orange-50"
            }`}
          >
            <BedDouble size={18} /> Room stays ({roomBookings.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("events");
              setSearchParams({ tab: "events" });
            }}
            className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-black transition ${
              activeTab === "events"
                ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
                : "text-slate-500 hover:bg-orange-50"
            }`}
          >
            <PartyPopper size={18} /> Events ({eventBookings.length})
          </button>
        </div>

        {error && (
          <div className="mb-6 flex flex-col items-start justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 font-bold text-red-600 sm:flex-row sm:items-center">
            <span>{error}</span>
            <button type="button" onClick={fetchBookings} className="inline-flex items-center gap-2">
              <RefreshCw size={17} /> Retry
            </button>
          </div>
        )}

        {loading ? (
          <ListSkeleton count={3} />
        ) : activeTab === "rooms" ? (
          <div className="grid gap-5">
            {roomBookings.map((booking) => (
              <article key={booking._id} className="premium-card p-5 md:p-6">
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                  <div>
                    <p className="text-xs font-black uppercase text-orange-500">
                      Booking #{booking._id.slice(-6).toUpperCase()}
                    </p>
                    <h2 className="mt-1 text-2xl font-black">
                      Room {booking.room?.roomNumber || "-"} · {booking.room?.type || "Hotel room"}
                    </h2>
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-slate-500">
                      <span className="inline-flex items-center gap-2"><CalendarDays size={16} />{formatDate(booking.checkInDate)} to {formatDate(booking.checkOutDate)}</span>
                      <span className="inline-flex items-center gap-2"><Users size={16} />{booking.numberOfGuests} guests</span>
                      <span className="inline-flex items-center gap-2"><Clock3 size={16} />{booking.nights} nights</span>
                    </div>
                    <p className="mt-3 text-sm font-bold capitalize text-slate-600">
                      Payment: {booking.paymentMethod || "online"} · {getPaymentLabel(booking)}
                    </p>
                    {booking.cashCode && (
                      <p className="mt-2 inline-flex rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-black text-orange-700">
                        Hotel payment code: {booking.cashCode}
                      </p>
                    )}
                  </div>
                  <div className="md:text-right">
                    <span className={`inline-flex rounded-xl px-4 py-2 text-sm font-black ${statusClass(booking.status)}`}>
                      {roomStatusLabels[booking.status] || booking.status}
                    </span>
                    <p className="mt-3 text-2xl font-black">Rs. {booking.roomAmount}</p>
                  </div>
                </div>
                <TrackingLine history={booking.statusHistory} currentStatus={booking.status} labels={roomStatusLabels} createdAt={booking.createdAt} updatedAt={booking.updatedAt} />
              </article>
            ))}
            {!roomBookings.length && (
              <div className="premium-card p-10 text-center">
                <BedDouble className="mx-auto text-orange-500" size={32} />
                <h2 className="mt-3 text-xl font-black">No room booking yet</h2>
                <Link to="/rooms" className="premium-primary-button mx-auto mt-5 w-fit px-5 py-3">Explore rooms</Link>
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-5">
            {eventBookings.map((booking) => (
              <article key={booking._id} className="premium-card p-5 md:p-6">
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                  <div>
                    <p className="text-xs font-black uppercase text-orange-500">
                      Event request #{booking._id.slice(-6).toUpperCase()}
                    </p>
                    <h2 className="mt-1 text-2xl font-black">{booking.eventType}</h2>
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-slate-500">
                      <span className="inline-flex items-center gap-2"><CalendarDays size={16} />{formatDate(booking.eventDate)}</span>
                      <span className="inline-flex items-center gap-2"><Users size={16} />{booking.guestCount} guests</span>
                    </div>
                    <p className="mt-3 text-sm font-bold text-slate-600">
                      Venue: {booking.tableRoom ? `${booking.tableRoom.type?.toUpperCase()} ${booking.tableRoom.number}` : booking.tablePreference || "Hotel will confirm the venue"}
                    </p>
                    {booking.adminNote && (
                      <div className="mt-3 rounded-xl bg-orange-50 p-3 text-sm font-bold text-orange-800">
                        Hotel update: {booking.adminNote}
                      </div>
                    )}
                  </div>
                  <div className="md:text-right">
                    <span className={`inline-flex rounded-xl px-4 py-2 text-sm font-black ${statusClass(booking.status)}`}>
                      {eventStatusLabels[booking.status] || booking.status}
                    </span>
                    <p className="mt-3 text-sm font-bold text-slate-500">Estimated budget</p>
                    <p className="text-2xl font-black">Rs. {booking.budget || 0}</p>
                  </div>
                </div>
                <TrackingLine history={booking.statusHistory} currentStatus={booking.status} labels={eventStatusLabels} createdAt={booking.createdAt} updatedAt={booking.updatedAt} />
              </article>
            ))}
            {!eventBookings.length && (
              <div className="premium-card p-10 text-center">
                <PartyPopper className="mx-auto text-orange-500" size={32} />
                <h2 className="mt-3 text-xl font-black">No event request yet</h2>
                <Link to="/events" className="premium-primary-button mx-auto mt-5 w-fit px-5 py-3">Plan an event</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
