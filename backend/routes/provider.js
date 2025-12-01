const express = require("express");
const User = require("../models/User");
const Provider = require("../models/Provider");
const upload = require("../middleware/upload");
const router = express.Router();

const uploadFields = upload.fields([
  { name: "profileImage", maxCount: 1 },
  { name: "workImages", maxCount: 5 }
]);

router.post("/register", uploadFields, async (req, res) => {
  try {
    const { userId, category, district, education, experience } = req.body;

    if (!userId) return res.status(400).json({ message: "User ID required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const profileImage = req.files["profileImage"]
      ? req.files["profileImage"][0].filename
      : null;

    const workImages = req.files["workImages"]
      ? req.files["workImages"].map(f => f.filename)
      : [];

    const provider = new Provider({
      userId,
      category,
      district,
      education,
      experience,
      profileImage,
      workImages
    });

    await provider.save();

    user.role = true;
    await user.save();

    res.status(201).json({ 
      message: "Provider profile created successfully", 
      provider 
    });

  } catch (error) {
    console.error("Provider registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
