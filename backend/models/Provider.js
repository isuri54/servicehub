const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  profileImage: { type: String },
  workImages: [{ type: String }],
  category: { type: String, required: true },
  district: { type: String, required: true },
  education: { type: String, required: true },
  experience: { type: String, required: true },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  workingDays: [{ type: String }],
  startTime: { type: String, default: "09:00" },
  endTime: { type: String, default: "17:00" },
  unavailableDates: [{ type: String }],
  earnings: [{
    amount: Number,
    clientName: String,
    date: Date,
    note: String
  }]
}, { timestamps: true });

module.exports = mongoose.model("Provider", providerSchema);
