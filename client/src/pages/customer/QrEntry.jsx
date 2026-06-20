import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { QrCode } from "lucide-react";
import BrandLogo from "../../components/BrandLogo";
import { useAuth } from "../../context/AuthContext";

const QrEntry = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    localStorage.setItem("qrToken", token);

    if (user?.role === "customer") {
      navigate("/menu", { replace: true });
    } else if (user) {
      navigate(`/login?redirect=/menu&qrToken=${token}&switchCustomer=1`, {
        replace: true,
      });
    } else {
      navigate(`/login?redirect=/menu&qrToken=${token}`, { replace: true });
    }
  }, [token, user, loading, navigate]);

  return (
    <div className="premium-page flex items-center justify-center p-5">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="premium-card relative z-10 max-w-md p-8 text-center"
      >
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/20">
          <QrCode />
        </div>

        <h1 className="text-3xl font-black text-slate-950">
          Opening hotel room-service menu
        </h1>
        <p className="mt-3 text-slate-500">
          Your room QR is being linked to this guest session.
        </p>

        <BrandLogo
          className="mx-auto mt-6 w-fit justify-center"
          size="sm"
          subtitle="Opening Guest Menu"
        />
      </motion.div>
    </div>
  );
};

export default QrEntry;
