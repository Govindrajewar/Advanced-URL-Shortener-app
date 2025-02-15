const shortid = require("shortid");
const URLModel = require("../models/urlModel");

// Shorten URL
exports.shortenUrl = async (req, res) => {
  const { longUrl, customAlias, topic } = req.body;

  if (!longUrl) {
    return res.status(400).json({ message: "longUrl is required" });
  }

  let shortCode = customAlias || shortid.generate();

  try {
    const existingUrl = await URLModel.findOne({ shortCode });
    if (existingUrl) {
      return res.status(400).json({ message: "Custom alias already taken" });
    }

    const newUrl = new URLModel({
      shortCode,
      longUrl,
      topic: topic || "general",
      userId: req.userId,
    });

    await newUrl.save();

    res.json({
      shortUrl: `http://localhost:5000/${shortCode}`,
      createdAt: newUrl.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
