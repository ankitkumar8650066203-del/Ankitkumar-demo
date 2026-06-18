const express = require("express");
const PDFDocument = require("pdfkit");

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const { ats, scam } = req.body;

    const doc = new PDFDocument();

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=report.pdf"
    );

    doc.pipe(res);

    doc.fontSize(20).text("Job Scan Report", {
      align: "center"
    });

    doc.moveDown();

    // ATS Section
    doc.fontSize(16).text("ATS Analysis");
    doc.fontSize(14).text(`Score: ${ats.atsScore}%`);

    doc.text("Strengths:");
    (ats.strengths || []).forEach((s) => {
      doc.text(`✔ ${s}`);
    });

    doc.text("Suggestions:");
    (ats.suggestions || []).forEach((s) => {
      doc.text(`• ${s}`);
    });

    doc.moveDown();

    // SCAM Section
    doc.fontSize(16).text("Scam Analysis");

    doc.text(`Risk Score: ${scam.riskScore || 0}`);
    doc.text(`Label: ${scam.label || "SAFE"}`);

    doc.text("Reasons:");
    (scam.reasons || []).forEach((r) => {
      doc.text(`⚠ ${r}`);
    });

    doc.end();

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;