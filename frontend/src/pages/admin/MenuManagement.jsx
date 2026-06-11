import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Pencil, Plus, Trash2, Utensils } from "lucide-react";
import api from "../../services/api";
import {
  buildDemoBackedMenu,
  DEMO_MENU_ITEMS,
} from "../../services/demoExperience";

const getImageUrl = (image) => {
  if (!image) return "";

  return image.startsWith("/uploads")
    ? `http://localhost:5000${image}`
    : image;
};

const isDemoMenuItem = (item) => item._id?.startsWith("demo-");

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMenuItems = async () => {
    try {
      const res = await api.get("/menu");
      const fetchedItems = res.data.menuItems || [];
      const demoModeEnabled = import.meta.env.VITE_ENABLE_DEMO_MODE !== "false";
      const demoBackedMenu = demoModeEnabled
        ? buildDemoBackedMenu({ menuItems: fetchedItems })
        : null;

      setMenuItems(demoBackedMenu?.menuItems || fetchedItems);
    } catch {
      setMenuItems(DEMO_MENU_ITEMS);
    } finally {
      setLoading(false);
    }
  };

  const deleteMenuItem = async (id) => {
    if (id?.startsWith("demo-")) {
      window.alert("This is a demo preview item. Add it as a real item before editing or deleting.");
      return;
    }

    const confirmDelete = window.confirm("Delete this menu item?");
    if (!confirmDelete) return;

    await api.delete(`/menu/${id}`);
    fetchMenuItems();
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="premium-label-pill mb-4">
            <Utensils size={18} />
            Menu Studio
          </div>
          <h1 className="text-4xl font-black text-slate-950">Menu Items</h1>
          <p className="mt-2 text-slate-500">
            Manage hotel room-service food items with premium visuals.
          </p>
        </div>

        <Link to="/admin/menu/add" className="premium-primary-button px-5 py-3">
          <Plus size={18} />
          Add Item
        </Link>
      </div>

      <div className="premium-card p-6">
        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-[2rem] bg-white/70 shadow-lg"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
            {menuItems.map((item) => (
              <motion.div
                key={item._id}
                layout
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
                className="overflow-hidden rounded-[2rem] border border-white bg-white/80 shadow-xl shadow-orange-100/40"
              >
                <div className="h-44 bg-orange-50">
                  {item.image ? (
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="h-full w-full object-cover transition duration-700 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400">
                      No Image
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-black text-slate-950">
                        {item.name}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {item.category?.name || "Uncategorized"}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {isDemoMenuItem(item) ? (
                        <span className="rounded-full bg-orange-50 px-3 py-2 text-xs font-black text-orange-600">
                          Demo
                        </span>
                      ) : (
                        <>
                          <Link
                            to={`/admin/menu/edit/${item._id}`}
                            className="rounded-xl bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
                            aria-label={`Edit ${item.name}`}
                          >
                            <Pencil size={18} />
                          </Link>

                          <button
                            onClick={() => deleteMenuItem(item._id)}
                            className="rounded-xl bg-red-50 p-2 text-red-500 transition hover:bg-red-100"
                            aria-label={`Delete ${item.name}`}
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <p className="mt-4 text-2xl font-black text-orange-500">
                    Rs. {item.price}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}

            {menuItems.length === 0 && (
              <div className="rounded-[2rem] border border-orange-100 bg-[#f8f6f2] p-10 text-center text-slate-500 md:col-span-2 xl:col-span-3">
                No menu items yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuManagement;
