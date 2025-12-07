const express = require('express');
const router = express.Router();
const Provider = require('../models/Provider');
const User = require('../models/User');
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

router.get('/category/:categoryName', async (req, res) => {
  try {
    let categoryName = req.params.categoryName
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());

    const providers = await Provider.find({ 
      category: categoryName 
    })
    .populate({
      path: 'userId',
      select: 'name profileImage phone category district education experience rating reviewCount' 
    });

    const providerList = providers.map(p => ({
      _id: p._id,
      name: p.userId?.name || 'Unknown User',
      profileImage: p.profileImage 
        ? `${BASE_URL}/uploads/${p.profileImage}` 
        : '/user.png',
      district: p.district,
      education: p.education,
      experience: p.experience,
      category: p.category,
      workImages: p.workImages || [],
      rating: p.rating || 0,
      reviewCount: p.reviewCount || 0
    }));

    res.json({
      success: true,
      count: providerList.length,
      providers: providerList
    });

  } catch (error) {
    console.error('Error fetching providers by category:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

router.put("/availability", auth, async (req, res) => {
  try {
    const { workingDays, startTime, endTime, unavailableDates } = req.body;
    await Provider.findOneAndUpdate(
      { userId: req.userId },
      { workingDays, startTime, endTime, unavailableDates },
      { new: true }
    );
    res.json({ success: true, message: "Availability updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/profile", auth, async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.userId }).populate("userId", "name phone");
    if (!provider) {
      return res.status(404).json({ success: false, message: "Provider not found" });
    }

    const BASE_URL = process.env.BASE_URL || "http://localhost:5000";
    res.json({
      success: true,
      provider: {
        userId: {
          name: provider.userId?.name || "",
          phone: provider.userId?.phone || "",
        },
        profileImage: provider.profileImage ? `${BASE_URL}/Uploads/${provider.profileImage}` : null,
        category: provider.category || "",
        district: provider.district || "",
        education: provider.education || "",
        experience: provider.experience || "",
        workingDays: provider.workingDays || [],
        startTime: provider.startTime || "09:00",
        endTime: provider.endTime || "17:00",
        unavailableDates: provider.unavailableDates || [],
      },
    });
  } catch (err) {
    console.error("Error fetching provider profile:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.put("/update", auth, upload.single("profileImage"), async (req, res) => {
  try {
    const { name, phone, category, district, education, experience } = req.body;
    const profileImage = req.file ? req.file.filename : null;

    const provider = await Provider.findOne({ userId: req.userId });
    if (!provider) {
      return res.status(404).json({ success: false, message: "Provider not found" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.name = name || user.name;
    user.phone = phone || user.phone;
    await user.save();

    provider.category = category || provider.category;
    provider.district = district || provider.district;
    provider.education = education || provider.education;
    provider.experience = experience || provider.experience;
    if (profileImage) provider.profileImage = profileImage;
    await provider.save();

    const BASE_URL = process.env.BASE_URL || "http://localhost:5000";
    res.json({
      success: true,
      provider: {
        userId: {
          name: user.name,
          phone: user.phone,
        },
        profileImage: provider.profileImage ? `${BASE_URL}/Uploads/${provider.profileImage}` : null,
        category: provider.category,
        district: provider.district,
        education: provider.education,
        experience: provider.experience,
        workingDays: provider.workingDays,
        startTime: provider.startTime,
        endTime: provider.endTime,
        unavailableDates: provider.unavailableDates,
      },
    });
  } catch (err) {
    console.error("Error updating provider profile:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/earnings", auth, async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.userId });
    res.json({ success: true, earnings: provider.earnings || [] });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

router.post("/earnings", auth, async (req, res) => {
  try {
    const { amount, clientName, date, note } = req.body;
    const provider = await Provider.findOneAndUpdate(
      { userId: req.userId },
      { $push: { earnings: { amount, clientName, date, note: note || "" } } },
      { new: true }
    );
    res.json({ success: true, earnings: provider.earnings });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;