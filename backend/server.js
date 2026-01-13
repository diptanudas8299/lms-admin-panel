// ========================================
// backend/server.js - MAIN SERVER FILE
// ========================================

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");

// ----------------------------------------
// Load environment variables
// ----------------------------------------
dotenv.config();

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("❌ Missing required environment variables");
  process.exit(1);
}

// ----------------------------------------
// Initialize Express app
// ----------------------------------------
const app = express();

// Trust proxy (Render / Railway)
app.set("trust proxy", 1);

// ----------------------------------------
// Core Middleware
// ----------------------------------------
app.use(helmet());

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ----------------------------------------
// CORS
// ----------------------------------------
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.CLIENT_URL
        : true,
    credentials: true,
  })
);

// ----------------------------------------
// Rate limiting (AFTER body parsing)
// ----------------------------------------
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", apiLimiter);

// ----------------------------------------
// Static uploads
// ----------------------------------------
app.use(
  "/uploads",
  express.static(path.resolve(__dirname, "uploads"))
);

// ----------------------------------------
// Routes
// ----------------------------------------
app.use("/api/auth", require("./routes/auth"));
app.use("/api/teachers", require("./routes/teachers"));
app.use("/api/courses", require("./routes/courses"));
app.use("/api/classes", require("./routes/classes"));
app.use("/api/students", require("./routes/students"));
app.use("/api/parents", require("./routes/parents"));
app.use("/api/dashboard", require("./routes/dashboard"));

// ----------------------------------------
// Health check
// ----------------------------------------
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ----------------------------------------
// Root
// ----------------------------------------
app.get("/", (req, res) => {
  res.json({
    message: "LMS Admin Panel API",
    environment: process.env.NODE_ENV || "development",
  });
});

// ----------------------------------------
// 404 Handler
// ----------------------------------------
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ----------------------------------------
// Global Error Handler
// ----------------------------------------
app.use((err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";

  // Mongo invalid ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  // Mongo duplicate key
  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate field value";
  }

  if (process.env.NODE_ENV === "development") {
    console.error(err);
  }

  res.status(statusCode).json({ message });
});

// ----------------------------------------
// Start server ONLY after DB connects
// ----------------------------------------
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log("=================================");
      console.log(` Server running on port ${PORT}`);
      console.log(` Environment: ${process.env.NODE_ENV || "development"}`);
      console.log("=================================");
    });

    const shutdown = (signal) => {
      console.log(`\n${signal} received. Shutting down...`);
      server.close(() => process.exit(0));
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);

  } catch (err) {
    console.error("❌ Server failed to start:", err);
    process.exit(1);
  }
};

startServer();

// ----------------------------------------
// Crash protection
// ----------------------------------------
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
  process.exit(1);
});
