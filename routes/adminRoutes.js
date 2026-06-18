const express = require("express");

const User = require("../models/User");
const ScanHistory = require("../models/ScanHistory");

const router = express.Router();

router.get("/stats", async (req, res) => {

  try {

    const totalUsers =
      await User.countDocuments();

    const totalScans =
      await ScanHistory.countDocuments();

    const safeJobs =
      await ScanHistory.countDocuments({
        result: "Safe Job"
      });

    const scamJobs =
      await ScanHistory.countDocuments({
        result: "Potential Scam"
      });

    const recentScans =
      await ScanHistory
      .find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalUsers,
      totalScans,
      safeJobs,
      scamJobs,
      recentScans
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

});

module.exports = router;