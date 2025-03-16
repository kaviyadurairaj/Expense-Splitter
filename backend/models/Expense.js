const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  desc: { type: String, required: true },
  amount: { type: Number, required: true },
  payer: { type: String, required: true },
  splitType: { type: String, required: true },
  percentages: { type: Object, default: {} },
  date: { type: Date, default: Date.now }, 
});

module.exports = mongoose.model("Expense", ExpenseSchema);
