import e from "cors";
import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required().email(),
  phone: Joi.number().required(),
  favorite: Joi.boolean().required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.number(),
  favorite: Joi.boolean(),
}).or("name", "email", "phone", "favorite");
