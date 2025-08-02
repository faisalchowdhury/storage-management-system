const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.routes");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
connectDB();

// Routes
app.use("/api/auth", authRoutes);

module.exports = app;
