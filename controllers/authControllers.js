import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";

import Gravatar from "gravatar";

import User from "../models/User.js";

import mail from "../mail.js";

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

  const userProfilePic = Gravatar.url(emailInLowerCase, { protocol: "http" });

  try {
    const user = await User.findOne({ email: emailInLowerCase });

    if (user !== null) {
      return res.status(409).send({
        message: "User has already registered!",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomUUID();

    const newUser = await User.create({
      email: emailInLowerCase,
      password: passwordHash,
      avatarURL: userProfilePic,
      verificationToken: verificationToken,
    });

    mail.sendEmail({
      to: emailInLowerCase,
      from: "crtrever@gmail.com",
      subject: "Email confirmation on contacts app",
      html: `<h1>Click on this <a href="http://localhost:3000/api/users/verify/${verificationToken}">link</a> to confirm your email</h1>`,
      text: `To confirm your email click the link below \nhttp://localhost:3000/api/users/verify/${verificationToken}`,
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

    if (!user.verify) {
      return res.status(401).send({
        message: "Email is not verified!",
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
  try {
    const user = await User.findByIdAndUpdate(req.user.id, { token: null });

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

export async function verify(req, res, next) {
  const { verificationToken } = req.params;

  try {
    const user = await User.findOneAndUpdate(
      { verificationToken },
      { verify: true, verificationToken: null },
      { new: true }
    );

    if (user === null) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    res.status(200).send({
      message: "Verification successful",
    });
  } catch (error) {
    next(error);
  }

  res.end();
}

export async function reverify(req, res, next) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({ message: "Missing required field email" });
  }

  const emailInLowerCase = email.toLowerCase();

  try {
    const user = await User.findOne({ email: emailInLowerCase });

    if (user === null) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    if (user.verify) {
      return res.status(400).send({
        message: "Verification has already been passed",
      });
    }

    const verificationToken = crypto.randomUUID();

    await User.findByIdAndUpdate(
      user._id,
      { verificationToken },
      { new: true }
    );

    mail.sendEmail({
      to: emailInLowerCase,
      from: "crtrever@gmail.com",
      subject: "Email confirmation on contacts app",
      html: `<h1>Click on this <a href="http://localhost:3000/api/users/verify/${verificationToken}">link</a> to confirm your email</h1>`,
      text: `To confirm your email click the link below \nhttp://localhost:3000/api/users/verify/${verificationToken}`,
    });

    res.status(200).send({
      message: "Verification email sent",
    });
  } catch (error) {
    next(error);
  }
}
