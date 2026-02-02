const mongoose = require("mongoose");
const Moment = require("../models/Moment");
const Memory = require("../models/Memory");
const fs = require("fs");
const path = require("path");

// POST /api/moments
const createMoment = async (req, res) => {
  try {
    const { text, mood, tags } = req.body;
    if (!text) return res.status(400).json({ message: "text is required" });

    const userId = new mongoose.Types.ObjectId(req.userId);

    const media = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        const type = file.mimetype.startsWith("image/") ? "image" : "video";
        media.push({
          type,
          url: `/uploads/${file.filename}`,
          filename: file.filename
        });
      });
    }

    const moment = await Moment.create({
      userId,
      text,
      mood: mood || "neutral",
      tags: tags ? (typeof tags === "string" ? tags.split(",").map(t => t.trim()) : tags) : [],
      media
    });

    return res.status(201).json(moment);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/moments
const getMyMoments = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "20", 10), 1), 100);
    const skip = (page - 1) * limit;

    const filter = { userId };
    if (req.query.mood) filter.mood = req.query.mood;
    if (req.query.tag) filter.tags = req.query.tag;
    if (req.query.q) filter.text = { $regex: req.query.q, $options: "i" };

    const [items, total] = await Promise.all([
      Moment.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Moment.countDocuments(filter)
    ]);

    return res.json({
      items,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/moments/:id
const getMomentById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid moment id" });
    }

    const userId = new mongoose.Types.ObjectId(req.userId);
    const moment = await Moment.findOne({ 
      _id: req.params.id, 
      userId 
    });

    if (!moment) {
      return res.status(404).json({ message: "Moment not found" });
    }

    return res.json(moment);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PATCH /api/moments/:id
const updateMoment = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid moment id" });
    }

    const userId = new mongoose.Types.ObjectId(req.userId);
    const allowed = {};
    if (req.body.text !== undefined) allowed.text = req.body.text;
    if (req.body.mood !== undefined) allowed.mood = req.body.mood;
    if (req.body.tags !== undefined) {
      allowed.tags = typeof req.body.tags === "string" 
        ? req.body.tags.split(",").map(t => t.trim()) 
        : req.body.tags;
    }

    if (Object.keys(allowed).length === 0) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const moment = await Moment.findOneAndUpdate(
      { _id: req.params.id, userId },
      { $set: allowed },
      { new: true }
    );

    if (!moment) return res.status(404).json({ message: "Moment not found" });
    return res.json(moment);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE /api/moments/:id
const deleteMoment = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid moment id" });
    }

    const userId = new mongoose.Types.ObjectId(req.userId);
    const moment = await Moment.findOne({ _id: req.params.id, userId });
    if (!moment) return res.status(404).json({ message: "Moment not found" });

    if (moment.media && moment.media.length > 0) {
      moment.media.forEach(m => {
        const filepath = path.join(__dirname, "../../uploads", m.filename);
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
      });
    }

    await Moment.deleteOne({ _id: req.params.id, userId });

    await Memory.updateMany(
      { userId },
      { $pull: { moments: { momentId: req.params.id } } }
    );

    return res.json({ message: "Moment deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/moments/:id/view
const incrementViews = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid moment id" });
    }

    const userId = new mongoose.Types.ObjectId(req.userId);
    const moment = await Moment.findOneAndUpdate(
      { _id: req.params.id, userId },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!moment) return res.status(404).json({ message: "Moment not found" });
    return res.json(moment);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  createMoment,
  getMyMoments,
  getMomentById,
  updateMoment,
  deleteMoment,
  incrementViews
};
