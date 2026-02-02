const mongoose = require("mongoose");
const Memory = require("../models/Memory");
const Moment = require("../models/Moment");
const fs = require("fs");
const path = require("path");

// POST /api/memories 
const createMemory = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ message: "title is required" });

    const coverImage = req.file ? {
      url: `/uploads/${req.file.filename}`,
      filename: req.file.filename
    } : null;

    const memory = await Memory.create({
      userId: req.userId,
      title,
      description: description || "",
      coverImage
    });

    return res.status(201).json(memory);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/memories/with-moments
const createMemoryWithMoments = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { title, description, momentIds } = req.body;

    if (!title) {
      await session.abortTransaction();
      return res.status(400).json({ message: "title is required" });
    }

    if (momentIds && momentIds.length > 0) {
      const moments = await Moment.find({
        _id: { $in: momentIds },
        userId: req.userId
      }).session(session);

      if (moments.length !== momentIds.length) {
        await session.abortTransaction();
        return res.status(400).json({ 
          message: "Some moments not found or don't belong to you" 
        });
      }
    }

    const memory = await Memory.create([{
      userId: req.userId,
      title,
      description: description || "",
      moments: (momentIds || []).map(id => ({ momentId: id }))
    }], { session });

    await session.commitTransaction();
    return res.status(201).json(memory[0]);

  } catch (err) {
    await session.abortTransaction();
    return res.status(500).json({ 
      message: "Transaction failed", 
      error: err.message 
    });
  } finally {
    session.endSession();
  }
};

// GET /api/memories 
const getMyMemories = async (req, res) => {
  try {
    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1;
    
    const sortOptions = {};
    sortOptions[sortBy] = order;

    const memories = await Memory.find({ userId: req.userId })
      .sort(sortOptions)
      .lean();

    return res.json(memories);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/memories/:id
const getMemoryById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid memory id" });
    }

    const memory = await Memory.findOne({ _id: req.params.id, userId: req.userId })
      .populate("moments.momentId")
      .lean();

    if (!memory) return res.status(404).json({ message: "Memory not found" });
    return res.json(memory);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PATCH /api/memories/:id ($set)
const updateMemory = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid memory id" });
    }

    const allowed = {};
    if (req.body.title !== undefined) allowed.title = req.body.title;
    if (req.body.description !== undefined) allowed.description = req.body.description;

    if (Object.keys(allowed).length === 0) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const updated = await Memory.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: allowed },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Memory not found" });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PATCH /api/memories/:id/add-moment ($push)
const addMomentToMemory = async (req, res) => {
  try {
    const { momentId } = req.body;
    if (!momentId) return res.status(400).json({ message: "momentId is required" });

    const updated = await Memory.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $push: { moments: { momentId } } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Memory not found" });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PATCH /api/memories/:id/remove-moment ($pull)
const removeMomentFromMemory = async (req, res) => {
  try {
    const { momentId } = req.body;
    if (!momentId) return res.status(400).json({ message: "momentId is required" });

    const updated = await Memory.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $pull: { moments: { momentId } } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Memory not found" });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE /api/memories/:id
const deleteMemory = async (req, res) => {
  try {
    const result = await Memory.deleteOne({ _id: req.params.id, userId: req.userId });
    if (result.deletedCount === 0) return res.status(404).json({ message: "Memory not found" });
    return res.json({ message: "Memory deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  createMemory,
  createMemoryWithMoments, 
  getMyMemories,
  getMemoryById,
  updateMemory,
  addMomentToMemory,
  removeMomentFromMemory,
  deleteMemory
};
