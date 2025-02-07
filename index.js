const express = require("express");
const app = express();

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Advanced URL Shortener application",
    Date: `${new Date().getDate()}-${
      new Date().getMonth() + 1
    }-${new Date().getFullYear()}`,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
