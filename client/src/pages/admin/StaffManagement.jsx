import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ChefHat,
  Mail,
  Phone,
  ShieldCheck,
  Trash2,
  UserPlus,
  UsersRound,
} from "lucide-react";
import api from "../../services/api";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  role: "waiter",
};

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const fetchStaff = async () => {
    try {
      const res = await api.get("/users/staff");
      setStaff(res.data.staff || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load staff users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setFormErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const validateForm = () => {
    const errors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      errors.name = "Staff name is required.";
    }

    if (!formData.email.trim()) {
      errors.email = "Email ID is required.";
    } else if (!emailPattern.test(formData.email)) {
      errors.email = "Enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required.";
    }

    if (!formData.password) {
      errors.password = "Temporary password is required.";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const createStaff = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const res = await api.post("/users/staff", formData);
      setStaff((prev) => [res.data.staff, ...prev]);
      setFormData(emptyForm);
      setMessage(res.data.message || "Staff account created.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create staff user.");
    } finally {
      setSaving(false);
    }
  };

  const deleteStaff = async (id) => {
    const confirmDelete = window.confirm("Delete this staff account?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/users/staff/${id}`);
      setStaff((prev) => prev.filter((item) => item._id !== id));
      setMessage("Staff account deleted.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete staff user.");
    }
  };

  const waiterCount = staff.filter((item) => item.role === "waiter").length;
  const kitchenCount = staff.filter((item) => item.role === "kitchen").length;

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="premium-label-pill mb-4">
            <ShieldCheck size={18} />
            Staff Authority
          </div>
          <h1 className="text-4xl font-black text-slate-950">
            Staff Management
          </h1>
          <p className="mt-2 text-slate-500">
            Create room-service and kitchen login accounts from the admin panel.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-[2rem] border border-white/80 bg-white/75 px-5 py-4 shadow-lg backdrop-blur-2xl">
            <p className="text-xs font-bold text-slate-500">Service Staff</p>
            <p className="text-3xl font-black text-orange-500">
              {waiterCount}
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/80 bg-white/75 px-5 py-4 shadow-lg backdrop-blur-2xl">
            <p className="text-xs font-bold text-slate-500">Kitchen</p>
            <p className="text-3xl font-black text-green-600">
              {kitchenCount}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-3xl border border-red-200 bg-red-50 p-4 font-semibold text-red-600">
          {error}
        </div>
      )}

      {message && (
        <div className="mb-5 rounded-3xl border border-green-200 bg-green-50 p-4 font-semibold text-green-700">
          {message}
        </div>
      )}

      <section className="premium-card mb-8 p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-950">
              Create Staff Account
            </h2>
            <p className="text-sm text-slate-500">
              Admin can issue official login details for room-service or kitchen use.
            </p>
          </div>

          <div className="rounded-2xl bg-orange-50 p-3 text-orange-500">
            <UserPlus />
          </div>
        </div>

        <form
          onSubmit={createStaff}
          noValidate
          className="grid grid-cols-1 gap-4 lg:grid-cols-2"
        >
          <div>
            <input
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Staff full name"
              className={`premium-input w-full p-4 ${
                formErrors.name ? "border-red-200 bg-red-50/60" : ""
              }`}
              aria-invalid={Boolean(formErrors.name)}
            />
            {formErrors.name && (
              <p className="mt-2 text-sm font-semibold text-red-500">
                {formErrors.name}
              </p>
            )}
          </div>

          <div className="rounded-[1.4rem] border border-slate-200 bg-white p-1.5 shadow-sm">
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { value: "waiter", label: "Service Staff", icon: UsersRound },
                { value: "kitchen", label: "Kitchen", icon: ChefHat },
              ].map((role) => {
                const Icon = role.icon;
                const active = formData.role === role.value;

                return (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => updateField("role", role.value)}
                    className={`flex items-center justify-center gap-2 rounded-[1.1rem] px-4 py-3 font-black transition ${
                      active
                        ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                        : "text-slate-500 hover:bg-orange-50 hover:text-orange-600"
                    }`}
                  >
                    <Icon size={18} />
                    {role.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="Email ID"
              className={`premium-input w-full p-4 ${
                formErrors.email ? "border-red-200 bg-red-50/60" : ""
              }`}
              aria-invalid={Boolean(formErrors.email)}
            />
            {formErrors.email && (
              <p className="mt-2 text-sm font-semibold text-red-500">
                {formErrors.email}
              </p>
            )}
          </div>

          <div>
            <input
              value={formData.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="Phone number"
              className={`premium-input w-full p-4 ${
                formErrors.phone ? "border-red-200 bg-red-50/60" : ""
              }`}
              aria-invalid={Boolean(formErrors.phone)}
            />
            {formErrors.phone && (
              <p className="mt-2 text-sm font-semibold text-red-500">
                {formErrors.phone}
              </p>
            )}
          </div>

          <div className="lg:col-span-2">
            <input
              type="password"
              value={formData.password}
              onChange={(e) => updateField("password", e.target.value)}
              placeholder="Temporary password"
              className={`premium-input w-full p-4 ${
                formErrors.password ? "border-red-200 bg-red-50/60" : ""
              }`}
              minLength={6}
              aria-invalid={Boolean(formErrors.password)}
            />
            {formErrors.password && (
              <p className="mt-2 text-sm font-semibold text-red-500">
                {formErrors.password}
              </p>
            )}
          </div>

          <button
            disabled={saving}
            className="premium-primary-button w-full p-4 disabled:bg-slate-300 disabled:shadow-none lg:col-span-2"
          >
            <UserPlus size={18} />
            {saving ? "Creating..." : "Create Staff Account"}
          </button>
        </form>
      </section>

      <section className="premium-card p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-950">
              Active Staff
            </h2>
            <p className="text-sm text-slate-500">
              Login users with room-service or kitchen access.
            </p>
          </div>

          <div className="rounded-2xl bg-orange-50 p-3 text-orange-500">
            <UsersRound />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="premium-shimmer h-44 rounded-[2rem]"
              />
            ))}
          </div>
        ) : staff.length === 0 ? (
          <div className="rounded-[2rem] border border-orange-100 bg-[#f8f6f2] p-10 text-center text-slate-500">
            No room-service or kitchen staff created yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {staff.map((item) => (
              <motion.div
                key={item._id}
                layout
                whileHover={{ y: -5, scale: 1.01 }}
                className="rounded-[2rem] border border-white bg-white/80 p-5 shadow-xl shadow-orange-100/40"
              >
                <div className="flex justify-between gap-3">
                  <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-orange-600">
                      {item.role === "kitchen" ? (
                        <ChefHat size={14} />
                      ) : (
                        <UsersRound size={14} />
                      )}
                      {item.role}
                    </div>

                    <h3 className="text-xl font-black text-slate-950">
                      {item.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => deleteStaff(item._id)}
                    className="h-fit rounded-xl bg-red-50 p-2 text-red-500 transition hover:bg-red-100"
                    aria-label={`Delete ${item.name}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p className="flex items-center gap-2 rounded-2xl bg-[#f8f6f2] p-3">
                    <Mail size={16} className="text-orange-500" />
                    {item.email}
                  </p>

                  <p className="flex items-center gap-2 rounded-2xl bg-[#f8f6f2] p-3">
                    <Phone size={16} className="text-orange-500" />
                    {item.phone}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default StaffManagement;
