const express = require("express");
const multer = require("multer");
const pdf = require("pdf-parse");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// ensure uploads folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

router.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;

    const buffer = fs.readFileSync(filePath);

    const data = await pdf(buffer);

    const text = (data.text || "").toLowerCase();

    let score = 50;
    let strengths = [];
    let suggestions = [];

    const skills = [
      "react",
      "node",
      "mongodb",
      "javascript",
      "html",
      "css",
      "java",
      "python",
      "mysql",
      "aws",
      "docker",
      "express"
    ];

    skills.forEach(skill => {
      if (text.includes(skill)) {
        strengths.push(skill);
        score += 4;
      }
    });

    if (!text.includes("project")) suggestions.push("Add Projects Section");
    if (!text.includes("github")) suggestions.push("Add GitHub Profile");
    if (!text.includes("linkedin")) suggestions.push("Add LinkedIn Profile");

    if (score > 100) score = 100;

    return res.json({
      atsScore: score,
      strengths,
      suggestions
    });

  } catch (error) {
    console.log("ATS ERROR:", error);
    return res.status(500).json({
      message: "Server Error in ATS analysis",
      error: error.message
    });
  }
});

module.exports = router;