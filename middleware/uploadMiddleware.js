import multer from "multer";
import path from "node:path";
import crypto from "crypto";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve("tmp"));
  },
  filename: (req, file, cb) => {
    const basename = path.basename(file.originalname);
    const extname = path.extname(file.originalname);
    const suffix = crypto.randomUUID();
    const filename = basename + "-" + suffix + extname;

    cb(null, filename);
  },
});

export default multer({ storage });
