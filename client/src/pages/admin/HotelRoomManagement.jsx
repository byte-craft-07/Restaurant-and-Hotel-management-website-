import { useEffect, useState } from "react";
import {
  BedDouble,
  Pencil,
  Plus,
  RefreshCcw,
  Trash2,
} from "lucide-react";
import api from "../../services/api";
import { resolveMediaUrl } from "../../utils/mediaUrl";
import SkeletonBlock, { ListSkeleton } from "../../components/Skeleton";

const emptyRoom = {
  roomNumber: "",
  type: "Deluxe Room",
  pricePerNight: "",
  capacity: 2,
  description: "",
  amenities: "Wi-Fi, Breakfast, Room Service",
  status: "available",
  images: "",
  isFeatured: false,
};

const statusOptions = ["available", "booked", "occupied", "cleaning", "maintenance"];
const fallbackRoomImage =
  "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=900&q=80";

const HotelRoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [summary, setSummary] = useState({});
  const [form, setForm] = useState(emptyRoom);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [roomRes, summaryRes] = await Promise.all([
        api.get("/hotel-rooms"),
        api.get("/hotel-rooms/status-summary"),
      ]);

      setRooms(roomRes.data.rooms || []);
      setSummary(summaryRes.data.summary || {});
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load hotel rooms.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateForm = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setEditingId("");
    setForm(emptyRoom);
  };

  const editRoom = (room) => {
    setEditingId(room._id);
    setForm({
      roomNumber: room.roomNumber || "",
      type: room.type || "Deluxe Room",
      pricePerNight: room.pricePerNight || "",
      capacity: room.capacity || 2,
      description: room.description || "",
      amenities: (room.amenities || []).join(", "),
      status: room.status || "available",
      images: (room.images || []).join(", "),
      isFeatured: Boolean(room.isFeatured),
    });
  };

  const submitRoom = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      if (editingId) {
        await api.put(`/hotel-rooms/${editingId}`, form);
        setMessage("Room updated successfully.");
      } else {
        await api.post("/hotel-rooms", form);
        setMessage("Room added successfully.");
      }

      resetForm();
      await fetchData();
    } catch (err) {
      const status = err.response?.status;
      const saveMessage =
        err.code === "ECONNABORTED"
          ? "Server response slow hai. Render free service wake hone me time le sakti hai, please retry."
          : err.response?.data?.message || err.message || "Unable to save room.";
      setError(status ? `${saveMessage} (status ${status})` : saveMessage);
    } finally {
      setSaving(false);
    }
  };

  const deleteRoom = async (roomId) => {
    if (!window.confirm("Delete this room?")) return;
    await api.delete(`/hotel-rooms/${roomId}`);
    await fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-white bg-white/80 p-6 shadow-xl shadow-slate-900/5">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-black text-orange-600">
              <BedDouble size={18} />
              Hotel owner room dashboard
            </div>
            <h1 className="text-4xl font-black text-slate-950">Hotel rooms</h1>
            <p className="mt-2 max-w-2xl text-slate-600">
              Add, edit, delete, and monitor the hotel rooms guests can book.
            </p>
          </div>
          <button
            onClick={fetchData}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-orange-200 bg-white px-4 py-3 font-black text-orange-600"
          >
            <RefreshCcw size={18} />
            Refresh
          </button>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          {[
            ["Available", summary.available || 0],
            ["Booked", summary.booked || 0],
            ["Occupied", summary.occupied || 0],
            ["Cleaning", summary.cleaning || 0],
            ["Maintenance", summary.maintenance || 0],
            ["Service requested", summary.serviceRequested || 0],
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
      {message && (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 font-bold text-emerald-700">
          {message}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form
          onSubmit={submitRoom}
          className="rounded-[2rem] border border-white bg-white/80 p-5 shadow-xl shadow-slate-900/5"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-2xl bg-orange-50 p-3 text-orange-500">
              {editingId ? <Pencil size={22} /> : <Plus size={22} />}
            </div>
            <div>
              <h2 className="text-2xl font-black">
                {editingId ? "Edit room" : "Add room"}
              </h2>
              <p className="text-sm font-semibold text-slate-500">
                Add details guests will see before booking.
              </p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {[
              ["roomNumber", "Room number", "text"],
              ["type", "Room type/category", "text"],
              ["pricePerNight", "Price per night", "number"],
              ["capacity", "Capacity", "number"],
            ].map(([name, label, type]) => (
              <label key={name} className="block">
                <span className="mb-1 block text-sm font-black text-slate-600">
                  {label}
                </span>
                <input
                  name={name}
                  type={type}
                  min={type === "number" ? 0 : undefined}
                  value={form[name]}
                  onChange={updateForm}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                  required
                />
              </label>
            ))}
            <label className="block md:col-span-2">
              <span className="mb-1 block text-sm font-black text-slate-600">
                Status
              </span>
              <select
                name="status"
                value={form.status}
                onChange={updateForm}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <label className="block md:col-span-2">
              <span className="mb-1 block text-sm font-black text-slate-600">
                Image URLs, comma separated
              </span>
              <input
                name="images"
                value={form.images}
                onChange={updateForm}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
              />
              <span className="mt-1 block text-xs font-semibold text-slate-500">
                Use direct image links ending in .jpg, .png, .webp, or an image CDN URL. Article/page links will show the default room image.
              </span>
            </label>
            <label className="block md:col-span-2">
              <span className="mb-1 block text-sm font-black text-slate-600">
                Amenities
              </span>
              <input
                name="amenities"
                value={form.amenities}
                onChange={updateForm}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
              />
            </label>
            <label className="block md:col-span-2">
              <span className="mb-1 block text-sm font-black text-slate-600">
                Description
              </span>
              <textarea
                name="description"
                value={form.description}
                onChange={updateForm}
                rows={4}
                className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
              />
            </label>
            <label className="flex items-center gap-3 rounded-2xl bg-orange-50 px-4 py-3 font-bold text-orange-700 md:col-span-2">
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={updateForm}
              />
              Featured on landing page
            </label>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-4 font-black text-white shadow-lg shadow-orange-500/20"
            >
              {saving && <SkeletonBlock className="h-5 w-5 rounded-full bg-white/30" />}
              {editingId ? "Update Room" : "Add Room"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-2xl border border-slate-200 px-5 py-4 font-black text-slate-600"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="rounded-[2rem] border border-white bg-white/80 p-5 shadow-xl shadow-slate-900/5">
          <h2 className="mb-4 text-2xl font-black">All rooms</h2>
          {loading ? (
            <ListSkeleton count={4} />
          ) : (
            <div className="grid gap-3">
              {rooms.map((room) => (
                <div
                  key={room._id}
                  className="grid gap-4 rounded-3xl bg-[#f8f6f2] p-4 md:grid-cols-[104px_1fr_auto]"
                >
                  <img
                    src={resolveMediaUrl(room.images?.[0]) || fallbackRoomImage}
                    alt={`${room.type} room ${room.roomNumber}`}
                    onError={(event) => {
                      event.currentTarget.src = fallbackRoomImage;
                    }}
                    className="h-24 w-full rounded-2xl object-cover object-center md:w-[104px]"
                  />
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">
                      Room {room.roomNumber}
                    </p>
                    <h3 className="text-xl font-black">{room.type}</h3>
                    <p className="text-sm font-semibold text-slate-500">
                      Rs. {room.pricePerNight}/night | {room.capacity} guests |{" "}
                      {room.status}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => editRoom(room)}
                      className="rounded-2xl bg-white p-3 text-orange-500"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => deleteRoom(room._id)}
                      className="rounded-2xl bg-red-50 p-3 text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              {!rooms.length && (
                <div className="rounded-3xl bg-[#f8f6f2] p-6 text-center font-bold text-slate-500">
                  No rooms added yet.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelRoomManagement;
