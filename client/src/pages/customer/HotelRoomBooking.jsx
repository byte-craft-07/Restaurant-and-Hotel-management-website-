import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Banknote,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Home,
  Hotel,
  Sparkles,
  Users,
} from "lucide-react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { resolveMediaUrl } from "../../utils/mediaUrl";
import AccountChip from "../../components/AccountChip";
import { DetailSkeleton } from "../../components/Skeleton";
import SkeletonBlock from "../../components/Skeleton";

const today = new Date().toISOString().slice(0, 10);
const fallbackRoomImage =
  "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80";

const getTomorrow = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
};

const getRoomImage = (room) => resolveMediaUrl(room?.images?.[0]) || fallbackRoomImage;

const HotelRoomBooking = () => {
  const { roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [bookingResult, setBookingResult] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    guestName: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    checkInDate: today,
    checkOutDate: getTomorrow(),
    numberOfGuests: 1,
    notes: "",
  });

  const selectedPrice = useMemo(() => {
    if (!room) return 0;
    const nights = Math.max(
      1,
      Math.ceil(
        (new Date(form.checkOutDate) - new Date(form.checkInDate)) /
          (1000 * 60 * 60 * 24)
      )
    );

    return nights * room.pricePerNight;
  }, [form.checkInDate, form.checkOutDate, room]);

  const minCheckoutDate = useMemo(() => {
    const date = new Date(form.checkInDate || today);
    date.setDate(date.getDate() + 1);
    return date.toISOString().slice(0, 10);
  }, [form.checkInDate]);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await api.get(`/hotel-rooms/${roomId}`);
        setRoom(res.data.room);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load selected room.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      guestName: prev.guestName || user?.name || "",
      phone: prev.phone || user?.phone || "",
      email: prev.email || user?.email || "",
    }));
  }, [user]);

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };

      if (name === "checkInDate") {
        const minCheckout = new Date(value || today);
        minCheckout.setDate(minCheckout.getDate() + 1);
        const minCheckoutValue = minCheckout.toISOString().slice(0, 10);

        if (!next.checkOutDate || next.checkOutDate <= value) {
          next.checkOutDate = minCheckoutValue;
        }
      }

      return next;
    });
  };

  const submitBooking = async (event) => {
    event.preventDefault();
    if (!room) return;

    setSubmitting(true);
    setError("");
    setMessage("");
    setBookingResult(null);

    try {
      const res = await api.post("/room-bookings", {
        ...form,
        roomId: room._id,
        paymentMethod,
      });
      setBookingResult(res.data.booking);
      setMessage(
        paymentMethod === "cash"
          ? "Offline booking request created. Admin will approve it after payment confirmation."
          : "Online payment successful. Your booking is confirmed."
      );
      navigate(`/bookings?tab=rooms&booking=${res.data.booking._id}`, {
        replace: true,
        state: { message: "Room booking submitted successfully." },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Room booking failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f6f2] px-4 py-6 text-slate-950 md:px-8 md:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/85 px-4 py-2 text-sm font-black text-slate-700 shadow-sm transition hover:border-orange-200 hover:text-orange-600"
            >
              <ArrowLeft size={17} />
              Back
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-black text-orange-600 shadow-sm transition hover:bg-orange-100"
            >
              <Home size={17} />
              Home
            </Link>
          </div>
          <AccountChip />
        </div>

        {loading ? (
          <DetailSkeleton />
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <section className="overflow-hidden rounded-[1.75rem] border border-white bg-white/90 shadow-xl shadow-slate-900/5">
              <img
                src={getRoomImage(room)}
                alt={`${room?.type} room ${room?.roomNumber}`}
                onError={(event) => {
                  event.currentTarget.src = fallbackRoomImage;
                }}
                className="h-72 w-full object-cover object-center"
              />
              <div className="p-6">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-black text-orange-600">
                  <Hotel size={18} />
                  Selected Room {room?.roomNumber}
                </div>
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <h1 className="text-4xl font-black leading-tight">
                      {room?.type}
                    </h1>
                    <p className="mt-3 leading-7 text-slate-600">
                      {room?.description || "Luxury stay with premium hotel services."}
                    </p>
                  </div>
                  <span className="w-fit rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700">
                    {room?.status}
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {(room?.amenities || []).map((amenity) => (
                    <span
                      key={amenity}
                      className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-orange-600"
                    >
                      <Sparkles size={12} />
                      {amenity}
                    </span>
                  ))}
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-[#f8f6f2] p-4">
                    <p className="text-sm font-bold text-slate-500">Price</p>
                    <p className="mt-1 text-3xl font-black text-orange-600">
                      Rs. {room?.pricePerNight}
                      <span className="ml-1 text-sm text-slate-500">/ night</span>
                    </p>
                  </div>
                  <div className="rounded-3xl bg-[#f8f6f2] p-4">
                    <p className="text-sm font-bold text-slate-500">Capacity</p>
                    <p className="mt-1 inline-flex items-center gap-2 text-3xl font-black">
                      <Users size={24} />
                      {room?.capacity} guests
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <form
              onSubmit={submitBooking}
              className="rounded-[1.75rem] border border-white bg-white/90 p-5 shadow-xl shadow-slate-900/5 md:p-6 lg:sticky lg:top-6"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-2xl bg-orange-50 p-3 text-orange-500">
                  <CalendarDays size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black">Booking details</h2>
                  <p className="text-sm font-semibold text-slate-500">
                    Room {room?.roomNumber} is selected automatically.
                  </p>
                </div>
              </div>

              <div className="mb-5 rounded-[1.5rem] border border-orange-100 bg-orange-50/60 p-3">
                <div className="flex gap-3">
                  <img
                    src={getRoomImage(room)}
                    alt={`${room?.type} room ${room?.roomNumber}`}
                    onError={(event) => {
                      event.currentTarget.src = fallbackRoomImage;
                    }}
                    className="h-24 w-24 shrink-0 rounded-2xl object-cover object-center"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-600">
                          Room {room?.roomNumber}
                        </p>
                        <h3 className="mt-1 truncate text-xl font-black text-slate-950">
                          {room?.type}
                        </h3>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-black capitalize text-emerald-700">
                        {room?.status}
                      </span>
                    </div>
                    <div className="mt-3 grid gap-2 text-sm font-bold text-slate-600 sm:grid-cols-2">
                      <span>Capacity: {room?.capacity} guests</span>
                      <span>Price: Rs. {room?.pricePerNight}/night</span>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 font-bold text-red-600">
                  {error}
                </div>
              )}
              {message && (
                <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 font-bold text-emerald-700">
                  <p>{message}</p>
                  {bookingResult?.cashCode && (
                    <p className="mt-2 rounded-xl bg-white px-3 py-2 text-sm text-slate-700">
                      Cash approval code:{" "}
                      <span className="text-orange-600">{bookingResult.cashCode}</span>
                    </p>
                  )}
                  <Link
                    to="/bookings?tab=rooms"
                    className="mt-3 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-black text-white"
                  >
                    View My Bookings
                  </Link>
                </div>
              )}

              <div className="grid gap-3">
                {[
                  ["guestName", "Guest name", "text"],
                  ["phone", "Phone", "tel"],
                  ["email", "Email", "email"],
                  ["checkInDate", "Check-in date", "date"],
                  ["checkOutDate", "Check-out date", "date"],
                  ["numberOfGuests", "Number of guests", "number"],
                ].map(([name, label, type]) => (
                  <label key={name} className="block">
                    <span className="mb-1 block text-sm font-black text-slate-600">
                      {label}
                    </span>
                    <input
                      name={name}
                      type={type}
                      min={
                        name === "checkInDate"
                          ? today
                          : name === "checkOutDate"
                            ? minCheckoutDate
                            : name === "numberOfGuests"
                              ? 1
                              : undefined
                      }
                      max={name === "numberOfGuests" ? room?.capacity : undefined}
                      value={form[name]}
                      onChange={updateForm}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                      required
                    />
                  </label>
                ))}
                <label className="block">
                  <span className="mb-1 block text-sm font-black text-slate-600">
                    Special note
                  </span>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={updateForm}
                    rows={3}
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                  />
                </label>
              </div>

              <div className="mt-5 rounded-3xl bg-orange-50 p-4">
                <p className="text-sm font-black text-orange-600">
                  Estimated stay total
                </p>
                <p className="mt-1 text-3xl font-black">Rs. {selectedPrice}</p>
              </div>

              <div className="mt-5 space-y-3 rounded-3xl border border-white bg-[#f8f6f2] p-4">
                <div>
                  <h3 className="font-black text-slate-950">Payment option</h3>
                  <p className="text-sm font-semibold text-slate-500">
                    Online bookings confirm instantly. Offline bookings need
                    admin approval.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
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
                      Confirm instantly
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
                    <span className="block font-black">Offline</span>
                    <span className="text-xs font-semibold">
                      Admin approval
                    </span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={!room || submitting || room.status !== "available"}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-4 font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <SkeletonBlock className="h-5 w-5 rounded-full bg-white/30" />
                ) : (
                  <CheckCircle2 size={20} />
                )}
                {paymentMethod === "cash"
                  ? "Request Offline Booking"
                  : "Pay Online & Book Room"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelRoomBooking;
