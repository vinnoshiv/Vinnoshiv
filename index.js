require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require("./backend/db");
const authRoutes = require("./backend/routes/auth");
const toolRoutes = require("./backend/routes/tools");
const profileRoutes = require("./backend/routes/profile");
const subscriberRoutes = require("./backend/routes/subscribers");
const inboxRoutes = require("./backend/routes/inbox");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/tools", toolRoutes);
app.use("/api/admin/profile", profileRoutes);
app.use("/api/subscribers", subscriberRoutes);
app.use("/api/admin/inbox", inboxRoutes);

app.use(express.static(path.join(__dirname, "frontend/build")));

app.use("/api/*", (req, res) => {
  res.status(404).json({ message: `API route not found: ${req.method} ${req.originalUrl}` });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
});

app.use((err, req, res, next) => {
  console.error("Express error:", err.message);
  res.status(err.status || 500).json({ message: err.message || "Internal server error" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Vinnoshiv server running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});
