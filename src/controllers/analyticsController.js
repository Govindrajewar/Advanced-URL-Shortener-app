const AnalyticsModel = require("../models/analyticsModel");
const moment = require("moment");

exports.getUrlAnalytics = async (req, res) => {
  try {
    const { alias } = req.params;

    const analytics = await AnalyticsModel.find({ shortCode: alias });

    if (!analytics.length) {
      return res.status(404).json({ message: "No analytics data found" });
    }

    // total clicks
    const totalClicks = analytics.length;

    // unique users (based on IP)
    const uniqueUsers = new Set(analytics.map((entry) => entry.ip)).size;

    // Clicks by date (last 7 days)
    const clicksByDate = [];
    for (let i = 6; i >= 0; i--) {
      const date = moment().subtract(i, "days").format("YYYY-MM-DD");
      const count = analytics.filter((entry) =>
        moment(entry.timestamp).isSame(date, "day")
      ).length;
      clicksByDate.push({ date, clickCount: count });
    }

    // group by OS type
    const osStats = {};
    analytics.forEach(({ userAgent, ip }) => {
      const osName = userAgent.includes("Windows")
        ? "Windows"
        : userAgent.includes("Mac")
        ? "macOS"
        : userAgent.includes("Linux")
        ? "Linux"
        : userAgent.includes("iPhone") || userAgent.includes("iOS")
        ? "iOS"
        : userAgent.includes("Android")
        ? "Android"
        : "Other";

      if (!osStats[osName]) {
        osStats[osName] = { uniqueClicks: 0, uniqueUsers: new Set() };
      }

      osStats[osName].uniqueClicks++;
      osStats[osName].uniqueUsers.add(ip);
    });

    // Convert OS stats to array
    const osType = Object.keys(osStats).map((osName) => ({
      osName,
      uniqueClicks: osStats[osName].uniqueClicks,
      uniqueUsers: osStats[osName].uniqueUsers.size,
    }));

    // Group by device type
    const deviceStats = {};
    analytics.forEach(({ userAgent, ip }) => {
      const deviceName = userAgent.includes("Mobi") ? "Mobile" : "Desktop";

      if (!deviceStats[deviceName]) {
        deviceStats[deviceName] = { uniqueClicks: 0, uniqueUsers: new Set() };
      }

      deviceStats[deviceName].uniqueClicks++;
      deviceStats[deviceName].uniqueUsers.add(ip);
    });

    // Convert device stats to array
    const deviceType = Object.keys(deviceStats).map((deviceName) => ({
      deviceName,
      uniqueClicks: deviceStats[deviceName].uniqueClicks,
      uniqueUsers: deviceStats[deviceName].uniqueUsers.size,
    }));

    res.json({
      totalClicks,
      uniqueUsers,
      clicksByDate,
      osType,
      deviceType,
    });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
