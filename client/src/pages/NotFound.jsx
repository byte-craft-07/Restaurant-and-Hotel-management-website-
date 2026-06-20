import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ChefHat, Home, SearchX } from "lucide-react";
import AccountChip from "../components/AccountChip";


const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#f8f6f2] text-slate-900 overflow-hidden relative flex items-center justify-center px-5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#fb923c_0,transparent_28%),radial-gradient(circle_at_bottom_right,#fde68a_0,transparent_30%)] opacity-20" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-orange-300/30 blur-3xl rounded-full" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-300/30 blur-3xl rounded-full" />
      <div className="absolute right-5 top-5 z-20">
        <AccountChip />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative z-10 w-full max-w-2xl bg-white/80 backdrop-blur-2xl border border-white/80 rounded-[2.5rem] p-8 md:p-12 shadow-2xl text-center"
      >
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 3, -3, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-24 h-24 bg-orange-50 text-orange-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6"
        >
          <ChefHat size={54} />
        </motion.div>

        <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 text-orange-600 px-4 py-2 rounded-full font-bold mb-5">
          <SearchX size={18} />
          Room not found
        </div>

        <h1 className="text-6xl md:text-8xl font-black text-orange-500">
          404
        </h1>

        <h2 className="text-3xl md:text-4xl font-black mt-3">
          This room-service page is not available.
        </h2>

        <p className="text-slate-500 mt-4 max-w-lg mx-auto">
          The page, room, order, or item you are looking for may have
          been moved, deleted, expired, or served already.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-4 rounded-2xl font-black shadow-lg shadow-orange-500/20 transition"
          >
            <Home size={20} />
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-6 py-4 rounded-2xl font-black shadow-sm hover:text-orange-500 transition"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
