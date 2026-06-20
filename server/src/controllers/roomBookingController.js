const HotelRoom = require("../models/HotelRoom");
const RoomBooking = require("../models/RoomBooking");
const ServiceRequest = require("../models/ServiceRequest");

const validBookingStatuses = [
  "pending",
  "confirmed",
  "checked-in",
  "checked-out",
  "cancelled",
];

const generateBookingCashCode = () =>
  `ROOM-${Math.floor(100000 + Math.random() * 900000)}`;

const calculateNights = (checkInDate, checkOutDate) => {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const diff = checkOut.getTime() - checkIn.getTime();
  const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));

  return nights > 0 ? nights : 0;
};

const populateBooking = (query) =>
  query
    .populate("room", "roomNumber type pricePerNight capacity status images")
    .populate("customer", "name phone email customerId");

const createBooking = async (req, res) => {
  try {
    const {
      roomId,
      guestName,
      phone,
      email,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      notes,
      paymentMethod,
    } = req.body;

    if (
      !roomId ||
      !guestName ||
      !phone ||
      !email ||
      !checkInDate ||
      !checkOutDate ||
      !numberOfGuests
    ) {
      return res.status(400).json({
        success: false,
        message: "All booking fields are required",
      });
    }

    const room = await HotelRoom.findById(roomId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Selected room not found",
      });
    }

    if (room.status !== "available") {
      return res.status(400).json({
        success: false,
        message: "Selected room is not available",
      });
    }

    if (Number(numberOfGuests) > room.capacity) {
      return res.status(400).json({
        success: false,
        message: `This room supports up to ${room.capacity} guests`,
      });
    }

    const nights = calculateNights(checkInDate, checkOutDate);

    if (!nights) {
      return res.status(400).json({
        success: false,
        message: "Check-out date must be after check-in date",
      });
    }

    const conflictingBooking = await RoomBooking.findOne({
      room: room._id,
      status: { $in: ["pending", "confirmed", "checked-in"] },
      checkInDate: { $lt: new Date(checkOutDate) },
      checkOutDate: { $gt: new Date(checkInDate) },
    }).select("_id status checkInDate checkOutDate");

    if (conflictingBooking) {
      return res.status(409).json({
        success: false,
        message: "This room is already reserved for the selected dates",
      });
    }

    const roomAmount = nights * room.pricePerNight;
    const safePaymentMethod = paymentMethod === "cash" ? "cash" : "online";
    const paymentStatus =
      safePaymentMethod === "cash" ? "pending_cash" : "paid";
    const bookingStatus =
      safePaymentMethod === "cash" ? "pending" : "confirmed";

    let cashCode;

    if (safePaymentMethod === "cash") {
      let isUnique = false;

      while (!isUnique) {
        cashCode = generateBookingCashCode();
        const existingBooking = await RoomBooking.findOne({ cashCode });
        isUnique = !existingBooking;
      }
    }

    const booking = await RoomBooking.create({
      room: room._id,
      customer: req.user?._id || null,
      guestName,
      phone,
      email,
      checkInDate,
      checkOutDate,
      numberOfGuests: Number(numberOfGuests),
      nights,
      roomAmount,
      status: bookingStatus,
      statusHistory: [{ status: bookingStatus }],
      paymentMethod: safePaymentMethod,
      paymentStatus,
      cashCode,
      paidAt: safePaymentMethod === "online" ? new Date() : null,
      notes,
      billingSummary: {
        roomBooking: roomAmount,
        finalAmount: roomAmount,
      },
    });

    room.status = "booked";
    await room.save();

    const fullBooking = await populateBooking(RoomBooking.findById(booking._id));

    res.status(201).json({
      success: true,
      message: "Room booking created successfully",
      booking: fullBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getBookings = async (req, res) => {
  try {
    const filter =
      req.user.role === "admin" ? {} : { customer: req.user._id };

    if (req.query.status && req.user.role === "admin") {
      filter.status = req.query.status;
    }

    const bookings = await populateBooking(
      RoomBooking.find(filter).sort({ createdAt: -1 })
    );

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await populateBooking(RoomBooking.findById(req.params.id));

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (
      req.user.role !== "admin" &&
      String(booking.customer?._id) !== String(req.user._id)
    ) {
      return res.status(403).json({
        success: false,
        message: "Not allowed to view this booking",
      });
    }

    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!validBookingStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status",
      });
    }

    const roomStatusByBookingStatus = {
      confirmed: "booked",
      "checked-in": "occupied",
      "checked-out": "cleaning",
      cancelled: "available",
    };

    const booking = await RoomBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const updateData = { status };

    if (booking.status !== status) {
      updateData.$push = {
        statusHistory: { status, changedAt: new Date() },
      };
    }

    if (status === "confirmed" && booking.paymentMethod === "cash") {
      updateData.paymentStatus = "paid";
      updateData.paidAt = booking.paidAt || new Date();
    }

    if (status === "cancelled" && booking.paymentMethod === "cash") {
      updateData.paymentStatus =
        booking.paymentStatus === "paid" ? "paid" : "failed";
    }

    const updatedBooking = await RoomBooking.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (roomStatusByBookingStatus[status]) {
      await HotelRoom.findByIdAndUpdate(updatedBooking.room, {
        status: roomStatusByBookingStatus[status],
      });
    }

    const fullBooking = await populateBooking(RoomBooking.findById(updatedBooking._id));

    res.json({
      success: true,
      message: "Booking status updated",
      booking: fullBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getRoomBillingSummary = async (req, res) => {
  try {
    const booking = await populateBooking(RoomBooking.findById(req.params.id));

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (
      req.user.role !== "admin" &&
      String(booking.customer?._id) !== String(req.user._id)
    ) {
      return res.status(403).json({
        success: false,
        message: "Not allowed to view this bill",
      });
    }

    const serviceRequests = await ServiceRequest.find({
      roomBooking: booking._id,
      status: { $ne: "cancelled" },
    });

    const serviceTotals = serviceRequests.reduce(
      (totals, request) => {
        const amount = Number(request.estimatedAmount || 0);

        if (request.type === "laundry") {
          totals.laundry += amount;
        } else if (["event"].includes(request.type)) {
          totals.eventBooking += amount;
        } else if (
          ["food", "water", "water-bottle", "towels", "cleaning", "housekeeping"].includes(
            request.type
          )
        ) {
          totals.roomService += amount;
        } else {
          totals.otherServices += amount;
        }

        return totals;
      },
      {
        roomService: 0,
        laundry: 0,
        eventBooking: 0,
        otherServices: 0,
      }
    );

    const billing = {
      roomBooking: booking.roomAmount,
      foodOrders: booking.billingSummary.foodOrders || 0,
      roomService: (booking.billingSummary.roomService || 0) + serviceTotals.roomService,
      laundry: (booking.billingSummary.laundry || 0) + serviceTotals.laundry,
      eventBooking:
        (booking.billingSummary.eventBooking || 0) + serviceTotals.eventBooking,
      otherServices:
        (booking.billingSummary.otherServices || 0) + serviceTotals.otherServices,
    };

    const finalAmount = Object.values(billing).reduce(
      (sum, amount) => sum + Number(amount || 0),
      0
    );

    res.json({
      success: true,
      booking,
      billing: {
        ...billing,
        finalAmount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  getRoomBillingSummary,
};
