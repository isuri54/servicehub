const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const User = require("../models/User");
const Provider = require("../models/Provider");
const Review = require("../models/Review");
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

router.get("/provider-bookings", auth, async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.userId });
    if (!provider) {
      return res.status(404).json({ success: false, message: "Provider profile not found" });
    }

    const bookings = await Booking.find({ providerId: provider._id })
      .populate({
        path: "userId",
        select: "name profileImage phone district"
      })
      .sort({ createdAt: -1 });
    
    const bookedDates = [];
    bookings.forEach(booking => {
      let current = new Date(booking.dateRange.start);
      const end = new Date(booking.dateRange.end);
      while (current <= end) {
        bookedDates.push(current.toISOString().split("T")[0]);
        current.setDate(current.getDate() + 1);
      }
    });

    const formatted = bookings.map(b => ({
      _id: b._id,
      dateRange: b.dateRange,
      status: b.status,
      client: {
        name: b.userId?.name || "Unknown Client",
        profileImage: b.userId?.profileImage
          ? `${process.env.BASE_URL || 'http://localhost:5000'}/uploads/${b.userId.profileImage}`
          : null,
        phone: b.userId?.phone || null,
        district: b.userId?.district || "N/A"
      }
    }));

    res.json({ 
      success: true,
      bookings: formatted,
      bookedDates,
      rating: provider.rating || 0,
      reviewCount: provider.reviewCount || 0 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.put("/accept/:bookingId", auth, async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.userId });
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.bookingId, providerId: provider._id },
      { status: "confirmed" },
      { new: true }
    );

    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    res.json({ success: true, message: "Booking accepted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.put("/complete/:bookingId", auth, async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.bookingId, userId: req.userId, status: "confirmed" },
      { status: "completed" },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found or not confirmed" });
    }

    res.json({ success: true, message: "Job marked as completed!", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/review", auth, async (req, res) => {
  try {
    const { bookingId, providerId, rating, comment } = req.body;
    const existing = await Review.findOne({ bookingId, clientId: req.userId });
    if (existing) return res.status(400).json({ success: false, message: "Already reviewed" });

    const review = new Review({
      bookingId,
      providerId,
      clientId: req.userId,
      rating,
      comment
    });
    await review.save();

    const reviews = await Review.find({ providerId });
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

    await Provider.findByIdAndUpdate(providerId, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length
    });

    res.json({ success: true, message: "Thank you for your review!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/provider-stats", auth, async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.userId });
    if (!provider) return res.status(404).json({ success: false });

    const bookings = await Booking.find({ providerId: provider._id });
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const thisMonthJobs = bookings.filter(b => new Date(b.dateRange.start) >= thisMonth).length;
    const lastMonthJobs = bookings.filter(b => new Date(b.dateRange.start) >= lastMonth && new Date(b.dateRange.start) < thisMonth).length;

    const completedJobs = bookings.filter(b => b.status === "completed").length;
    const totalJobs = bookings.length;
    const uniqueClients = [...new Set(bookings.map(b => b.userId.toString()))].length;
    const repeatClients = bookings.reduce((acc, b) => {
      const count = bookings.filter(x => x.userId.toString() === b.userId.toString()).length;
      return count > 1 ? acc + 1 : acc;
    }, 0) / 2;

    const responseTimes = bookings
      .filter(b => b.status === "confirmed")
      .map(b => (new Date(b.updatedAt) - new Date(b.createdAt)) / (1000 * 60));
    const avgResponseTime = responseTimes.length > 0
      ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
      : 0;

    res.json({
      success: true,
      stats: {
        totalClients: uniqueClients,
        completionRate: totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0,
        avgResponseTime: avgResponseTime > 0 ? `${avgResponseTime} min` : "N/A",
        repeatClients: Math.floor(repeatClients),
        thisMonthJobs,
        lastMonthJobs
      }
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;