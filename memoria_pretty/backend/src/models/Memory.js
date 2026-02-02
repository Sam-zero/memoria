const mongoose = require("mongoose");

const memorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    coverImage: {
      url: { type: String },
      filename: { type: String }
    },
    moments: [
      {
        momentId: { type: mongoose.Schema.Types.ObjectId, ref: "Moment", required: true },
        addedAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

memorySchema.index({ userId: 1, createdAt: -1 });
memorySchema.index({ userId: 1, title: 1 });

module.exports = mongoose.model("Memory", memorySchema);
