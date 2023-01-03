const db = require("../models/contacts");

async function getContacts(req, res, next) {
  const contacts = await db.listContacts();
  return res.status(200).json(contacts);
}

async function getContact(req, res, next) {
  const { id } = req.params;

  const contact = await db.getContactById(id);
  if (!contact) {
    return next(res.status(404).json({ message: "Not found" }));
  }
  return res.status(200).json(contact);
}

async function createContact(req, res, next) {
  const { name, email, phone } = req.body;

  const newContact = await db.addContact(name, email, phone);
  return res.status(201).json(newContact);
}

async function deleteContact(req, res, next) {
  const { id } = req.params;

  const contact = await db.getContactById(id);

  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }
  await db.removeContact(id);

  return res.status(200).json({ message: "contact deleted" });
}

async function updateContact(req, res, next) {
  const { id } = req.params;
  const body = req.body;

  const updateContacts = await db.updateContact(id, body);

  if (!updateContacts) {
    return res.status(404).json({ message: "Not found" });
  }

  return res.status(200).json(updateContacts);
}

module.exports = {
  getContacts,
  getContact,
  createContact,
  deleteContact,
  updateContact,
};
