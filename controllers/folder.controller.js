const Folder = require("../models/folder");

exports.createFolder = async (req, res) => {
  try {
    const { name, parentFolder } = req.body;
    const newFolder = new Folder({
      name,
      parentFolder: parentFolder || null,
      owner: req.user._id,
    });

    await newFolder.save();
    res.status(201).json({ message: "Folder created", folder: newFolder });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getUserFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ owner: req.user._id });
    res.status(200).json({ folders });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
