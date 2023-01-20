const { Contact } = require("../models/contacts");

async function getContacts(req, res, next) {
  const { page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;

  if (favorite) {
    const favoriteContacts = await Contact.find({ favorite: true });
    return res.status(200).json(favoriteContacts);
  }

  const contacts = await Contact.find({}).skip(skip).limit(limit);

  return res.status(200).json(contacts);
}

async function getContact(req, res, next) {
  const { id } = req.params;

  const contact = await Contact.findById(id);

  if (!contact) {
    return next(res.status(404).json({ message: "Not found" }));
  }
  return res.status(200).json(contact);
}

async function createContact(req, res, next) {
  const { name, email, phone, favorite } = req.body;

  const newContact = await Contact.create({ name, email, phone, favorite });
  return res.status(201).json(newContact);
}

async function deleteContact(req, res, next) {
  const { id } = req.params;

  const contact = await Contact.findByIdAndRemove(id);

  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }

  return res.status(200).json({ message: "contact deleted" });
}

async function updateContact(req, res, next) {
  const { id } = req.params;
  const body = req.body;

  const updateContacts = await Contact.findByIdAndUpdate(id, body, {
    new: true,
  });

  if (!updateContacts) {
    return res.status(404).json({ message: "Not found" });
  }

  return res.status(200).json(updateContacts);
}

async function updateStatusContact(req, res, next) {
  const { id } = req.params;
  const body = req.body;

  if (!body) {
    return res.status(400).json({ message: "missing field favorite" });
  }

  const updateFavoriteContact = await Contact.findByIdAndUpdate(id, body, {
    new: true,
  });

  if (!updateFavoriteContact) {
    return res.status(404).json({ message: "Not found" });
  }
  return res.status(200).json(updateFavoriteContact);
}

module.exports = {
  getContacts,
  getContact,
  createContact,
  deleteContact,
  updateContact,
  updateStatusContact,
};
