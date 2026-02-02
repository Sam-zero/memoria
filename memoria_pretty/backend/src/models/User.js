const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true, 
      trim: true,
      index: true // ✨ ДОБАВЛЕНО
    },
    passwordHash: { type: String, required: true }
  },
  { timestamps: true }
);

userSchema.index({ email: 1, createdAt: -1 });

module.exports = mongoose.model("User", userSchema);
