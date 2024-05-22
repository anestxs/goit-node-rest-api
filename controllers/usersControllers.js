import User from "../models/User.js";
import * as fs from "node:fs/promises";
import path from "node:path";
import Jimp from "jimp";

export async function uploadAvatar(req, res, next) {
  try {
    const file = await Jimp.read(req.file.path);
    await file.resize(250, 250).writeAsync(req.file.path);

    await fs.rename(
      req.file.path,
      path.resolve("public/avatars", req.file.filename)
    );

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatarURL: req.file.filename },
      { new: true }
    );

    if (user === null) {
      return res.status(401).send({
        message: "Not authorized",
      });
    }

    res.status(200).send({ avatarURL: user.avatarURL });
  } catch (error) {
    next(error);
  }
}
