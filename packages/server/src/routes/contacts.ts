import express, { Request, Response } from "express";
import Contacts from "../services/contact-svc";

const router = express.Router();

// GET /api/contacts - list all contacts
router.get("/", async (_, res) => {
  try {
    const contacts = await Contacts.index();
    res.json(contacts);
  } catch (err) {
    res.status(500).send(err);
  }
});

// GET /api/contacts/:id - get one contact by id
router.get("/:id", async (req, res) => {
  try {
    const contact = await Contacts.get(req.params.id);
    if (contact) res.json(contact);
    else res.status(404).send("Contact not found");
  } catch (err) {
    res.status(500).send(err);
  }
});

// POST /api/contacts - create a new contact
router.post("/", async (req, res) => {
  try {
    const newContact = req.body;
    const created = await Contacts.create(newContact);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).send(err);
  }
});

// PUT /api/contacts/:id - update a contact by id
router.put("/:id", async (req, res) => {
  try {
    const updated = await Contacts.update(req.params.id, req.body);
    if (updated) res.json(updated);
    else res.status(404).send("Contact not found");
  } catch (err) {
    res.status(500).send(err);
  }
});

// DELETE /api/contacts/:id - delete a contact by id
router.delete("/:id", async (req, res) => {
  try {
    await Contacts.remove(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(404).send(err);
  }
});

export default router;
