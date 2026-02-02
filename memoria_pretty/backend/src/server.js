const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const connectDB = require("./config/db");

// routes imports
const authRoutes = require("./routes/authRoutes");
const momentRoutes = require("./routes/momentRoutes");
const memoryRoutes = require("./routes/memoryRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

connectDB();

const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(uploadsDir));

// API docs
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api/openapi.json", (req, res) => res.json(swaggerSpec));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/moments", momentRoutes);
app.use("/api/memories", memoryRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Memoria backend is running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Central error handler
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
