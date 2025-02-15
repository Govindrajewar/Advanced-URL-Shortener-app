const URLModel = require("../models/urlModel");
const AnalyticsModel = require("../models/analyticsModel");
const moment = require("moment");

// Get Topic-Based Analytics
exports.getTopicAnalytics = async (req, res) => {
  try {
    const { topic } = req.params;

    // Fetch all URLs under the given topic
    const urls = await URLModel.find({ topic });

    if (!urls.length) {
      return res
        .status(404)
        .json({ message: "No URLs found under this topic" });
    }

    let totalClicks = 0;
    const uniqueUsersSet = new Set();
    const urlAnalytics = [];

    // Clicks by date (last 7 days)
    const clicksByDate = [];
    for (let i = 6; i >= 0; i--) {
      const date = moment().subtract(i, "days").format("YYYY-MM-DD");
      clicksByDate.push({ date, clickCount: 0 });
    }

    for (const url of urls) {
      const analytics = await AnalyticsModel.find({ shortCode: url.shortCode });

      // Calculate total clicks for this URL
      const urlClicks = analytics.length;
      totalClicks += urlClicks;

      // Get unique users for this URL
      const urlUniqueUsers = new Set(analytics.map((entry) => entry.ip));
      urlUniqueUsers.forEach((ip) => uniqueUsersSet.add(ip));

      // Update clicks by date
      analytics.forEach((entry) => {
        const entryDate = moment(entry.timestamp).format("YYYY-MM-DD");
        const dateIndex = clicksByDate.findIndex(
          (item) => item.date === entryDate
        );
        if (dateIndex !== -1) {
          clicksByDate[dateIndex].clickCount++;
        }
      });

      // Store analytics for this URL
      urlAnalytics.push({
        shortUrl: `http://localhost:5000/${url.shortCode}`,
        totalClicks: urlClicks,
        uniqueUsers: urlUniqueUsers.size,
      });
    }

    res.json({
      totalClicks,
      uniqueUsers: uniqueUsersSet.size,
      clicksByDate,
      urls: urlAnalytics,
    });
  } catch (error) {
    console.error("Topic analytics fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
