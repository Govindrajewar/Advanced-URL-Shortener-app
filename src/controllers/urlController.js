const shortid = require("shortid");
const URLModel = require("../models/urlModel");
const analyticsModel = require("../models/analyticsModel");
const geoip = require("geoip-lite");

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

exports.redirectUrl = async (req, res) => {
  try {
    const { alias } = req.params;
    const url = await URLModel.findOne({ shortCode: alias });

    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }

    const userAgent = req.headers["user-agent"];
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const geo = geoip.lookup(ip);

    await analyticsModel.create({
      shortCode: alias,
      timestamp: new Date(),
      userAgent,
      ip,
      location: geo || {},
    });

    res.redirect(url.originalUrl);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
