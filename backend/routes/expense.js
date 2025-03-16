const express = require("express");
const mongoose = require("mongoose");
const Expense = require("../models/Expense");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Add Expense
router.post("/", authMiddleware, async (req, res) => {
  try {
    console.log("📥 Request Body:", req.body);
    console.log("🔑 User ID from Token:", req.user?.id);

    // Validate request body
    const { desc, amount, payer, splitType, percentages } = req.body;
    if (!desc || !amount || !payer || !splitType) {
      return res
        .status(400)
        .json({ error: "All fields are required and must be valid" });
    }

    // Ensure userId is an ObjectId
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const newExpense = new Expense({
      userId,
      desc,
      amount,
      payer,
      splitType,
      percentages,
      date: new Date(), 
    });

    await newExpense.save();
    console.log("✅ Expense Saved:", newExpense);
    res.status(201).json(newExpense);
  } catch (error) {
    console.error("❌ Error adding expense:", error.message);
    res.status(500).json({ error: "Failed to add expense", details: error.message });
  }
});

// Get Expenses
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    
    // Fetch expenses sorted by date (newest first)
    const expenses = await Expense.find({ userId }).sort({ date: -1 });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

module.exports = router;

