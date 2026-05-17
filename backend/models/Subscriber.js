const mongoose = require("mongoose");

const subscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, default: "" },
  consentGiven: { type: Boolean, default: true },
  consentDate: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Subscriber", subscriberSchema);
