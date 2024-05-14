import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default function authMiddleware(req, res, next) {
  const autorizationHeader = req.headers.authorization;

  if (typeof autorizationHeader === "undefined") {
    return res.status(401).send({
      message: "Invalid token",
    });
  }

  const [bearer, token] = autorizationHeader.split(" ", 2);

  if (bearer !== "Bearer") {
    return res.status(401).send({
      message: "Invalid token",
    });
  }

  async function tokenVerification(error, decode) {
    if (error) {
      return res.status(401).send({
        message: "Invalid token",
      });
    }

    try {
      const user = await User.findById(decode.id);

      if (user === null) {
        return res.status(401).send({
          message: "Invalid token",
        });
      }

      req.user = {
        id: user._id,
        email: user.email,
      };

      next();
    } catch (error) {
      next(error);
    }
  }

  jwt.verify(token, process.env.JWT_SECRET, tokenVerification(error, decode));
}
