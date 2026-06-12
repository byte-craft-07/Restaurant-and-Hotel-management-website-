const app = require("../backend/app");

module.exports = (req, res) => {
  const pathParam = req.query?.path;

  if (pathParam) {
    const forwardedPath = Array.isArray(pathParam)
      ? pathParam.join("/")
      : pathParam;
    const url = new URL(req.url || "/", "http://localhost");

    url.searchParams.delete("path");
    req.url = `/api/${forwardedPath}${url.search}`;
  }

  return app(req, res);
};
