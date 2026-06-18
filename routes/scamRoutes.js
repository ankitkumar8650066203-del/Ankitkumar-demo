const express = require("express");
const multer = require("multer");
const Tesseract = require("tesseract.js");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// ensure uploads folder
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// Scam keywords
const scamKeywords = [
  "registration fee",
  "whatsapp",
  "telegram",
  "urgent hiring",
  "easy money",
  "no experience required",
  "send cv on whatsapp",
  "processing fee",
  "guaranteed job",
  "work from home earn"
];

router.post("/analyze-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const imagePath = req.file.path;

    // OCR extract text
    const result = await Tesseract.recognize(imagePath, "eng");
    const text = result.data.text.toLowerCase();

    let score = 0;
    let reasons = [];

    scamKeywords.forEach((keyword) => {
      if (text.includes(keyword)) {
        score += 15;
        reasons.push(`Found suspicious phrase: ${keyword}`);
      }
    });

    if (text.includes("telegram")) {
      reasons.push("Telegram contact detected");
    }

    if (text.includes("registration fee")) {
      reasons.push("Possible fake job with fee requirement");
    }

    if (score > 100) score = 100;

    let label = "SAFE";

    if (score >= 70) label = "SCAM";
    else if (score >= 40) label = "SUSPICIOUS";

    res.json({
      riskScore: score,
      label,
      reasons,
      extractedText: text
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Scam analysis failed",
      error: error.message
    });
  }
});

module.exports = router;