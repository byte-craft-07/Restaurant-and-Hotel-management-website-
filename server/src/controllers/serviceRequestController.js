const ServiceRequest = require("../models/ServiceRequest");
const TableRoom = require("../models/TableRoom");
const HotelRoom = require("../models/HotelRoom");
const RoomBooking = require("../models/RoomBooking");

const populateRequest = (query) =>
  query
    .populate("tableRoom", "type number label")
    .populate("hotelRoom", "roomNumber type status")
    .populate("roomBooking", "guestName checkInDate checkOutDate status")
    .populate("customer", "name phone email customerId");

const createServiceRequest = async (req, res) => {
  try {
    const {
      qrToken,
      roomBookingId,
      hotelRoomId,
      type = "waiter",
      note = "",
      estimatedAmount = 0,
    } = req.body;

    if (!qrToken && !roomBookingId && !hotelRoomId) {
      return res.status(400).json({
        success: false,
        message: "Please select a room booking or scan your room QR first.",
      });
    }

    let tableRoom = null;
    let hotelRoom = null;
    let roomBooking = null;

    if (qrToken) {
      tableRoom = await TableRoom.findOne({
        qrToken,
        isActive: true,
      });

      if (!tableRoom) {
        return res.status(404).json({
          success: false,
          message: "Invalid or inactive QR code",
        });
      }
    }

    if (roomBookingId) {
      roomBooking = await RoomBooking.findById(roomBookingId);

      if (!roomBooking) {
        return res.status(404).json({
          success: false,
          message: "Room booking not found",
        });
      }

      if (
        req.user.role !== "admin" &&
        String(roomBooking.customer) !== String(req.user._id)
      ) {
        return res.status(403).json({
          success: false,
          message: "Not allowed to request service for this booking",
        });
      }

      hotelRoom = roomBooking.room;
    } else if (hotelRoomId) {
      hotelRoom = await HotelRoom.findById(hotelRoomId);

      if (!hotelRoom) {
        return res.status(404).json({
          success: false,
          message: "Hotel room not found",
        });
      }

      if (req.user.role !== "admin") {
        roomBooking = await RoomBooking.findOne({
          room: hotelRoom._id,
          customer: req.user._id,
          status: { $in: ["confirmed", "checked-in"] },
        });

        if (!roomBooking) {
          return res.status(403).json({
            success: false,
            message: "An active booking is required for this room service request",
          });
        }
      }
    }

    const serviceRequest = await ServiceRequest.create({
      tableRoom: tableRoom?._id || null,
      hotelRoom: hotelRoom?._id || hotelRoom || null,
      roomBooking: roomBooking?._id || null,
      customer: req.user?._id || null,
      type,
      note,
      estimatedAmount: Number(estimatedAmount) || 0,
    });

    const fullRequest = await populateRequest(
      ServiceRequest.findById(serviceRequest._id)
    );

    const io = req.app.get("io");
    if (io) {
      io.emit("service_request_created", fullRequest);
    }

    res.status(201).json({
      success: true,
      message: "Service request sent to staff.",
      serviceRequest: fullRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyServiceRequests = async (req, res) => {
  try {
    const serviceRequests = await populateRequest(
      ServiceRequest.find({ customer: req.user._id }).sort({ createdAt: -1 })
    );

    res.json({
      success: true,
      count: serviceRequests.length,
      serviceRequests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getServiceRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status
      ? { status }
      : { status: { $in: ["pending", "acknowledged"] } };

    const serviceRequests = await populateRequest(
      ServiceRequest.find(filter).sort({ createdAt: -1 })
    );

    res.json({
      success: true,
      count: serviceRequests.length,
      serviceRequests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateServiceRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const update = { status };

    if (status === "acknowledged") {
      update.acknowledgedAt = new Date();
    }

    if (status === "resolved" || status === "cancelled") {
      update.resolvedAt = new Date();
    }

    const serviceRequest = await populateRequest(
      ServiceRequest.findByIdAndUpdate(req.params.id, update, {
        new: true,
        runValidators: true,
      })
    );

    if (!serviceRequest) {
      return res.status(404).json({
        success: false,
        message: "Service request not found",
      });
    }

    const io = req.app.get("io");
    if (io) {
      io.emit("service_request_updated", serviceRequest);
    }

    res.json({
      success: true,
      message: "Service request updated.",
      serviceRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createServiceRequest,
  getMyServiceRequests,
  getServiceRequests,
  updateServiceRequestStatus,
};
