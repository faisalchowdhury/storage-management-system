const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/auth.middleware");

const { updateProfile } = require("../controllers/user.controller");

router.post("/profile", verifyToken, updateProfile);
module.exports = router;
