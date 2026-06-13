const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "server", ".env") });
dotenv.config({ path: path.join(__dirname, ".env") });

require("./server/src/server");
