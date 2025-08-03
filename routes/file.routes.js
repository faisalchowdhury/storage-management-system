const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");
const { uploadFile } = require("../controllers/file.controller");

// Upload single file
router.post("/upload", verifyToken, upload.single("file"), uploadFile);

module.exports = router;
