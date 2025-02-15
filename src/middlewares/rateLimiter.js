const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { message: "Rate limit exceeded. Try again later." },
  keyGenerator: (req) => req.userId || req.ip,
});

module.exports = limiter;
