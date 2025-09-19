import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  filename: { type: String, required: true },
  thumbnail: { type: String },
  duration: { type: String }, // e.g., "12:45"
  views: { type: Number, default: 0 },
  professor: { type: mongoose.Schema.Types.ObjectId, ref: "Professor", required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Video", videoSchema);
