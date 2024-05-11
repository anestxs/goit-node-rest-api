import Contact from "../models/contact.js";

import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();

    res.status(200).send(contacts);
  } catch (error) {
    console.error(error);
  }
};

export const getOneContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);

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
    const contact = await Contact.findByIdAndDelete(id);

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

    let { name, email, phone, favorite } = value;

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    if (!favorite) {
      value.favorite = false;
    }

    await Contact.create({ name, email, phone, favorite });

    res.status(201).send(value);
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
    const updatedContact = await Contact.findByIdAndUpdate(
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

export const updateFavorite = async (req, res) => {
  const { id } = req.params;
  const updatedContact = req.body;

  if (!updatedContact.favorite) {
    return res.status(400).send({ message: "Missing field favorite" });
  }
  try {
    const contact = await Contact.findByIdAndUpdate(id, updatedContact, {
      new: true,
    });

    res.status(200).send(contact);
  } catch (error) {
    res.status(400).send({ message: "Not found" });
  }
};
