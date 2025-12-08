const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: "Provider" },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: String,
  sender: { type: String, enum: ["client", "provider"] },
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);