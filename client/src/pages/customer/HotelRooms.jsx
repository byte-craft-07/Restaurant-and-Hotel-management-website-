import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Home,
  Hotel,
  Sparkles,
  Users,
} from "lucide-react";
import api from "../../services/api";
import { resolveMediaUrl } from "../../utils/mediaUrl";
import AccountChip from "../../components/AccountChip";
import { CardSkeletonGrid } from "../../components/Skeleton";

const fallbackRoomImage =
  "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80";
const getRoomImage = (room) => resolveMediaUrl(room.images?.[0]) || fallbackRoomImage;

const HotelRooms = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await api.get("/hotel-rooms?available=true");
      setRooms(res.data.rooms || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load available rooms.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

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

        <div className="mb-6 flex flex-col justify-between gap-4 md:mb-8 md:flex-row md:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-sm font-black text-orange-600 shadow-sm">
              <Hotel size={18} />
              Premium room booking
            </div>
            <h1 className="text-4xl font-black leading-tight md:text-5xl">
              Book your stay
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
              Choose an available room, confirm guest details, and keep room
              service, dining, and billing connected to your stay.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-3xl border border-red-200 bg-red-50 p-4 font-bold text-red-600">
            {error}
          </div>
        )}
        {loading ? (
          <CardSkeletonGrid count={6} cardClassName="h-[520px]" className="sm:grid-cols-2 lg:grid-cols-3" />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room) => (
                <article
                  key={room._id}
                  className="flex min-h-[520px] flex-col overflow-hidden rounded-[1.75rem] border border-white bg-white/90 text-left shadow-xl shadow-slate-900/5 transition hover:-translate-y-1 hover:border-orange-200"
                >
                  <div className="relative h-56 w-full overflow-hidden bg-orange-50">
                    <img
                      src={getRoomImage(room)}
                      alt={`${room.type} room ${room.roomNumber}`}
                      onError={(event) => {
                        event.currentTarget.src = fallbackRoomImage;
                      }}
                      className="absolute inset-0 block h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-500">
                          Room {room.roomNumber}
                        </p>
                        <h3 className="mt-1 text-2xl font-black leading-tight">
                          {room.type}
                        </h3>
                      </div>
                      <span className="shrink-0 rounded-2xl bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                        {room.status}
                      </span>
                    </div>

                    <p className="mt-3 line-clamp-3 min-h-16 text-sm leading-6 text-slate-600">
                      {room.description || "Luxury stay with premium hotel services."}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {(room.amenities || []).slice(0, 3).map((amenity) => (
                        <span
                          key={amenity}
                          className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-orange-600"
                        >
                          <Sparkles size={12} />
                          {amenity}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                      <span className="text-2xl font-black leading-none text-orange-600">
                        Rs. {room.pricePerNight}
                        <span className="ml-1 text-xs font-bold text-slate-500">
                          / night
                        </span>
                      </span>
                      <span className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-slate-500">
                        <Users size={16} />
                        {room.capacity} guests
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(`/rooms/${room._id}/book`)}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-4 font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
                    >
                      <CheckCircle2 size={18} />
                      Select Room
                    </button>
                  </div>
                </article>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelRooms;
