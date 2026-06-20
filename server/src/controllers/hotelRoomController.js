const HotelRoom = require("../models/HotelRoom");
const ServiceRequest = require("../models/ServiceRequest");
const RoomBooking = require("../models/RoomBooking");

const validStatuses = ["available", "booked", "occupied", "cleaning", "maintenance"];

const parseList = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const getImagePaths = (req, fallback = []) => {
  const uploaded = (req.files || []).map((file) => `/uploads/${file.filename}`);
  const provided = parseList(req.body.images);

  return uploaded.length || provided.length ? [...provided, ...uploaded] : fallback;
};

const normalizeRoomPayload = (body, existingImages = []) => {
  const payload = {};

  if (body.roomNumber !== undefined) {
    payload.roomNumber = String(body.roomNumber).trim();
  }

  if (body.type !== undefined) {
    payload.type = String(body.type).trim();
  }

  if (body.pricePerNight !== undefined) {
    payload.pricePerNight = Number(body.pricePerNight);
  }

  if (body.capacity !== undefined) {
    payload.capacity = Number(body.capacity);
  }

  if (body.description !== undefined) {
    payload.description = String(body.description).trim();
  }

  if (body.status !== undefined) {
    payload.status = String(body.status).trim();
  }

  if (body.amenities !== undefined) {
    payload.amenities = parseList(body.amenities);
  }

  if (body.isFeatured !== undefined) {
    payload.isFeatured = body.isFeatured === "true" || body.isFeatured === true;
  }

  payload.images = existingImages;

  return payload;
};

const validateRoomPayload = (payload, partial = false) => {
  if (!partial || payload.roomNumber !== undefined) {
    if (!payload.roomNumber) return "Room number is required";
  }

  if (!partial || payload.type !== undefined) {
    if (!payload.type) return "Room type/category is required";
  }

  if (!partial || payload.pricePerNight !== undefined) {
    if (!Number.isFinite(payload.pricePerNight) || payload.pricePerNight < 0) {
      return "Price per night must be a valid number";
    }
  }

  if (!partial || payload.capacity !== undefined) {
    if (!Number.isInteger(payload.capacity) || payload.capacity < 1) {
      return "Capacity must be at least 1";
    }
  }

  if (payload.status !== undefined && !validStatuses.includes(payload.status)) {
    return "Invalid room status";
  }

  return "";
};

const sendRoomError = (res, error) => {
  if (error?.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Room number already exists",
    });
  }

  if (error?.name === "ValidationError" || error?.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: error.message || "Unable to save room",
  });
};

const createRoom = async (req, res) => {
  try {
    const roomData = normalizeRoomPayload(req.body, getImagePaths(req));
    const validationMessage = validateRoomPayload(roomData);

    if (validationMessage) {
      return res.status(400).json({
        success: false,
        message: validationMessage,
      });
    }

    const room = await HotelRoom.create(roomData);

    res.status(201).json({
      success: true,
      message: "Room added successfully",
      room,
    });
  } catch (error) {
    sendRoomError(res, error);
  }
};

const getRooms = async (req, res) => {
  try {
    const { status, available, featured } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (available === "true") filter.status = "available";
    if (featured === "true") filter.isFeatured = true;

    const rooms = await HotelRoom.find(filter).sort({
      isFeatured: -1,
      pricePerNight: 1,
      roomNumber: 1,
    });

    res.json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getRoomById = async (req, res) => {
  try {
    const room = await HotelRoom.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    res.json({
      success: true,
      room,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateRoom = async (req, res) => {
  try {
    const existingRoom = await HotelRoom.findById(req.params.id);

    if (!existingRoom) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    const updateData = normalizeRoomPayload(
      req.body,
      getImagePaths(req, existingRoom.images)
    );
    const validationMessage = validateRoomPayload(updateData, true);

    if (validationMessage) {
      return res.status(400).json({
        success: false,
        message: validationMessage,
      });
    }

    if (updateData.status === "available") {
      const activeBooking = await RoomBooking.exists({
        room: existingRoom._id,
        status: { $in: ["pending", "confirmed", "checked-in"] },
      });

      if (activeBooking) {
        return res.status(409).json({
          success: false,
          message: "Cancel or complete the active booking before marking this room available",
        });
      }
    }

    const room = await HotelRoom.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: "Room updated successfully",
      room,
    });
  } catch (error) {
    sendRoomError(res, error);
  }
};

const deleteRoom = async (req, res) => {
  try {
    const room = await HotelRoom.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    const activeBooking = await RoomBooking.exists({
      room: room._id,
      status: { $in: ["pending", "confirmed", "checked-in"] },
    });

    if (activeBooking) {
      return res.status(409).json({
        success: false,
        message: "This room has an active booking and cannot be deleted",
      });
    }

    await room.deleteOne();

    res.json({
      success: true,
      message: "Room deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getRoomStatusSummary = async (req, res) => {
  try {
    const statuses = ["available", "booked", "occupied", "cleaning", "maintenance"];
    const counts = await HotelRoom.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const summary = statuses.reduce((result, status) => {
      result[status] = 0;
      return result;
    }, {});

    counts.forEach((item) => {
      summary[item._id] = item.count;
    });

    summary.serviceRequested = await ServiceRequest.countDocuments({
      status: { $in: ["pending", "acknowledged"] },
      $or: [{ hotelRoom: { $ne: null } }, { roomBooking: { $ne: null } }],
    });

    res.json({
      success: true,
      summary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  getRoomStatusSummary,
};
