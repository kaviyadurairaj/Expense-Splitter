
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const expenseRoutes = require("./routes/expense");
const memberRoutes = require("./routes/member");
const authMiddleware = require("./middleware/auth");
const balanceRoutes = require("./routes/balance");  

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;

db.on("connected", () => {
  console.log("✅ MongoDB connected successfully");
});

db.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});

// Root Route
app.get("/", (req, res) => {
  res.send("Backend is working!");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/expense", authMiddleware, expenseRoutes);
app.use("/api/members", authMiddleware, memberRoutes);
app.use("/api/balance", authMiddleware, balanceRoutes);  

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
