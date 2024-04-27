import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const contactsPath = path.resolve("./db/contacts.json");

async function listContacts() {
  const contacts = await fs.readFile(contactsPath, { encoding: "utf-8" });

  return JSON.parse(contacts);
}

function writeContacts(contacts) {
  return fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));
}

async function getContactById(contactId) {
  const contacts = await listContacts();

  const contact = contacts.find((contact) => contact.id === contactId);

  if (typeof contact === "undefined") {
    return null;
  }

  return contact;
}

async function removeContact(contactId) {
  const contacts = await listContacts();

  const removedContactIndex = contacts.findIndex(
    (contact) => contact.id === contactId
  );

  const removedContact = contacts[removedContactIndex];

  if (removedContactIndex === -1) {
    return null;
  }

  contacts.splice(removedContactIndex, 1);

  await writeContacts(contacts);

  return removedContact;
}

async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const newContact = {
    id: crypto.randomUUID(),
    name,
    email,
    phone,
  };

  contacts.push(newContact);

  await writeContacts(contacts);

  return newContact;
}

export async function updateContact(id, name, email, phone) {
  const contacts = await listContacts();
  const contactIndex = contacts.findIndex((contact) => contact.id === id);

  if (contactIndex === -1) {
    return null;
  }

  const contactToUpdate = contacts[contactIndex];
  contacts[contactIndex] = {
    ...contactToUpdate,
    name: name !== undefined ? name : contactToUpdate.name,
    email: email !== undefined ? email : contactToUpdate.email,
    phone: phone !== undefined ? phone : contactToUpdate.phone,
  };

  await writeContacts(contacts);

  return contacts[contactIndex];
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
