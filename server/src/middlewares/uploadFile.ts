import multer, { FileFilterCallback } from "multer";
import { Request, Response, NextFunction } from "express";

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const type = file.mimetype.split("/")[0];
    if (type === "image") {
      cb(null, "uploads/images");
    } else {
      cb(null, "uploads/files");
    }
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + "." + ext;
    cb(null, uniqueSuffix);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (
    ["image/jpg", "image/jpeg", "image/png", "image/webp"].includes(
      file.mimetype
    )
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: fileStorage,
  fileFilter,
  limits: { fieldSize: 1024 * 1024 * 10 },
});

export const uploadMemory = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fieldSize: 1024 * 1024 * 10 },
});
export default upload;
