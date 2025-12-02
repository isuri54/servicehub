const express = require('express');
const router = express.Router();
const Provider = require('../models/Provider');
const User = require('../models/User');
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
      select: 'name profileImage phone' 
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
      workImages: p.workImages || []
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

module.exports = router;