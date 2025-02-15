const express = require("express");
const router = express.Router();
const topicAnalyticsController = require("../controllers/topicAnalyticsController");

router.get(
  "/analytics/topic/:topic",
  topicAnalyticsController.getTopicAnalytics
);

module.exports = router;
