const express = require("express");
const router = express.Router();
const overallAnalyticsController = require("../controllers/overallAnalyticsController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get(
  "/analytics/overall",
  authMiddleware,
  overallAnalyticsController.getOverallAnalytics
);

module.exports = router;
