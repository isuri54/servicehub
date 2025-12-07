const express = require("express");
const User = require("../models/User");
const Provider = require("../models/Provider");
const upload = require("../middleware/upload");
const router = express.Router();
const auth = require("../middleware/auth");
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

router.get("/profileview/:providerId", async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.providerId)
      .populate("userId", "name phone");

    if (!provider) {
      return res.status(404).json({ success: false, message: "Provider not found" });
    }

    const providerData = {
      _id: provider._id,
      name: provider.userId?.name || "Unknown",
      profileImage: provider.profileImage
        ? `${BASE_URL}/uploads/${provider.profileImage}`
        : null,
      phone: provider.userId?.phone || null,
      category: provider.category,
      district: provider.district,
      education: provider.education,
      experience: provider.experience,
      workImages: provider.workImages?.map(img => `${BASE_URL}/uploads/${img}`) || [],
      rating: provider.rating || 0,
      reviewCount: provider.reviewCount || 0,
      workingDays: provider.workingDays || [],
      startTime: provider.startTime || "09:00",
      endTime: provider.endTime || "17:00",
      unavailableDates: provider.unavailableDates || []
    };

    res.json({ success: true, provider: providerData });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/profileview/me", auth, async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.userId })
      .populate("userId", "name phone");

    if (!provider) {
      return res.status(404).json({ success: false, message: "Provider not found" });
    }

    const providerData = {
      _id: provider._id,
      name: provider.userId?.name || "Unknown",
      phone: provider.userId?.phone || null,
      profileImage: provider.profileImage ? `${BASE_URL}/uploads/${provider.profileImage}` : null,
      category: provider.category,
      district: provider.district,
      education: provider.education,
      experience: provider.experience,
      workImages: provider.workImages?.map(img => `${BASE_URL}/uploads/${img}`) || [],
      rating: provider.rating || 0,
      reviewCount: provider.reviewCount || 0
    };

    res.json({ success: true, provider: providerData });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;