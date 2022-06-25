require("dotenv").config();
const path = require("path");

module.exports = {
  rootPath: path.resolve(__dirname, "../../"),
  serviceName: "api",
  urlDb: process.env.MONGO_URL,
  jwtKey: process.env.SECRET,
};
