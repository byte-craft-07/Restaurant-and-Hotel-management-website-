const sendTokenCookie = (res, token) => {
  const days = Number(process.env.COOKIE_EXPIRES_DAYS) || 15;

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: days * 24 * 60 * 60 * 1000,
  });
};

module.exports = sendTokenCookie;