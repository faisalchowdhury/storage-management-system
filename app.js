const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/error.middleware");

const authRoutes = require("./routes/auth.routes");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(errorHandler);
connectDB();

// Routes
app.use("/api/auth", authRoutes);

const folderRoutes = require("./routes/folder.routes");
app.use("/api/folder", folderRoutes);

const fileRoutes = require("./routes/file.routes");
app.use("/api/file", fileRoutes);

module.exports = app;
