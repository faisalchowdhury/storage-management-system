const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/auth.middleware");

const { updateProfile } = require("../controllers/user.controller");

router.put("/profile", verifyToken, updateProfile);
module.exports = router;
