"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var import_express = __toESM(require("express"));
var import_path = __toESM(require("path"));
var import_dotenv = __toESM(require("dotenv"));
var import_mongoose = __toESM(require("mongoose"));
var import_contacts = __toESM(require("./routes/contacts.js"));
import_dotenv.default.config();
const app = (0, import_express.default)();
const PORT = process.env.PORT || 3e3;
const STATIC = process.env.STATIC || "../../app/dist";
const staticDir = import_path.default.resolve(__dirname, STATIC);
console.log("STATIC env:", process.env.STATIC);
console.log("Resolved staticDir:", staticDir);
const { MONGO_USER, MONGO_PWD, MONGO_CLUSTER } = process.env;
const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@${MONGO_CLUSTER}/?retryWrites=true&w=majority`;
import_mongoose.default.connect(uri).then(() => {
  console.log("\u2705 MongoDB connected");
});
app.use(import_express.default.json());
app.use("/api/contacts", import_contacts.default);
app.use(import_express.default.static(staticDir));
app.get("/{*splat}", (req, res) => {
  const filePath = import_path.default.join(staticDir, "index.html");
  console.log("Serving SPA index from:", filePath);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("\u274C Failed to serve index.html:", err);
      res.status(500).send("Internal Server Error");
    }
  });
});
app.listen(PORT, () => {
  console.log(`\u{1F680} Server running at http://localhost:${PORT}`);
});
