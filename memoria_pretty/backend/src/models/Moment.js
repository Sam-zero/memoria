const mongoose = require("mongoose");

const momentSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true, 
      index: true 
    },
    text: { type: String, required: true, trim: true },
    mood: { type: String, default: "neutral", index: true },
    tags: [{ type: String, index: true }],
    views: { type: Number, default: 0 },
    media: [{
      type: { type: String, enum: ["image", "video"] },
      url: { type: String },
      filename: { type: String }
    }]
  },
  { timestamps: true }
);

// Compound indexes
momentSchema.index({ userId: 1, createdAt: -1 });
momentSchema.index({ userId: 1, mood: 1, createdAt: -1 });
momentSchema.index({ userId: 1, tags: 1 });

module.exports = mongoose.model("Moment", momentSchema);
