const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    fileType: { type: String, enum: ["image", "pdf", "note"], required: true },
    data: { type: Buffer, required: true },
    size: { type: Number, required: true }, // in bytes
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    folder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },
    favorite: { type: Boolean, default: false },
    isPrivate: { type: Boolean, default: false },
    password: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", fileSchema);
