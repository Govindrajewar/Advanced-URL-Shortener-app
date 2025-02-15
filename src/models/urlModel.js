const mongoose = require("mongoose");

const URLSchema = new mongoose.Schema({
  shortCode: { type: String, required: true, unique: true },
  longUrl: { type: String, required: true },
  topic: { type: String, default: "general" },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("URL", URLSchema);
