const mongoose = require("mongoose");

const toolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  oldPrice: { type: String, default: "" },
  icon: { type: String, default: "fas fa-tools" },
  color: { type: String, default: "#0284c7" },
  ref: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
  category: { type: String, default: "automation" },
  sales: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  status: { type: String, default: "Active" },
  buyLink: { type: String, default: "" },
  demoUrl: { type: String, default: "" },
  features: { type: [String], default: [] },
}, { timestamps: true });

module.exports = mongoose.model("Tool", toolSchema);
