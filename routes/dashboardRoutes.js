const express = require("express");
const Scan = require("../models/Scan");

const router = express.Router();

router.get("/stats", async (req, res) => {
  try {
    const totalATS = await Scan.countDocuments({ type: "ATS" });
    const totalSCAM = await Scan.countDocuments({ type: "SCAM" });

    const avgATSData = await Scan.aggregate([
      { $match: { type: "ATS" } },
      { $group: { _id: null, avgScore: { $avg: "$score" } } }
    ]);

    const avgATS = avgATSData[0]?.avgScore || 0;

    const scamCount = await Scan.countDocuments({
      type: "SCAM",
      label: "SCAM"
    });

    const safeCount = await Scan.countDocuments({
      type: "SCAM",
      label: { $ne: "SCAM" }
    });

    const recent = await Scan.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalATS,
      totalSCAM,
      avgATS: Math.round(avgATS),
      scamCount,
      safeCount,
      recent
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;