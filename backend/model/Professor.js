import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  //name: { type: String, required: true },        // reviewer name
  rating: { type: Number, required: true, min: 0, max: 5 },
  comment: { type: String },
  //date: { type: Date, default: Date.now },
});

const professorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  experience: { type: String },
  education: { type: String },
  biography: { type: String },
  profileImage: { type: String},
  branches: { type: [String], default: [] },
  semestersTaught: { type: [String], default: [] },
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
  reviews: [reviewSchema],
});


professorSchema.virtual("averageRating").get(function () {
  if (this.reviews.length === 0) return 0;
  const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
  return total / this.reviews.length;
});


professorSchema.virtual("totalRatings").get(function () {
  return this.reviews.length;
});

professorSchema.set("toJSON", { virtuals: true });
professorSchema.set("toObject", { virtuals: true });

export default mongoose.model("Professor", professorSchema);
