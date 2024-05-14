import express from "express";
import {
  register,
  login,
  logout,
  getUser,
} from "../controllers/authControllers.js";
import authMiddleware from "../middleware/authMiddleware.js";

const usersRouter = express.Router();
const jsonParser = express.json();

usersRouter.post("/register", jsonParser, register);
usersRouter.post("/login", jsonParser, login);
usersRouter.get("/logout", authMiddleware, logout);
usersRouter.get("/current", authMiddleware, getUser);

export default usersRouter;
