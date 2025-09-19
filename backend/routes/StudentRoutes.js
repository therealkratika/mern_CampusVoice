const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const keys = require("../config/key");

const Student = require("../models/Student");
const router = express.Router();
router.post("/login", async (req, res) => {
  const { collegeId, password } = req.body;

  try {
    const student = await Student.findOne({ collegeId });
    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const payload = {
      id: student.id,
      name: student.name,
      collegeId: student.collegeId,
    };

    jwt.sign(payload, keys.secretOrKey, { expiresIn: "1h" }, (err, token) => {
      if (err) throw err;
      res.json({ success: true, token: "Bearer " + token });
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).send("Server error");
  }
});
router.get(
  "/dashboard",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      msg: "Welcome to Student Dashboard 🎉",
      student: req.user,
    });
  }
);

module.exports = router;

