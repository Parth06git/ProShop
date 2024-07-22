import path from "path";
import express from "express";
import multer from "multer";
import userController from "../controllers/userController.mjs";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

function fileFilter(req, file, cb) {
  const filetypes = /jpe?g|png|webp/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Images only!"), false);
  }
}

const upload = multer({ storage, fileFilter });

router.post("/", upload.single("image"), userController.protect, (req, res) => {
  if (!req.user.isAdmin) {
    return next(new AppError("You are not authorize for this action", 401));
  }

  res.status(200).send({
    message: "Image uploaded successfully",
    image: `/${req.file.path}`,
  });
});

export default router;
