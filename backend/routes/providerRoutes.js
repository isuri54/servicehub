const express = require('express');
const router = express.Router();
const Provider = require('../models/Provider');
const User = require('../models/User');
const auth = require("../middleware/auth")
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

module.exports = router;