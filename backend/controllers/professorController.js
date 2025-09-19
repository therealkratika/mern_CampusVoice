// controllers/professorController.js
import Professor from "../model/Professor.js";

export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const professor = await Professor.findById(req.params.id);

    if (!professor) {
      return res.status(404).json({ message: "Professor not found" });
    }

    const review = {
      rating: Number(rating),
      comment,
    };

    // Add new review
    professor.reviews.push(review);

    // Update aggregate rating
    professor.totalRatings = professor.reviews.length;
    professor.averageRating =
      professor.reviews.reduce((acc, r) => acc + r.rating, 0) /
      professor.totalRatings;

    await professor.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: professor,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Error adding review", error: error.message });
  }
};


// Add professor
export const addProfessor = async (req, res) => {
  try {
    const prof = new Professor({
      name: req.body.name,
      subject: req.body.subject,
      experience: req.body.experience,
      education: req.body.education,
      biography: req.body.biography,
      branches: JSON.parse(req.body.branches || "[]"),
      semestersTaught: JSON.parse(req.body.semestersTaught || "[]"),
      profileImage: req.file ? req.file.filename : "", // save filename
    });

    await prof.save();
    res.status(201).json({
      success: true,
      message: "Professor added successfully",
      data: prof,
    });
  } catch (error) {
    console.error("Error adding professor:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all professors
export const getProfessors = async (req, res) => {
  try {
    const profs = await Professor.find();
    res.json(profs);
  } catch (error) {
    console.error("Error fetching professors:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getProfessorById = async (req, res) => {
  try {
    const professor = await Professor.findById(req.params.id)
      .populate({
        path: "videos",
        select: "title filename thumbnail duration views createdAt",
      });

    if (!professor) return res.status(404).json({ message: "Professor not found" });
    res.json(professor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Delete professor
export const deleteProfessor = async (req, res) => {
  try {
    const prof = await Professor.findByIdAndDelete(req.params.id);
    if (!prof) return res.status(404).json({ message: "Professor not found" });
    res.json({ message: "Professor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update professor
export const updateProfessor = async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      subject: req.body.subject,
      experience: req.body.experience,
      education: req.body.education,
      biography: req.body.biography,
      branches: JSON.parse(req.body.branches || "[]"),
      semestersTaught: JSON.parse(req.body.semestersTaught || "[]"),
    };
    if (req.file) {
      updateData.profileImage = req.file.filename;
    }

    const prof = await Professor.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!prof) return res.status(404).json({ message: "Professor not found" });
    res.json(prof);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

