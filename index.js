require("dotenv").config();

// ✅ FORCE IPV4 FIRST (Fixes Render Gmail IPv6 issue)
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

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

// ✅ Connect MongoDB
connectDB();

// ✅ Middleware
app.use(cors());

app.use(express.json({
  limit: "10mb"
}));

app.use(express.urlencoded({
  extended: true,
  limit: "10mb"
}));

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tools", toolRoutes);
app.use("/api/admin/profile", profileRoutes);
app.use("/api/subscribers", subscriberRoutes);
app.use("/api/admin/inbox", inboxRoutes);

// ✅ Frontend Build
app.use(express.static(path.join(__dirname, "frontend/build")));

// ✅ API 404 Handler
app.use("/api/*", (req, res) => {
  res.status(404).json({
    message: `API route not found: ${req.method} ${req.originalUrl}`
  });
});

// ✅ React Frontend Catch-All
app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "frontend/build", "index.html")
  );
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("Express error:", err);

  res.status(err.status || 500).json({
    message: err.message || "Internal server error"
  });
});

// ✅ Start Server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Vinnoshiv server running on port ${PORT}`);
  console.log(`🌐 Visit: http://localhost:${PORT}`);
});
