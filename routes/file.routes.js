const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

const {
  uploadFile,
  accessPrivateFile,
  markAsFavorite,
  getFavoriteFiles,
} = require("../controllers/file.controller");

// Upload single file (protected route)
router.post("/upload", verifyToken, upload.single("file"), uploadFile);

// Access private file by ID (no token required, only password check)
router.post("/access/:fileId", accessPrivateFile);

// make a file favorite
router.patch("/favorite/:fileId", verifyToken, markAsFavorite);
module.exports = router;

// get all fav files
router.get("/favorite", verifyToken, getFavoriteFiles);
