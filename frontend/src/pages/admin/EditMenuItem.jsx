import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  ChefHat,
  Leaf,
  Save,
  Sparkles,
  XCircle,
} from "lucide-react";
import api from "../../services/api";
import {
  FieldError,
  PremiumSelect,
  SegmentedControl,
  fieldClass,
} from "../../components/form/PremiumFields";

const getImageUrl = (image) => {
  if (!image) return "";

  return image.startsWith("/uploads")
    ? `http://localhost:5000${image}`
    : image;
};

const EditMenuItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [notFound, setNotFound] = useState(false);
  const [itemForm, setItemForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    imageFile: null,
    category: "",
    isVeg: true,
    isAvailable: true,
    preparationTime: 15,
    tags: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemRes, categoryRes] = await Promise.all([
          api.get(`/menu/${id}`),
          api.get("/categories"),
        ]);

        const item = itemRes.data.menuItem;

        if (!item) {
          setNotFound(true);
          return;
        }

        setCategories(categoryRes.data.categories || []);
        setItemForm({
          name: item.name || "",
          description: item.description || "",
          price: item.price || "",
          image: item.image || "",
          imageFile: null,
          category: item.category?._id || item.category || "",
          isVeg: item.isVeg ?? true,
          isAvailable: item.isAvailable ?? true,
          preparationTime: item.preparationTime || 15,
          tags: item.tags?.join(", ") || "",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Menu item load failed");
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const updateField = (field, value) => {
    setItemForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const errors = {};
    const price = Number(itemForm.price);
    const preparationTime = Number(itemForm.preparationTime);

    if (!itemForm.name.trim()) errors.name = "Item name is required.";
    if (!itemForm.category) errors.category = "Please select a category.";
    if (!itemForm.price) {
      errors.price = "Price is required.";
    } else if (Number.isNaN(price) || price <= 0) {
      errors.price = "Price must be greater than 0.";
    }

    if (
      itemForm.preparationTime &&
      (Number.isNaN(preparationTime) || preparationTime < 1)
    ) {
      errors.preparationTime = "Preparation time must be at least 1 minute.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const updateMenuItem = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    setError("");

    const formData = new FormData();
    formData.append("name", itemForm.name);
    formData.append("description", itemForm.description);
    formData.append("price", itemForm.price);
    formData.append("category", itemForm.category);
    formData.append("isVeg", itemForm.isVeg);
    formData.append("isAvailable", itemForm.isAvailable);
    formData.append("preparationTime", itemForm.preparationTime);
    formData.append("tags", itemForm.tags);

    if (itemForm.image) {
      formData.append("image", itemForm.image);
    }

    if (itemForm.imageFile) {
      formData.append("image", itemForm.imageFile);
    }

    try {
      await api.put(`/menu/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/admin/menu");
    } catch (err) {
      setError(err.response?.data?.message || "Menu item update failed");
    } finally {
      setSaving(false);
    }
  };

  const categoryOptions = categories.map((cat) => ({
    value: cat._id,
    label: cat.name,
  }));

  if (loading) {
    return (
      <div className="premium-card p-10 text-center text-slate-500">
        Loading menu item...
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-[2rem] border border-white/80 bg-white/80 p-8 text-center shadow-xl backdrop-blur-2xl">
          <h2 className="text-2xl font-black text-orange-500">
            Menu item not found
          </h2>

          <p className="mt-3 text-slate-500">
            This food item may have been removed or updated by the hotel.
          </p>

          <button
            onClick={() => navigate("/admin/menu")}
            className="premium-primary-button mt-6 px-6 py-3"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="premium-label-pill mb-4">
            <Sparkles size={18} />
            Menu Editor
          </div>
          <h1 className="text-4xl font-black text-slate-950">
            Edit Menu Item
          </h1>
          <p className="mt-2 text-slate-500">
            Update item details, pricing, image and availability.
          </p>
        </div>

        <Link to="/admin/menu" className="premium-soft-button px-5 py-3">
          <ArrowLeft size={18} />
          Back
        </Link>
      </div>

      <form
        onSubmit={updateMenuItem}
        noValidate
        className="premium-card p-6"
      >
        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {itemForm.image && (
          <div className="mb-5 h-56 overflow-hidden rounded-[2rem] bg-orange-50 md:h-72">
            <img
              src={getImageUrl(itemForm.image)}
              alt={itemForm.name}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <input
              value={itemForm.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Item name"
              className={fieldClass(formErrors.name)}
              aria-invalid={Boolean(formErrors.name)}
            />
            <FieldError>{formErrors.name}</FieldError>
          </div>

          <div>
            <input
              value={itemForm.price}
              onChange={(e) => updateField("price", e.target.value)}
              placeholder="Price"
              type="number"
              min="0"
              className={fieldClass(formErrors.price)}
              aria-invalid={Boolean(formErrors.price)}
            />
            <FieldError>{formErrors.price}</FieldError>
          </div>

          <div>
            <PremiumSelect
              value={itemForm.category}
              onChange={(value) => updateField("category", value)}
              options={categoryOptions}
              placeholder="Select Category"
              error={formErrors.category}
            />
            <FieldError>{formErrors.category}</FieldError>
          </div>

          <SegmentedControl
            value={itemForm.isVeg}
            onChange={(value) => updateField("isVeg", value)}
            options={[
              { value: true, label: "Veg", icon: Leaf },
              { value: false, label: "Non-Veg", icon: ChefHat },
            ]}
          />

          <SegmentedControl
            value={itemForm.isAvailable}
            onChange={(value) => updateField("isAvailable", value)}
            options={[
              { value: true, label: "Available", icon: CheckCircle },
              { value: false, label: "Hidden", icon: XCircle },
            ]}
          />

          <div>
            <input
              value={itemForm.preparationTime}
              onChange={(e) =>
                updateField("preparationTime", e.target.value)
              }
              placeholder="Preparation time"
              type="number"
              min="1"
              className={fieldClass(formErrors.preparationTime)}
              aria-invalid={Boolean(formErrors.preparationTime)}
            />
            <FieldError>{formErrors.preparationTime}</FieldError>
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => updateField("imageFile", e.target.files[0])}
            className="premium-input w-full p-4"
          />

          <input
            value={itemForm.image}
            onChange={(e) => updateField("image", e.target.value)}
            placeholder="Image URL"
            className="premium-input w-full p-4"
          />

          <input
            value={itemForm.tags}
            onChange={(e) => updateField("tags", e.target.value)}
            placeholder="Tags: spicy, popular"
            className="premium-input w-full p-4 sm:col-span-2"
          />

          <textarea
            value={itemForm.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Description"
            className="premium-input min-h-32 w-full p-4 sm:col-span-2"
          />
        </div>

        <button
          disabled={saving}
          className="premium-primary-button mt-5 w-full p-4 disabled:bg-slate-300 disabled:shadow-none"
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditMenuItem;
