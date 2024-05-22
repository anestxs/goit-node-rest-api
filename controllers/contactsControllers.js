import Contact from "../models/contact.js";

import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ owner: req.user.id });

    res.status(200).send(contacts);
  } catch (error) {
    console.error(error);
  }
};

export const getOneContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findOne({ _id: id, owner: req.user.id });

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
    const contact = await Contact.findOneAndDelete({
      owner: req.user.id,
      _id: id,
    });

    if (!contact) {
      return res.status(404).send({ message: "Not found" });
    }

    res.status(200).send(contact);
  } catch (error) {
    res.status(404).send({ message: "Not found" });
  }
};

export const createContact = async (req, res) => {
  const { error, value } = createContactSchema.validate(req.body);

  if (error) {
    return res.status(400).send({ message: error.message });
  }

  let { name, email, phone, favorite } = value;

  const contact = {
    name,
    email,
    phone,
    favorite,
    owner: req.user.id,
  };

  if (!favorite) {
    value.favorite = false;
  }

  try {
    const createdContact = await Contact.create({ contact });

    res.status(201).send(createdContact);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

export const updateContact = async (req, res) => {
  const { error, value } = updateContactSchema.validate(req.body);

  const { id } = req.params;

  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }

  console.log(id);

  try {
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: id, owner: req.user.id },
      value,
      {
        new: true,
      }
    );

    console.log(updatedContact);

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

  console.log(updatedContact);

  if (typeof updatedContact.favorite === "undefined") {
    return res.status(400).send({ message: "Missing field favorite" });
  }

  try {
    const contact = await Contact.findOneAndUpdate(
      { _id: id, owner: req.user.id },
      updatedContact,
      {
        new: true,
      }
    );

    res.status(200).send(contact);
  } catch (error) {
    res.status(400).send({ message: "Not found" });
  }
};
