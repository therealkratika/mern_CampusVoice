import express from "express";
import multer from "multer";
import { 
  addProfessor, 
  getProfessors, 
  getProfessorById, 
  deleteProfessor, 
  updateProfessor, 
  addReview 
} from "../controllers/professorController.js";

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Folder to save uploaded images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

// Add a new professor with optional photo
router.post("/", upload.single("profileImage"), addProfessor);

// Get all professors
router.get("/", getProfessors);

// Get a single professor by ID
router.get("/:id", getProfessorById);

// Update professor by ID (with optional new image)
router.put("/:id", upload.single("profileImage"), updateProfessor);

// Delete professor by ID
router.delete("/:id", deleteProfessor);

// Add review for a professor
router.post("/:id/reviews", addReview);

export default router;

