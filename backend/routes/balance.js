const express = require("express");
const authMiddleware = require("../middleware/auth");
const Expense = require("../models/Expense"); 
const Member = require("../models/Member"); 

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find();
    const members = await Member.find();
    const balances = {};

    const memberMap = {};
    members.forEach((member) => {
      memberMap[member._id.toString()] = member.name;
    });

    expenses.forEach((expense) => {
      const { payer, amount, percentages } = expense;
      const payerId = payer.toString();

      if (!balances[payerId]) balances[payerId] = 0;

      if (percentages && Object.keys(percentages).length > 0) {
        let payerShare = amount;
        Object.entries(percentages).forEach(([member, percent]) => {
          const memberId = member.toString();
          const memberShare = (amount * percent) / 100;
          balances[memberId] = (balances[memberId] || 0) - memberShare;
          payerShare -= memberShare;
        });
        balances[payerId] += payerShare; 
      } else {
        const share = amount / members.length;
        members.forEach((member) => {
          const memberId = member._id.toString();
          if (!balances[memberId]) balances[memberId] = 0;

          if (memberId === payerId) {
            balances[memberId] += amount; 
          }
          balances[memberId] -= share; 
        });
      }
    });
    const formattedBalances = Object.entries(balances).map(
      ([userId, amount]) => ({
        name: memberMap[userId] || "Unknown",
        amount: parseFloat(amount.toFixed(2)), 
      })
    );

    console.log("📊 Final Balances Calculation:", formattedBalances);
    res.json(formattedBalances);
  } catch (error) {
    console.error("❌ Error calculating balances:", error.message);
    res.status(500).json({ error: "Failed to calculate balances" });
  }
});

module.exports = router;

