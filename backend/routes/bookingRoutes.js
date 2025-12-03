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

router.get("/my-bookings", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.userId })
      .populate({
        path: "providerId",
        populate: {
          path: "userId",
          select: "name profileImage"
        }
      })
      .sort({ "dateRange.start": -1 });

    const formattedBookings = bookings.map(b => {
      if (!b.providerId) {
        return null;
      }

      return {
        _id: b._id,
        dateRange: b.dateRange,
        status: b.status,
        provider: {
          _id: b.providerId._id,
          name: b.providerId.userId?.name || "Unknown Provider",
          profileImage: b.providerId.profileImage
            ? `${process.env.BASE_URL || 'http://localhost:5000'}/uploads/${b.providerId.profileImage}`
            : null,
          category: b.providerId.category,
          district: b.providerId.district,
        }
      };
    }).filter(Boolean);

    res.json({ success: true, bookings: formattedBookings });
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.put("/cancel/:bookingId", auth, async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.bookingId, userId: req.userId },
      { status: "cancelled" },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    res.json({ success: true, message: "Booking cancelled" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;