const express = require("express");
require("dotenv").config();
const connectDB = require("./db");
const urlRoutes = require("./src/routes/urlRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Connect to Database
connectDB();

// Routes
app.use("/api", urlRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
