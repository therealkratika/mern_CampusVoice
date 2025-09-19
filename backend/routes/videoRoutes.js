import express from "express";
import upload from "../middleware/Upload.js";
import { addVideo, getVideos, updateVideo, streamVideo,deleteVideo } from "../controllers/videoController.js";

const router = express.Router();

// Upload video + optional thumbnail
router.post("/", upload.fields([{ name: "video", maxCount: 1 }, { name: "thumbnail", maxCount: 1 }]), addVideo);

// Get all videos
router.get("/", getVideos);

// Update video
router.patch("/:id", updateVideo);

// ✅ New: Stream video
router.get("/stream/:filename", streamVideo);
// Delete video
router.delete("/:id", deleteVideo); // <--- You need this

export default router;
