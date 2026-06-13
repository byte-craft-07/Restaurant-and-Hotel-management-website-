import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ChefHat, Leaf, Plus, Sparkles } from "lucide-react";
import api from "../../services/api";
import {
  FieldError,
  PremiumSelect,
  SegmentedControl,
  fieldClass,
} from "../../components/form/PremiumFields";

const AddMenuItem = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [itemForm, setItemForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    imageFile: null,
    category: "",
    isVeg: true,
    preparationTime: 15,
    tags: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await api.get("/categories");
      setCategories(res.data.categories || []);
    };

    fetchCategories();
  }, []);

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

  const createMenuItem = async (e) => {
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
    formData.append("preparationTime", itemForm.preparationTime);
    formData.append("tags", itemForm.tags);

    if (itemForm.image) {
      formData.append("image", itemForm.image);
    }

    if (itemForm.imageFile) {
      formData.append("image", itemForm.imageFile);
    }

    try {
      await api.post("/menu", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/admin/menu");
    } catch (err) {
      setError(err.response?.data?.message || "Menu item create failed");
    } finally {
      setSaving(false);
    }
  };

  const categoryOptions = categories.map((cat) => ({
    value: cat._id,
    label: cat.name,
  }));

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="premium-label-pill mb-4">
            <Sparkles size={18} />
            New Menu Item
          </div>
          <h1 className="text-4xl font-black text-slate-950">
            Add Menu Item
          </h1>
          <p className="mt-2 text-slate-500">
            Create a polished item card for your customer menu.
          </p>
        </div>

        <Link to="/admin/menu" className="premium-soft-button px-5 py-3">
          <ArrowLeft size={18} />
          Back
        </Link>
      </div>

      <form
        onSubmit={createMenuItem}
        noValidate
        className="premium-card p-6"
      >
        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-600">
            {error}
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
          <Plus size={18} />
          {saving ? "Saving..." : "Add Menu Item"}
        </button>
      </form>
    </div>
  );
};

export default AddMenuItem;
