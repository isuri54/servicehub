const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Message = require("../models/Message");
const Provider = require("../models/Provider");
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

router.get("/:providerId", auth, async (req, res) => {
  try {
    const providerId = req.params.providerId;
    const providerExists = await Provider.findById(providerId);
    if (!providerExists) {
      return res.status(404).json({ success: false, message: "Provider not found" });
    }

    const messages = await Message.find({
      providerId,
      clientId: req.userId
    })
    .sort({ createdAt: 1 })
    .lean();

    const formatted = messages.map(msg => ({
      ...msg,
      sender: msg.clientId.toString() === req.userId.toString() ? "client" : "provider"
    }));

    res.json({ success: true, messages: formatted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { providerId, message } = req.body;
    const msg = new Message({
      providerId,
      clientId: req.userId,
      message,
      sender: "client"
    });
    await msg.save();
    res.json({ 
      success: true, 
      message: { 
        ...msg._doc, 
        sender: "client" 
      } 
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

router.get("/provider/conversations", auth, async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.userId });
    if (!provider) return res.status(404).json({ success: false });
    const messages = await Message.find({ providerId: provider._id })
      .populate("clientId", "name profileImage")
      .sort({ createdAt: -1 });

    const convMap = new Map();
    messages.forEach(msg => {
      const clientId = msg.clientId._id.toString();
      if (!convMap.has(clientId)) {
        convMap.set(clientId, {
          clientId,
          clientName: msg.clientId.name,
          clientImage: msg.clientId.profileImage ? `${BASE_URL}/uploads/${msg.clientId.profileImage}` : null,
          lastMessage: msg.message,
          lastTime: msg.createdAt
        });
      }
    });

    res.json({ success: true, conversations: Array.from(convMap.values()) });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

router.get("/provider/:clientId", auth, async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.userId });
    const messages = await Message.find({
      providerId: provider._id,
      clientId: req.params.clientId
    }).sort({ createdAt: 1 });
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

router.post("/provider/reply", auth, async (req, res) => {
  try {
    const { clientId, message } = req.body;
    const provider = await Provider.findOne({ userId: req.userId });
    const msg = new Message({
      providerId: provider._id,
      clientId,
      message,
      sender: "provider"
    });
    await msg.save();
    res.json({ 
      success: true, 
      message: { 
        ...msg._doc, 
        sender: "provider" 
      } 
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

router.get("/client/conversations", auth, async (req, res) => {
  try {
    const messages = await Message.find({ clientId: req.userId })
      .populate({
        path: "providerId",
        select: "userId category profileImage",
        populate: { path: "userId", select: "name profileImage" }
      })
      .sort({ createdAt: -1 });

    const convMap = new Map();
    messages.forEach(msg => {
      if (!msg.providerId?.userId) return;

      const p = msg.providerId;
      const providerId = p._id.toString();

      if (!convMap.has(providerId)) {
        convMap.set(providerId, {
          providerId,
          providerName: p.userId.name,
          providerImage: p.profileImage ? `${BASE_URL}/uploads/${p.profileImage}` : null,
          lastMessage: msg.message,
          lastTime: msg.createdAt
        });
      }
    });

    res.json({ success: true, conversations: Array.from(convMap.values()) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;