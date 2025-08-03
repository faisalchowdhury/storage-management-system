const File = require("../models/file");
const bcrypt = require("bcrypt");
exports.uploadFile = async (req, res) => {
  try {
    const { folder, fileType, isPrivate, password } = req.body;
    const fileData = req.file;

    if (!fileData) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Hash password if provided
    let hashedPassword = null;
    if (password) {
      hashedPassword = password;
    }

    const newFile = new File({
      filename: fileData.originalname,
      fileType,
      data: fileData.buffer,
      size: fileData.size,
      owner: req.user._id,
      folder: folder || null,
      favorite: false,
      isPrivate: isPrivate === "true", // form data comes as string
      password: hashedPassword,
    });

    await newFile.save();

    res
      .status(201)
      .json({ message: "File uploaded successfully", file: newFile });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Private file access

exports.accessPrivateFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { password } = req.body;

    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (!file.isPrivate) {
      return res.status(403).json({ message: "This file is not private" });
    }

    const isMatch = password === file.password;
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    res.status(200).json({
      message: "Access granted",
      file: {
        filename: file.filename,
        fileType: file.fileType,
        size: file.size,
        uploadedAt: file.createdAt,
        buffer: file.data.toString("base64"),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// mark as favorite

exports.markAsFavorite = async (req, res) => {
  try {
    const { fileId } = req.params;

    const file = await File.findOne({ _id: fileId, owner: req.user._id });
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    file.favorite = !file.favorite;
    await file.save();

    res.status(200).json({
      message: `File marked as ${file.favorite ? "favorite" : "not favorite"}`,
      fileId: file._id,
      favorite: file.favorite,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// all favorite files

exports.getFavoriteFiles = async (req, res) => {
  try {
    const userId = req.user._id;

    const favoriteFiles = await File.find({ owner: userId, favorite: true })
      .select("-data")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Favorite files fetched successfully",
      files: favoriteFiles,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Rename file

exports.renameFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { newFilename } = req.body;
    const userId = req.user._id;

    if (!newFilename || newFilename.trim() === "") {
      return res.status(400).json({ message: "New filename is required" });
    }

    const file = await File.findOne({ _id: fileId, owner: userId });
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    file.filename = newFilename.trim();
    await file.save();

    res.status(200).json({
      message: "File renamed successfully",
      fileId: file._id,
      newFilename: file.filename,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
