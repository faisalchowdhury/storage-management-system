const express = require("express");
const router = express.Router();
const {
  createFolder,
  getUserFolders,
} = require("../controllers/folder.controller");
const verifyToken = require("../middlewares/auth.middleware");

router.post("/create", verifyToken, createFolder);
router.get("/", verifyToken, getUserFolders);

module.exports = router;
