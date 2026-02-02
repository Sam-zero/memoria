const mongoose = require("mongoose");
const Moment = require("../models/Moment");
const Memory = require("../models/Memory");

// GET /api/analytics
const getAnalytics = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);

    // Total counts
    const [totalMoments, totalMemories] = await Promise.all([
      Moment.countDocuments({ userId }),
      Memory.countDocuments({ userId })
    ]);

    // Total views
    const viewsAgg = await Moment.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: "$views" } } }
    ]);
    const totalViews = viewsAgg.length > 0 ? viewsAgg[0].total : 0;

    // Mood distribution
    const moodDistribution = await Moment.aggregate([
      { $match: { userId } },
      { $group: { _id: "$mood", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Tag cloud
    const tagCloud = await Moment.aggregate([
      { $match: { userId } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 30 }
    ]);

    // Timeline (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const timeline = await Moment.aggregate([
      { 
        $match: { 
          userId,
          createdAt: { $gte: thirtyDaysAgo }
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return res.json({
      totalMoments,
      totalMemories,
      totalViews,
      moodDistribution,
      tagCloud,
      timeline
    });
  } catch (err) {
    return res.status(500).json({ 
      message: "Server error", 
      error: err.message 
    });
  }
};

module.exports = { getAnalytics };
