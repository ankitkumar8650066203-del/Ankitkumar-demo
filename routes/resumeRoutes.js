const express = require("express");
const multer = require("multer");
const pdf = require("pdf-parse");
const fs = require("fs");

const router = express.Router();

const storage = multer.diskStorage({
destination: (req, file, cb) => {
cb(null, "uploads/");
},

filename: (req, file, cb) => {
cb(
null,
Date.now() + "-" + file.originalname
);
}
});

const upload = multer({
storage
});

router.post(
"/match",
upload.single("resume"),
async (req, res) => {


try {

  const jobText = req.body.jobText;

  if (!req.file || !jobText) {

    return res.status(400).json({
      message:
        "Resume and Job Description required"
    });

  }

  const buffer =
    fs.readFileSync(
      req.file.path
    );

  console.log("PDF Loaded");

  const data =
    await pdf(buffer);

  console.log("PDF Parsed");

  const resumeText =
    data.text.toLowerCase();

  const job =
    jobText.toLowerCase();

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

  let matched = [];
  let missing = [];

  skills.forEach((skill) => {

    if (job.includes(skill)) {

      if (
        resumeText.includes(skill)
      ) {

        matched.push(skill);

      } else {

        missing.push(skill);

      }

    }

  });

  const total =
    matched.length +
    missing.length;

  const score =
    total === 0
      ? 0
      : Math.round(
          (matched.length / total) * 100
        );

  console.log("MATCH RESULT");

  console.log({
    score,
    matchedSkills: matched,
    missingSkills: missing
  });

  res.json({
    score,
    matchedSkills: matched,
    missingSkills: missing
  });

} catch (error) {

  console.log("FULL ERROR");
  console.log(error);

  res.status(500).json({
    message: error.message
  });

}

}
);

module.exports = router;
