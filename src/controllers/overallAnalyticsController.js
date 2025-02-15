const URLModel = require("../models/URL");
const AnalyticsModel = require("../models/Analytics");
const moment = require("moment");

exports.getOverallAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    // Fetch all URLs created by the user
    const urls = await URLModel.find({ createdBy: userId });

    if (!urls.length) {
      return res.status(404).json({ message: "No URLs found for this user" });
    }

    let totalClicks = 0;
    let totalUrls = urls.length;
    const uniqueUsersSet = new Set();
    const clicksByDate = [];
    const osAnalytics = {};
    const deviceAnalytics = {};

    for (let i = 6; i >= 0; i--) {
      const date = moment().subtract(i, "days").format("YYYY-MM-DD");
      clicksByDate.push({ date, clickCount: 0 });
    }

    for (const url of urls) {
      const analytics = await AnalyticsModel.find({ shortCode: url.shortCode });

      totalClicks += analytics.length;

      analytics.forEach((entry) => {
        uniqueUsersSet.add(entry.ip);

        const entryDate = moment(entry.timestamp).format("YYYY-MM-DD");
        const dateIndex = clicksByDate.findIndex(
          (item) => item.date === entryDate
        );
        if (dateIndex !== -1) {
          clicksByDate[dateIndex].clickCount++;
        }

        // Track OS type analytics
        if (!osAnalytics[entry.os]) {
          osAnalytics[entry.os] = { uniqueClicks: 0, uniqueUsers: new Set() };
        }
        osAnalytics[entry.os].uniqueClicks++;
        osAnalytics[entry.os].uniqueUsers.add(entry.ip);

        // Track Device type analytics
        if (!deviceAnalytics[entry.device]) {
          deviceAnalytics[entry.device] = {
            uniqueClicks: 0,
            uniqueUsers: new Set(),
          };
        }
        deviceAnalytics[entry.device].uniqueClicks++;
        deviceAnalytics[entry.device].uniqueUsers.add(entry.ip);
      });
    }

    // Format OS analytics response
    const osType = Object.keys(osAnalytics).map((os) => ({
      osName: os,
      uniqueClicks: osAnalytics[os].uniqueClicks,
      uniqueUsers: osAnalytics[os].uniqueUsers.size,
    }));

    // Format Device analytics response
    const deviceType = Object.keys(deviceAnalytics).map((device) => ({
      deviceName: device,
      uniqueClicks: deviceAnalytics[device].uniqueClicks,
      uniqueUsers: deviceAnalytics[device].uniqueUsers.size,
    }));

    res.json({
      totalUrls,
      totalClicks,
      uniqueUsers: uniqueUsersSet.size,
      clicksByDate,
      osType,
      deviceType,
    });
  } catch (error) {
    console.error("Overall analytics fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
