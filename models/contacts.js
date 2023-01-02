const { nanoid } = require("nanoid");
const fs = require("fs/promises");

const path = require("path");

const contactsPath = path.resolve(
  "../goit-nodejs-homework2/models",
  "contacts.json"
);

const listContacts = async () => {
  try {
    const contactsListRaw = await fs.readFile(contactsPath);
    const contactList = JSON.parse(contactsListRaw);
    console.log(contactsPath);
    console.log(contactList);
    return contactList;
  } catch (error) {
    console.error(error);
  }
};

const getContactById = async (contactId) => {
  try {
    const contacts = await listContacts();
    const currentContact = contacts.find(
      (contact) => contact.id === contactId.toString()
    );
    return currentContact;
  } catch (error) {
    console.error(error);
  }
};

const removeContact = async (contactId) => {
  try {
    const contacts = await listContacts();
    const updatedContacts = contacts.filter(
      (contact) => contact.id !== contactId.toString()
    );
    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2));
  } catch (error) {
    console.error(error);
  }
};

const addContact = async (name, email, phone) => {
  const id = nanoid();
  const contact = { id, name, email, phone };

  try {
    const contacts = await listContacts();
    contacts.push(contact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return contact;
  } catch (error) {
    console.error(error);
  }
};

const updateContact = async (contactId, { name, email, phone }) => {
  try {
    const contacts = await listContacts();

    const contactToFind = contacts.findIndex(
      (contact) => contact.id === contactId
    );

    if (contactToFind === -1) return false;

    contacts[contactToFind] = { id: contactId, name, email, phone };

    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

    return contacts;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
