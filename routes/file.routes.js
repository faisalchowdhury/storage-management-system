const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

const {
  uploadFile,
  accessPrivateFile,
  markAsFavorite,
  getFavoriteFiles,
  renameFile,
  deleteFile,
  duplicateFile,
  getRecentFiles,
  getFilesByDate,
} = require("../controllers/file.controller");

// Upload single file (protected route)
router.post("/upload", verifyToken, upload.single("file"), uploadFile);

// Access private file by ID (no token required, only password check)
router.post("/access/:fileId", accessPrivateFile);

// make a file favorite
router.patch("/favorite/:fileId", verifyToken, markAsFavorite);

// get all fav files
router.get("/favorite", verifyToken, getFavoriteFiles);

// rename file
router.patch("/rename/:fileId", verifyToken, renameFile);
// delete file
router.delete("/delete/:fileId", verifyToken, deleteFile);
//duplicate
router.post("/duplicate/:id", verifyToken, duplicateFile);
//recent upload
router.get("/recent", verifyToken, getRecentFiles);
// get files by date
router.get("/by-date", verifyToken, getFilesByDate);
module.exports = router;
