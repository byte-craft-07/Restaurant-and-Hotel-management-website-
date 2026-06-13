let app;

const loadApp = () => {
  if (!app) {
    app = require("../server/src/app");
  }

  return app;
};

module.exports = (req, res) => {
  try {
    const expressApp = loadApp();
    const pathParam = req.query?.path;

    if (pathParam) {
      const forwardedPath = Array.isArray(pathParam)
        ? pathParam.join("/")
        : pathParam;
      const url = new URL(req.url || "/", "http://localhost");

      url.searchParams.delete("path");
      req.url = `/api/${forwardedPath}${url.search}`;
    }

    return expressApp(req, res);
  } catch (error) {
    console.error("Vercel API function failed:", error);

    return res.status(500).json({
      success: false,
      status: "function_load_error",
      message: error.message,
      stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
    });
  }
};
