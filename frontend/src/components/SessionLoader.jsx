import { motion } from "framer-motion";
import { Utensils } from "lucide-react";

const SessionLoader = () => {
  return (
    <div className="min-h-screen bg-[#f8f6f2] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="bg-white/80 border border-white/80 rounded-[2rem] p-8 shadow-2xl text-center"
      >
        <motion.div
          animate={{ rotate: [0, 8, -8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-16 h-16 bg-orange-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-5"
        >
          <Utensils size={30} />
        </motion.div>

        <h2 className="text-2xl font-black text-slate-900">
          Preparing your table...
        </h2>

        <p className="text-slate-500 mt-2">
          Restoring your secure dining session.
        </p>
      </motion.div>
    </div>
  );
};

export default SessionLoader;