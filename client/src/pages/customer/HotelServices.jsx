import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Car,
  Coffee,
  ConciergeBell,
  Droplets,
  Home,
  Send,
  Shirt,
  Sparkles,
  X,
} from "lucide-react";
import AccountChip from "../../components/AccountChip";
import PageNavigation from "../../components/PageNavigation";
import { ListSkeleton } from "../../components/Skeleton";
import api from "../../services/api";

const services = [
  { title: "Food", description: "Order from the live room-service menu.", icon: Coffee, to: "/menu" },
  { title: "Housekeeping", type: "housekeeping", description: "Request cleaning, towels, or a room refresh.", icon: Home },
  { title: "Laundry", type: "laundry", description: "Schedule laundry pickup and pressing.", icon: Shirt },
  { title: "Water bottle", type: "water-bottle", description: "Ask staff for water or minibar support.", icon: Droplets },
  { title: "Taxi", type: "taxi", description: "Arrange local pickup or airport transfer.", icon: Car },
  { title: "Concierge", type: "concierge", description: "Get help with spa, breakfast, and city plans.", icon: ConciergeBell },
];

const statusStyles = {
  pending: "bg-orange-50 text-orange-700",
  acknowledged: "bg-blue-50 text-blue-700",
  resolved: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-rose-50 text-rose-700",
};

const HotelServices = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [roomBookingId, setRoomBookingId] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadGuestServices = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [bookingResult, requestResult] = await Promise.allSettled([
        api.get("/room-bookings"),
        api.get("/service-requests/my"),
      ]);

      if (bookingResult.status === "fulfilled") {
        const activeBookings = (bookingResult.value.data.bookings || []).filter(
          (booking) => ["confirmed", "checked-in"].includes(booking.status)
        );
        setBookings(activeBookings);
        setRoomBookingId((current) => current || activeBookings[0]?._id || "");
      }

      if (requestResult.status === "fulfilled") {
        setRequests(requestResult.value.data.serviceRequests || []);
      }

      if (bookingResult.status === "rejected" && requestResult.status === "rejected") {
        throw bookingResult.reason;
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load hotel services.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGuestServices();
  }, [loadGuestServices]);

  const selectedBooking = useMemo(
    () => bookings.find((booking) => booking._id === roomBookingId),
    [bookings, roomBookingId]
  );

  const openRequest = (service) => {
    setSelectedService(service);
    setError("");
    setNote("");
  };

  const submitRequest = async (event) => {
    event.preventDefault();

    if (!roomBookingId) {
      setError("Please book a room before requesting hotel services.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      const response = await api.post("/service-requests", {
        roomBookingId,
        type: selectedService.type,
        note,
      });
      setRequests((current) => [response.data.serviceRequest, ...current]);
      setSelectedService(null);
      navigate(`/hotel-services?request=${response.data.serviceRequest._id}`, {
        replace: true,
        state: { message: `${selectedService.title} request sent.` },
      });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to send service request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f6f2] px-4 py-8 text-slate-950 md:px-8">
      <div className="mx-auto max-w-6xl">
        <PageNavigation className="mb-5" />
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-black text-orange-600">
            <Sparkles size={18} /> Hotel services
          </div>
          <AccountChip />
        </div>
        <h1 className="text-4xl font-black md:text-6xl">Services during your stay</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
          Send a request for your active room booking and follow its live status here.
        </p>

        {error && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 font-bold text-red-600">{error}</div>
        )}

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            const content = (
              <div className="h-full rounded-[2rem] border border-white bg-white/80 p-6 text-left shadow-xl shadow-slate-900/5 transition hover:-translate-y-1 hover:border-orange-200">
                <div className="mb-5 inline-flex rounded-2xl bg-orange-50 p-3 text-orange-500"><Icon size={26} /></div>
                <h2 className="text-2xl font-black">{service.title}</h2>
                <p className="mt-2 leading-7 text-slate-600">{service.description}</p>
                <p className="mt-5 text-sm font-black text-orange-600">{service.to ? "Open menu" : "Request service"}</p>
              </div>
            );

            return service.to ? (
              <Link key={service.title} to={service.to}>{content}</Link>
            ) : (
              <button key={service.title} type="button" onClick={() => openRequest(service)}>{content}</button>
            );
          })}
        </div>

        <section className="mt-10">
          <h2 className="text-3xl font-black">My service requests</h2>
          {loading ? (
            <ListSkeleton count={3} className="mt-5" />
          ) : (
            <div className="mt-5 grid gap-3">
              {requests.map((request) => (
                <article key={request._id} className="premium-card flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
                  <div>
                    <p className="font-black capitalize">{request.type.replaceAll("-", " ")}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-500">
                      Room {request.hotelRoom?.roomNumber || selectedBooking?.room?.roomNumber || "-"} · {request.note || "No special note"}
                    </p>
                    <p className="mt-1 text-xs font-bold text-slate-400">{new Date(request.createdAt).toLocaleString()}</p>
                  </div>
                  <span className={`w-fit rounded-xl px-4 py-2 text-sm font-black capitalize ${statusStyles[request.status] || statusStyles.pending}`}>{request.status}</span>
                </article>
              ))}
              {!requests.length && (
                <div className="premium-card p-8 text-center font-bold text-slate-500">No service requests yet.</div>
              )}
            </div>
          )}
        </section>
      </div>

      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-sm">
          <form onSubmit={submitRequest} className="w-full max-w-lg rounded-[2rem] border border-white bg-[#f8f6f2] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black text-orange-600">Hotel service request</p>
                <h2 className="mt-1 text-3xl font-black">{selectedService.title}</h2>
              </div>
              <button type="button" onClick={() => setSelectedService(null)} className="rounded-xl bg-white p-2 text-slate-500" aria-label="Close request form"><X /></button>
            </div>

            <label className="mt-6 block text-sm font-black text-slate-700">Active room booking</label>
            <select value={roomBookingId} onChange={(event) => setRoomBookingId(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-4 font-bold outline-none focus:border-orange-400">
              <option value="">Select room booking</option>
              {bookings.map((booking) => <option key={booking._id} value={booking._id}>Room {booking.room?.roomNumber} · {booking.room?.type}</option>)}
            </select>

            <label className="mt-5 block text-sm font-black text-slate-700">Request details</label>
            <textarea value={note} onChange={(event) => setNote(event.target.value)} maxLength={300} rows={4} placeholder={`Add details for ${selectedService.title.toLowerCase()}...`} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-4 outline-none focus:border-orange-400" />

            {!bookings.length && <p className="mt-3 rounded-xl bg-orange-50 p-3 text-sm font-bold text-orange-700">A confirmed or checked-in room booking is required.</p>}

            <button type="submit" disabled={submitting || !bookings.length} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-4 font-black text-white shadow-lg shadow-orange-500/20 disabled:opacity-50">
              {submitting ? <span className="premium-shimmer h-5 w-20 rounded-full" /> : <><Send size={18} /> Send request</>}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default HotelServices;
