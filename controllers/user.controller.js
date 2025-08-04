const User = require("../models/user.js");
const File = require("../models/file");
const Folder = require("../models/folder");
const mongoose = require("mongoose");
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, avatar } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, avatar },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete user and file folder of this user

exports.deleteUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    // Delete user
    await User.findByIdAndDelete(userId);

    // Delete all folders and files
    await Folder.deleteMany({ owner: new mongoose.Types.ObjectId(userId) });
    await File.deleteMany({ owner: new mongoose.Types.ObjectId(userId) });

    return res.status(200).json({
      success: true,
      message: "User profile and associated data deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// storage summery

exports.getStorageStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const files = await File.find({
      owner: new mongoose.Types.ObjectId(userId),
    });

    let totalSize = 0;
    let imageSize = 0;
    let pdfSize = 0;
    let noteSize = 0;

    files.forEach((file) => {
      totalSize += file.size;

      if (file.fileType === "image") imageSize += file.size;
      else if (file.fileType === "pdf") pdfSize += file.size;
      else if (file.fileType === "note") noteSize += file.size;
    });

    const user = await User.findById(userId);
    const totalLimit = user.storageLimit;
    const remainingSize = totalLimit - totalSize;

    const toMB = (bytes) => (bytes / (1024 * 1024)).toFixed(2) + " MB";
    const toGB = (bytes) => (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";

    res.status(200).json({
      used: {
        mb: toMB(totalSize),
        gb: toGB(totalSize),
      },
      remaining: {
        mb: toMB(remainingSize),
        gb: toGB(remainingSize),
      },
      breakdown: {
        image: {
          mb: toMB(imageSize),
          gb: toGB(imageSize),
        },
        pdf: {
          mb: toMB(pdfSize),
          gb: toGB(pdfSize),
        },
        note: {
          mb: toMB(noteSize),
          gb: toGB(noteSize),
        },
      },
    });
  } catch (error) {
    console.error("Storage stats error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
