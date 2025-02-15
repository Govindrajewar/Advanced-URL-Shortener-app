const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");

router.get("/analytics/:alias", analyticsController.getUrlAnalytics);

module.exports = router;
