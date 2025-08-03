const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    avatar: {
      type: String,
      default: "",
    },
    storageUsed: {
      type: Number,
      default: 0, // in bytes
    },
    storageLimit: {
      type: Number,
      default: 16106127360, // 15GB
    },
    resetCode: String,
    resetCodeExpire: Date,
  },

  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
