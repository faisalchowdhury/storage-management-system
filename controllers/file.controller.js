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
      hashedPassword = await bcrypt.hash(password, 10);
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
