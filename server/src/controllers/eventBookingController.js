const EventBooking = require("../models/EventBooking");

const createEventBooking = async (req, res) => {
  try {
    const {
      eventType,
      eventDate,
      guestCount,
      budget,
      tableRoom,
      tablePreference,
      foodPreferences,
      decorationPreferences,
      specialRequests,
      contactPhone,
    } = req.body;

    if (!eventType || !eventDate || !guestCount) {
      return res.status(400).json({
        success: false,
        message: "Event type, date and guest count are required",
      });
    }

    const booking = await EventBooking.create({
      customer: req.user._id,
      eventType,
      eventDate,
      guestCount,
      budget,
      tableRoom: tableRoom || null,
      tablePreference,
      foodPreferences,
      decorationPreferences,
      specialRequests,
      contactPhone: contactPhone || req.user.phone || "",
      statusHistory: [{ status: "new" }],
    });

    const fullBooking = await EventBooking.findById(booking._id)
      .populate("customer", "name email phone")
      .populate("tableRoom", "type number label");

    res.status(201).json({
      success: true,
      message: "Event request submitted successfully",
      booking: fullBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyEventBookings = async (req, res) => {
  try {
    const bookings = await EventBooking.find({ customer: req.user._id }).sort({
      createdAt: -1,
    }).populate("tableRoom", "type number label");

    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllEventBookings = async (req, res) => {
  try {
    const bookings = await EventBooking.find()
      .populate("customer", "name email phone")
      .populate("tableRoom", "type number label")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateEventBooking = async (req, res) => {
  try {
    const { status, adminNote } = req.body;

    const existingBooking = await EventBooking.findById(req.params.id);

    if (!existingBooking) {
      return res.status(404).json({
        success: false,
        message: "Event request not found",
      });
    }

    const update = { status, adminNote };

    if (status && existingBooking.status !== status) {
      update.$push = {
        statusHistory: { status, changedAt: new Date() },
      };
    }

    const booking = await EventBooking.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    )
      .populate("customer", "name email phone")
      .populate("tableRoom", "type number label");

    res.json({
      success: true,
      message: "Event request updated",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createEventBooking,
  getMyEventBookings,
  getAllEventBookings,
  updateEventBooking,
};
