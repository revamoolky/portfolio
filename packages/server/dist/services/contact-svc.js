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
var contact_svc_exports = {};
__export(contact_svc_exports, {
  default: () => contact_svc_default
});
module.exports = __toCommonJS(contact_svc_exports);
var import_contact = __toESM(require("../models/contact"));
async function index() {
  return await import_contact.default.find().exec();
}
async function get(id) {
  return await import_contact.default.findById(id).exec();
}
async function create(contact) {
  const created = new import_contact.default(contact);
  return await created.save();
}
async function update(id, data) {
  return await import_contact.default.findByIdAndUpdate(id, data, { new: true }).exec();
}
async function remove(id) {
  const result = await import_contact.default.findByIdAndDelete(id).exec();
  return result !== null;
}
var contact_svc_default = { index, get, create, update, remove };
