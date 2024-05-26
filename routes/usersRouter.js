import express from "express";
import {
  register,
  login,
  logout,
  getUser,
  verify,
  reverify,
} from "../controllers/authControllers.js";
import { uploadAvatar } from "../controllers/usersControllers.js";
import authMiddleware from "../middleware/authMiddleware.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";

const usersRouter = express.Router();
const jsonParser = express.json();

usersRouter.get("/verify/:verificationToken", verify);
usersRouter.post("/verify", jsonParser, reverify);

usersRouter.post("/register", jsonParser, register);
usersRouter.post("/login", jsonParser, login);
usersRouter.post("/logout", authMiddleware, logout);
usersRouter.get("/current", authMiddleware, getUser);

usersRouter.patch(
  "/avatars",
  authMiddleware,
  uploadMiddleware.single("avatar"),
  uploadAvatar
);

export default usersRouter;
