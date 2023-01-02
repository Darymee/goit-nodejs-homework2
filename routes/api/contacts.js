const express = require("express");
const router = express.Router();
const { validation } = require("../schemas/contacts");

const db = require("../../models/contacts");

router.get("/", async (req, res, next) => {
  const contacts = await db.listContacts();
  return res.status(200).json(contacts);
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  const contact = await db.getContactById(id);

  if (!contact) return res.status(404).json({ message: "Not found" });

  return res.status(200).json(contact);
});

router.post("/", async (req, res, next) => {
  const { name, email, phone } = req.body;

  const { error } = validation.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const newContact = await db.addContact(name, email, phone);

  return res.status(201).json(newContact);
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  const contact = await db.getContactById(id);

  if (!contact) return res.status(404).json({ message: "Not found" });

  await db.removeContact(id);

  return res.status(200).json({ message: "contact deleted" });
});

router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const body = req.body;

  const { error } = validation.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const updateContacts = await db.updateContact(id, body);

  if (!updateContacts) return res.status(404).json({ message: "Not found" });

  return res.status(200).json(updateContacts);
});

module.exports = router;
