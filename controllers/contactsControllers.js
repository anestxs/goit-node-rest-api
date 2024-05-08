import Contact from "../models/contact.js";

import contactsService from "../services/contactsServices.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    console.log(contacts);

    res.status(200).send(contacts);
  } catch (error) {
    console.error(error);
  }

  res.send(contacts);
};

export const getOneContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await contactsService.getContactById(id);

    if (!contact) {
      return res.status(404).send({ message: "Not found" });
    }

    res.status(200).send(contact);
  } catch (error) {
    res.status(404).send({ message: "Something went wrong!" });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await contactsService.removeContact(id);

    if (!contact) {
      return res.status(404).send({ message: "Not found" });
    }

    res.status(200).send(contact);
  } catch (error) {
    res.status(404).send({ message: "Not found" });
  }
};

export const createContact = async (req, res) => {
  try {
    const { error, value } = createContactSchema.validate(req.body);

    const { name, email, phone, favorite } = value;

    console.log(value);

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    await Contact.create({ name, email, phone, favorite });

    // const newContact = await contactsService.addContact(name, email, phone);

    res.status(201).send("Contact");
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

export const updateContact = async (req, res) => {
  const { error, value } = updateContactSchema.validate(req.body);

  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }

  const { name, email, phone } = value;
  try {
    const updatedContact = await contactsService.updateContact(
      req.params.id,
      name,
      email,
      phone.toString()
    );

    if (!updatedContact) {
      return res.status(404).send({ message: "Not found" });
    }

    return res.status(200).send(updatedContact);
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: "An error occurred" });
  }
};
