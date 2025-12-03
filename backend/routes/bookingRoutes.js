const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const User = require("../models/User");
const auth = require("../middleware/auth")

router.get("/availability/:providerId", async (req, res) => {
  try {
    const bookings = await Booking.find({ providerId: req.params.providerId }).select("dateRange");
    const bookedDates = bookings.map(b => ({ start: b.dateRange.start, end: b.dateRange.end }));
    res.json({ success: true, bookedDates });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/create", auth, async (req, res) => {
  try {
    console.log("Decoded User ID:", req.userId);
    console.log("Body Data:", req.body);
    const { providerId, selectedDate, isLongTerm } = req.body;

    const dateRange = isLongTerm
      ? { start: selectedDate[0], end: selectedDate[1] }
      : { start: selectedDate, end: selectedDate };

    const newBooking = new Booking({
      userId: req.userId,
      providerId,
      dateRange,
      status: "pending",
    });

    await newBooking.save();

    res.json({ success: true, message: "Booking created" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;