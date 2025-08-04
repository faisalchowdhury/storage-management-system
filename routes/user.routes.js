const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/auth.middleware");

const {
  updateProfile,
  deleteUserProfile,
  getStorageStats,
} = require("../controllers/user.controller");

router.post("/profile", verifyToken, updateProfile);

router.delete("/delete-profile", verifyToken, deleteUserProfile);

router.get("/storage/stats", verifyToken, getStorageStats);
module.exports = router;
