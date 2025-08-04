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
