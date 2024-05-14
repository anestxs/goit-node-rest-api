import Joi from "joi";

export const createUserSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
  subscription: Joi.string(),
  token: Joi.string(),
});
