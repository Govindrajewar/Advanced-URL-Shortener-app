const mongoose = require("mongoose");

const AnalyticsSchema = new mongoose.Schema({
  shortCode: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  userAgent: { type: String },
  ip: { type: String },
  location: { type: Object },
});

module.exports = mongoose.model("Analytics", AnalyticsSchema);
