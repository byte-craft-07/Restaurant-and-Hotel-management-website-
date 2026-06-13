const TableRoom = require("../models/TableRoom");
const VerificationSession = require("../models/VerificationSession");
const {
  generateQrToken,
  generateVerificationCode,
} = require("../utils/tokenUtils");

// Admin creates room QR
const createTableRoom = async (req, res) => {
  try {
    const { number, label } = req.body;

    if (!number) {
      return res.status(400).json({
        success: false,
        message: "Room number is required",
      });
    }

    const qrToken = generateQrToken();

    const qrUrl = `${process.env.CLIENT_URL}/qr/${qrToken}`;

    const tableRoom = await TableRoom.create({
      type: "room",
      number,
      label,
      qrToken,
      qrUrl,
    });

    res.status(201).json({
      success: true,
      message: "Room QR created successfully",
      tableRoom,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin gets all room QR records
const getTableRooms = async (req, res) => {
  try {
    const tableRooms = await TableRoom.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tableRooms.length,
      tableRooms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPendingVerificationSessions = async (req, res) => {
  try {
    const sessions = await VerificationSession.find({
      isVerified: false,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    })
      .populate("tableRoom", "type number label")
      .populate("customer", "name phone email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      sessions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getQrContext = async (req, res) => {
  try {
    const { token } = req.params;

    const tableRoom = await TableRoom.findOne({
      qrToken: token,
      isActive: true,
    }).select("type number label isActive");

    if (!tableRoom) {
      return res.status(404).json({
        success: false,
        message: "Invalid or inactive QR code",
      });
    }

    res.json({
      success: true,
      tableRoom,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const scanQrToken = async (req, res) => {
  try {
    const { token } = req.params;
    const {
      cartPreview = "[]",
      numberOfPeople = 1,
      note = "",
      totalAmount = 0,
    } = req.query;
    let parsedCartPreview = [];

    try {
      parsedCartPreview =
        typeof cartPreview === "string" ? JSON.parse(cartPreview) : cartPreview;
    } catch {
      parsedCartPreview = [];
    }

    const tableRoom = await TableRoom.findOne({
      qrToken: token,
      isActive: true,
    });

    if (!tableRoom) {
      return res.status(404).json({
        success: false,
        message: "Invalid or inactive QR code",
      });
    }

    const verificationCode = generateVerificationCode();

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const session = await VerificationSession.create({
      tableRoom: tableRoom._id,
      customer: req.user?._id || null,
      verificationCode,
      isVerified: true,
      expiresAt,
      cartPreview: parsedCartPreview,
      numberOfPeople,
      note,
      totalAmount,
    });
    const fullSession = await VerificationSession.findById(session._id)
      .populate("tableRoom", "type number label")
      .populate("customer", "name phone email");

    const io = req.app.get("io");
    if (io) {
      io.emit("table_session_created", fullSession);
    }

    res.json({
      success: true,
      message: "Room service session created.",
      data: {
        sessionId: session._id,
        session: fullSession,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Customer verifies code
const verifySessionCode = async (req, res) => {
  try {
    const { sessionId, verificationCode } = req.body;

    if (!sessionId || !verificationCode) {
      return res.status(400).json({
        success: false,
        message: "Session ID and verification code are required",
      });
    }

    const session = await VerificationSession.findById(sessionId).populate(
      "tableRoom"
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    if (session.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Verification session expired",
      });
    }

    if (session.verificationCode !== verificationCode) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code",
      });
    }

    session.isVerified = true;

    if (req.user) {
      session.customer = req.user._id;
    }

    await session.save();

    const io = req.app.get("io");
    if (io) {
      io.emit("verification_session_verified", session._id);
    }

    res.json({
      success: true,
      message: "Session verified successfully",
      session: {
        id: session._id,
        isVerified: session.isVerified,
        tableRoom: session.tableRoom,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin update room QR
const updateTableRoom = async (req, res) => {
  try {
    const tableRoom = await TableRoom.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!tableRoom) {
      return res.status(404).json({
        success: false,
        message: "Room QR not found",
      });
    }

    res.json({
      success: true,
      message: "Room QR updated successfully",
      tableRoom,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin delete room QR
const deleteTableRoom = async (req, res) => {
  try {
    const tableRoom = await TableRoom.findByIdAndDelete(req.params.id);

    if (!tableRoom) {
      return res.status(404).json({
        success: false,
        message: "Room QR not found",
      });
    }

    res.json({
      success: true,
      message: "Room QR deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createTableRoom,
  getTableRooms,
  getQrContext,
  getPendingVerificationSessions,
  scanQrToken,
  verifySessionCode,
  updateTableRoom,
  deleteTableRoom,
};
