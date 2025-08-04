const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/auth.middleware");

const {
  updateProfile,
  deleteUserProfile,
} = require("../controllers/user.controller");

router.post("/profile", verifyToken, updateProfile);

router.delete("/delete-profile", verifyToken, deleteUserProfile);

module.exports = router;
