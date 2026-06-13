import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Lock, Mail, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import BrandLogo from "../../components/BrandLogo";
import { FieldError } from "../../components/form/PremiumFields";
import { getCustomerRedirect, getRoleRedirect } from "../../utils/authRedirect";
import { getAuthErrorMessage } from "../../utils/apiErrors";
import { API_BASE_URL } from "../../services/api";

const Login = () => {
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirect = searchParams.get("redirect") || "/menu";
  const qrToken = searchParams.get("qrToken");
  const switchCustomer = searchParams.get("switchCustomer") === "1";
  const customerRedirect = getCustomerRedirect(redirect);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setFormErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.emailOrPhone.trim()) {
      errors.emailOrPhone = "Email or phone is required.";
    }

    if (!formData.password) {
      errors.password = "Password is required.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setError("");

    try {
      const data = await login({
        emailOrPhone: formData.emailOrPhone.trim(),
        password: formData.password,
      });

      if (qrToken) {
        localStorage.setItem("qrToken", qrToken);
      }

      navigate(getRoleRedirect(data.user.role, redirect));
    } catch (err) {
      setError(getAuthErrorMessage(err, "Login failed"));
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8f6f2] text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#fb923c_0,transparent_28%),radial-gradient(circle_at_bottom_right,#fcd34d_0,transparent_30%)] opacity-20" />
      <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-orange-300/30 blur-3xl" />
      <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-yellow-300/30 blur-3xl" />

      <div className="relative z-10 grid min-h-screen lg:grid-cols-2">
        <section className="hidden min-h-screen flex-col gap-7 overflow-hidden p-8 xl:p-10 lg:flex">
          <Link to="/">
            <BrandLogo subtitle="Smart Hospitality OS" />
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-4 py-2 shadow-sm">
              <Sparkles size={18} className="text-orange-500" />
              <span className="text-sm font-semibold">
                Smart Hospitality OS
              </span>
            </div>

            <h1 className="text-5xl font-black leading-tight xl:text-6xl">
              Welcome back to your{" "}
              <span className="text-orange-500">
                hotel control room.
              </span>
            </h1>

            <p className="mt-6 text-lg text-slate-600">
              Manage orders, room QR codes, service flow, kitchen display and
              customer loyalty from one beautifully connected system.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="rounded-3xl border border-white/80 bg-white/70 p-4 shadow-lg xl:p-5">
                <p className="text-3xl font-black text-orange-500">QR</p>
                <p className="mt-1 text-sm text-slate-500">Smart ordering</p>
              </div>

              <div className="rounded-3xl border border-white/80 bg-white/70 p-4 shadow-lg xl:p-5">
                <p className="text-3xl font-black text-green-600">Live</p>
                <p className="mt-1 text-sm text-slate-500">Order tracking</p>
              </div>

              <div className="rounded-3xl border border-white/80 bg-white/70 p-4 shadow-lg xl:p-5">
                <p className="text-3xl font-black text-purple-600">CRM</p>
                <p className="mt-1 text-sm text-slate-500">Customers</p>
              </div>
            </div>
          </motion.div>

        </section>

        <section className="flex items-center justify-center px-5 py-10">
          <motion.div
            data-premium-hover="true"
            initial={{ opacity: 0, y: 35, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55 }}
            className="w-full max-w-md rounded-[2rem] border border-white/80 bg-white/75 p-8 shadow-2xl backdrop-blur-2xl"
          >
            <div className="mb-8">
              <BrandLogo
                className="mb-6"
                size="md"
                subtitle="Premium QR Ordering"
              />

              <h2 className="text-3xl font-black">Login</h2>
              <p className="mt-2 text-slate-500">
                Continue your smart dining workflow.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                <p>{error}</p>
                <p className="mt-2 break-all text-xs font-semibold text-red-500">
                  API: {API_BASE_URL}
                </p>
              </div>
            )}

            {(qrToken || switchCustomer) && (
              <div className="mb-5 rounded-2xl border border-orange-200 bg-orange-50 p-3 text-sm font-semibold text-orange-700">
                {switchCustomer
                  ? "Staff session detected. Login as customer to track this QR order."
                  : "Room QR detected. Login once to track orders and offers."}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <div className="relative">
                  <Mail
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    name="emailOrPhone"
                    placeholder="Email or Phone"
                    value={formData.emailOrPhone}
                    onChange={handleChange}
                    className={`w-full rounded-2xl border bg-white py-4 pl-12 pr-4 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100 ${
                      formErrors.emailOrPhone
                        ? "border-red-200 bg-red-50/60"
                        : "border-slate-200"
                    }`}
                    aria-invalid={Boolean(formErrors.emailOrPhone)}
                  />
                </div>
                <FieldError>{formErrors.emailOrPhone}</FieldError>
              </div>

              <div>
                <div className="relative">
                  <Lock
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full rounded-2xl border bg-white py-4 pl-12 pr-4 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100 ${
                      formErrors.password
                        ? "border-red-200 bg-red-50/60"
                        : "border-slate-200"
                    }`}
                    aria-invalid={Boolean(formErrors.password)}
                  />
                </div>
                <FieldError>{formErrors.password}</FieldError>
              </div>

              <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 p-4 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600">
                Login
                <ArrowRight size={20} />
              </button>
            </form>

            <button
              type="button"
              onClick={() => {
                setFormData({
                  emailOrPhone: "admin@restro.com",
                  password: "admin123",
                });
                setError("");
                setFormErrors({});
              }}
              className="mt-4 w-full rounded-2xl border border-orange-200 bg-orange-50 p-3 text-sm font-bold text-orange-600 transition hover:bg-orange-100"
            >
              Use admin login
            </button>

            <p className="mt-6 text-center text-sm text-slate-500">
              New customer?{" "}
              <Link
                to={`/register?redirect=${customerRedirect}${
                  qrToken ? `&qrToken=${qrToken}` : ""
                }`}
                className="font-bold text-orange-500"
              >
                Create account
              </Link>
            </p>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Login;
