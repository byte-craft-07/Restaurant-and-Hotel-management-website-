import { Link } from "react-router-dom";
import {
  motion,
} from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Bot,
  CalendarDays,
  ChefHat,
  ClipboardList,
  Gift,
  PartyPopper,
  MonitorPlay,
  QrCode,
  ScanLine,
  ShieldCheck,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import BrandLogo from "../components/BrandLogo";
import PremiumHoverCard from "../components/motion/PremiumHoverCard";
import RestaurantBrandPanel from "../components/restaurant/RestaurantBrandPanel";
import { DEMO_QR_TOKEN } from "../services/demoExperience";

const features = [
  {
    title: "QR Room Ordering",
    description:
      "Guests scan the room QR, browse the menu, and place verified room-service orders without staff confusion.",
    icon: QrCode,
  },
  {
    title: "AI Natural Ordering",
    description:
      "Guests can type requests like '2 burgers and 1 coffee' and the assistant builds a real cart from the live menu.",
    icon: Bot,
  },
  {
    title: "Live Kitchen Display",
    description:
      "Kitchen teams see room-wise pending, accepted, and preparing orders in a clean real-time queue.",
    icon: ChefHat,
  },
  {
    title: "Hotel Staff Operations",
    description:
      "Service staff verify room requests, monitor guest calls, and update order status from one focused screen.",
    icon: ClipboardList,
  },
];

const stats = [
  { label: "AI cart build", value: "<3s" },
  { label: "Order flow", value: "QR" },
  { label: "Live dashboards", value: "4" },
];

const workflowSteps = [
  {
    title: "Scan QR",
    description: "Guest lands on the room-aware digital menu.",
    icon: ScanLine,
  },
  {
    title: "Ask AI",
    description: "Natural text becomes exact menu suggestions or cart items.",
    icon: WandSparkles,
  },
  {
    title: "Place Order",
    description: "QR room sessions keep orders simple and staff-aware.",
    icon: ShieldCheck,
  },
  {
    title: "Kitchen Live",
    description: "Orders move instantly to kitchen and hotel service operations.",
    icon: MonitorPlay,
  },
];

const aiPreviewPrompts = [
  "2 spicy burgers and 1 cold coffee",
  "Veg food under Rs. 300",
  "Suggest something spicy",
];

const Landing = () => {
  return (
    <div className="safe-page min-h-screen overflow-hidden bg-[#f8f6f2] text-slate-900">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/50 bg-[#f8f6f2]/75 backdrop-blur-2xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-3">
            <BrandLogo size="sm" subtitle="Hotel OS" />
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/events"
              className="hidden rounded-2xl border border-pink-200 bg-pink-50 px-4 py-2 text-sm font-semibold text-pink-700 shadow-sm transition hover:border-pink-300 hover:bg-pink-100 md:inline-flex"
            >
              Special Events
            </Link>
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
          </div>
        </nav>
      </header>

      <section className="relative min-h-[92vh] border-b border-orange-100">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2400&q=85')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f8f6f2] via-[#f8f6f2]/88 to-[#f8f6f2]/38" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(248,246,242,0.2),rgba(248,246,242,0.95))]" />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-28 md:gap-14 md:px-6 md:pb-24 lg:min-h-[92vh]">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/70 px-4 py-2 text-sm font-semibold text-orange-600 backdrop-blur-xl">
              <Sparkles size={16} />
              AI-powered QR room service for modern hotels
            </div>

            <h1 className="max-w-3xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl md:text-7xl">
              Ultra-fast room service with an AI menu concierge.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
              Guests scan from their room, type what they want, and DineLink
              converts menu intent into cart actions while hotel staff and
              kitchen teams stay live.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to={`/qr/${DEMO_QR_TOKEN}`}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-4 font-bold text-white shadow-xl shadow-orange-500/20 transition hover:bg-orange-600"
              >
                Simulate Room QR
                <ArrowRight size={18} />
              </Link>
              <Link
                to={`/qr/${DEMO_QR_TOKEN}`}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white/80 px-6 py-4 font-bold text-slate-900 shadow-sm backdrop-blur-xl transition hover:border-orange-200 hover:text-orange-600"
              >
                Try AI Menu
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white/60 px-6 py-4 font-bold text-slate-700 shadow-sm backdrop-blur-xl transition hover:border-orange-200 hover:text-orange-600"
              >
                Hotel Staff Login
            </Link>
            <Link
              to="/events"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-pink-200 bg-pink-50 px-6 py-4 font-bold text-pink-700 shadow-sm backdrop-blur-xl transition hover:border-pink-300 hover:bg-pink-100"
            >
              Plan Special Event
              <PartyPopper size={18} />
            </Link>
          </div>

            <div className="mt-12 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="border border-white/70 bg-white/70 p-4 shadow-lg shadow-slate-900/5 backdrop-blur-2xl"
                >
                  <p className="text-2xl font-bold text-slate-950">
                    {item.value}
                  </p>
                  <p className="mt-1 text-xs text-slate-600">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      <section className="relative overflow-hidden border-b border-pink-100 bg-white/45">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=2200&q=85')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f8f6f2] via-[#f8f6f2]/92 to-[#f8f6f2]/70" />

        <div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-5 py-16 md:py-20 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white/80 px-4 py-2 text-sm font-black text-pink-700 shadow-sm backdrop-blur-xl">
              <PartyPopper size={18} />
              Birthdays, parties and private celebrations
            </div>

            <h2 className="max-w-3xl text-4xl font-black leading-tight text-slate-950 md:text-6xl">
              Plan special events with custom food, decor and service.
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Customers can request birthdays, anniversaries, family functions
              or office parties with guest count, budget, menu preferences,
              decoration choices and special instructions.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/events"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-pink-600 px-6 py-4 font-black text-white shadow-xl shadow-pink-500/20 transition hover:bg-pink-700"
              >
                Customize Event
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/login?redirect=/events"
                className="inline-flex items-center justify-center rounded-2xl border border-pink-200 bg-white/80 px-6 py-4 font-black text-pink-700 shadow-sm backdrop-blur-xl transition hover:bg-pink-50"
              >
                Login to Request
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Birthday Setups",
                copy: "Cake setup, balloons, music, kids menu and family seating.",
                icon: Gift,
              },
              {
                title: "Custom Menu",
                copy: "Starters, main course, desserts, drinks and veg/non-veg choices.",
                icon: ChefHat,
              },
              {
                title: "Guest Planning",
                copy: "Guest count, budget range, contact phone and preferred date.",
                icon: CalendarDays,
              },
              {
                title: "Admin Follow-up",
                copy: "Requests reach admin panel for status updates and planning notes.",
                icon: ClipboardList,
              },
            ].map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: index * 0.07 }}
                  whileHover={{ y: -7, scale: 1.01 }}
                  className="rounded-[2rem] border border-white/80 bg-white/80 p-5 shadow-xl shadow-pink-100/50 backdrop-blur-2xl"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-xl font-black text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.copy}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <main className="relative mx-auto max-w-7xl px-5 py-16">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
            Complete Flow
          </p>
          <h2 className="text-4xl font-bold text-slate-950">
            Built for real hotel room service.
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Every screen is designed for fast staff action and a smoother guest
            ordering experience.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <PremiumHoverCard
                key={feature.title}
                className="min-h-[272px] p-6"
                intensity={12}
              >
                <motion.div
                  animate={{ y: [0, -5, 0], rotate: [0, 4, -4, 0] }}
                  transition={{
                    duration: 3.4,
                    repeat: Infinity,
                    delay: index * 0.25,
                  }}
                  whileHover={{ scale: 1.15, rotate: 12 }}
                  className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-orange-50 to-amber-100 text-orange-500 shadow-inner"
                >
                  <motion.span
                    animate={{ scale: [1, 1.45, 1], opacity: [0.35, 0, 0.35] }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      delay: index * 0.2,
                    }}
                    className="absolute inset-0 rounded-lg border border-orange-300"
                  />
                  <Icon size={23} />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-950">
                  {feature.title}
                </h3>
                <p className="mt-3 leading-7 text-slate-600">
                  {feature.description}
                </p>
                <div className="mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-orange-400 via-amber-300 to-transparent" />
              </PremiumHoverCard>
            );
          })}
        </div>

        <section className="mt-16 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="premium-card p-6">
            <div className="premium-label-pill mb-5">
              <ScanLine size={18} />
              Live Demo Flow
            </div>
            <h2 className="text-3xl font-black text-slate-950">
              From room QR scan to kitchen queue in one smooth story.
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              Built for hackathon demos: every step explains itself visually,
              from guest intent to staff execution.
            </p>
            <Link
              to="/menu"
              className="premium-primary-button mt-6 px-5 py-3"
            >
              Start Guest Demo
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ y: -7, scale: 1.01 }}
                  className="rounded-[2rem] border border-white/80 bg-white/75 p-5 shadow-lg shadow-orange-100/50 backdrop-blur-2xl"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                    <Icon size={22} />
                  </div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-500">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-2 text-xl font-black text-slate-950">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="mt-16 overflow-hidden rounded-[2.25rem] border border-white/80 bg-white/75 p-6 shadow-2xl shadow-orange-100/60 backdrop-blur-2xl md:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <div className="premium-label-pill mb-5">
                <Bot size={18} />
                AI Assistant Preview
              </div>
              <h2 className="text-3xl font-black text-slate-950 md:text-4xl">
                Judges can see the AI value immediately.
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                The assistant uses the real menu, avoids fake items, suggests
                close matches, and builds the cart when the request is clear.
              </p>
            </div>

            <motion.div
              whileHover={{ y: -8, rotateX: 2, rotateY: -2 }}
              className="rounded-[2rem] border border-orange-100 bg-[#f8f6f2] p-5 shadow-inner"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/20">
                  <WandSparkles />
                </div>
                <div>
                  <p className="font-black text-slate-950">Build My Order</p>
                  <p className="text-sm text-slate-500">
                    Natural language to cart
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {aiPreviewPrompts.map((prompt, index) => (
                  <motion.div
                    key={prompt}
                    animate={{ x: [0, index % 2 === 0 ? 6 : -6, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: index * 0.35,
                    }}
                    className="rounded-2xl border border-white bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm"
                  >
                    "{prompt}"
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 rounded-2xl border border-green-100 bg-green-50 p-4 text-sm text-green-700">
                AI result: matched menu items, quantity detected, cart ready.
              </div>
            </motion.div>
          </div>
        </section>

        <section className="mt-16 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <div className="premium-label-pill mb-5">
              <ShieldCheck size={18} />
              Hotel Branding
            </div>
            <h2 className="text-3xl font-black text-slate-950 md:text-4xl">
              The guest experience feels like the hotel, not a template.
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              Hotel name, logo mark, service tags, status, banner imagery, and
              room context can shape the interface while DineLink keeps the
              premium product consistency.
            </p>
          </div>

          <RestaurantBrandPanel
            tableContext={{ type: "room", number: "204" }}
          />
        </section>

        <div className="mt-16 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <PremiumHoverCard className="p-6" intensity={7}>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-orange-500">
                  Analytics Snapshot
                </p>
                <h3 className="mt-1 text-2xl font-bold">
                  Revenue and customer insight
                </h3>
              </div>
              <motion.div
                animate={{ y: [0, -5, 0], rotate: [0, -6, 6, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="rounded-lg bg-orange-50 p-3 text-orange-500"
              >
                <BarChart3 />
              </motion.div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <motion.div
                whileHover={{ y: -6, backgroundColor: "#fff7ed" }}
                className="rounded-lg bg-[#f5f5f4] p-4 transition-colors"
              >
                <p className="text-sm text-slate-600">Revenue</p>
                <p className="mt-2 text-2xl font-bold text-slate-950">
                  Rs. 42k
                </p>
              </motion.div>
              <motion.div
                whileHover={{ y: -6, backgroundColor: "#fff7ed" }}
                className="rounded-lg bg-[#f5f5f4] p-4 transition-colors"
              >
                <p className="text-sm text-slate-600">Orders</p>
                <p className="mt-2 text-2xl font-bold text-slate-950">128</p>
              </motion.div>
              <motion.div
                whileHover={{ y: -6, backgroundColor: "#fff7ed" }}
                className="rounded-lg bg-[#f5f5f4] p-4 transition-colors"
              >
                <p className="text-sm text-slate-600">Customers</p>
                <p className="mt-2 text-2xl font-bold text-slate-950">64</p>
              </motion.div>
            </div>
          </PremiumHoverCard>

          <PremiumHoverCard className="p-6" intensity={7}>
            <p className="text-sm font-semibold text-orange-500">
              Room Service Queue
            </p>
            <h3 className="mt-1 text-2xl font-bold">Live service view</h3>

            <div className="mt-6 space-y-3">
              {["Room 204", "Room 101", "Suite 307"].map((label, index) => (
                <motion.div
                  key={label}
                  whileHover={{ x: 8, backgroundColor: "#fff7ed" }}
                  className="flex items-center justify-between rounded-lg bg-[#f5f5f4] p-4 transition-colors"
                >
                  <div>
                    <p className="font-bold">{label}</p>
                    <p className="text-sm text-slate-600">
                      {index === 0
                        ? "Paneer Butter Masala"
                        : index === 1
                        ? "Kebab Platter"
                      : "Chef Special Thali"}
                    </p>
                  </div>
                  <span className="relative rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-600">
                    <span className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-green-500">
                      <span className="absolute inset-0 animate-ping rounded-full bg-green-400" />
                    </span>
                    Live
                  </span>
                </motion.div>
              ))}
            </div>
          </PremiumHoverCard>
        </div>
      </main>
    </div>
  );
};

export default Landing;
