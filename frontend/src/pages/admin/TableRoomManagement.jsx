import { useEffect, useState } from "react";
import { Download, QrCode, Table2, Trash2 } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { motion } from "framer-motion";
import api from "../../services/api";
import {
  FieldError,
  SegmentedControl,
  fieldClass,
} from "../../components/form/PremiumFields";

const TableRoomManagement = () => {
  const [tableRooms, setTableRooms] = useState([]);
  const [formData, setFormData] = useState({
    type: "table",
    number: "",
    label: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchTableRooms = async () => {
    try {
      const res = await api.get("/table-rooms");
      setTableRooms(res.data.tableRooms || []);
    } catch {
      setTableRooms([]);
    }
  };

  useEffect(() => {
    fetchTableRooms();
  }, []);

  const createTableRoom = async (e) => {
    e.preventDefault();

    if (!formData.number.trim()) {
      setFormErrors({ number: "Table or room number is required." });
      return;
    }

    await api.post("/table-rooms", formData);

    setFormData({
      type: "table",
      number: "",
      label: "",
    });
    setFormErrors({});

    fetchTableRooms();
  };

  const deleteTableRoom = async (id) => {
    const confirmDelete = window.confirm("Delete this table/room?");
    if (!confirmDelete) return;

    await api.delete(`/table-rooms/${id}`);
    fetchTableRooms();
  };

  const downloadQr = (id, number) => {
    const canvas = document.getElementById(`qr-${id}`);
    if (!canvas) return;

    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");

    downloadLink.href = pngUrl;
    downloadLink.download = `QR-${number}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div>
      <div className="mb-8">
        <div className="premium-label-pill mb-4">
          <Table2 size={18} />
          QR Table Manager
        </div>
        <h1 className="text-4xl font-black text-slate-950">Tables & Rooms</h1>
        <p className="mt-2 text-slate-500">
          Create tables/rooms and manage downloadable QR ordering cards.
        </p>
      </div>

      <form
        onSubmit={createTableRoom}
        noValidate
        className="premium-card mb-8 p-6"
      >
        <h2 className="mb-5 text-2xl font-black text-slate-950">
          Create Table / Room
        </h2>

        <div className="grid gap-4 md:grid-cols-4">
          <SegmentedControl
            value={formData.type}
            onChange={(value) => setFormData({ ...formData, type: value })}
            options={[
              { value: "table", label: "Table", icon: Table2 },
              { value: "room", label: "Room", icon: QrCode },
            ]}
          />

          <div>
            <input
              value={formData.number}
              onChange={(e) => {
                setFormData({ ...formData, number: e.target.value });
                setFormErrors((prev) => ({ ...prev, number: "" }));
              }}
              placeholder="Number e.g. T1 / R101"
              className={fieldClass(formErrors.number)}
              aria-invalid={Boolean(formErrors.number)}
            />
            <FieldError>{formErrors.number}</FieldError>
          </div>

          <input
            value={formData.label}
            onChange={(e) =>
              setFormData({ ...formData, label: e.target.value })
            }
            placeholder="Label e.g. Near window"
            className="premium-input w-full p-4"
          />

          <button className="premium-primary-button p-4">
            <QrCode size={18} />
            Create
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
        {tableRooms.map((item) => (
          <motion.div
            key={item._id}
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            className="premium-card p-6"
          >
            <div className="flex justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-orange-500">
                  {item.type}
                </p>

                <h3 className="mt-1 text-3xl font-black text-slate-950">
                  {item.type.toUpperCase()} {item.number}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {item.label || "No label"}
                </p>
              </div>

              <button
                onClick={() => deleteTableRoom(item._id)}
                className="h-fit rounded-xl bg-red-50 p-2 text-red-500 transition hover:bg-red-100"
                aria-label={`Delete ${item.number}`}
              >
                <Trash2 size={20} />
              </button>
            </div>

            <div className="mt-6 flex justify-center">
              <div className="rounded-[2rem] bg-white p-4 shadow-lg">
                <QRCodeCanvas
                  id={`qr-${item._id}`}
                  value={item.qrUrl}
                  size={180}
                  level="H"
                  includeMargin={true}
                />
              </div>
            </div>

            <div className="mt-5 flex justify-center">
              <button
                onClick={() => downloadQr(item._id, item.number)}
                className="flex items-center gap-2 rounded-2xl bg-green-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition hover:bg-green-600"
              >
                <Download size={16} />
                Download QR
              </button>
            </div>

            <div className="mt-4 flex justify-center">
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  item.isActive
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {item.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {tableRooms.length === 0 && (
        <div className="premium-card mt-6 p-10 text-center text-slate-500">
          No table or room created yet.
        </div>
      )}
    </div>
  );
};

export default TableRoomManagement;
