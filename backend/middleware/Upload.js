import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

// File filter: allow videos & images
const videoTypes = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/x-matroska"];
const imageTypes = ["image/jpeg", "image/png", "image/webp"];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (
    (videoTypes.includes(file.mimetype) && /mp4|mov|avi|mkv/.test(ext)) ||
    (imageTypes.includes(file.mimetype) && /jpg|jpeg|png|webp/.test(ext))
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only video or image files are allowed"));
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
