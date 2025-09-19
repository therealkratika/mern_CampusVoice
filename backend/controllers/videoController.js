// controllers/videoController.js
import Video from "../model/Video.js";
import Professor from "../model/Professor.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    // Remove video file
    const videoPath = path.join("uploads", video.filename);
    if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);

    // Remove thumbnail file if exists
    if (video.thumbnail) {
      const thumbPath = path.join("uploads", video.thumbnail);
      if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);
    }

    // Remove from professor
    const professor = await Professor.findById(video.professor);
    if (professor) {
      professor.videos = professor.videos.filter((id) => id.toString() !== video._id.toString());
      await professor.save();
    }

    // Delete video document
    await video.deleteOne();

    res.json({ success: true, message: "Video deleted successfully" });
  } catch (error) {
    console.error("Error deleting video:", error);
    res.status(500).json({ message: error.message });
  }
};

export const streamVideo = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, "../uploads", filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Video not found" });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      const file = fs.createReadStream(filePath, { start, end });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": "video/mp4",
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      };
      res.writeHead(200, head);
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (error) {
    console.error("Error streaming video:", error);
    res.status(500).json({ message: error.message });
  }
};

export const addVideo = async (req, res) => {
  try {
    const { title, professorId, duration } = req.body;

    if (!title || !professorId || !req.files?.video?.[0]?.filename) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const video = new Video({
      title,
      filename: req.files.video[0].filename,          // video file
      thumbnail: req.files?.thumbnail?.[0]?.filename || "", // optional
      duration,
      professor: professorId,
    });

    await video.save();

    // Add video to professor
    const professor = await Professor.findById(professorId);
    if (!professor) return res.status(404).json({ message: "Professor not found" });

    professor.videos.push(video._id);
    await professor.save();

    res.status(201).json({ success: true, message: "Video added successfully", data: video });
  } catch (error) {
    console.error("Error adding video:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const { title, professorId, duration } = req.body;

    // Update professor if changed
    if (professorId && video.professor.toString() !== professorId) {
      const oldProf = await Professor.findById(video.professor);
      if (oldProf) {
        oldProf.videos = oldProf.videos.filter((id) => id.toString() !== video._id.toString());
        await oldProf.save();
      }

      const newProf = await Professor.findById(professorId);
      if (newProf) {
        newProf.videos.push(video._id);
        await newProf.save();
      }
      video.professor = professorId;
    }

    video.title = title || video.title;
    video.duration = duration || video.duration;

    // If a new video file uploaded
    if (req.files?.video?.[0]?.filename) video.filename = req.files.video[0].filename;

    // If a new thumbnail uploaded, replace; otherwise keep old
    if (req.files?.thumbnail?.[0]?.filename) {
      video.thumbnail = req.files.thumbnail[0].filename;
    }

    await video.save();
    res.json({ success: true, message: "Video updated successfully", data: video });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


// Optional: fetch all videos with professor populated
export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
