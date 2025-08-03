const express = require("express");
const router = express.Router();

const {
  register,
  login,
  forgotPassword,
} = require("../controllers/auth.controller");

router.post("/register", register);

router.post("/login", login);
router.post("/reset", forgotPassword);

module.exports = router;
