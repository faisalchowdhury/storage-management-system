const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const { sendEmail } = require("../utils/email");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Hashing password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        storageUsed: user.storageUsed,
        storageLimit: user.storageLimit,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// send reset pass token

function generate4DigitCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const resetCode = generate4DigitCode();
  user.resetCode = resetCode;
  user.resetCodeExpire = Date.now() + 10 * 60 * 1000;
  await user.save();

  await sendEmail(
    user.email,
    "Reset Your Password",
    `<p>Your password reset code is ${resetCode}. code will expire in 10 minute.</p>`
  );

  res.json({ message: "Reset code sent", resetCode });
};

// Verify code and reset pass

exports.resetPassword = async (req, res) => {
  const { email, resetCode, newPassword } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (
    user.resetCode !== resetCode ||
    !user.resetCodeExpire ||
    user.resetCodeExpire < Date.now()
  ) {
    return res.status(400).json({ message: "Invalid or expired reset code" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  user.resetCode = null;
  user.resetCodeExpire = null;
  await user.save();

  res.json({ message: "Password reset successful" });
};
