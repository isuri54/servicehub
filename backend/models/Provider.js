const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  profileImage: { type: String },
  workImages: [{ type: String }],
  category: { type: String, required: true },
  district: { type: String, required: true },
  education: { type: String, required: true },
  experience: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Provider", providerSchema);
