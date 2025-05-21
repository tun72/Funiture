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
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (["image/jpg", "image/jpeg", "image/png"].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: fileStorage,
  fileFilter,
  limits: { fieldSize: 1024 * 1024 * 2 },
});

export const uploadMemory = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fieldSize: 1024 * 1024 * 10 },
});
export default upload;
