import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Car,
  ChefHat,
  Coffee,
  ConciergeBell,
  MapPin,
  PartyPopper,
  ShieldCheck,
  Sparkles,
  Star,
  Utensils,
  Waves,
  Wifi,
} from "lucide-react";
import BrandLogo from "../components/BrandLogo";
import PremiumHoverCard from "../components/motion/PremiumHoverCard";
import { useAuth } from "../context/AuthContext";
import { getRoleRedirect } from "../utils/authRedirect";

const hotelStats = [
  { label: "Guest rating", value: "4.8/5" },
  { label: "Room types", value: "12+" },
  { label: "Service desk", value: "24/7" },
];

const roomHighlights = [
  {
    title: "Deluxe Rooms",
    copy: "Warm interiors, king bed, smart TV, work desk and city view.",
    price: "From Rs. 2499",
    image:
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Premium Suites",
    copy: "Larger stay space with lounge seating, bath amenities and privacy.",
    price: "From Rs. 4999",
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85",
  },
  {
    title: "Family Stays",
    copy: "Comfortable rooms for groups with breakfast and housekeeping support.",
    price: "From Rs. 3499",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85",
  },
];

const services = [
  { title: "Room Service", copy: "Food, water, towels and cleaning requests.", icon: ConciergeBell },
  { title: "Breakfast", copy: "Fresh breakfast options delivered or served in-house.", icon: Coffee },
  { title: "Laundry", copy: "Daily laundry and pressing support for long stays.", icon: Waves },
  { title: "Taxi Pickup", copy: "Local taxi and airport transfer assistance.", icon: Car },
  { title: "Free Wi-Fi", copy: "Reliable internet for work, calls and streaming.", icon: Wifi },
  { title: "Dining", copy: "Hotel kitchen, snacks, beverages and special meals.", icon: Utensils },
];

const gallery = [
  {
    title: "Lobby",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1100&q=85",
  },
  {
    title: "Restaurant",
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1100&q=85",
  },
  {
    title: "Poolside",
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1100&q=85",
  },
];

const Landing = () => {
  const { user, logout } = useAuth();

  return (
    <div className="safe-page min-h-screen overflow-hidden bg-[#f8f6f2] text-slate-900">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/50 bg-[#f8f6f2]/80 backdrop-blur-2xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-3">
            <BrandLogo size="sm" subtitle="Hotel OS" />
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/menu"
              className="hidden items-center gap-2 rounded-2xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 lg:inline-flex"
            >
              <Utensils size={16} />
              Order Food
            </Link>
            <Link
              to="/rooms"
              className="hidden rounded-2xl border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 shadow-sm transition hover:border-orange-300 hover:bg-orange-100 md:inline-flex"
            >
              View Rooms
            </Link>
            <Link
              to="/events"
              className="hidden rounded-2xl border border-pink-200 bg-pink-50 px-4 py-2 text-sm font-semibold text-pink-700 shadow-sm transition hover:border-pink-300 hover:bg-pink-100 md:inline-flex"
            >
              Events
            </Link>
            {user ? (
              <>
                <Link
                  to={getRoleRedirect(user.role)}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-orange-200 hover:text-orange-600"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="hidden rounded-2xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 sm:inline-flex"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-orange-200 hover:text-orange-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="hidden rounded-2xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 sm:inline-flex"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <section className="relative min-h-[92vh] border-b border-orange-100">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2400&q=85')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f8f6f2] via-[#f8f6f2]/88 to-[#f8f6f2]/25" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(248,246,242,0.08),rgba(248,246,242,0.92))]" />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-28 md:px-6 lg:min-h-[92vh]">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/75 px-4 py-2 text-sm font-semibold text-orange-600 backdrop-blur-xl">
              <Star size={16} />
              Premium hotel stay and room service
            </div>

            <h1 className="max-w-3xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl md:text-7xl">
              DineLink Hotel
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
              Comfortable rooms, quick booking, in-room dining, housekeeping,
              laundry, events and guest services from one connected hotel system.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                to="/rooms"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-4 font-bold text-white shadow-xl shadow-orange-500/20 transition hover:bg-orange-600"
              >
                Book Room
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/menu"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-4 font-bold text-white shadow-xl shadow-slate-900/20 transition hover:bg-slate-800"
              >
                Order Food
                <Utensils size={18} />
              </Link>
              <Link
                to="/hotel-services"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white/80 px-6 py-4 font-bold text-slate-900 shadow-sm backdrop-blur-xl transition hover:border-orange-200 hover:text-orange-600"
              >
                Hotel Services
              </Link>
              <Link
                to="/events"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-pink-200 bg-pink-50 px-6 py-4 font-bold text-pink-700 shadow-sm backdrop-blur-xl transition hover:border-pink-300 hover:bg-pink-100"
              >
                Plan Event
                <PartyPopper size={18} />
              </Link>
            </div>

            <div className="mt-12 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
              {hotelStats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl border border-white/70 bg-white/75 p-4 shadow-lg shadow-slate-900/5 backdrop-blur-2xl"
                >
                  <p className="text-2xl font-black text-slate-950">
                    {item.value}
                  </p>
                  <p className="mt-1 text-xs font-bold text-slate-600">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="relative mx-auto max-w-7xl px-5 py-16">
        <section>
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
                Rooms
              </p>
              <h2 className="text-4xl font-black text-slate-950">
                Available stays for every guest.
              </h2>
            </div>
            <Link
              to="/rooms"
              className="inline-flex w-fit items-center gap-2 rounded-2xl border border-orange-200 bg-white px-5 py-3 font-black text-orange-600 shadow-sm transition hover:bg-orange-50"
            >
              View all rooms
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {roomHighlights.map((room, index) => (
              <motion.article
                key={room.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.06 }}
                className="overflow-hidden rounded-[2rem] border border-white bg-white/85 shadow-xl shadow-orange-100/40"
              >
                <img
                  src={room.image}
                  alt={room.title}
                  className="h-64 w-full object-cover"
                />
                <div className="p-5">
                  <p className="text-sm font-black text-orange-500">
                    {room.price}
                  </p>
                  <h3 className="mt-2 text-2xl font-black text-slate-950">
                    {room.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {room.copy}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="mt-16 overflow-hidden rounded-[2.25rem] border border-orange-100 bg-white/80 shadow-2xl shadow-orange-100/50">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
            <div className="grid min-h-80 grid-cols-2 gap-2 bg-orange-50 p-2 sm:min-h-[28rem]">
              <img
                src="https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1100&q=85"
                alt="Hotel butter chicken room-service dish"
                className="h-full w-full rounded-l-[1.75rem] object-cover"
              />
              <div className="grid gap-2">
                <img
                  src="https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=900&q=85"
                  alt="Fresh hotel biryani"
                  className="h-full min-h-0 w-full rounded-tr-[1.75rem] object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=85"
                  alt="Cold coffee from the hotel menu"
                  className="h-full min-h-0 w-full rounded-br-[1.75rem] object-cover"
                />
              </div>
            </div>

            <div className="flex flex-col justify-center p-6 md:p-10">
              <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-black text-orange-600">
                <ChefHat size={18} />
                In-room dining
              </div>
              <h2 className="text-3xl font-black leading-tight text-slate-950 md:text-5xl">
                Order fresh food from the hotel kitchen.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                Browse the complete live menu, add dishes to your cart, choose
                online or cash payment and track every order from your account.
                A room QR can link the order to your stay, but website ordering
                also works without scanning.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  "38 live menu choices",
                  "Online and cash payment",
                  "Optional room QR linking",
                  "Live order status tracking",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 font-bold text-slate-700">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                      <ShieldCheck size={16} />
                    </span>
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/menu"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-4 font-black text-white shadow-xl shadow-orange-500/20 transition hover:bg-orange-600"
                >
                  View Menu & Order
                  <ArrowRight size={18} />
                </Link>
                {user && user.role === "customer" && (
                  <Link
                    to="/my-orders"
                    className="inline-flex items-center justify-center rounded-2xl border border-orange-200 bg-white px-6 py-4 font-black text-orange-600 transition hover:bg-orange-50"
                  >
                    Track My Orders
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <div className="mb-8 max-w-2xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
              Services
            </p>
            <h2 className="text-4xl font-black text-slate-950">
              Everything guests expect from a modern hotel.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <PremiumHoverCard key={service.title} className="p-6" intensity={8}>
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3.2, repeat: Infinity, delay: index * 0.18 }}
                    className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-500"
                  >
                    <Icon size={22} />
                  </motion.div>
                  <h3 className="text-xl font-black text-slate-950">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {service.copy}
                  </p>
                </PremiumHoverCard>
              );
            })}
          </div>
        </section>

        <section className="mt-16 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <div className="premium-label-pill mb-5">
              <Sparkles size={18} />
              Gallery
            </div>
            <h2 className="text-3xl font-black text-slate-950 md:text-4xl">
              Premium spaces for stay, dining and celebrations.
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              Explore bright rooms, a welcoming lobby, relaxed dining and event-ready spaces before booking your stay.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {gallery.map((item) => (
              <figure
                key={item.title}
                className="overflow-hidden rounded-[2rem] border border-white bg-white/80 shadow-xl shadow-slate-900/5"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-64 w-full object-cover sm:h-80"
                />
                <figcaption className="px-4 py-3 text-sm font-black text-slate-700">
                  {item.title}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="mt-16 relative overflow-hidden rounded-[2.25rem] border border-white/80 bg-white/75 shadow-2xl shadow-pink-100/50 backdrop-blur-2xl">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=2200&q=85')",
            }}
          />
          <div className="relative grid gap-8 p-6 md:p-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white/80 px-4 py-2 text-sm font-black text-pink-700 shadow-sm backdrop-blur-xl">
                <PartyPopper size={18} />
                Private events
              </div>
              <h2 className="max-w-3xl text-4xl font-black leading-tight text-slate-950 md:text-5xl">
                Birthdays, meetings and family celebrations.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                Request decor, food preferences, guest count, budget and date.
                Hotel staff can follow up from the admin event desk.
              </p>
              <Link
                to="/events"
                className="mt-7 inline-flex items-center justify-center gap-2 rounded-2xl bg-pink-600 px-6 py-4 font-black text-white shadow-xl shadow-pink-500/20 transition hover:bg-pink-700"
              >
                Plan Special Event
                <ArrowRight size={18} />
              </Link>
            </div>
            <div className="grid gap-3">
              {[
                ["Custom menu", ChefHat],
                ["Guest planning", CalendarDays],
                ["Service follow-up", ShieldCheck],
              ].map(([label, Icon]) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-3xl border border-white bg-white/85 p-4 shadow-sm"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
                    <Icon size={20} />
                  </span>
                  <span className="font-black text-slate-800">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <div className="premium-label-pill mb-5">
              <MapPin size={18} />
              Contact
            </div>
            <h2 className="text-3xl font-black text-slate-950 md:text-4xl">
              Easy to reach, comfortable to stay.
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              Near city transport, business areas and local attractions. Contact the hotel desk for bookings, services and event planning.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-white/80 p-4 shadow-sm">
                <p className="text-sm font-bold text-slate-500">Phone</p>
                <p className="mt-1 font-black text-slate-950">+91 98765 43210</p>
              </div>
              <div className="rounded-3xl bg-white/80 p-4 shadow-sm">
                <p className="text-sm font-bold text-slate-500">Location</p>
                <p className="mt-1 font-black text-slate-950">City Center, India</p>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-white bg-white/85 shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1300&q=85"
              alt="Hotel exterior"
              className="h-80 w-full object-cover"
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Landing;
