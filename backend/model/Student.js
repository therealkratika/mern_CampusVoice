const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    collegeId: {
      type: String, 
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true, 
    },
    role: {
      type: String,
      default: "student", 
    },
    year: {
      type: Number,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", StudentSchema);
