const pdfParse = require("pdf-parse");

// simple ATS scoring logic (demo)
function calculateATS(text) {
  let score = 40;

  const keywords = [
    "javascript",
    "react",
    "node",
    "express",
    "mongodb",
    "html",
    "css",
    "api",
    "sql",
  ];

  keywords.forEach((word) => {
    if (text.toLowerCase().includes(word)) {
      score += 5;
    }
  });

  if (text.length > 1000) score += 10;

  return Math.min(score, 100);
}

exports.analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const dataBuffer = req.file.buffer;

    const pdfData = await pdfParse(dataBuffer);

    const text = pdfData.text || "";

    const atsScore = calculateATS(text);

    const strengths = [];
    const suggestions = [];

    if (text.toLowerCase().includes("react")) {
      strengths.push("Good React experience mentioned");
    } else {
      suggestions.push("Add React experience");
    }

    if (text.toLowerCase().includes("node")) {
      strengths.push("Node.js backend skills present");
    } else {
      suggestions.push("Mention Node.js experience");
    }

    if (text.length < 800) {
      suggestions.push("Resume content is too short");
    }

    return res.json({
      atsScore,
      strengths,
      suggestions,
    });

  } catch (error) {
    console.log("ATS ERROR:", error);
    return res.status(500).json({
      message: "Server Error in ATS Analyzer",
    });
  }
};