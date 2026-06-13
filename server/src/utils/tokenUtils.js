const crypto = require("crypto");

const generateQrToken = () => {
  return crypto.randomBytes(24).toString("hex");
};

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = {
  generateQrToken,
  generateVerificationCode,
};