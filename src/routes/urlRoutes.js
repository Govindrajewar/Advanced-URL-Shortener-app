const express = require("express");
const router = express.Router();
const urlController = require("../controllers/urlController");
const verifyGoogleToken = require("../middlewares/authMiddleware");
const limiter = require("../middlewares/rateLimiter");

router.post("/shorten", verifyGoogleToken, limiter, urlController.shortenUrl);

router.get("/shorten/:alias", urlController.redirectUrl);

module.exports = router;
