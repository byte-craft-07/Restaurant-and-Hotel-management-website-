const ServiceRequest = require("../models/ServiceRequest");
const TableRoom = require("../models/TableRoom");

const populateRequest = (query) =>
  query
    .populate("tableRoom", "type number label")
    .populate("customer", "name phone email customerId");

const createServiceRequest = async (req, res) => {
  try {
    const { qrToken, type = "waiter", note = "" } = req.body;

    if (!qrToken) {
      return res.status(400).json({
        success: false,
        message: "Please scan your room QR first.",
      });
    }

    const tableRoom = await TableRoom.findOne({
      qrToken,
      isActive: true,
    });

    if (!tableRoom) {
      return res.status(404).json({
        success: false,
        message: "Invalid or inactive QR code",
      });
    }

    const serviceRequest = await ServiceRequest.create({
      tableRoom: tableRoom._id,
      customer: req.user?._id || null,
      type,
      note,
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
  getServiceRequests,
  updateServiceRequestStatus,
};
