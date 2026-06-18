const mongoose = require("mongoose");

const scanHistorySchema = new mongoose.Schema({

  jobText: {
    type: String,
    required: true
  },

  result: {
    type: String,
    required: true
  },

  riskScore: {
    type: Number,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model(
  "ScanHistory",
  scanHistorySchema
);