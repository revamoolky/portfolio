"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var contacts_exports = {};
__export(contacts_exports, {
  default: () => contacts_default
});
module.exports = __toCommonJS(contacts_exports);
var import_express = __toESM(require("express"));
var import_contact_svc = __toESM(require("../services/contact-svc"));
const router = import_express.default.Router();
router.get("/", async (_, res) => {
  try {
    const contacts = await import_contact_svc.default.index();
    res.json(contacts);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.get("/:id", async (req, res) => {
  try {
    const contact = await import_contact_svc.default.get(req.params.id);
    if (contact) res.json(contact);
    else res.status(404).send("Contact not found");
  } catch (err) {
    res.status(500).send(err);
  }
});
router.post("/", async (req, res) => {
  try {
    const newContact = req.body;
    const created = await import_contact_svc.default.create(newContact);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).send(err);
  }
});
router.put("/:id", async (req, res) => {
  try {
    const updated = await import_contact_svc.default.update(req.params.id, req.body);
    if (updated) res.json(updated);
    else res.status(404).send("Contact not found");
  } catch (err) {
    res.status(500).send(err);
  }
});
router.delete("/:id", async (req, res) => {
  try {
    await import_contact_svc.default.remove(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(404).send(err);
  }
});
var contacts_default = router;
