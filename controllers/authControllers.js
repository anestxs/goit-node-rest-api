import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

import { createUserSchema } from "../schemas/usersSchemas.js";

export async function register(req, res, next) {
  const { value } = createUserSchema.validate(req.body);

  const { email, password } = value;

  if (email === undefined || password === undefined) {
    return res.status(400).send({
      message: "Missing required fields!",
    });
  }

  const emailInLowerCase = email.toLowerCase();

  try {
    const user = await User.findOne({ email: emailInLowerCase });

    if (user !== null) {
      return res.status(409).send({
        message: "User has already registered!",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email: emailInLowerCase,
      password: passwordHash,
    });

    res.status(201).send({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .send({ message: "Email and password are required!" });
  }

  const emailInLowerCase = email.toLowerCase();

  try {
    const user = await User.findOne({ email: emailInLowerCase });

    if (user === null) {
      return res.status(401).send({
        message: "Email or password is wrong!",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).send({
        message: "Email or password is wrong!",
      });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    const updatedUser = await User.findByIdAndUpdate(user._id, { token });

    res.status(200).send({
      token,
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res, next) {
  const { user } = req;

  try {
    await User.findByIdAndUpdate(user._id, { token: null });

    if (user === null) {
      return res.status(401).send({
        message: "Not authorized",
      });
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

export async function getUser(req, res, next) {
  const autorizationHeader = req.headers.authorization;

  const [bearer, token] = autorizationHeader.split(" ", 2);

  try {
    const user = await User.findOne({ token });

    if (user === null) {
      return res.status(401).send({
        message: "Not authorized",
      });
    }

    res.status(200).send({
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
}
